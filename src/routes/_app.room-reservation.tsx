import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ROOMS, TIME_SLOTS, DAYS, ROOM_OCCUPANCY } from "@/lib/mock-data";
import {
  FlaskConical,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Send,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/_app/room-reservation")({
  component: RoomReservationPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReservationRequest {
  id: string;
  room: string;
  day: string;
  slot: string;
  purpose: string;
  status: "pending" | "approved" | "declined";
  submittedAt: string;
}

// ---------------------------------------------------------------------------
// Mock — in a real app these come from your DB / store
// ---------------------------------------------------------------------------

const INITIAL_REQUESTS: ReservationRequest[] = [
  {
    id: "req-001",
    room: "CS Lab 1",
    day: "Monday",
    slot: "1:30 PM – 3:30 PM",
    purpose: "Extra session for IT322 students before midterms",
    status: "approved",
    submittedAt: "2025-01-10 08:32",
  },
  {
    id: "req-002",
    room: "Net Lab",
    day: "Wednesday",
    slot: "3:30 PM – 5:30 PM",
    purpose: "Network troubleshooting practicum for IT324",
    status: "pending",
    submittedAt: "2025-01-12 14:05",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a grid of { room → { day → { slot → occupant | null } } }
 * pulling from ROOM_OCCUPANCY (scheduled subjects) and any approved reservation requests.
 */
function buildAvailabilityGrid(approvedRequests: ReservationRequest[]) {
  const grid: Record<string, Record<string, Record<string, string | null>>> = {};

  for (const room of ROOMS) {
    grid[room] = {};
    for (const day of DAYS) {
      grid[room][day] = {};
      for (const slot of TIME_SLOTS) {
        const slotIdx = TIME_SLOTS.indexOf(slot);
        const scheduled = ROOM_OCCUPANCY[room]?.[day]?.[slotIdx] ?? null;
        grid[room][day][slot] = scheduled;
      }
    }
  }

  // Overlay approved reservations
  for (const req of approvedRequests) {
    if (grid[req.room]?.[req.day]) {
      grid[req.room][req.day][req.slot] = `Reserved — ${req.purpose.slice(0, 30)}…`;
    }
  }

  return grid;
}

const STATUS_CONFIG = {
  pending:  { label: "Pending",  className: "bg-warning/20 text-warning-foreground border-warning/40 border" },
  approved: { label: "Approved", className: "bg-success/15 text-success border-success/30 border" },
  declined: { label: "Declined", className: "bg-destructive/15 text-destructive border-destructive/30 border" },
} as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function RoomReservationPage() {
  const [requests, setRequests] = useState<ReservationRequest[]>(INITIAL_REQUESTS);
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");

  // Request form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ room: string; day: string; slot: string } | null>(null);
  const [purpose, setPurpose] = useState("");

  const approvedRequests = requests.filter((r) => r.status === "approved");
  const grid = useMemo(() => buildAvailabilityGrid(approvedRequests), [approvedRequests]);

  const filteredDays  = filterDay  === "all" ? DAYS  : DAYS.filter((d) => d === filterDay);
  const filteredRooms = filterRoom === "all" ? ROOMS : ROOMS.filter((r) => r === filterRoom);

  function openRequestDialog(room: string, day: string, slot: string) {
    setSelectedCell({ room, day, slot });
    setPurpose("");
    setDialogOpen(true);
  }

  function submitRequest() {
    if (!selectedCell || !purpose.trim()) return;
    const newReq: ReservationRequest = {
      id: `req-${Date.now()}`,
      room: selectedCell.room,
      day: selectedCell.day,
      slot: selectedCell.slot,
      purpose: purpose.trim(),
      status: "pending",
      submittedAt: new Date().toLocaleString("en-US", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false,
      }),
    };
    setRequests((prev) => [newReq, ...prev]);
    setDialogOpen(false);
    setSelectedCell(null);
    setPurpose("");
  }

  // Check if faculty already has a pending/approved request for a cell
  function cellRequestStatus(room: string, day: string, slot: string) {
    return requests.find((r) => r.room === room && r.day === day && r.slot === slot);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Room reservation</h1>
        <p className="text-sm text-muted-foreground">
          Browse available laboratory rooms and submit a reservation request
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Legend</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-success/20 border border-success/40" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-destructive/15 border border-destructive/30" />
          Occupied (scheduled)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-warning/20 border border-warning/40" />
          Reserved
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-primary/15 border border-primary/30" />
          Your pending request
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Filter by day</Label>
          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All days</SelectItem>
              {DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Filter by room</Label>
          <Select value={filterRoom} onValueChange={setFilterRoom}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rooms</SelectItem>
              {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Availability grid — one card per room */}
      <div className="space-y-4">
        {filteredRooms.map((room) => (
          <Card key={room} className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FlaskConical className="size-4 text-accent" />
                {room}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-44">Time slot</th>
                      {filteredDays.map((day) => (
                        <th key={day} className="px-3 py-2 text-center font-medium text-muted-foreground">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((slot) => (
                      <tr key={slot} className="border-t">
                        <td className="px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 shrink-0" /> {slot}
                          </span>
                        </td>
                        {filteredDays.map((day) => {
                          const occupant = grid[room]?.[day]?.[slot];
                          const existing = cellRequestStatus(room, day, slot);

                          if (occupant) {
                            return (
                              <td key={day} className="px-2 py-1.5 text-center">
                                <div className="rounded-md bg-destructive/10 border border-destructive/25 px-2 py-1 text-destructive text-[11px] leading-tight">
                                  {occupant}
                                </div>
                              </td>
                            );
                          }

                          if (existing) {
                            const cfg = STATUS_CONFIG[existing.status];
                            return (
                              <td key={day} className="px-2 py-1.5 text-center">
                                <div className={`rounded-md px-2 py-1 text-[11px] leading-tight ${
                                  existing.status === "pending"
                                    ? "bg-primary/10 border border-primary/25 text-primary"
                                    : existing.status === "approved"
                                    ? "bg-success/10 border border-success/25 text-success"
                                    : "bg-destructive/10 border border-destructive/25 text-destructive"
                                }`}>
                                  {cfg.label}
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td key={day} className="px-2 py-1.5 text-center">
                              <button
                                onClick={() => openRequestDialog(room, day, slot)}
                                className="w-full rounded-md bg-success/10 border border-success/25 px-2 py-1 text-[11px] text-success hover:bg-success/20 transition-colors cursor-pointer"
                              >
                                Available
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My requests */}
      {requests.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">My requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr className="text-left">
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-3 py-2">Time slot</th>
                    <th className="px-3 py-2">Purpose</th>
                    <th className="px-3 py-2">Submitted</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{req.room}</td>
                      <td className="px-3 py-2">{req.day}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{req.slot}</td>
                      <td className="px-3 py-2 max-w-xs text-muted-foreground truncate">{req.purpose}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{req.submittedAt}</td>
                      <td className="px-3 py-2">
                        <Badge className={STATUS_CONFIG[req.status].className}>
                          {req.status === "approved" && <CheckCircle2 className="size-3" />}
                          {req.status === "declined" && <XCircle className="size-3" />}
                          {STATUS_CONFIG[req.status].label}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-accent" /> Request reservation
            </DialogTitle>
          </DialogHeader>
          {selectedCell && (
            <div className="space-y-4 py-1">
              <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{selectedCell.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day</span>
                  <span className="font-medium">{selectedCell.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time slot</span>
                  <span className="font-medium">{selectedCell.slot}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purpose">Purpose / reason</Label>
                <Textarea
                  id="purpose"
                  placeholder="e.g. Extra session for IT321 students before finals…"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
                <Info className="size-3.5 mt-0.5 shrink-0" />
                Your request will be reviewed by the laboratory custodian before the room is confirmed.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={submitRequest}
              disabled={!purpose.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="size-3.5" /> Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}