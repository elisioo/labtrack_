import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { QRPlaceholder } from "@/components/QRPlaceholder";
import { FACULTY_SUBJECTS, FACULTY_WEEKLY_SCHEDULE, statusFromProgress } from "@/lib/mock-data";
import { Clock, CheckCircle2, Gauge, CalendarCheck, QrCode, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export function FacultyDashboard() {
  const totalReq = FACULTY_SUBJECTS.reduce((a, s) => a + s.required, 0);
  const totalLog = FACULTY_SUBJECTS.reduce((a, s) => a + s.logged, 0);
  const overall = Math.round((totalLog / totalReq) * 1000) / 10;
  const [qr, setQr] = useState<null | (typeof FACULTY_SUBJECTS)[number]>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Juan</h1>
        <p className="text-sm text-muted-foreground">Week 10 of 18 • 1st Semester 2025–2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Required Hours" value={`${totalReq}h`} icon={<Clock className="size-4" />} />
        <KpiCard label="Hours Completed" value={`${totalLog}h`} icon={<CheckCircle2 className="size-4" />} accent="success" />
        <KpiCard label="Overall Compliance" value={`${overall}%`} icon={<Gauge className="size-4" />} accent="accent" />
        <KpiCard label="Sessions This Week" value="3" icon={<CalendarCheck className="size-4" />} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Compliance Progress by Subject
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {FACULTY_SUBJECTS.map((s) => {
            const pct = Math.round((s.logged / s.required) * 100);
            const status = statusFromProgress(pct);
            const remaining = s.required - s.logged;
            const projected = Math.min(100, Math.round((pct / 10) * 18 / 10 * 100) / 100);
            const projectedPct = Math.min(100, Math.round(pct * (18 / 10)));
            return (
              <Card key={s.code} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">{s.code}</div>
                      <CardTitle className="text-base">{s.name}</CardTitle>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Stat label="Required" value={`${s.required}h`} />
                    <Stat label="Logged" value={`${s.logged}h`} highlight />
                    <Stat label="Remaining" value={`${remaining}h`} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive",
                        )}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      Projected completion: <b className="text-foreground">{projectedPct}%</b> by Week 18
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <CalendarDays className="size-3.5" /> View Schedule
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setQr(s)}
                    >
                      <QrCode className="size-3.5" /> Show QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">My Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">Day</th>
                <th className="py-3 pr-4">Time Slot</th>
                <th className="py-3 pr-4">Room</th>
                <th className="py-3 pr-4">Subject</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {FACULTY_WEEKLY_SCHEDULE.map((row) => (
                <tr key={row.day} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{row.day}</td>
                  <td className="py-3 pr-4">{row.timeSlot}</td>
                  <td className="py-3 pr-4">{row.room}</td>
                  <td className={cn("py-3 pr-4", row.isLab ? "font-medium text-accent" : "text-muted-foreground")}>
                    {row.subject}
                  </td>
                  <td className="py-3 pr-4">
                    {row.isLab ? (
                      <Badge className="bg-accent/15 text-accent border-accent/30 border">Lab Session</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Lecture</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!qr} onOpenChange={(o) => !o && setQr(null)}>
        <DialogContent className="max-w-sm">
          {qr && (
            <>
              <DialogHeader>
                <DialogTitle>{qr.code} — {qr.name}</DialogTitle>
                <DialogDescription>Scan to Acknowledge Session</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3">
                <QRPlaceholder size={200} />
                <div className="text-center text-sm">
                  <div className="font-medium">{qr.room}</div>
                  <div className="text-muted-foreground">{qr.day} • {qr.timeSlot}</div>
                  <div className="text-muted-foreground">Week 10 — Oct 28, 2025</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setQr(null)} className="w-full">Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: "success" | "accent" }) {
  const tone = accent === "success" ? "bg-success/10 text-success" : accent === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary";
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

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-2", highlight && "bg-accent/5 border-accent/30")}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
