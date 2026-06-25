import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-store";
import { FacultyDashboard } from "@/pages/FacultyDashboard";
import { CustodianDashboard } from "@/pages/CustodianDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = useRole();
  if (role === "Faculty") return <FacultyDashboard />;
  if (role === "Custodian") return <CustodianDashboard />;
  return <AdminDashboard />;
}
