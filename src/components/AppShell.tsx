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
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarCheck,
  Inbox,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useRole, type Role } from "@/lib/role-store";
import { NOTIFICATIONS } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import labtrackLogo from "@/assets/labtrack-logo.png";

type NavItem = { to: string; label: string; icon: ReactNode; badge?: number };

type NavSection = { label: string; items: NavItem[] };

function buildNav(role: Role, notifCount: number): NavSection[] {
  const ic = "size-[17px]" as const;
  const main: Record<Role, NavItem[]> = {
    Faculty: [
      { to: "/dashboard",        label: "Dashboard",     icon: <LayoutDashboard className={ic} strokeWidth={1.75} /> },
      { to: "/schedule",         label: "My Schedule",   icon: <CalendarDays    className={ic} strokeWidth={1.75} /> },
      { to: "/room-reservation", label: "Reserve a Room",icon: <CalendarCheck   className={ic} strokeWidth={1.75} /> },
      { to: "/session-logs",     label: "Session Logs",  icon: <ClipboardList   className={ic} strokeWidth={1.75} /> },
    ],
    Custodian: [
      { to: "/dashboard",             label: "Dashboard",            icon: <LayoutDashboard className={ic} strokeWidth={1.75} /> },
      { to: "/schedule-generator",    label: "Schedule Generator",   icon: <Wand2           className={ic} strokeWidth={1.75} /> },
      { to: "/reservation-requests",  label: "Reservation Requests", icon: <Inbox           className={ic} strokeWidth={1.75} />, badge: 3 },
      { to: "/faculty-monitor",       label: "Faculty Monitor",      icon: <Users           className={ic} strokeWidth={1.75} /> },
      { to: "/room-occupancy",        label: "Room Occupancy",       icon: <DoorOpen        className={ic} strokeWidth={1.75} /> },
      { to: "/session-logs",          label: "Session Logs",         icon: <ClipboardList   className={ic} strokeWidth={1.75} /> },
    ],
    Administrator: [
      { to: "/dashboard",      label: "Dashboard",      icon: <LayoutDashboard className={ic} strokeWidth={1.75} /> },
      { to: "/schedule",       label: "All Schedules",  icon: <CalendarDays    className={ic} strokeWidth={1.75} /> },
      { to: "/faculty-monitor",label: "Faculty Reports",icon: <Users           className={ic} strokeWidth={1.75} /> },
      { to: "/analytics",      label: "Analytics",      icon: <BarChart3       className={ic} strokeWidth={1.75} /> },
      { to: "/room-occupancy", label: "Room Analytics", icon: <DoorOpen        className={ic} strokeWidth={1.75} /> },
      { to: "/session-logs",   label: "System Logs",    icon: <ClipboardList   className={ic} strokeWidth={1.75} /> },
    ],
  };
  return [
    { label: "MAIN", items: main[role] },
    {
      label: "ACCOUNT",
      items: [
        { to: "/notifications", label: "Notifications", icon: <Bell     className={ic} strokeWidth={1.75} />, badge: notifCount },
        { to: "/settings",      label: "Settings",      icon: <Settings className={ic} strokeWidth={1.75} /> },
      ],
    },
  ];
}

function LogoMark() {
  return (
    <img
      src={labtrackLogo}
      alt="LabTrack"
      className="shrink-0 object-contain"
      style={{ width: 34, height: 34, borderRadius: 9 }}
    />
  );
}

