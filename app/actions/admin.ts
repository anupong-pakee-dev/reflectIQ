"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

// ─────────────────────────────────────────────────────────
//  Guard helper
// ─────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function genStudentId() {
  const code = Math.floor(1000 + Math.random() * 9000);
  return `CLS-${code}`;
}

// ─────────────────────────────────────────────────────────
//  Get pending applications
// ─────────────────────────────────────────────────────────

export async function getPendingUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      motivation: true,
      goals: true,
      checkinFreq: true,
      createdAt: true,
      reviewNote: true,
    },
  });
}

// ─────────────────────────────────────────────────────────
//  Get all students
// ─────────────────────────────────────────────────────────

export async function getAllStudents() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { reviewedAt: "desc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      reviewedAt: true,
      student: {
        select: {
          id: true,
          studentId: true,
          academic: true,
          physical: true,
          social: true,
          mental: true,
          leadership: true,
          adaptability: true,
          privatePoints: true,
          checkinStreak: true,
        },
      },
    },
  });
}

// ─────────────────────────────────────────────────────────
//  Admin stats
// ─────────────────────────────────────────────────────────

export async function getAdminStats() {
  await requireAdmin();
  const [pending, students, total] = await Promise.all([
    prisma.user.count({ where: { role: "PENDING" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
  ]);
  return { pending, students, rejected: total - pending - students };
}

// ─────────────────────────────────────────────────────────
//  Approve user
// ─────────────────────────────────────────────────────────

export async function approveUser(
  userId: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: true },
  });

  if (!user) return { success: false, error: "User not found" };
  if (user.role !== "PENDING") return { success: false, error: "User is not pending" };
  if (user.student) return { success: false, error: "Student already exists" };

  // Create student profile & approve
  const studentCode = genStudentId();

  await prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        name: user.displayName,
        studentId: studentCode,
        userId: user.id,
        logs: {
          create: {
            type: "system",
            message: `[SYSTEM] โปรไฟล์เริ่มต้น — ${user.displayName} / ${studentCode} / ได้รับการอนุมัติเข้าศึกษา`,
            color: "#4b5563",
          },
        },
        achievements: {
          create: { code: "FIRST_STEP" },
        },
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        role: "STUDENT",
        reviewNote: note ?? null,
        reviewedAt: new Date(),
      },
    });

    return student;
  });

  // Send email (non-blocking)
  try {
    await sendApprovalEmail(user.email, user.displayName, note);
  } catch (e) {
    console.error("[email] Approval email failed:", e);
  }

  revalidatePath("/admin");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
//  Reject user
// ─────────────────────────────────────────────────────────

export async function rejectUser(
  userId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (!reason?.trim()) {
    return { success: false, error: "กรุณาระบุเหตุผลในการปฏิเสธ" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };
  if (user.role !== "PENDING") return { success: false, error: "User is not pending" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "REJECTED",
      reviewNote: reason.trim(),
      reviewedAt: new Date(),
    },
  });

  try {
    await sendRejectionEmail(user.email, user.displayName, reason.trim());
  } catch (e) {
    console.error("[email] Rejection email failed:", e);
  }

  revalidatePath("/admin");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
//  Get inactive students
//  Definition: STUDENT role, approved >24h ago, AND
//  (never logged in OR last login >24h ago)
// ─────────────────────────────────────────────────────────

export async function getInactiveStudents() {
  await requireAdmin();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return prisma.user.findMany({
    where: {
      role: "STUDENT",
      reviewedAt: { lt: cutoff },
      OR: [
        { lastLoginAt: null },
        { lastLoginAt: { lt: cutoff } },
      ],
    },
    orderBy: { reviewedAt: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      reviewedAt: true,
      lastLoginAt: true,
      student: { select: { studentId: true, checkinStreak: true } },
    },
  });
}

// ─────────────────────────────────────────────────────────
//  Delete user (and their student data)
// ─────────────────────────────────────────────────────────

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: { select: { id: true } } },
  });
  if (!user) return { success: false, error: "User not found" };

  // Delete Student first (cascades to logs, achievements, exams, transactions)
  if (user.student) {
    await prisma.student.delete({ where: { id: user.student.id } });
  }
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin");
  return { success: true };
}
