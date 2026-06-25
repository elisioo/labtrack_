import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bell,
  Settings,
  Users,
  DoorOpen,
  Wand2,
  BarChart3,
  Beaker,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useRole, type Role } from "@/lib/role-store";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string; icon: ReactNode };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  Faculty: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { to: "/schedule", label: "My Schedule", icon: <CalendarDays className="size-4" /> },
    { to: "/session-logs", label: "Session Logs", icon: <ClipboardList className="size-4" /> },
    { to: "/notifications", label: "Notifications", icon: <Bell className="size-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
  ],
  Custodian: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { to: "/schedule-generator", label: "Schedule Generator", icon: <Wand2 className="size-4" /> },
    { to: "/faculty-monitor", label: "Faculty Monitor", icon: <Users className="size-4" /> },
    { to: "/room-occupancy", label: "Room Occupancy", icon: <DoorOpen className="size-4" /> },
    { to: "/session-logs", label: "Session Logs", icon: <ClipboardList className="size-4" /> },
    { to: "/notifications", label: "Notifications", icon: <Bell className="size-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
  ],
  Administrator: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { to: "/schedule", label: "All Schedules", icon: <CalendarDays className="size-4" /> },
    { to: "/faculty-monitor", label: "Faculty Reports", icon: <Users className="size-4" /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
    { to: "/room-occupancy", label: "Room Analytics", icon: <DoorOpen className="size-4" /> },
    { to: "/session-logs", label: "System Logs", icon: <ClipboardList className="size-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
  ],
};

export function AppShell() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const items = NAV_BY_ROLE[role];

  const userByRole: Record<Role, { name: string; sub: string; initials: string }> = {
    Faculty: { name: "Juan Dela Cruz", sub: "Faculty • CS Dept.", initials: "JD" },
    Custodian: { name: "Pedro Bautista", sub: "Lab Custodian", initials: "PB" },
    Administrator: { name: "Dr. Elena Cruz", sub: "Administrator", initials: "EC" },
  };
  const user = userByRole[role];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Beaker className="size-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-base font-semibold">
                Lab<span className="text-accent">Track</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">UM Davao</div>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className="size-9">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">{user.initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-sidebar-foreground/60">{user.sub}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden size-9 items-center justify-center rounded-lg border bg-background hover:bg-muted md:flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>

          <div className="hidden flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 lg:flex max-w-md">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Search faculty, courses, rooms…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-muted-foreground">Viewing as</span>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Custodian">Custodian</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="size-4" />
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                    {NOTIFICATIONS.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {NOTIFICATIONS.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="font-medium">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{n.body}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/" })} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
