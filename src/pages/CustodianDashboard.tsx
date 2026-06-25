import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { FACULTY_COMPLIANCE } from "@/lib/mock-data";
import { Users, CalendarCheck, AlertTriangle, DoorOpen } from "lucide-react";

export function CustodianDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Custodian Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor all faculty laboratory utilization in real time</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Faculty Monitored" value="12" icon={<Users className="size-4" />} />
        <Kpi label="Sessions Today" value="5" icon={<CalendarCheck className="size-4" />} accent="accent" />
        <Kpi label="Compliance Alerts" value="3" icon={<AlertTriangle className="size-4" />} accent="warning" />
        <Kpi label="Rooms In Use Now" value="2" icon={<DoorOpen className="size-4" />} accent="success" />
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Faculty Compliance Overview</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Faculty</th>
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Required</th>
                <th className="py-3 pr-4">Logged</th>
                <th className="py-3 pr-4 w-48">Progress</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {FACULTY_COMPLIANCE.map((r) => {
                const pct = Math.round((r.logged / r.required) * 100);
                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{r.name}</td>
                    <td className="py-3 pr-4">{r.code}</td>
                    <td className="py-3 pr-4 tabular-nums">{r.required}h</td>
                    <td className="py-3 pr-4 tabular-nums">{r.logged}h</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2" />
                        <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: "accent" | "warning" | "success" }) {
  const tone =
    accent === "accent" ? "bg-accent/10 text-accent" :
    accent === "warning" ? "bg-warning/15 text-warning-foreground" :
    accent === "success" ? "bg-success/10 text-success" :
    "bg-primary/10 text-primary";
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${tone}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
