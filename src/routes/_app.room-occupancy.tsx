import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROOMS, DAYS, TIME_SLOTS, ROOM_OCCUPANCY } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/room-occupancy")({
  component: RoomOccupancyPage,
});

function RoomOccupancyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Room Occupancy Grid</h1>
        <p className="text-sm text-muted-foreground">Live view of laboratory room utilization by day &amp; time slot</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="overflow-x-auto p-4">
          <table className="w-full min-w-[960px] border-separate border-spacing-1 text-[11px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card p-2 text-left text-xs uppercase tracking-wide text-muted-foreground">Room</th>
                {DAYS.map((d) => (
                  <th key={d} colSpan={TIME_SLOTS.length} className="bg-muted/40 p-2 text-center text-xs font-semibold">{d}</th>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 z-10 bg-card"></th>
                {DAYS.flatMap((d) =>
                  TIME_SLOTS.map((s) => (
                    <th key={d + s} className="p-1 text-[9px] font-normal text-muted-foreground">
                      {s.split("–")[0]}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((room) => (
                <tr key={room}>
                  <td className="sticky left-0 z-10 bg-card p-2 text-xs font-medium">{room}</td>
                  {DAYS.flatMap((d) =>
                    (ROOM_OCCUPANCY[room]?.[d] ?? []).map((cell, i) => (
                      <td key={room + d + i} className="p-0">
                        {cell ? (
                          <div className="rounded-md bg-accent px-1.5 py-2 text-center font-semibold text-accent-foreground">
                            {cell}
                          </div>
                        ) : (
                          <div className="rounded-md bg-muted px-1.5 py-2 text-center text-muted-foreground">—</div>
                        )}
                      </td>
                    )),
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-accent" /> Occupied</div>
            <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-muted" /> Available</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
