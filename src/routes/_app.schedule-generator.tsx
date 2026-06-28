import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROOMS, ROOM_OCCUPANCY } from "@/lib/mock-data";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Upload,
  Download,
  FileSpreadsheet,
  FolderOpen,
  X,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/_app/schedule-generator")({
  component: ScheduleGeneratorPage,
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * All lab time slots: 2-hour blocks from 8:00 AM to 9:30 PM.
 * Note: 12:00–1:30 PM is reserved as a lunch break and is intentionally skipped.
 */
const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "1:30 PM – 3:30 PM",
  "3:30 PM – 5:30 PM",
  "5:30 PM – 7:30 PM",
  "7:30 PM – 9:30 PM",
];

/**
 * Sessions per week is always fixed at 2.
 * Each session is 2 hours → 4 hours generated per week.
 */
const SESSIONS_PER_WEEK = 2;
const HOURS_PER_SESSION = 2;
const HOURS_PER_WEEK = SESSIONS_PER_WEEK * HOURS_PER_SESSION; // 4

/**
 * Compliance minimums per duration.
 * 9-week term  → must accumulate ≥ 27 h
 * 18-week sem  → must accumulate ≥ 54 h
 */
const COMPLIANCE_THRESHOLD: Record<number, number> = {
  9: 27,
  18: 54,
};

// Each combo is [displayLabel, day1Key, day2Key] where day keys match ROOM_OCCUPANCY keys
const DAY_COMBOS: [string, string, string][] = [
  ["Tue & Thu",  "Tuesday",   "Thursday"],
  ["Mon & Wed",  "Monday",    "Wednesday"],
  ["Wed & Fri",  "Wednesday", "Friday"],
  ["Tue & Fri",  "Tuesday",   "Friday"],
  ["Mon & Thu",  "Monday",    "Thursday"],
];

const TEMPLATE_ROWS = [
  ["IT321", "Systems Integration", 9, "1:30 PM – 3:30 PM", "CS Lab 2"],
  ["IT322", "Web Development", 18, "10:00 AM – 12:00 PM", "CS Lab 1"],
  ["IT323", "Database Management", 9, "3:30 PM – 5:30 PM", "Net Lab"],
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ImportedSubject {
  id: number;
  code: string;
  subject: string;
  duration: number; // weeks: 9 or 18
  slot: string;
  room: string;
}

interface GeneratedResult extends ImportedSubject {
  totalHours: number;
  complianceThreshold: number;
  assignedDays: string;
  feasibility: "Compliant" | "Non-Compliant";
  conflict: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the conflict message if a room+slot+day triple is already taken, otherwise null.
 */
function getRoomConflict(room: string, slotIdx: number, day: string, courseCode: string): string | null {
  const occupant = ROOM_OCCUPANCY[room]?.[day]?.[slotIdx];
  if (occupant && occupant !== courseCode) {
    return `${room} is occupied on ${day} at ${TIME_SLOTS[slotIdx]} by ${occupant}`;
  }
  return null;
}

function computeResult(row: ImportedSubject): GeneratedResult {
  const totalHours = row.duration * HOURS_PER_WEEK;
  const threshold = COMPLIANCE_THRESHOLD[row.duration] ?? (row.duration * 3);
  const feasibility: GeneratedResult["feasibility"] =
    totalHours >= threshold ? "Compliant" : "Non-Compliant";

  const slotIdx = TIME_SLOTS.indexOf(row.slot);

  // Try each day combo in order; use the first one where BOTH days are conflict-free.
  // If every combo has a conflict on at least one day, fall back to the first and report it.
  let assignedDays = DAY_COMBOS[0][0];
  let conflict: string | null = null;
  let foundClean = false;

  for (const [label, day1, day2] of DAY_COMBOS) {
    const c1 = getRoomConflict(row.room, slotIdx, day1, row.code);
    const c2 = getRoomConflict(row.room, slotIdx, day2, row.code);
    if (!c1 && !c2) {
      assignedDays = label;
      conflict = null;
      foundClean = true;
      break;
    }
  }

  if (!foundClean) {
    // No clean combo exists — assign first combo and surface the conflicts
    const [label, day1, day2] = DAY_COMBOS[0];
    assignedDays = label;
    const c1 = getRoomConflict(row.room, slotIdx, day1, row.code);
    const c2 = getRoomConflict(row.room, slotIdx, day2, row.code);
    conflict = [c1, c2].filter(Boolean).join("; ") || null;
  }

  return { ...row, totalHours, complianceThreshold: threshold, assignedDays, feasibility, conflict };
}

function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Course Code", "Subject Name", "Duration (weeks)", "Time Slot", "Room"],
    ...TEMPLATE_ROWS,
  ]);
  ws["!cols"] = [14, 26, 18, 24, 16].map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Subjects");
  XLSX.writeFile(wb, "labtrack_subjects_template.xlsx");
}

