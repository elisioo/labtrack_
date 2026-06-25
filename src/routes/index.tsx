import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Beaker, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole, type Role } from "@/lib/role-store";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [email, setEmail] = useState("juan.delacruz@umindanao.edu.ph");
  const [password, setPassword] = useState("••••••••");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* Brand side */}
        <div className="hidden flex-col justify-between rounded-2xl bg-primary p-10 text-primary-foreground shadow-elevated lg:flex">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Beaker className="size-6" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">
                  Lab<span className="text-accent">Track</span>
                </div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/70">UM Davao</div>
              </div>
            </div>
            <h1 className="mt-12 text-3xl font-semibold leading-tight">
              Faculty Laboratory Utilization Monitoring &amp; Feedback System
            </h1>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/75">
              Track laboratory hours, generate compliant schedules, and verify sessions via QR — all in one
              workspace built for the University of Mindanao.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { k: "12", v: "Faculty" },
              { k: "4", v: "Labs" },
              { k: "156", v: "Sessions" },
            ].map((s) => (
              <div key={s.v} className="rounded-lg bg-primary-foreground/10 p-3">
                <div className="text-xl font-semibold">{s.k}</div>
                <div className="text-xs text-primary-foreground/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form side */}
        <div className="rounded-2xl border bg-card p-8 shadow-elevated sm:p-10">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Beaker className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold">
                Lab<span className="text-accent">Track</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">UM Davao</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            University of Mindanao — Laboratory Management System
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Custodian">Custodian</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Demo build — any credentials will sign you in.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
