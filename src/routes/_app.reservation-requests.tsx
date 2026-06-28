import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  FlaskConical,
  CalendarDays,
  User,
  MessageSquare,
  TriangleAlert,
} from "lucide-react";

export const Route = createFileRoute("/_app/reservation-requests")({
  component: ReservationRequestsPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RequestStatus = "pending" | "approved" | "declined";

interface ReservationRequest {
  id: string;
  facultyName: string;
  facultyCode: string;
  room: string;
  day: string;
  slot: string;
  purpose: string;
  status: RequestStatus;
  submittedAt: string;
  reviewNote?: string;
}

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls
// ---------------------------------------------------------------------------

const MOCK_REQUESTS: ReservationRequest[] = [
  {
    id: "req-001",
    facultyName: "Dr. Maria Santos",
    facultyCode: "FAC-011",
    room: "CS Lab 1",
    day: "Monday",
    slot: "1:30 PM – 3:30 PM",
    purpose: "Extra session for IT322 students before midterms. Students need additional practice with React state management concepts.",
    status: "approved",
    submittedAt: "2025-01-10 08:32",
    reviewNote: "Approved. Room is free during this time.",
  },
  {
    id: "req-002",
    facultyName: "Prof. Juan dela Cruz",
    facultyCode: "FAC-007",
    room: "Net Lab",
    day: "Wednesday",
    slot: "3:30 PM – 5:30 PM",
    purpose: "Network troubleshooting practicum for IT324. Students will work on packet analysis exercises using Wireshark.",
    status: "pending",
    submittedAt: "2025-01-12 14:05",
  },
  {
    id: "req-003",
    facultyName: "Prof. Ana Reyes",
    facultyCode: "FAC-003",
    room: "Multimedia Lab",
    day: "Friday",
    slot: "10:00 AM – 12:00 PM",
    purpose: "Video editing workshop for IT411 final project. Students will render their documentary outputs.",
    status: "pending",
    submittedAt: "2025-01-13 09:18",
  },
  {
    id: "req-004",
    facultyName: "Dr. Carlo Bautista",
    facultyCode: "FAC-015",
    room: "CS Lab 2",
    day: "Tuesday",
    slot: "8:00 AM – 10:00 AM",
    purpose: "Make-up lab session for IT321. Several students missed the previous session due to a university event.",
    status: "declined",
    submittedAt: "2025-01-09 16:45",
    reviewNote: "Room is reserved for department inventory check on this date.",
  },
  {
    id: "req-005",
    facultyName: "Prof. Juan dela Cruz",
    facultyCode: "FAC-007",
    room: "CS Lab 3",
    day: "Thursday",
    slot: "5:30 PM – 7:30 PM",
    purpose: "Overtime lab session for IT324 capstone project debugging.",
    status: "pending",
    submittedAt: "2025-01-14 11:00",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-warning/20 text-warning-foreground border-warning/40 border" },
  approved: { label: "Approved", className: "bg-success/15 text-success border-success/30 border" },
  declined: { label: "Declined", className: "bg-destructive/15 text-destructive border-destructive/30 border" },
};

const SUMMARY_STATS = (requests: ReservationRequest[]) => [
  { label: "Total requests",  value: requests.length,                                       color: "" },
  { label: "Pending",         value: requests.filter((r) => r.status === "pending").length,  color: "text-warning-foreground" },
  { label: "Approved",        value: requests.filter((r) => r.status === "approved").length, color: "text-success" },
  { label: "Declined",        value: requests.filter((r) => r.status === "declined").length, color: "text-destructive" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ReservationRequestsPage() {
  const [requests, setRequests] = useState<ReservationRequest[]>(MOCK_REQUESTS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Review dialog
  const [reviewTarget, setReviewTarget] = useState<ReservationRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "decline" | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const rooms = [...new Set(MOCK_REQUESTS.map((r) => r.room))];

  const filtered = requests.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchRoom   = filterRoom   === "all" || r.room === filterRoom;
    const matchSearch =
      !search ||
      r.facultyName.toLowerCase().includes(search.toLowerCase()) ||
      r.room.toLowerCase().includes(search.toLowerCase()) ||
      r.purpose.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchRoom && matchSearch;
  });

  function openReview(req: ReservationRequest, action: "approve" | "decline") {
    setReviewTarget(req);
    setReviewAction(action);
    setReviewNote("");
  }

  function submitReview() {
    if (!reviewTarget || !reviewAction) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reviewTarget.id
          ? { ...r, status: reviewAction === "approve" ? "approved" : "declined", reviewNote: reviewNote.trim() || undefined }
          : r
      )
    );
    setReviewTarget(null);
    setReviewAction(null);
    setReviewNote("");
  }

  const stats = SUMMARY_STATS(requests);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reservation requests</h1>
        <p className="text-sm text-muted-foreground">
          Review and action faculty requests to reserve laboratory rooms
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-xs"
            placeholder="Search faculty, room, or purpose…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="All rooms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rooms</SelectItem>
            {rooms.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Pending requests — highlighted section */}
      {filtered.some((r) => r.status === "pending") && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning-foreground" />
            Needs your action
          </h2>
          {filtered
            .filter((r) => r.status === "pending")
            .map((req) => (
              <RequestCard key={req.id} req={req} onReview={openReview} />
            ))}
        </div>
      )}

      {/* Reviewed requests */}
      {filtered.some((r) => r.status !== "pending") && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Previously reviewed</h2>
          {filtered
            .filter((r) => r.status !== "pending")
            .map((req) => (
              <RequestCard key={req.id} req={req} onReview={openReview} />
            ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
          <Search className="mb-2 size-7 opacity-30" />
          No requests match your filters.
        </div>
      )}

      {/* Review dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={() => { setReviewTarget(null); setReviewAction(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction === "approve"
                ? <><CheckCircle2 className="size-4 text-success" /> Approve reservation</>
                : <><XCircle className="size-4 text-destructive" /> Decline reservation</>}
            </DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4 py-1">
              <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faculty</span>
                  <span className="font-medium">{reviewTarget.facultyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{reviewTarget.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day & time</span>
                  <span className="font-medium">{reviewTarget.day}, {reviewTarget.slot}</span>
                </div>
                <div className="pt-1 border-t">
                  <p className="text-muted-foreground text-xs mb-1">Purpose</p>
                  <p className="text-xs">{reviewTarget.purpose}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reviewNote">
                  Note <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="reviewNote"
                  placeholder={reviewAction === "approve"
                    ? "e.g. Approved. Room is free during this time."
                    : "e.g. Room is being used for department inventory on this date."}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReviewTarget(null); setReviewAction(null); }}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              className={reviewAction === "approve"
                ? "bg-success text-white hover:bg-success/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
            >
              {reviewAction === "approve"
                ? <><CheckCircle2 className="size-3.5" /> Confirm approval</>
                : <><XCircle className="size-3.5" /> Confirm decline</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RequestCard sub-component
// ---------------------------------------------------------------------------

function RequestCard({
  req,
  onReview,
}: {
  req: ReservationRequest;
  onReview: (req: ReservationRequest, action: "approve" | "decline") => void;
}) {
  const cfg = STATUS_CONFIG[req.status];
  const isPending = req.status === "pending";

  return (
    <Card className={`shadow-card transition-colors ${isPending ? "border-warning/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: details */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cfg.className}>
                {req.status === "approved" && <CheckCircle2 className="size-3" />}
                {req.status === "declined" && <XCircle className="size-3" />}
                {req.status === "pending"  && <Clock className="size-3" />}
                {cfg.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{req.submittedAt}</span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <User className="size-3" />
                <span className="font-medium text-foreground">{req.facultyName}</span>
                <span className="text-muted-foreground">({req.facultyCode})</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <FlaskConical className="size-3" />
                {req.room}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="size-3" />
                {req.day}, {req.slot}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{req.purpose}</p>

            {req.reviewNote && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MessageSquare className="size-3 mt-0.5 shrink-0" />
                <span className="italic">{req.reviewNote}</span>
              </div>
            )}
          </div>

          {/* Right: actions — only for pending */}
          {isPending && (
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => onReview(req, "decline")}
              >
                <XCircle className="size-3.5" /> Decline
              </Button>
              <Button
                size="sm"
                className="h-8 bg-success text-white hover:bg-success/90"
                onClick={() => onReview(req, "approve")}
              >
                <CheckCircle2 className="size-3.5" /> Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}