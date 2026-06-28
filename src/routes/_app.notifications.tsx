import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const ICONS = {
  danger: AlertTriangle,
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
} as const;

const COLORS = {
  danger: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  info: "bg-accent/10 text-accent",
  warning: "bg-warning/15 text-warning-foreground",
} as const;

function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Compliance alerts, reminders, and confirmations</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="size-4" /> Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {NOTIFICATIONS.map((n) => {
            const Icon = ICONS[n.type as keyof typeof ICONS];
            return (
              <div key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", COLORS[n.type as keyof typeof COLORS])}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.time}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
