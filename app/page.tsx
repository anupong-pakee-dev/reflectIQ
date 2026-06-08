import { getStudent, checkIn } from "@/app/actions/student";
import AssessmentDashboard from "@/app/components/AssessmentDashboard";
import AssessmentQuiz from "@/app/components/AssessmentQuiz";

function hasCheckedInToday(lastCheckin: Date | null): boolean {
  if (!lastCheckin) return false;
  const last = new Date(lastCheckin);
  const now = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate()
  );
}

export default async function Home() {
  let student = await getStudent();

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] text-[#e8e8f0]">
        <div className="text-center space-y-4 p-8 border border-[#1c1c2e]">
          <div className="text-[10px] tracking-[0.4em] text-[#374151]">SYSTEM ERROR</div>
          <div className="text-2xl font-bold text-[#ef4444]">Student profile not found</div>
          <div className="text-xs text-[#4b5563]">Contact Admin to verify your account status.</div>
        </div>
      </div>
    );
  }

  if (!student.assessmentDone) {
    return <AssessmentQuiz />;
  }

  if (!hasCheckedInToday(student.lastCheckin)) {
    await checkIn();
    student = await getStudent() ?? student;
  }

  return (
    <AssessmentDashboard
      initial={student as Parameters<typeof AssessmentDashboard>[0]["initial"]}
    />
  );
}
