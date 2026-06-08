"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calcAssessmentScores, calcInitialStats } from "@/lib/quiz";

export async function submitAssessment(answers: Record<number, number>): Promise<void> {
  const session = await getSession();
  if (!session?.studentId) redirect("/login");

  // ค่าที่จะบันทึกจริง — cap ที่ 2/100 ทุกตัว
  const initial = calcInitialStats(answers);

  // ค่า raw 0-100 — เก็บไว้แค่ใน log เพื่อดูภายหลัง
  const raw = calcAssessmentScores(answers);

  await prisma.student.update({
    where: { id: session.studentId },
    data: {
      academic:       initial.academic,
      physical:       initial.physical,
      social:         initial.social,
      mental:         initial.mental,
      leadership:     initial.leadership,
      adaptability:   initial.adaptability,
      assessmentDone: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      studentId: session.studentId,
      type:      "assessment",
      message:
        `[ASSESSMENT] Initial OAA — ` +
        `${(["academic","physical","social","mental","leadership","adaptability"] as const)
            .map((k) => `${k}:${initial[k]}/2`)
            .join(" | ")}` +
        ` (raw: ${(["academic","physical","social","mental","leadership","adaptability"] as const)
            .map((k) => `${k}:${raw[k]}`)
            .join(" ")})`,
      color: "#ffd700",
    },
  });

  redirect("/");
}
