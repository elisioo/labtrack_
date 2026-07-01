export const TIME_SLOTS = [
  "8:00–10:00 AM",
  "10:00 AM–12:00 NN",
  "1:30–3:30 PM",
  "3:30–5:30 PM",
  "5:30–7:30 PM",
  "7:30–9:30 PM",
];

export const ROOMS = ["CS Lab 1", "CS Lab 2", "IT Lab 3", "IT Lab 4"];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export type Status = "Compliant" | "At Risk" | "Non-Compliant";

export function statusFromProgress(progress: number): Status {
  if (progress >= 80) return "Compliant";
  if (progress >= 50) return "At Risk";
  return "Non-Compliant";
}

export const FACULTY_SUBJECTS = [
  {
    code: "IT321",
    name: "Systems Integration",
    required: 54, // 18-week term
    logged: 36,
    room: "CS Lab 2",
    day: "Tue",
    timeSlot: "1:30–3:30 PM",
    termDuration: 18,
  },
  {
    code: "CS401",
    name: "Capstone Project",
    required: 27, // 9-week term
    logged: 20,
    room: "IT Lab 3",
    day: "Wed",
    timeSlot: "10:00 AM–12:00 NN",
    termDuration: 9,
  },
  {
    code: "IT411",
    name: "Network Security",
    required: 54, // 18-week term
    logged: 12,
    room: "CS Lab 2",
    day: "Thu",
    timeSlot: "1:30–3:30 PM",
    termDuration: 18,
  },
];

export const FACULTY_WEEKLY_SCHEDULE = [
  { day: "Mon", timeSlot: "8:00–10:00 AM", room: "—", subject: "Lecture", isLab: false },
  { day: "Tue", timeSlot: "1:30–3:30 PM", room: "CS Lab 2", subject: "IT321 — Systems Integration", isLab: true },
  { day: "Wed", timeSlot: "10:00 AM–12:00 NN", room: "IT Lab 3", subject: "CS401 — Capstone Project", isLab: true },
  { day: "Thu", timeSlot: "1:30–3:30 PM", room: "CS Lab 2", subject: "IT411 — Network Security", isLab: true },
  { day: "Fri", timeSlot: "10:00 AM–12:00 NN", room: "—", subject: "Lecture", isLab: false },
];

export const FACULTY_COMPLIANCE = [
  { id: 1, name: "Juan Dela Cruz", code: "IT321", required: 54, logged: 44, projected: "Week 17", status: "Compliant" as Status },
  { id: 2, name: "Maria Santos", code: "CS401", required: 36, logged: 18, projected: "Week 22", status: "At Risk" as Status },
  { id: 3, name: "Jose Reyes", code: "IT411", required: 54, logged: 12, projected: "Week 30+", status: "Non-Compliant" as Status },
  { id: 4, name: "Ana Lim", code: "CS301", required: 36, logged: 30, projected: "Week 16", status: "Compliant" as Status },
  { id: 5, name: "Carlos Gomez", code: "IT221", required: 54, logged: 27, projected: "Week 20", status: "At Risk" as Status },
];

export const NOTIFICATIONS = [
  { id: 1, type: "danger", title: "IT411 is At Risk", body: "You are 4 hours behind schedule.", time: "2h ago" },
  { id: 2, type: "success", title: "CS401 session acknowledged", body: "Week 9 session verified via QR.", time: "1d ago" },
  { id: 3, type: "info", title: "Reminder: IT411 lab tomorrow", body: "CS Lab 2 • 1:30 PM", time: "1d ago" },
  { id: 4, type: "warning", title: "Schedule conflict resolved", body: "Custodian moved IT221 to CS Lab 1.", time: "3d ago" },
];

// Room occupancy: room -> day -> slot index -> subject code (or null)
export const ROOM_OCCUPANCY: Record<string, Record<string, (string | null)[]>> = {
  "CS Lab 1": {
    Mon: ["IT221", null, "CS301", null, null, null],
    Tue: [null, "IT221", null, "CS301", null, null],
    Wed: ["CS301", null, null, "IT221", null, null],
    Thu: [null, null, "CS301", null, "IT221", null],
    Fri: ["IT221", null, null, null, null, null],
  },
  "CS Lab 2": {
    Mon: [null, "IT321", null, null, "CS401", null],
    Tue: [null, null, "IT321", "IT321", null, null],
    Wed: ["IT411", null, null, "IT321", null, null],
    Thu: [null, "IT411", "IT411", null, null, null],
    Fri: [null, null, "IT321", null, "CS401", null],
  },
  "IT Lab 3": {
    Mon: [null, null, "CS401", null, null, null],
    Tue: ["CS401", null, null, null, "IT221", null],
    Wed: [null, "CS401", null, "CS301", null, null],
    Thu: [null, null, null, "CS401", null, null],
    Fri: ["CS301", null, "CS401", null, null, null],
  },
  "IT Lab 4": {
    Mon: [null, null, null, null, null, "IT411"],
    Tue: [null, "IT221", null, null, null, null],
    Wed: [null, null, "IT411", null, null, null],
    Thu: ["IT411", null, null, null, "IT221", null],
    Fri: [null, "IT411", null, null, null, null],
  },
};