function CollapsedSidebar({
  sections,
  pathname,
  user,
  onExpand,
  onUserClick,
}: {
  sections: NavSection[];
  pathname: string;
  user: { initials: string };
  onExpand: () => void;
  onUserClick?: () => void;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full w-14 flex-col items-center bg-white py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onExpand}
              className="flex size-9 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f9fafb]"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="size-[17px]" strokeWidth={1.75} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        </Tooltip>

        <div className="my-3">
          <LogoMark />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1 pt-2">
          {sections.flatMap((s) =>
            s.items.map((item) => {
              const active = pathname === item.to;
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      className="relative flex size-9 items-center justify-center rounded-lg"
                      style={{
                        background: active ? "#f0fdfb" : "transparent",
                        color: active ? "#0d9488" : "#6b7280",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {active && (
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: -6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 18,
                            background: "#0d9488",
                            borderRadius: "0 3px 3px 0",
                          }}
                        />
                      )}
                      {item.icon}
                      {item.badge && item.badge > 0 ? (
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "#d97706",
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                          }}
                        />
                      ) : null}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }),
          )}
        </nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onUserClick}
              className="mt-2 flex size-9 items-center justify-center rounded-full text-white"
              style={{ background: "#0d9488", fontSize: 11, fontWeight: 700 }}
              aria-label="Switch role"
            >
              {user.initials}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Switch role</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function SidebarContent({
  sections,
  pathname,
  user,
  onNavigate,
  onUserClick,
  onCollapse,
}: {
  sections: NavSection[];
  pathname: string;
  user: { name: string; sub: string; initials: string };
  onNavigate?: () => void;
  onUserClick?: () => void;
  onCollapse?: () => void;
}) {
  const done = 78;
  const total = 144;
  const remaining = total - done;
  const pct = Math.round((done / total) * 100);
  const meterColor = pct < 70 ? "#d97706" : "#059669";

  const week = 10;
  const weeks = 18;
  const weekPct = Math.round((week / weeks) * 100);

  return (
    <div className="flex h-full flex-col bg-white" style={{ width: 224 }}>
      {/* Logo */}
      <div className="px-[14px] pt-[18px] pb-[14px]" style={{ borderBottom: "1px solid #f4f4f2" }}>
        <div className="flex items-center gap-[10px]">
          <LogoMark />
          <div className="leading-tight flex-1 min-w-0">
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
              <span style={{ color: "#1a1a1a" }}>Lab</span>
              <span style={{ color: "#0d9488" }}>Track</span>
            </div>
            <div style={{ fontSize: 9, letterSpacing: "1.5px", color: "#b0b0aa", marginTop: 2 }}>
              BY GIRFRASO
            </div>
          </div>
          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              className="hidden md:flex size-7 items-center justify-center rounded-md text-[#9ca3af] hover:bg-[#f9fafb] hover:text-[#0d9488]"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="size-[15px]" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* Semester chip */}
      <div
        style={{
          margin: "14px 14px 0",
          padding: "8px 11px",
          background: "#f0fdfb",
          border: "1px solid #ccfbf1",
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "1.2px", color: "#0d9488", fontWeight: 600 }}>
          CURRENT TERM
        </div>
        <div style={{ fontSize: 11.5, color: "#374151", marginTop: 2 }}>1st Sem AY 2025–2026</div>
        <div style={{ fontSize: 9.5, color: "#9ca3af", marginTop: 1 }}>
          Week {week} of {weeks}
        </div>
        <div style={{ marginTop: 7, height: 3, background: "#e5e7eb", borderRadius: 999 }}>
          <div
            style={{ width: `${weekPct}%`, height: "100%", background: "#0d9488", borderRadius: 999 }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-[10px] pt-4 pb-3">
        {sections.map((section, sIdx) => (
          <div key={section.label} className={sIdx > 0 ? "mt-5" : ""}>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "1.4px",
                color: "#c4c4be",
                fontWeight: 600,
                padding: "0 10px 8px",
              }}
            >
              {section.label}
            </div>
            <div className="space-y-[2px]">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className="relative flex items-center gap-[10px] rounded-lg transition-colors"
                    style={{
                      padding: "8px 10px",
                      background: active ? "#f0fdfb" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {active && (
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 3,
                          height: 18,
                          background: "#0d9488",
                          borderRadius: "0 3px 3px 0",
                        }}
                      />
                    )}
                    <span style={{ color: active ? "#0d9488" : "#6b7280", display: "inline-flex" }}>
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: active ? 600 : 500,
                        color: active ? "#0f766e" : "#6b7280",
                      }}
                      className="flex-1 truncate"
                    >
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 ? (
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#b45309",
                          borderRadius: 10,
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "1px 6px",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Compliance meter */}
      <div
        style={{
          margin: "0 10px 10px",
          padding: "11px 12px",
          background: "#fafaf9",
          border: "1px solid #f0f0ee",
          borderRadius: 10,
        }}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 9.5, letterSpacing: "1px", color: "#b0b0aa", fontWeight: 600 }}>
            COMPLIANCE
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: meterColor }}>{pct}%</span>
        </div>
        <div style={{ marginTop: 7, height: 4, background: "#f3f4f6", borderRadius: 999 }}>
          <div
            style={{ width: `${pct}%`, height: "100%", background: meterColor, borderRadius: 999 }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#b0b0aa", marginTop: 6 }}>
          {done}h done · {remaining}h remaining
        </div>
      </div>

      {/* User profile */}
      <button
        type="button"
        onClick={onUserClick}
        style={{
          margin: "0 10px 14px",
          padding: "9px 10px",
          background: "#f9fafb",
          border: "1px solid #f0f0ee",
          borderRadius: 10,
        }}
        className="flex items-center gap-[10px] text-left transition-colors hover:bg-[#f3f4f6]"
      >
        <span
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{ width: 30, height: 30, background: "#0d9488", color: "white", fontSize: 11, fontWeight: 700 }}
        >
          {user.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate" style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
            {user.name}
          </span>
          <span className="block truncate" style={{ fontSize: 10, color: "#9ca3af" }}>
            {user.sub}
          </span>
        </span>
        <ChevronRight size={14} style={{ color: "#d1d5db" }} />
      </button>
    </div>
  );
}

export function AppShell() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const sections = buildNav(role, NOTIFICATIONS.length);

  const userByRole: Record<Role, { name: string; sub: string; initials: string }> = {
    Faculty: { name: "Juan Dela Cruz", sub: "Faculty • CS Dept.", initials: "JD" },
    Custodian: { name: "Pedro Bautista", sub: "Lab Custodian", initials: "PB" },
    Administrator: { name: "Dr. Elena Cruz", sub: "Administrator", initials: "EC" },
  };
  const user = userByRole[role];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className="sticky top-0 hidden h-screen shrink-0 md:block transition-[width] duration-200"
        style={{ width: collapsed ? 56 : 224, borderRight: "1px solid #f0f0ee" }}
      >
        {collapsed ? (
          <CollapsedSidebar
            sections={sections}
            pathname={pathname}
            user={user}
            onExpand={() => setCollapsed(false)}
            onUserClick={() => setRoleMenuOpen(true)}
          />
        ) : (
          <SidebarContent
            sections={sections}
            pathname={pathname}
            user={user}
            onUserClick={() => setRoleMenuOpen(true)}
            onCollapse={() => setCollapsed(true)}
          />
        )}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0" style={{ width: 224, borderRight: "1px solid #f0f0ee" }}>
            <SidebarContent
              sections={sections}
              pathname={pathname}
              user={user}
              onNavigate={() => setMobileOpen(false)}
              onUserClick={() => {
                setMobileOpen(false);
                setRoleMenuOpen(true);
              }}
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border bg-background hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
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
              <Select
                value={role}
                onValueChange={(v) => setRole(v as Role)}
                open={roleMenuOpen}
                onOpenChange={setRoleMenuOpen}
              >
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