# Separated Pages: Calendar vs Classes

## Overview
**Calendar** and **Classes** are now completely separate pages with distinct content and headings, accessible via the collapsible "My Schedule" sub-navigation in the sidebar.

## Page Structure

### 1. **Calendar Page** (`/schedule/calendar`)

**Heading:** "My Calendar"  
**Subtitle:** "Academic Year 2025–2026 · Week 10 of 18 · 18-Week Term"

**Content:**
- Weekly calendar grid (Mon-Fri)
- Time slot rows (8:00 AM - 9:30 PM)
- Room-based booking visualization
- QR verification indicators on calendar cells
- Session booking popovers with:
  - Session details tab
  - Make-up booking tab
  - Progress information
- Room filter dropdown
- Scope toggle (All Schedule / Department / My Schedule)
- Week navigation (Previous / Next / Today)
- Legend with subject colors and QR status

**Purpose:** Weekly time slot management and session bookings

---

### 2. **Classes Page** (`/schedule/classes`)

**Heading:** "Classes"  
**Subtitle:** "Course compliance tracking · Laboratory assignments"

**Content:**
- **Three compliance cards** in a grid (matching your screenshot):
  - Subject code (e.g., "IT321")
  - Subject name (e.g., "Systems Integration")
  - Status badge (At Risk / Compliant / Non-Compliant)
  - Progress bar with colors
  - Hours logged vs required (e.g., "36 / 54 hrs")
  - Remaining hours and percentage
  - Laboratory assignment (room + day)
  - Projected completion warning (if behind)

**Card Layout:**
```
┌─────────────────────────────┐
│ IT321        [At Risk]      │
│ Systems Integration         │
│                             │
│ Progress    36 / 54 hrs     │
│ ████████░░░░ 67%           │
│ 18h remaining · 69.7% comp  │
│                             │
│ 📍 CS Lab 2  📅 Tues       │
│                             │
│ ⚠️ Projected: Week 150      │
│    (Behind schedule)        │
└─────────────────────────────┘
```

- **Prescriptive Correction info box** at bottom
- **Make-up Session button** in header

**Purpose:** Quick overview of all classes with compliance status

---

## Navigation Flow

### Sidebar (Default - Collapsed):
```
📊 Dashboard
📅 My Schedule  [▶]  ← Click arrow to expand
🏠 Reserve a Room
📋 Session Logs
```

### Sidebar (Expanded):
```
📊 Dashboard
📅 My Schedule  [▼]
   ├─ 📆 Calendar   ← Weekly grid view
   └─ 📚 Classes    ← Compliance cards
🏠 Reserve a Room
📋 Session Logs
```

### User Flow:
1. Click **arrow** (▶) next to "My Schedule" to expand
2. See two options: **Calendar** and **Classes**
3. Click **Calendar** → See weekly calendar grid with heading "My Calendar"
4. Click **Classes** → See compliance cards with heading "Classes"
5. Click **arrow** (▼) again to collapse sub-items

---

## Key Differences

| Feature | Calendar Page | Classes Page |
|---------|--------------|--------------|
| **Heading** | "My Calendar" | "Classes" |
| **Content** | Weekly time slot grid | Compliance cards (3-column grid) |
| **Focus** | Session scheduling | Course compliance tracking |
| **View** | Calendar grid with days/times | Card-based list view |
| **Interactions** | Click cells to book/view sessions | View status badges and progress |
| **QR Status** | On calendar cells (✓/QR icons) | Not prominently shown |
| **Laboratory Info** | In session popover | On each card (room + day) |
| **Room Filter** | Yes (dropdown) | No |
| **Week Navigation** | Yes (prev/next/today) | No |
| **Progress Bars** | In session popover | On each card |
| **Make-up Button** | In popover | In page header |

---

## Visual Layouts

### **Calendar Page:**
```
┌────────────────────────────────────────────────┐
│  My Calendar                 [Make-up Session] │
│  Academic Year 2025-2026 · Week 10 of 18       │
├────────────────────────────────────────────────┤
│  [<] Oct 27 - Oct 31 [>] [Today] [Filters]    │
├────────────────────────────────────────────────┤
│  TIME  │ MON  │ TUE  │ WED  │ THU  │ FRI     │
│  8:00  │      │ IT321│      │      │         │
│  10:00 │      │   ✓  │ CS401│      │ IT411   │
│  1:30  │ CS301│      │   QR │ IT321│         │
│  ...   │  ... │  ... │  ... │  ... │  ...    │
└────────────────────────────────────────────────┘
```

### **Classes Page:**
```
┌────────────────────────────────────────────────┐
│  Classes                     [Make-up Session] │
│  Course compliance tracking · Lab assignments  │
├────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │  IT321    │ │  CS401    │ │  IT411    │   │
│  │ At Risk   │ │ At Risk   │ │Non-Compli │   │
│  │ Progress  │ │ Progress  │ │ Progress  │   │
│  │ 36/54 hrs │ │ 20/27 hrs │ │ 12/54 hrs │   │
│  │ █████░░░  │ │ ██████░░  │ │ ██░░░░░░  │   │
│  │ CS Lab 2  │ │ IT Lab 3  │ │ CS Lab 2  │   │
│  │ Tues      │ │ Weds      │ │ Thurs     │   │
│  └───────────┘ └───────────┘ └───────────┘   │
├────────────────────────────────────────────────┤
│  ℹ️ Prescriptive Correction System             │
│  The system automatically monitors...          │
└────────────────────────────────────────────────┘
```

---

## Routes

- **Calendar:** `/schedule/calendar`
- **Classes:** `/schedule/classes`
- **Default:** `/schedule` → redirects to `/schedule/calendar`

---

## Files Modified

1. **`_app.schedule.classes.tsx`** - Simple 3-column compliance cards
2. **`_app.schedule.calendar.tsx`** - Changed heading to "My Calendar"
3. **`AppShell.tsx`** - Changed default expanded state to collapsed

---

## Status

✅ **Complete**
- Calendar and Classes are fully separate pages
- Each has distinct heading and content
- Collapsible navigation with arrow (defaults to closed)
- Clean, focused views for different purposes

**Calendar:** Weekly session management  
**Classes:** Compliance tracking overview