export const SESSION_LOGS = [
  { id: 1, date: "Oct 28, 2025", faculty: "Juan Dela Cruz", code: "IT321", room: "CS Lab 2", timeSlot: "1:30–3:30 PM", duration: "2h", ack: "QR Verified" },
  { id: 2, date: "Oct 28, 2025", faculty: "Maria Santos", code: "CS401", room: "IT Lab 3", timeSlot: "10:00 AM–12:00 NN", duration: "2h", ack: "QR Verified" },
  { id: 3, date: "Oct 28, 2025", faculty: "Jose Reyes", code: "IT411", room: "CS Lab 2", timeSlot: "1:30–3:30 PM", duration: "2h", ack: "Pending" },
  { id: 4, date: "Oct 27, 2025", faculty: "Ana Lim", code: "CS301", room: "CS Lab 1", timeSlot: "8:00–10:00 AM", duration: "2h", ack: "QR Verified" },
  { id: 5, date: "Oct 27, 2025", faculty: "Carlos Gomez", code: "IT221", room: "IT Lab 4", timeSlot: "3:30–5:30 PM", duration: "2h", ack: "QR Verified" },
  { id: 6, date: "Oct 26, 2025", faculty: "Juan Dela Cruz", code: "IT321", room: "CS Lab 2", timeSlot: "1:30–3:30 PM", duration: "2h", ack: "QR Verified" },
  { id: 7, date: "Oct 26, 2025", faculty: "Maria Santos", code: "CS401", room: "IT Lab 3", timeSlot: "10:00 AM–12:00 NN", duration: "2h", ack: "Pending" },
  { id: 8, date: "Oct 25, 2025", faculty: "Ana Lim", code: "CS301", room: "CS Lab 1", timeSlot: "8:00–10:00 AM", duration: "2h", ack: "QR Verified" },
  { id: 9, date: "Oct 25, 2025", faculty: "Jose Reyes", code: "IT411", room: "CS Lab 2", timeSlot: "1:30–3:30 PM", duration: "2h", ack: "QR Verified" },
  { id: 10, date: "Oct 24, 2025", faculty: "Carlos Gomez", code: "IT221", room: "IT Lab 4", timeSlot: "3:30–5:30 PM", duration: "2h", ack: "Pending" },
];

export const ROOM_UTILIZATION_BY_SLOT = TIME_SLOTS.map((slot, i) => ({
  slot: slot.split("–")[0],
  "CS Lab 1": [62, 70, 85, 55, 30, 15][i],
  "CS Lab 2": [70, 78, 92, 80, 45, 20][i],
  "IT Lab 3": [55, 65, 78, 60, 35, 18][i],
  "IT Lab 4": [50, 60, 72, 58, 30, 12][i],
}));

export const WEEKLY_TREND = Array.from({ length: 18 }, (_, i) => ({
  week: `W${i + 1}`,
  IT321: Math.min(54, Math.round(((i + 1) / 18) * 54 * 0.95)),
  CS401: Math.min(36, Math.round(((i + 1) / 18) * 36 * 1.0)),
  IT411: Math.min(54, Math.round(((i + 1) / 18) * 54 * 0.45)),
}));

export const HEATMAP = DAYS.map((day) => ({
  day,
  values: TIME_SLOTS.map(() => Math.round(20 + Math.random() * 80)),
}));

export const COMPLIANCE_DISTRIBUTION = [
  { name: "Compliant", value: 7, color: "var(--success)" },
  { name: "At Risk", value: 3, color: "var(--warning)" },
  { name: "Non-Compliant", value: 2, color: "var(--destructive)" },
];

export const END_OF_TERM = [
  { faculty: "Juan Dela Cruz", code: "IT321", room: "CS Lab 2", required: 54, logged: 52, status: "Compliant" as Status },
  { faculty: "Maria Santos", code: "CS401", room: "IT Lab 3", required: 36, logged: 22, status: "At Risk" as Status },
  { faculty: "Jose Reyes", code: "IT411", room: "CS Lab 2", required: 54, logged: 14, status: "Non-Compliant" as Status },
  { faculty: "Ana Lim", code: "CS301", room: "CS Lab 1", required: 36, logged: 36, status: "Compliant" as Status },
  { faculty: "Carlos Gomez", code: "IT221", room: "IT Lab 4", required: 54, logged: 33, status: "At Risk" as Status },
  { faculty: "Liza Tan", code: "IT321", room: "CS Lab 2", required: 54, logged: 50, status: "Compliant" as Status },
];
