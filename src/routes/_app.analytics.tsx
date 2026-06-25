import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ROOM_UTILIZATION_BY_SLOT, WEEKLY_TREND, HEATMAP, COMPLIANCE_DISTRIBUTION,
  TIME_SLOTS, END_OF_TERM, DAYS,
} from "@/lib/mock-data";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, Gauge, DoorOpen, Clock, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Laboratory Utilization Analytics</h1>
          <p className="text-sm text-muted-foreground">Term-level insights and end-of-semester reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="s1">
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="s1">1st Sem 2025–2026</SelectItem>
              <SelectItem value="s2">2nd Sem 2025–2026</SelectItem>
              <SelectItem value="t1">Summer Term 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="size-4" /> Export</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Average Compliance Rate" value="64%" icon={<Gauge className="size-4" />} />
        <Kpi label="Most Used Room" value="CS Lab 2" icon={<DoorOpen className="size-4" />} />
        <Kpi label="Peak Time Slot" value="1:30–3:30 PM" icon={<Clock className="size-4" />} />
        <Kpi label="Non-Compliant Faculty" value="2" icon={<AlertOctagon className="size-4" />} accent="destructive" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Room Utilization by Time Slot</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROOM_UTILIZATION_BY_SLOT}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="slot" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="CS Lab 1" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CS Lab 2" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IT Lab 3" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IT Lab 4" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Weekly Session Completion Trend</CardTitle></CardHeader>
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

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Usage Heatmap — Day × Time Slot</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-xs">
              <thead>
                <tr>
                  <th></th>
                  {TIME_SLOTS.map((s) => (
                    <th key={s} className="px-1 py-1 text-[10px] font-normal text-muted-foreground">{s.split("–")[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP.map((row) => (
                  <tr key={row.day}>
                    <td className="pr-2 text-right font-medium">{row.day}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-0.5">
                        <div
                          className="flex h-9 items-center justify-center rounded text-[10px] font-medium text-white"
                          style={{ background: `oklch(0.62 ${0.04 + (v / 100) * 0.08} 195 / ${0.25 + (v / 100) * 0.75})` }}
                        >
                          {v}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              Low
              <div className="h-2 flex-1 rounded" style={{ background: "linear-gradient(90deg, oklch(0.85 0.04 195), oklch(0.5 0.12 195))" }} />
              High
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Compliance Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPLIANCE_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {COMPLIANCE_DISTRIBUTION.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* End-of-term table */}
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">End-of-Term Compliance Summary</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Faculty</th>
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Room</th>
                <th className="py-3 pr-4">Required</th>
                <th className="py-3 pr-4">Logged</th>
                <th className="py-3 pr-4">Compliance %</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {END_OF_TERM.map((r) => {
                const pct = Math.round((r.logged / r.required) * 100);
                return (
                  <tr key={r.faculty + r.code} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{r.faculty}</td>
                    <td className="py-3 pr-4">{r.code}</td>
                    <td className="py-3 pr-4">{r.room}</td>
                    <td className="py-3 pr-4 tabular-nums">{r.required}h</td>
                    <td className="py-3 pr-4 tabular-nums">{r.logged}h</td>
                    <td className="py-3 pr-4 tabular-nums">{pct}%</td>
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

function Kpi({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: "destructive" }) {
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${accent === "destructive" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
