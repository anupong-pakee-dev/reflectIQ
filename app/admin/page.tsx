import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getPendingUsers,
  getAllStudents,
  getAdminStats,
  getInactiveStudents,
} from "@/app/actions/admin";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [pending, students, stats, inactive] = await Promise.all([
    getPendingUsers(),
    getAllStudents(),
    getAdminStats(),
    getInactiveStudents(),
  ]);

  return (
    <AdminDashboard
      pending={pending}
      students={students}
      stats={stats}
      inactive={inactive}
    />
  );
}
