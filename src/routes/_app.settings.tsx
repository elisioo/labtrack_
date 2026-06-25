import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { role } = useRole();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and notification preferences</p>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" value="Juan Dela Cruz" />
          <Field label="Email" value="juan.delacruz@umindanao.edu.ph" />
          <Field label="Role" value={role} />
          <Field label="Department" value="College of Computer Studies" />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Toggle title="Compliance alerts" desc="Get notified when you fall behind schedule" defaultChecked />
          <Toggle title="Session reminders" desc="Email reminder 1 hour before each lab session" defaultChecked />
          <Toggle title="QR verification receipts" desc="Email confirmation after every QR scan" />
          <Toggle title="Weekly summary" desc="Friday digest of compliance progress" defaultChecked />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={value} />
    </div>
  );
}

function Toggle({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
