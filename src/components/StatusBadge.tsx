import type { Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const styles: Record<Status, string> = {
    Compliant: "bg-success/10 text-success border-success/30",
    "At Risk": "bg-warning/15 text-warning-foreground border-warning/40",
    "Non-Compliant": "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status], className)}>
      <span
        className={cn(
          "mr-1.5 inline-block size-1.5 rounded-full",
          status === "Compliant" && "bg-success",
          status === "At Risk" && "bg-warning",
          status === "Non-Compliant" && "bg-destructive",
        )}
      />
      {status}
    </span>
  );
}
