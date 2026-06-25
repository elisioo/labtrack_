import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { FACULTY_COMPLIANCE } from "@/lib/mock-data";
import { Search, Lightbulb, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/faculty-monitor")({
  component: FacultyMonitorPage,
});

function FacultyMonitorPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<null | (typeof FACULTY_COMPLIANCE)[number]>(null);
  const rows = FACULTY_COMPLIANCE.filter((r) =>
    `${r.name} ${r.code}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Faculty Compliance Monitor</h1>
        <p className="text-sm text-muted-foreground">Track every faculty member's laboratory utilization progress</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Faculty Compliance</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search faculty…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Faculty</th>
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Required</th>
                <th className="py-3 pr-4">Logged</th>
                <th className="py-3 pr-4 w-48">Progress</th>
                <th className="py-3 pr-4">Projected</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
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
                    <td className="py-3 pr-4">{r.projected}</td>
                    <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="size-3.5" /> View
                        </Button>
                        {r.status !== "Compliant" && (
                          <Button
                            size="sm"
                            onClick={() => setOpen(r)}
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            <Lightbulb className="size-3.5" /> Recommend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Prescriptive Recommendation</DialogTitle>
                <DialogDescription>
                  Actionable plan for {open.name} — {open.code}
                </DialogDescription>
              </DialogHeader>
              {(() => {
                const remaining = open.required - open.logged;
                const weeksLeft = Math.max(1, 18 - 10);
                const sessionsNeeded = Math.ceil(remaining / 2);
                const perWeek = Math.ceil(sessionsNeeded / weeksLeft);
                return (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <Stat label="Hours remaining" value={`${remaining}h`} />
                      <Stat label="Weeks remaining" value={`${weeksLeft}`} />
                      <Stat label="Sessions / week" value={`${perWeek}×`} />
                      <Stat label="Projected compliance" value="Week 18" />
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Suggested plan</div>
                      <p className="mt-1.5">
                        Add <b>{perWeek}</b> session{perWeek > 1 ? "s" : ""} per week on <b>Tuesday &amp; Thursday</b>,
                        1:30–3:30 PM in <b>CS Lab 2</b> to recover {remaining} hours by Week 18.
                      </p>
                    </div>
                  </div>
                );
              })()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(null)}>Dismiss</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(null)}>
                  Accept Recommendation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
