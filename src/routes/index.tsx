import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Users, Monitor, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole, type Role } from "@/lib/role-store";
import labCartoon from "@/assets/lab-cartoon.png";
import labLogo from "@/assets/labtrack-logo.png";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [email, setEmail] = useState("juan.delacruz@umindanao.edu.ph");
  const [password, setPassword] = useState("••••••••");

  return (
    <div className="min-h-screen bg-white px-4 py-8 lg:px-12 lg:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-8 lg:grid-cols-2">
        {/* Illustration side */}
        <div className="order-2 flex items-center justify-center lg:order-1">
          <img
            src={labCartoon}
            alt="Students using the computer laboratory with QR session check-in"
            className="w-full max-w-xl object-contain"
          />
        </div>

        {/* Form side */}
        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-elevated sm:p-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={labLogo} alt="LabTrack logo" className="size-14 rounded-xl object-contain" />
              <div>
                <div className="text-2xl font-bold tracking-tight text-primary">
                  Lab<span className="text-accent">Track</span>
                </div>
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  By GirFraSo
                </div>
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-semibold text-primary">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Your Next Level Computer Laboratory Management System
            </p>

            <form
              className="mt-7 space-y-4"
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
                Wanna try?
              </p>
            </form>

            {/* Stat tiles */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Users, k: "12", v: "Faculty" },
                { icon: Monitor, k: "4", v: "Labs" },
                { icon: BarChart3, k: "156", v: "Sessions" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={v} className="rounded-xl border border-border bg-background p-3 text-center">
                  <Icon className="mx-auto size-5 text-accent" />
                  <div className="mt-1.5 text-lg font-semibold text-primary">{k}</div>
                  <div className="text-[11px] text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
