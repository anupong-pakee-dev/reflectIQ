"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { QUESTIONS_BY_STAT } from "@/lib/daily-challenges";
import { revalidatePath } from "next/cache";
import type { StatId } from "@/lib/constants";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function getStudentId(): Promise<string | null> {
  const session = await getSession();
  return session?.studentId ?? null;
}

export async function getChallengeStatus(statId: StatId): Promise<{
  alreadyDone: boolean;
  answered: number;
  correct: number;
  wrong: number;
}> {
  const sid = await getStudentId();
  if (!sid) return { alreadyDone: false, answered: 0, correct: 0, wrong: 0 };

  const record = await prisma.dailyChallenge.findUnique({
    where: { studentId_statId_date: { studentId: sid, statId, date: todayStr() } },
  });

  if (!record) return { alreadyDone: false, answered: 0, correct: 0, wrong: 0 };
  return { alreadyDone: true, answered: record.answered, correct: record.correct, wrong: record.wrong };
}

export async function submitChallenge(
  statId: StatId,
  answers: { questionId: number; selectedIndex: number }[]
): Promise<{ cpDelta: number; newCP: number; correct: number; wrong: number }> {
  const sid = await getStudentId();
  if (!sid) throw new Error("Not authenticated");

  const date = todayStr();

  // Idempotency: if already done today, return current CP
  const existing = await prisma.dailyChallenge.findUnique({
    where: { studentId_statId_date: { studentId: sid, statId, date } },
  });
  if (existing) {
    const student = await prisma.student.findUnique({ where: { id: sid }, select: { classPoints: true } });
    return { cpDelta: 0, newCP: student?.classPoints ?? 0, correct: existing.correct, wrong: existing.wrong };
  }

  // Validate answers against the actual question bank
  const pool = QUESTIONS_BY_STAT[statId];
  const poolMap = new Map(pool.map(q => [q.id, q]));

  let correct = 0;
  let wrong = 0;

  for (const ans of answers) {
    const q = poolMap.get(ans.questionId);
    if (!q) continue;
    if (ans.selectedIndex === q.correct) correct++;
    else wrong++;
  }

  const cpDelta = Math.round((correct * 0.25 - wrong * 0.50) * 100) / 100;

  const student = await prisma.student.findUnique({ where: { id: sid }, select: { classPoints: true } });
  const currentCP = student?.classPoints ?? 0;
  const newCP = Math.max(0, currentCP + cpDelta);

  await prisma.$transaction([
    prisma.student.update({
      where: { id: sid },
      data: { classPoints: newCP },
    }),
    prisma.dailyChallenge.create({
      data: { studentId: sid, statId, date, answered: answers.length, correct, wrong },
    }),
    prisma.activityLog.create({
      data: {
        studentId: sid,
        type: "challenge",
        message: `[CHALLENGE] ${statId.toUpperCase()} — ${correct}✓ ${wrong}✗ → ${cpDelta >= 0 ? "+" : ""}${cpDelta}CP`,
        color: cpDelta >= 0 ? "#22c55e" : "#ef4444",
      },
    }),
  ]);

  revalidatePath("/");
  return { cpDelta, newCP, correct, wrong };
}
