import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROOMS, TIME_SLOTS, DAYS, ROOM_OCCUPANCY } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/schedule-generator")({
  component: ScheduleGeneratorPage,
});

function ScheduleGeneratorPage() {
  const [form, setForm] = useState({
    subject: "Systems Integration",
    code: "IT321",
    hours: "54",
    duration: "18",
    slot: TIME_SLOTS[2],
    room: "CS Lab 2",
  });
  const [result, setResult] = useState<null | {
    weeks: number;
    daysPerWeek: number;
    hours: number;
    feasibility: "Feasible" | "Under-Allocated" | "Over-Allocated";
    conflict: string | null;
  }>(null);

  function generate() {
    const weeks = Number(form.duration);
    const hours = Number(form.hours);
    const sessionsNeeded = hours / 2;
    const daysPerWeek = Math.ceil(sessionsNeeded / weeks);
    const feasibility: "Feasible" | "Under-Allocated" | "Over-Allocated" =
      daysPerWeek <= 2 ? "Feasible" : daysPerWeek <= 3 ? "Under-Allocated" : "Over-Allocated";
    const slotIdx = TIME_SLOTS.indexOf(form.slot);
    const conflictDay = DAYS.find((d) => ROOM_OCCUPANCY[form.room]?.[d]?.[slotIdx]);
    const conflict =
      conflictDay && ROOM_OCCUPANCY[form.room][conflictDay][slotIdx] !== form.code
        ? `${form.room} is already occupied on ${conflictDay} at ${form.slot} by ${ROOM_OCCUPANCY[form.room][conflictDay][slotIdx]}.`
        : null;
    setResult({ weeks, daysPerWeek, hours, feasibility, conflict });
  }

  const weeklyRows = useMemo(() => {
    if (!result) return [];
    let cumulative = 0;
    const dayCombos = ["Tue & Thu", "Mon & Wed", "Wed & Fri", "Tue & Fri", "Mon & Thu"];
    return Array.from({ length: result.weeks }, (_, i) => {
      cumulative += result.daysPerWeek * 2;
      cumulative = Math.min(cumulative, result.hours);
      return {
        week: i + 1,
        days: dayCombos[i % dayCombos.length],
        room: form.room,
        slot: form.slot,
        cumulative,
      };
    });
  }, [result, form.room, form.slot]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule Generator</h1>
        <p className="text-sm text-muted-foreground">Generate automated laboratory schedules with conflict detection</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Course Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Subject Name</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Required Lab Hours</Label>
                <Select value={form.hours} onValueChange={(v) => setForm({ ...form, hours: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="36">36 hours</SelectItem>
                    <SelectItem value="54">54 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Course Duration</Label>
                <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Term (9 weeks)</SelectItem>
                    <SelectItem value="18">Semester (18 weeks)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Session Duration</Label>
              <Input value="2 hours (fixed)" readOnly className="bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Preferred Time Slot</Label>
                <Select value={form.slot} onValueChange={(v) => setForm({ ...form, slot: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Laboratory Room</Label>
                <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={generate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="size-4" /> Generate Schedule
              </Button>
              <Button variant="outline" onClick={() => setResult(null)}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Generated Schedule</CardTitle>
              {result && (
                <Badge
                  className={
                    result.feasibility === "Feasible"
                      ? "bg-success/15 text-success border-success/30 border"
                      : result.feasibility === "Under-Allocated"
                      ? "bg-warning/20 text-warning-foreground border-warning/40 border"
                      : "bg-destructive/15 text-destructive border-destructive/30 border"
                  }
                >
                  {result.feasibility === "Feasible" ? <CheckCircle2 className="size-3.5" /> :
                   result.feasibility === "Under-Allocated" ? <AlertTriangle className="size-3.5" /> :
                   <XCircle className="size-3.5" />}
                  {result.feasibility}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                <Sparkles className="mb-2 size-8 opacity-40" />
                Fill the form and click Generate Schedule to preview the weekly plan.
              </div>
            ) : (
              <div className="space-y-4">
                {result.conflict && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                      <span>{result.conflict}</span>
                    </div>
                  </div>
                )}
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <div className="font-mono">
                    Required sessions = {result.hours} / 2 = {result.hours / 2} • Weeks = {result.weeks} →
                    <span className="ml-1 font-semibold text-foreground">
                      {result.daysPerWeek} lab day{result.daysPerWeek > 1 ? "s" : ""} / week
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-auto rounded-lg border">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-muted/60">
                      <tr className="text-left">
                        <th className="px-3 py-2">Week</th>
                        <th className="px-3 py-2">Assigned Days</th>
                        <th className="px-3 py-2">Room</th>
                        <th className="px-3 py-2">Time Slot</th>
                        <th className="px-3 py-2 text-right">Cum. Hrs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyRows.map((r) => (
                        <tr key={r.week} className="border-t">
                          <td className="px-3 py-2 font-medium">W{r.week}</td>
                          <td className="px-3 py-2">{r.days}</td>
                          <td className="px-3 py-2">{r.room}</td>
                          <td className="px-3 py-2">{r.slot}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{r.cumulative}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
