"use server";

/**
 * Exam quiz server actions.
 * Correct answers are NEVER sent to the client.
 * A short-lived signed JWT carries the shuffled answer key.
 */

import { SignJWT, jwtVerify } from "jose";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EXAM_QUESTIONS } from "@/lib/exam-questions";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Question sent to the client — no correct answer */
export interface ClientQuestion {
  id: string;
  text: string;
  options: [string, string, string, string];
}

export interface StartExamResult {
  questions: ClientQuestion[];
  sessionToken: string;       // signed JWT — client must return on submit
  alreadyAttempted: boolean;
}

export interface SubmitExamResult {
  score: number;
  total: number;
  passed: boolean;
}

// ─── JWT helpers (exam session, 1-hour expiry) ────────────────────────────────

interface ExamSessionPayload {
  studentId: string;
  subject: string;
  /** correct answer index (0-3) for each of the 20 questions, in order */
  correctAnswers: number[];
  /** question IDs in order — used for answer verification */
  questionIds: string[];
}

function getSecret() {
  const key = process.env.JWT_SECRET ?? "reflectiq-dev-secret-change-in-production";
  return new TextEncoder().encode(key);
}

async function signExamSession(payload: ExamSessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecret());
}

async function verifyExamSession(token: string): Promise<ExamSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as ExamSessionPayload;
  } catch {
    return null;
  }
}

// ─── Fisher-Yates shuffle (seeded by Math.random at call time) ───────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── startExam ────────────────────────────────────────────────────────────────

export async function startExam(subject: string): Promise<StartExamResult> {
  const session = await getSession();
  if (!session?.studentId) throw new Error("Not authenticated");

  const bank = EXAM_QUESTIONS[subject];
  if (!bank) throw new Error("Unknown subject");

  // Check one-attempt rule: maxScore=20 marks a quiz attempt
  const prior = await prisma.examResult.findFirst({
    where: { studentId: session.studentId, subject, maxScore: 20 },
  });
  if (prior) {
    return { questions: [], sessionToken: "", alreadyAttempted: true };
  }

  // Pick 20 random questions from bank (bank already has exactly 20)
  const picked = shuffle(bank).slice(0, 20);

  const clientQuestions: ClientQuestion[] = picked.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
  }));

  const correctAnswers = picked.map((q) => q.correct);
  const questionIds = picked.map((q) => q.id);

  const sessionToken = await signExamSession({
    studentId: session.studentId,
    subject,
    correctAnswers,
    questionIds,
  });

  return { questions: clientQuestions, sessionToken, alreadyAttempted: false };
}

// ─── submitExam ───────────────────────────────────────────────────────────────

export async function submitExam(
  sessionToken: string,
  /** selected option index (0-3) for each question, in same order as questions received */
  answers: number[]
): Promise<SubmitExamResult> {
  const session = await getSession();
  if (!session?.studentId) throw new Error("Not authenticated");

  const payload = await verifyExamSession(sessionToken);
  if (!payload) throw new Error("Invalid or expired exam session");
  if (payload.studentId !== session.studentId) throw new Error("Session mismatch");

  // Guard against double-submit
  const prior = await prisma.examResult.findFirst({
    where: { studentId: session.studentId, subject: payload.subject, maxScore: 20 },
  });
  if (prior) {
    return { score: prior.score, total: 20, passed: prior.passed };
  }

  // Evaluate
  const total = payload.correctAnswers.length;
  let score = 0;
  for (let i = 0; i < total; i++) {
    if (answers[i] === payload.correctAnswers[i]) score++;
  }

  const passed = score >= Math.ceil(total * 0.6); // 60% pass threshold

  await prisma.$transaction(async (tx) => {
    await tx.examResult.create({
      data: {
        studentId: session.studentId!,
        subject: payload.subject,
        score,
        maxScore: total,
        passed,
        notes: `Quiz: ${score}/${total}`,
      },
    });
    await tx.activityLog.create({
      data: {
        studentId: session.studentId!,
        type: "exam",
        message: `[EXAM] ${payload.subject}: ${score}/${total} — ${passed ? "PASS" : "FAIL"}`,
        color: passed ? "#22c55e" : "#ef4444",
      },
    });
    // First exam achievement
    await tx.studentAchievement.upsert({
      where: { studentId_code: { studentId: session.studentId!, code: "FIRST_EXAM" } },
      update: {},
      create: { studentId: session.studentId!, code: "FIRST_EXAM" },
    });
  });

  revalidatePath("/");
  return { score, total, passed };
}
