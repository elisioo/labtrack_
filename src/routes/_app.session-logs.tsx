import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SESSION_LOGS, ROOMS } from "@/lib/mock-data";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/session-logs")({
  component: SessionLogsPage,
});

function SessionLogsPage() {
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = SESSION_LOGS.filter((l) => {
    const q = query.toLowerCase();
    return (
      (room === "all" || l.room === room) &&
      (status === "all" || l.ack === status) &&
      (`${l.faculty} ${l.code}`.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Session Logs</h1>
        <p className="text-sm text-muted-foreground">Verified laboratory sessions with QR acknowledgement</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All Sessions</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search faculty / course…" className="pl-9" />
            </div>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Room" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="QR Verified">QR Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Faculty</th>
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Room</th>
                <th className="py-3 pr-4">Time Slot</th>
                <th className="py-3 pr-4">Duration</th>
                <th className="py-3 pr-4">Ack.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 tabular-nums text-muted-foreground">{l.id}</td>
                  <td className="py-3 pr-4">{l.date}</td>
                  <td className="py-3 pr-4 font-medium">{l.faculty}</td>
                  <td className="py-3 pr-4">{l.code}</td>
                  <td className="py-3 pr-4">{l.room}</td>
                  <td className="py-3 pr-4">{l.timeSlot}</td>
                  <td className="py-3 pr-4">{l.duration}</td>
                  <td className="py-3 pr-4">
                    {l.ack === "QR Verified" ? (
                      <Badge className="bg-success/15 text-success border-success/30 border">
                        <CheckCircle2 className="size-3" /> QR Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-warning/20 text-warning-foreground border-warning/40 border">
                        <Clock className="size-3" /> Pending
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {SESSION_LOGS.length} sessions</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-8"><ChevronLeft className="size-3.5" /></Button>
              <Button variant="outline" size="sm" className="h-8">1</Button>
              <Button variant="ghost" size="sm" className="h-8">2</Button>
              <Button variant="ghost" size="sm" className="h-8">3</Button>
              <Button variant="outline" size="icon" className="size-8"><ChevronRight className="size-3.5" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
