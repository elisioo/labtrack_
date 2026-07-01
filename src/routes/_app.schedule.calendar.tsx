import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users, X, Filter, CheckCircle2, QrCode, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS, TIME_SLOTS, ROOMS, ROOM_OCCUPANCY, FACULTY_SUBJECTS, SESSION_LOGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/_app/schedule/calendar")({
  component: ScheduleCalendarPage,
});

const SUBJECT_META: Record<string, { name: string; faculty: string; color: string }> = {
  IT321: { name: "Systems Integration", faculty: "Juan Dela Cruz", color: "teal" },
  CS401: { name: "Capstone Project", faculty: "Maria Santos", color: "indigo" },
  IT411: { name: "Network Security", faculty: "Jose Reyes", color: "amber" },
  CS301: { name: "Data Structures", faculty: "Ana Lim", color: "rose" },
  IT221: { name: "Web Development", faculty: "Carlos Gomez", color: "sky" },
};

const COLOR_STYLES: Record<string, { bg: string; ring: string; text: string; dot: string }> = {
  teal: { bg: "bg-teal-50", ring: "ring-teal-200", text: "text-teal-800", dot: "bg-teal-500" },
  indigo: { bg: "bg-indigo-50", ring: "ring-indigo-200", text: "text-indigo-800", dot: "bg-indigo-500" },
  amber: { bg: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-800", dot: "bg-amber-500" },
  rose: { bg: "bg-rose-50", ring: "ring-rose-200", text: "text-rose-800", dot: "bg-rose-500" },
  sky: { bg: "bg-sky-50", ring: "ring-sky-200", text: "text-sky-800", dot: "bg-sky-500" },
};

const UNAVAILABLE = new Set<string>(["CS Lab 2|Fri|5", "IT Lab 4|Wed|5", "CS Lab 1|Thu|5"]);
const WEEK_DATES = ["Oct 27", "Oct 28", "Oct 29", "Oct 30", "Oct 31"];

type Cell = { room: string; day: string; slotIdx: number; subject: string | null };

function ScheduleCalendarPage() {
  const { role } = useRole();
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [scope, setScope] = useState<"all" | "mine" | "team">(role === "Faculty" ? "mine" : "all");
  const [openCell, setOpenCell] = useState<string | null>(null);

  const visibleRooms = roomFilter === "all" ? ROOMS : [ROOMS.find((r) => r === roomFilter) ?? ROOMS[0]];

  const grid = useMemo(() => {
    const map: Record<string, Cell[]> = {};
    for (const day of DAYS) {
      for (let s = 0; s < TIME_SLOTS.length; s++) {
        const key = `${day}|${s}`;
        map[key] = visibleRooms.map((room) => ({
          room,
          day,
          slotIdx: s,
          subject: ROOM_OCCUPANCY[room]?.[day]?.[s] ?? null,
        }));
      }
    }
    return map;
  }, [visibleRooms]);

  const title = role === "Administrator" ? "All Schedules" : "My Calendar";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Academic Year 2025–2026 · Week 10 of 18 · 18-Week Term
          </p>
        </div>
        <Button className="bg-[#0D9488] hover:bg-[#0b7f74] text-white gap-2">
          <Plus className="h-4 w-4" /> Schedule Make-up Session
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1.5 rounded-md bg-slate-50 border text-sm font-medium">
              Oct 27 – Oct 31, 2025
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border bg-slate-50 p-0.5">
              {(["all", "team", "mine"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition",
                    scope === s
                      ? "bg-white text-[#1E3A5F] shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s === "all" ? "All Schedule" : s === "team" ? "Department" : "My Schedule"}
                </button>
              ))}
            </div>

            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {ROOMS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="inline-flex rounded-lg border bg-slate-50 p-0.5">
              <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-[#1E3A5F] shadow-sm">
                Week
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-muted-foreground">
                Day
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[880px]">
            {/* Day header */}
            <div className="grid grid-cols-[96px_repeat(5,minmax(0,1fr))] border-b bg-slate-50/60">
              <div className="p-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </div>
              {DAYS.map((day, i) => {
                const isToday = i === 1;
                return (
                  <div key={day} className="p-3 border-l">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      {day}
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className={cn(
                        "text-sm font-semibold",
                        isToday ? "text-[#0D9488]" : "text-foreground",
                      )}>
                        {WEEK_DATES[i]}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-medium text-[#0D9488] uppercase">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time rows */}
            {TIME_SLOTS.map((slot, sIdx) => (
              <div
                key={slot}
                className="grid grid-cols-[96px_repeat(5,minmax(0,1fr))] border-b last:border-b-0 min-h-[86px]"
              >
                <div className="p-3 text-[11px] font-medium text-muted-foreground border-r bg-slate-50/30">
                  <div>{slot.split("–")[0]}</div>
                  <div className="text-muted-foreground/70">{slot.split("–")[1]}</div>
                </div>

                {DAYS.map((day) => {
                  const cells = grid[`${day}|${sIdx}`];
                  const bookings = cells.filter((c) => c.subject);
                  const unavailable = cells.every((c) =>
                    UNAVAILABLE.has(`${c.room}|${day}|${sIdx}`),
                  );
                  const cellKey = `${day}|${sIdx}`;

                  const sessionLog = SESSION_LOGS.find(log => 
                    log.date === `Oct ${27 + DAYS.indexOf(day)}, 2025` && 
                    log.timeSlot === slot
                  );

                  if (unavailable) {
                    return (
                      <div
                        key={day}
                        className="border-l relative overflow-hidden"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(-45deg, #f1f5f9 0 6px, transparent 6px 12px)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                            Unavailable
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Popover
                      key={day}
                      open={openCell === cellKey}
                      onOpenChange={(o) => setOpenCell(o ? cellKey : null)}
                    >
                      <PopoverTrigger asChild>
                        <div className="border-l p-1.5 hover:bg-slate-50/60 cursor-pointer transition group relative">
                          <div className="space-y-1">
                            {bookings.map((b) => {
                              const meta = SUBJECT_META[b.subject!] ?? {
                                name: b.subject!,
                                faculty: "—",
                                color: "teal",
                              };
                              const styles = COLOR_STYLES[meta.color];
                              const hasQR = sessionLog?.ack === "QR Verified";
                              const isPending = sessionLog?.ack === "Pending";
                              
                              return (
                                <div
                                  key={b.room}
                                  className={cn(
                                    "rounded-md px-2 py-1.5 ring-1 relative",
                                    styles.bg,
                                    styles.ring,
                                  )}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
                                    <span className={cn("text-[11px] font-semibold", styles.text)}>
                                      {b.subject}
                                    </span>
                                    {hasQR && (
                                      <CheckCircle2 className="h-3 w-3 text-green-600 ml-auto" />
                                    )}
                                    {isPending && (
                                      <QrCode className="h-3 w-3 text-amber-600 ml-auto" />
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-600 mt-0.5 truncate">
                                    {b.room}
                                  </div>
                                </div>
                              );
                            })}
                            {bookings.length === 0 && (
                              <div className="opacity-0 group-hover:opacity-100 transition flex items-center justify-center h-full min-h-[70px] text-[11px] text-slate-400 gap-1">
                                <Plus className="h-3 w-3" /> Book
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <BookingPopover
                          day={day}
                          date={WEEK_DATES[DAYS.indexOf(day)]}
                          slot={slot}
                          bookings={bookings}
                          rooms={visibleRooms}
                          onClose={() => setOpenCell(null)}
                        />
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {Object.entries(SUBJECT_META).map(([code, meta]) => {
          const s = COLOR_STYLES[meta.color];
          return (
            <div key={code} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
              <span className="font-medium text-foreground">{code}</span>
              <span>· {meta.name}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 ml-auto">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
          <span>QR Verified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <QrCode className="h-3.5 w-3.5 text-amber-600" />
          <span>Pending QR</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-6 rounded-sm border"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #f1f5f9 0 4px, transparent 4px 8px)",
            }}
          />
          <span>Unavailable / Maintenance</span>
        </div>
      </div>
    </div>
  );
}

function BookingPopover({
  day,
  date,
  slot,
  bookings,
  rooms,
  onClose,
}: {
  day: string;
  date: string;
  slot: string;
  bookings: Cell[];
  rooms: string[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"view" | "book">(bookings.length > 0 ? "view" : "book");
  const availableRooms = rooms.filter((r) => !bookings.some((b) => b.room === r));

  const sessionLogs = SESSION_LOGS.filter(log => 
    log.date === date && log.timeSlot === slot
  );

  return (
    <div>
      <div className="flex items-start justify-between p-4 border-b">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {day} · {date}
          </div>
          <div className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#0D9488]" />
            {slot}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex border-b bg-slate-50/50">
        <button
          onClick={() => setTab("view")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium transition",
            tab === "view"
              ? "text-[#0D9488] border-b-2 border-[#0D9488] bg-white"
              : "text-muted-foreground",
          )}
        >
          Session Details ({bookings.length})
        </button>
        <button
          onClick={() => setTab("book")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium transition",
            tab === "book"
              ? "text-[#0D9488] border-b-2 border-[#0D9488] bg-white"
              : "text-muted-foreground",
          )}
        >
          Book Make-up
        </button>
      </div>

      {tab === "view" && (
        <div className="p-4 space-y-3 max-h-72 overflow-auto">
          {bookings.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No sessions scheduled for this slot.
            </p>
          ) : (
            bookings.map((b) => {
              const meta = SUBJECT_META[b.subject!];
              const styles = COLOR_STYLES[meta?.color ?? "teal"];
              const log = sessionLogs.find(l => l.code === b.subject && l.room === b.room);
              const hasQR = log?.ack === "QR Verified";
              const isPending = log?.ack === "Pending";

              const subjectInfo = FACULTY_SUBJECTS.find(s => s.code === b.subject);
              const progress = subjectInfo ? (subjectInfo.logged / subjectInfo.required) * 100 : 0;
              
              return (
                <div key={b.room} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", styles.dot)} />
                      <span className="font-semibold text-sm">{b.subject}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">Lab</Badge>
                      {hasQR && (
                        <Badge className="text-[10px] bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {isPending && (
                        <Badge className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                          <QrCode className="h-2.5 w-2.5 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{meta?.name}</div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {b.room}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {meta?.faculty}
                    </span>
                  </div>

                  {subjectInfo && (
                    <div className="pt-2 border-t space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="font-semibold">{subjectInfo.logged}/{subjectInfo.required}h</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            progress >= 80 ? "bg-green-500" : progress >= 50 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {progress.toFixed(1)}% complete · {subjectInfo.required - subjectInfo.logged}h remaining
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "book" && (
        <div className="p-4 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800 mb-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Prescriptive Correction System</div>
                <div className="text-[11px]">
                  Make-up sessions are recommended for subjects falling behind CHED-required hours. 
                  The system will automatically suggest optimal time slots based on room availability.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Subject Code
            </label>
            <Select>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {FACULTY_SUBJECTS.map((subj) => {
                  const progress = (subj.logged / subj.required) * 100;
                  const needsMakeup = progress < 80;
                  return (
                    <SelectItem key={subj.code} value={subj.code}>
                      <div className="flex items-center gap-2">
                        <span>{subj.code}</span>
                        {needsMakeup && (
                          <span className="text-[10px] text-amber-600">(Behind schedule)</span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Room
            </label>
            <Select defaultValue={availableRooms[0]}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    All rooms booked
                  </div>
                ) : (
                  availableRooms.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Duration
            </label>
            <Select defaultValue="2">
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 hours (Regular Term)</SelectItem>
                <SelectItem value="3">3 hours (Summer Term)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 bg-[#0D9488] hover:bg-[#0b7f74] text-white h-8"
              disabled={availableRooms.length === 0}
            >
              Schedule Make-up Session
            </Button>
            <Button size="sm" variant="outline" className="h-8" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
