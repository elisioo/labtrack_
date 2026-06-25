import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, DoorOpen, Clock, AlertOctagon } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { COMPLIANCE_DISTRIBUTION, ROOM_UTILIZATION_BY_SLOT, WEEKLY_TREND } from "@/lib/mock-data";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administrator Dashboard</h1>
        <p className="text-sm text-muted-foreground">University-wide laboratory utilization snapshot</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Avg Compliance Rate" value="64%" icon={<Gauge className="size-4" />} accent="accent" />
        <Kpi label="Most Used Room" value="CS Lab 2" icon={<DoorOpen className="size-4" />} />
        <Kpi label="Peak Time Slot" value="1:30–3:30 PM" icon={<Clock className="size-4" />} />
        <Kpi label="Non-Compliant Faculty" value="2" icon={<AlertOctagon className="size-4" />} accent="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Room Utilization</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROOM_UTILIZATION_BY_SLOT}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="slot" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="CS Lab 2" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IT Lab 3" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Weekly Completion Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="h" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="IT321" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="CS401" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="IT411" stroke="var(--chart-5)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card max-w-md">
        <CardHeader><CardTitle className="text-base">Compliance Distribution</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={COMPLIANCE_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                {COMPLIANCE_DISTRIBUTION.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: "accent" | "destructive" }) {
  const tone =
    accent === "accent" ? "bg-accent/10 text-accent" :
    accent === "destructive" ? "bg-destructive/10 text-destructive" :
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
