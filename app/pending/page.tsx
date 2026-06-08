import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PendingView from "./PendingView";

export default async function PendingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "STUDENT") redirect("/");
  if (session.role === "ADMIN") redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      displayName: true,
      email: true,
      checkinFreq: true,
      reviewNote: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <PendingView
      user={{
        displayName: user.displayName,
        email: user.email,
        checkinFreq: user.checkinFreq,
        reviewNote: user.reviewNote,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  );
}
