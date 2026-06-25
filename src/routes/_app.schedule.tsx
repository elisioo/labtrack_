import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FACULTY_WEEKLY_SCHEDULE, DAYS, TIME_SLOTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/_app/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const { role } = useRole();
  const title = role === "Administrator" ? "All Schedules" : "My Schedule";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Weekly laboratory schedule overview — Week 10 of 18</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
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
                  <td
                    className={cn(
                      "py-3 pr-4",
                      row.isLab ? "font-medium text-accent" : "text-muted-foreground",
                    )}
                  >
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

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Room Grid — This Week</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <thead>
              <tr className="border-b text-left uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-2">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="py-2 pr-2">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, i) => (
                <tr key={slot} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-medium text-muted-foreground">{slot}</td>
                  {DAYS.map((d) => {
                    const match = FACULTY_WEEKLY_SCHEDULE.find((r) => r.day === d && r.timeSlot === slot);
                    return (
                      <td key={d} className="py-1.5 pr-2">
                        {match && match.isLab ? (
                          <div className="rounded-md bg-accent/15 px-2 py-1 text-accent font-medium">
                            {match.subject.split(" — ")[0]}
                          </div>
                        ) : (
                          <div className="rounded-md bg-muted px-2 py-1 text-muted-foreground">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
