"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  calcOAA,
  getClassRank,
  STATS_CONFIG,
  SPECIAL_EXAMS,
  type StatId,
  type ClassRank,
} from "@/lib/constants";
import { ACHIEVEMENT_DEFS, ACHIEVEMENT_MAP } from "@/lib/achievements";

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

async function getStudentId(): Promise<string | null> {
  const session = await getSession();
  return session?.studentId ?? null;
}

// ─────────────────────────────────────────────────────────────
//  Check achievements after any mutation
// ─────────────────────────────────────────────────────────────

async function checkAndUnlockAchievements(studentId: string): Promise<string[]> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      achievements: { select: { code: true } },
      exams: { select: { id: true, passed: true } },
      logs: { where: { type: "note" }, select: { id: true } },
    },
  });
  if (!student) return [];

  const unlocked = new Set(student.achievements.map((a) => a.code));
  const toUnlock: string[] = [];
  const ss = { academic: student.academic, physical: student.physical, social: student.social, mental: student.mental, leadership: student.leadership, adaptability: student.adaptability };
  const oaa = calcOAA(ss);

  const check = (code: string, condition: boolean) => {
    if (condition && !unlocked.has(code)) toUnlock.push(code);
  };

  check("SCHOLAR",       ss.academic >= 90);
  check("ATHLETE",       ss.physical >= 90);
  check("IRON_WILL",     ss.mental >= 90);
  check("SOCIALITE",     ss.social >= 90);
  check("COMMANDER",     ss.leadership >= 90);
  check("CHAMELEON",     ss.adaptability >= 90);
  check("ALL_ROUNDER",   Object.values(ss).every((v) => v >= 70));
  check("S_CANDIDATE",   oaa >= 90);
  check("MILLIONAIRE",   student.privatePoints >= 500000);
  check("PERFECT",       Object.values(ss).every((v) => v >= 100));
  check("STREAK_7",      student.checkinStreak >= 7);
  check("EXAM_PASS",     student.exams.filter((e) => e.passed).length >= 5);
  check("NOTE_TAKER",    student.logs.length >= 10);

  if (toUnlock.length > 0) {
    await prisma.$transaction([
      prisma.studentAchievement.createMany({
        data: toUnlock.map((code) => ({ studentId, code })),
        skipDuplicates: true,
      }),
      prisma.activityLog.createMany({
        data: toUnlock.map((code) => {
          const def = ACHIEVEMENT_MAP.get(code);
          return {
            studentId,
            type: "achievement",
            message: `[ACHIEVEMENT] ${def?.titleTh ?? code} — ${def?.desc ?? ""}`,
            color: def?.color ?? "#ffd700",
          };
        }),
      }),
    ]);
  }

  return toUnlock;
}

// ─────────────────────────────────────────────────────────────
//  Public Server Actions
// ─────────────────────────────────────────────────────────────