function exportResults(results: GeneratedResult[]) {
  const ws = XLSX.utils.aoa_to_sheet([
    [
      "Course Code",
      "Subject Name",
      "Duration (weeks)",
      "Sessions/Week",
      "Hrs/Week",
      "Total Hours",
      "Compliance Min (hrs)",
      "Assigned Days",
      "Time Slot",
      "Room",
      "Status",
      "Notes",
    ],
    ...results.map((r) => [
      r.code,
      r.subject,
      `${r.duration} wks`,
      SESSIONS_PER_WEEK,
      `${HOURS_PER_WEEK}h`,
      `${r.totalHours}h`,
      `${r.complianceThreshold}h`,
      r.assignedDays,
      r.slot,
      r.room,
      r.feasibility,
      r.conflict ?? "No issues",
    ]),
  ]);
  ws["!cols"] = [14, 26, 16, 14, 10, 12, 20, 14, 24, 16, 14, 32].map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Generated Schedules");
  XLSX.writeFile(wb, "labtrack_generated_schedules.xlsx");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FeasibilityBadge({ value }: { value: GeneratedResult["feasibility"] }) {
  if (value === "Compliant")
    return (
      <Badge className="bg-success/15 text-success border-success/30 border">
        <CheckCircle2 className="size-3.5" /> Compliant
      </Badge>
    );
  return (
    <Badge className="bg-destructive/15 text-destructive border-destructive/30 border">
      <XCircle className="size-3.5" /> Non-Compliant
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Import Tab
// ---------------------------------------------------------------------------

function ImportTab() {
  const [dragOver, setDragOver] = useState(false);
  const [importedRows, setImportedRows] = useState<ImportedSubject[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target?.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1 });
      const rows: ImportedSubject[] = (data as (string | number)[][])
        .slice(1)
        .filter((r) => r[0])
        .map((r, i) => ({
          id: i,
          code: String(r[0] ?? ""),
          subject: String(r[1] ?? ""),
          duration: Number(r[2]) || 18,
          slot: String(r[3] ?? TIME_SLOTS[0]),
          room: String(r[4] ?? ROOMS[0]),
        }));
      setImportedRows(rows);
      setSelected(new Set(rows.map((r) => r.id)));
      setResults([]);
      setFileName(`${file.name} · ${rows.length} subjects`);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".xlsx")) parseFile(file);
    },
    [parseFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const clearFile = () => {
    setImportedRows([]);
    setSelected(new Set());
    setResults([]);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(importedRows.map((r) => r.id)) : new Set());
  };

  const generateAll = () => {
    const toProcess = importedRows.filter((r) => selected.has(r.id));
    setResults(toProcess.map(computeResult));
  };

  const allChecked = importedRows.length > 0 && selected.size === importedRows.length;
  const compliantCount = results.filter((r) => r.feasibility === "Compliant").length;
  const conflictCount = results.filter((r) => r.conflict).length;

  return (
    <div className="space-y-6">
      {/* Drop zone / file info */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="size-4 text-accent" />
              Import from Excel
            </CardTitle>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="size-3.5" /> Download template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!fileName ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                dragOver ? "border-accent bg-accent/5" : "border-border"
              }`}
            >
              <Upload className={`size-8 ${dragOver ? "text-accent" : "text-muted-foreground/40"}`} />
              <p className="text-sm text-muted-foreground">Drag and drop your Excel file here</p>
              <p className="text-xs text-muted-foreground/60">
                Columns: Course Code, Subject Name, Duration (weeks), Time Slot, Room
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                <FolderOpen className="size-3.5" /> Browse file
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              <FileSpreadsheet className="size-4 text-accent" />
              <span>{fileName}</span>
              <Button variant="ghost" size="sm" className="ml-auto h-6 px-2" onClick={clearFile}>
                <X className="size-3.5" /> Clear
              </Button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />

          {/* Schedule rules info banner */}
          <div className="mt-4 rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Schedule rules</p>
            <p>• Sessions per week: <span className="font-medium text-foreground">2 sessions × 2 h = 4 h/week</span> (fixed)</p>
            <p>• Term (9 weeks): minimum <span className="font-medium text-foreground">27 h</span> total → generates 36 h ✓</p>
            <p>• Semester (18 weeks): minimum <span className="font-medium text-foreground">54 h</span> total → generates 72 h ✓</p>
            <p>• Time slots run 8:00 AM – 9:30 PM in 2-hour blocks (12:00–1:30 PM lunch break excluded)</p>
          </div>
        </CardContent>
      </Card>

      {/* Preview table */}
      {importedRows.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Imported subjects
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {selected.size} of {importedRows.length} selected
                </span>
              </CardTitle>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={generateAll}
                disabled={selected.size === 0}
              >
                <Sparkles className="size-3.5" /> Generate schedules
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr className="text-left">
                    <th className="px-3 py-2">
                      <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                    </th>
                    <th className="px-3 py-2">Course code</th>
                    <th className="px-3 py-2">Subject name</th>
                    <th className="px-3 py-2">Duration</th>
                    <th className="px-3 py-2">Time slot</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importedRows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">
                        <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleRow(r.id)} />
                      </td>
                      <td className="px-3 py-2 font-mono font-medium text-accent">{r.code}</td>
                      <td className="px-3 py-2">{r.subject}</td>
                      <td className="px-3 py-2">{r.duration} wks</td>
                      <td className="px-3 py-2">{r.slot}</td>
                      <td className="px-3 py-2">{r.room}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="gap-1 text-muted-foreground">
                          <Clock className="size-3" /> Pending
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

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Summary metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Subjects scheduled", value: results.length, sub: "selected for generation", color: "" },
              { label: "Compliant", value: compliantCount, sub: "meets hour requirement", color: "text-success" },
              {
                label: "Room conflicts",
                value: conflictCount,
                sub: conflictCount > 0 ? "review required" : "all clear",
                color: conflictCount > 0 ? "text-destructive" : "text-success",
              },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className={`text-2xl font-semibold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </div>
            ))}
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated schedules</CardTitle>
                <Button variant="outline" size="sm" onClick={() => exportResults(results)}>
                  <Download className="size-3.5" /> Export results
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/60">
                    <tr className="text-left">
                      <th className="px-3 py-2">Course code</th>
                      <th className="px-3 py-2">Subject name</th>
                      <th className="px-3 py-2">Duration</th>
                      <th className="px-3 py-2">Sessions/wk</th>
                      <th className="px-3 py-2">Hrs/wk</th>
                      <th className="px-3 py-2">Total hrs</th>
                      <th className="px-3 py-2">Min. required</th>
                      <th className="px-3 py-2">Assigned days</th>
                      <th className="px-3 py-2">Time slot</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr
                        key={r.id}
                        className={`border-t ${r.conflict ? "bg-destructive/5" : ""}`}
                      >
                        <td className="px-3 py-2 font-mono font-medium text-accent">{r.code}</td>
                        <td className="px-3 py-2">{r.subject}</td>
                        <td className="px-3 py-2">{r.duration} wks</td>
                        <td className="px-3 py-2">{SESSIONS_PER_WEEK}×/wk</td>
                        <td className="px-3 py-2">{HOURS_PER_WEEK}h</td>
                        <td className="px-3 py-2 font-medium">{r.totalHours}h</td>
                        <td className="px-3 py-2 text-muted-foreground">≥ {r.complianceThreshold}h</td>
                        <td className="px-3 py-2">{r.assignedDays}</td>
                        <td className="px-3 py-2">{r.slot}</td>
                        <td className="px-3 py-2">{r.room}</td>
                        <td className="px-3 py-2">
                          <FeasibilityBadge value={r.feasibility} />
                        </td>
                        <td className={`px-3 py-2 ${r.conflict ? "text-destructive" : "text-muted-foreground"}`}>
                          {r.conflict ?? "No issues"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manual Tab
// ---------------------------------------------------------------------------

function ManualTab() {
  const [form, setForm] = useState({
    subject: "Systems Integration",
    code: "IT321",
    duration: "18",
    slot: TIME_SLOTS[0],
    room: "CS Lab 2",
  });

  const [result, setResult] = useState<null | {
    weeks: number;
    totalHours: number;
    complianceThreshold: number;
    feasibility: "Compliant" | "Non-Compliant";
    conflict: string | null;
    resolvedDays: string;
  }>(null);

  function generate() {
    const weeks = Number(form.duration);
    const totalHours = weeks * HOURS_PER_WEEK;
    const complianceThreshold = COMPLIANCE_THRESHOLD[weeks] ?? weeks * 3;
    const feasibility: "Compliant" | "Non-Compliant" =
      totalHours >= complianceThreshold ? "Compliant" : "Non-Compliant";

    const slotIdx = TIME_SLOTS.indexOf(form.slot);
    // Find first day combo with no conflicts; surface conflicts only if all combos are taken
    let resolvedDays = DAY_COMBOS[0][0];
    let conflict: string | null = null;
    let foundClean = false;
    for (const [label, day1, day2] of DAY_COMBOS) {
      const c1 = getRoomConflict(form.room, slotIdx, day1, form.code);
      const c2 = getRoomConflict(form.room, slotIdx, day2, form.code);
      if (!c1 && !c2) { resolvedDays = label; conflict = null; foundClean = true; break; }
    }
    if (!foundClean) {
      const [label, day1, day2] = DAY_COMBOS[0];
      resolvedDays = label;
      const c1 = getRoomConflict(form.room, slotIdx, day1, form.code);
      const c2 = getRoomConflict(form.room, slotIdx, day2, form.code);
      conflict = [c1, c2].filter(Boolean).join("; ") || null;
    }

    setResult({ weeks, totalHours, complianceThreshold, feasibility, conflict, resolvedDays });
  }

  const weeklyRows = useMemo(() => {
    if (!result) return [];
    let cumulative = 0;
    return Array.from({ length: result.weeks }, (_, i) => {
      cumulative = Math.min((i + 1) * HOURS_PER_WEEK, result.totalHours);
      return {
        week: i + 1,
        days: result.resolvedDays,
        room: form.room,
        slot: form.slot,
        cumulative,
      };
    });
  }, [result, form.room, form.slot]);

  const threshold = COMPLIANCE_THRESHOLD[Number(form.duration)] ?? Number(form.duration) * 3;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Course details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Course code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Subject name</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Course duration</Label>
            <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="9">Term (9 weeks) — min. 27 h</SelectItem>
                <SelectItem value="18">Semester (18 weeks) — min. 54 h</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fixed schedule rules */}
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Fixed schedule parameters</p>
            <p>Sessions per week: <span className="font-medium text-foreground">2</span></p>
            <p>Hours per session: <span className="font-medium text-foreground">2 h</span></p>
            <p>Hours per week: <span className="font-medium text-foreground">{HOURS_PER_WEEK} h</span></p>
            <p>
              Total generated:{" "}
              <span className="font-medium text-foreground">
                {Number(form.duration) * HOURS_PER_WEEK} h
              </span>{" "}
              (min. required: {threshold} h)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Time slot</Label>
              <Select value={form.slot} onValueChange={(v) => setForm({ ...form, slot: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Laboratory room</Label>
              <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={generate} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Sparkles className="size-4" /> Generate schedule
            </Button>
            <Button variant="outline" onClick={() => setResult(null)}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Generated schedule</CardTitle>
            {result && (
              <Badge
                className={
                  result.feasibility === "Compliant"
                    ? "bg-success/15 text-success border-success/30 border"
                    : "bg-destructive/15 text-destructive border-destructive/30 border"
                }
              >
                {result.feasibility === "Compliant"
                  ? <CheckCircle2 className="size-3.5" />
                  : <XCircle className="size-3.5" />}
                {result.feasibility}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
              <Sparkles className="mb-2 size-8 opacity-40" />
              Fill the form and click Generate schedule to preview the weekly plan.
            </div>
          ) : (
            <div className="space-y-4">
              {result.conflict && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{result.conflict}</span>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground font-mono">
                {result.weeks} wks × {SESSIONS_PER_WEEK} sessions × {HOURS_PER_SESSION} h =
                <span className="ml-1 font-semibold text-foreground">{result.totalHours} h total</span>
                <span className="ml-2 text-muted-foreground">(min. required: {result.complianceThreshold} h)</span>
              </div>

              <div className="max-h-80 overflow-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/60">
                    <tr className="text-left">
                      <th className="px-3 py-2">Week</th>
                      <th className="px-3 py-2">Assigned days</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Time slot</th>
                      <th className="px-3 py-2 text-right">Cum. hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyRows.map((r) => (
                      <tr key={r.week} className="border-t">
                        <td className="px-3 py-2 font-medium">W{r.week}</td>
                        <td className="px-3 py-2">{r.days}</td>
                        <td className="px-3 py-2">{r.room}</td>
                        <td className="px-3 py-2">{r.slot}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{r.cumulative}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Save schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ScheduleGeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate laboratory schedules manually or by importing a subject list from Excel
        </p>
      </div>

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">
            <FileSpreadsheet className="size-3.5" /> Import from Excel
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Sparkles className="size-3.5" /> Manual entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6">
          <ImportTab />
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <ManualTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
