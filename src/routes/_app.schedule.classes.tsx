import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AlertTriangle, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FACULTY_SUBJECTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/_app/schedule/classes")({
  component: ScheduleClassesPage,
});

function ScheduleClassesPage() {
  const { role } = useRole();

  // Calculate compliance status for each subject
  const subjectCompliance = useMemo(() => {
    return FACULTY_SUBJECTS.map(subj => {
      const progress = (subj.logged / subj.required) * 100;
      const projectedWeeks = Math.ceil((subj.required / (subj.logged / 10)) * 10); // Assuming we're in week 10
      const status = progress >= 80 ? "Compliant" : progress >= 50 ? "At Risk" : "Non-Compliant";
      return {
        ...subj,
        progress,
        projectedWeeks,
        status,
        remaining: subj.required - subj.logged,
      };
    });
  }, []);

  const title = role === "Administrator" ? "All Classes" : "Classes";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Course compliance tracking · Laboratory assignments
          </p>
        </div>
        <Button className="bg-[#0D9488] hover:bg-[#0b7f74] text-white gap-2">
          Schedule Make-up Session
        </Button>
      </div>

      {/* Compliance Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {subjectCompliance.map((subj) => {
          const statusColor = 
            subj.status === "Compliant" ? "text-green-600 bg-green-50 border-green-200" :
            subj.status === "At Risk" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";
          
          const progressColor = 
            subj.status === "Compliant" ? "bg-green-500" :
            subj.status === "At Risk" ? "bg-amber-500" :
            "bg-red-500";

          return (
            <Card key={subj.code} className="p-4 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm">{subj.code}</div>
                  <div className="text-xs text-muted-foreground">{subj.name}</div>
                </div>
                <Badge className={cn("text-[10px] font-medium", statusColor)}>
                  {subj.status}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{subj.logged} / {subj.required} hrs</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all", progressColor)}
                    style={{ width: `${Math.min(subj.progress, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {subj.remaining}h remaining · {subj.progress.toFixed(1)}% complete
                </div>
              </div>

              {/* Session Info */}
              <div className="flex items-center gap-3 text-[10px] text-slate-600 border-t pt-3">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {subj.room}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> {subj.day}s
                </span>
              </div>

              {/* Projected Completion */}
              {subj.projectedWeeks > 18 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center gap-1.5 text-[10px] text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Projected: Week {subj.projectedWeeks} (Behind schedule)</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Prescriptive Correction Info */}
      <Card className="p-5 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold mb-2">Prescriptive Correction System</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The system automatically monitors your progress against CHED-mandated laboratory hours. 
              When a course falls behind schedule, the Rule-Based Prescriptive Correction engine will 
              recommend make-up sessions based on room availability and your existing schedule.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