export async function getStudent() {
  const sid = await getStudentId();
  if (!sid) return null;
  return prisma.student.findUnique({
    where: { id: sid },
    include: {
      logs:         { orderBy: { createdAt: "desc" }, take: 100 },
      achievements: { orderBy: { unlockedAt: "desc" } },
      exams:        { orderBy: { examDate: "desc" }, take: 50 },
      transactions: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
}

export async function updateStat(statId: StatId, value: number) {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  const student = await prisma.student.findUnique({ where: { id: sid } });
  if (!student) throw new Error("Student not found");

  const prev = student[statId] as number;
  if (prev === value) return;

  const delta = value - prev;
  const cfg = STATS_CONFIG.find((s) => s.id === statId)!;

  // Check class rank change
  const oldStats = {
    academic: student.academic, physical: student.physical,
    social: student.social,     mental: student.mental,
    leadership: student.leadership, adaptability: student.adaptability,
  };
  const newStats = { ...oldStats, [statId]: value };
  const oldRank = getClassRank(calcOAA(oldStats));
  const newRank = getClassRank(calcOAA(newStats));
  const rankChanged = oldRank !== newRank;

  const logEntries: { studentId: string; type: string; message: string; delta?: number; statId?: string; color?: string }[] = [
    {
      studentId: sid,
      type: "stat_update",
      message: `[UPDATE] ${cfg.nameJp} ${cfg.nameTh}: ${prev} → ${value} (${delta > 0 ? "+" : ""}${delta})`,
      delta,
      statId,
      color: cfg.color,
    },
  ];

  if (rankChanged) {
    logEntries.push({
      studentId: sid,
      type: "rank_change",
      message: `[RANK CHANGE] ${oldRank} Class → ${newRank} Class`,
      color: "#ffd700",
    });
  }

  await prisma.$transaction([
    prisma.student.update({ where: { id: sid }, data: { [statId]: value } }),
    prisma.activityLog.createMany({ data: logEntries }),
  ]);

  const newAch = await checkAndUnlockAchievements(sid);

  if (rankChanged) {
    const def = ACHIEVEMENT_MAP.get("CLASS_UP");
    await prisma.studentAchievement.upsert({
      where: { studentId_code: { studentId: sid, code: "CLASS_UP" } },
      update: { unlockedAt: new Date() },
      create: { studentId: sid, code: "CLASS_UP" },
    });
  }

  revalidatePath("/");
  return { newAchievements: newAch, rankChanged, newRank };
}

export async function addNote(message: string) {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  await prisma.activityLog.create({
    data: {
      studentId: sid,
      type: "note",
      message: `[NOTE] ${message}`,
      color: "#6b7280",
    },
  });

  await checkAndUnlockAchievements(sid);
  revalidatePath("/");
}

export async function checkIn() {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  const student = await prisma.student.findUnique({ where: { id: sid } });
  if (!student) throw new Error("Student not found");

  const now = new Date();
  const last = student.lastCheckin;
  const isConsecutive =
    last &&
    now.getTime() - last.getTime() < 48 * 60 * 60 * 1000 &&
    now.getDate() !== last.getDate();

  const streak = isConsecutive ? student.checkinStreak + 1 : 1;
  const oaa = calcOAA({ academic: student.academic, physical: student.physical, social: student.social, mental: student.mental, leadership: student.leadership, adaptability: student.adaptability });
  const rank = getClassRank(oaa);

  await prisma.$transaction([
    prisma.student.update({
      where: { id: sid },
      data: {
        lastCheckin: now,
        checkinStreak: streak,
        classPoints: { increment: 10 },
      },
    }),
    prisma.activityLog.create({
      data: {
        studentId: sid,
        type: "check_in",
        message: `[CHECK-IN] OAA: ${oaa} / Class: ${rank} / Streak: ${streak}日`,
        color: "#22c55e",
      },
    }),
  ]);

  if (streak === 1) {
    await prisma.studentAchievement.upsert({
      where: { studentId_code: { studentId: sid, code: "FIRST_CHECKIN" } },
      update: {},
      create: { studentId: sid, code: "FIRST_CHECKIN" },
    });
  }

  await checkAndUnlockAchievements(sid);
  revalidatePath("/");
  return { streak };
}

export async function addExam(subject: string, score: number, maxScore: number, notes?: string) {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  const passed = score >= maxScore * 0.6;

  await prisma.$transaction(async (tx) => {
    await tx.examResult.create({ data: { studentId: sid, subject, score, maxScore, passed, notes } });
    await tx.activityLog.create({
      data: {
        studentId: sid, type: "exam",
        message: `[EXAM] ${subject}: ${score}/${maxScore} — ${passed ? "PASS" : "FAIL"}`,
        color: passed ? "#22c55e" : "#ef4444",
      },
    });
    await tx.studentAchievement.upsert({
      where: { studentId_code: { studentId: sid, code: "FIRST_EXAM" } },
      update: {}, create: { studentId: sid, code: "FIRST_EXAM" },
    });
  });

  await checkAndUnlockAchievements(sid);
  revalidatePath("/");
  return { passed };
}


export async function runSpecialExam(examId: string) {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  const exam = SPECIAL_EXAMS.find((e) => e.id === examId);
  if (!exam) throw new Error("Exam not found");

  const student = await prisma.student.findUnique({ where: { id: sid } });
  if (!student) throw new Error("Student not found");

  const statVal = student[exam.targetStat] as number;
  const passed = statVal >= exam.requirement;

  const cpDelta = passed ? exam.passReward.classPoints : -exam.failPenalty.classPoints;
  const newCP = Math.max(0, student.classPoints + cpDelta);

  const statBoostData = (passed && exam.passReward.statBoost)
    ? { [exam.targetStat]: Math.min(100, statVal + exam.passReward.statBoost) }
    : {};

  await prisma.$transaction([
    prisma.student.update({
      where: { id: sid },
      data: { classPoints: newCP, ...statBoostData },
    }),
    prisma.activityLog.create({
      data: {
        studentId: sid, type: "special_exam",
        message: `[SPECIAL EXAM] ${exam.title} (${exam.titleJp}) — ${passed ? `PASS +${cpDelta}CP` : `FAIL -${Math.abs(cpDelta)}CP`}`,
        color: passed ? "#ffd700" : "#ef4444",
      },
    }),
  ]);

  if (passed) {
    await prisma.studentAchievement.upsert({
      where: { studentId_code: { studentId: sid, code: "SPECIAL_PASS" } },
      update: {},
      create: { studentId: sid, code: "SPECIAL_PASS" },
    });
  }

  await checkAndUnlockAchievements(sid);
  revalidatePath("/");
  return { passed, cpDelta, newCP };
}

export async function adjustPrivatePoints(delta: number, reason: string) {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");
  if (!delta || !reason?.trim()) throw new Error("Invalid input");

  const student = await prisma.student.findUnique({ where: { id: sid } });
  if (!student) throw new Error("Student not found");

  const newBalance = Math.max(0, student.privatePoints + delta);

  await prisma.$transaction([
    prisma.student.update({ where: { id: sid }, data: { privatePoints: newBalance } }),
    prisma.activityLog.create({
      data: {
        studentId: sid,
        type: "transaction",
        message: `[POINTS] ${delta > 0 ? "+" : ""}${delta.toLocaleString()}P — ${reason.trim()}`,
        color: delta > 0 ? "#22c55e" : "#ef4444",
      },
    }),
    prisma.pointTransaction.create({
      data: {
        studentId: sid,
        type: delta > 0 ? "earn" : "spend",
        amount: delta,
        balance: newBalance,
        reason: reason.trim(),
      },
    }),
  ]);

  await checkAndUnlockAchievements(sid);
  revalidatePath("/");
  return { newBalance };
}

export async function resetStudent() {
  const session = await getSession();
  if (!session?.studentId) return;
  await prisma.student.delete({ where: { id: session.studentId } });
  revalidatePath("/");
}
