# Classes Page Layout Update

## Overview
The **Classes** page (`/schedule/classes`) now displays each faculty class as a separate, comprehensive card showing:
- Assigned laboratory room and schedule
- Compliance progress with CHED requirements
- Mini calendar with recent session history
- QR verification status
- Projected completion forecasting

## Page Structure

### Header Section
- **Page Title**: "My Classes"
- **Subtitle**: "Course compliance tracking · CHED-mandated laboratory hours"
- **Summary Cards** (3 columns):
  1. **Total Required** - Sum of all required hours across subjects
  2. **Hours Logged** - Total hours completed with percentage
  3. **Remaining** - Hours left with weeks remaining context

### Individual Class Cards

Each class is displayed as a **two-column card**:

#### **Left Column: Class Information & Progress**

**1. Header**
- Subject code (e.g., "IT321") with status badge
- Subject name (e.g., "Systems Integration")
- Status badge: Compliant (green), At Risk (amber), Non-Compliant (red)

**2. Laboratory Assignment Card** (Featured)
- Laboratory icon (📍 MapPin icon in teal circle)
- "Assigned Laboratory" label
- **Room name** in large font (e.g., "CS Lab 2")
- Schedule details:
  - Day of week (e.g., "Every Tue")
  - Time slot (e.g., "1:30–3:30 PM")
  - Duration (e.g., "2 hours/session")

**3. Compliance Progress Bar**
- Current vs. required hours (e.g., "36 / 54 hrs")
- Color-coded progress bar (green/amber/red)
- Percentage complete
- Remaining hours with weekly requirement calculation

**4. CHED Requirements Box** (Blue highlight)
- Required hours (large number)
- Term duration context (18-week or 9-week)

**5. Projected Completion**
- Trending icon with forecast
- Status message:
  - ✓ "On track to complete Xh by Week 18" (green)
  - "At current pace: Xh by Week 18 (Xh short)" (amber)
  - "Behind schedule · Projected completion: Week X" (red)

#### **Right Column: Calendar & Actions (280px width)**

**1. Mini Calendar Card**
- Shows 4 weeks of the monthly calendar
- Color-coded session indicators:
  - **Green** = QR Verified session
  - **Amber** = Pending QR acknowledgement
- Legend at bottom
- Highlights scheduled day of week

**2. Status Alert Box**
- **Compliant** (Green):
  - CheckCircle icon
  - "On Track" message
- **At Risk** (Amber):
  - Warning triangle icon
  - Required hours per week to catch up
- **Non-Compliant** (Red):
  - Warning triangle icon
  - "Make-up sessions required" message

**3. Latest Session Card**
- Date and time of most recent session
- QR verification badge:
  - "Verified" (green checkmark)
  - "Pending" (QR icon)

**4. Make-up Session Button** (Conditional)
- Only shows for "At Risk" or "Non-Compliant" subjects
- Teal button: "Schedule Make-up Session"

## Visual Design

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Summary Cards (Total Required | Hours Logged | Remaining) │
└─────────────────────────────────────────────────────────┘

┌────────────────────────────┬──────────────────────────┐
│  IT321 [At Risk]          │  📅 Mini Calendar        │
│  Systems Integration       │  ┌──┬──┬──┬──┬──┐      │
│                            │  │Mo│Tu│We│Th│Fr│      │
│  ┌──────────────────────┐ │  ├──┼──┼──┼──┼──┤      │
│  │ 📍 CS Lab 2          │ │  │20│21│22│23│24│      │
│  │ Every Tue            │ │  │25│26│27│28│29│      │
│  │ 1:30-3:30 PM · 2h    │ │  └──┴──┴──┴──┴──┘      │
│  └──────────────────────┘ │                          │
│                            │  ⚠️ At Risk             │
│  Progress: 36 / 54 hrs     │  Need 2.3h/week        │
│  ████████░░░░ 67%         │                          │
│  18h remaining · 2.3h/wk   │  📱 Latest Session      │
│                            │  Oct 28, 2025           │
│  📊 CHED Required: 54h     │  ✓ QR Verified          │
│  18-week term              │                          │
│                            │  [Schedule Make-up]     │
│  📈 Projected: Week 22     │                          │
└────────────────────────────┴──────────────────────────┘
```

### Color Scheme

**Status Colors:**
- **Compliant**: Green (#059669)
- **At Risk**: Amber (#d97706)
- **Non-Compliant**: Red (#dc2626)

**UI Elements:**
- **Laboratory card**: Slate background (#f8fafc)
- **CHED box**: Blue background (#eff6ff)
- **Status alerts**: Matching status color backgrounds
- **Progress bars**: Matching status colors
- **Mini calendar verified**: Green (#dcfce7)
- **Mini calendar pending**: Amber (#fef3c7)

### Typography
- **Subject code**: 20px, bold
- **Subject name**: 14px, regular
- **Laboratory name**: 16px, semibold
- **Progress numbers**: 16px, bold
- **CHED hours**: 24px, bold
- **Body text**: 12px
- **Micro text**: 10px

## Data Integration

### Source Data
- `FACULTY_SUBJECTS` - Subject metadata, hours, schedules
- `SESSION_LOGS` - QR verification records
- `DAYS` - Day of week constants
- `TIME_SLOTS` - Time slot definitions

### Calculations
```typescript
const progress = (logged / required) * 100;
const status = progress >= 80 ? "Compliant" 
             : progress >= 50 ? "At Risk" 
             : "Non-Compliant";
const projectedWeeks = Math.ceil((required / (logged / 10)) * 10);
const projectedTotal = logged + (hoursPerWeek * weeksRemaining);
const weeklyNeed = (required - logged) / 8; // 8 weeks remaining
```

## Mini Calendar Component

### Features
- Shows 4 weeks of dates (weeks 8-11 for demo)
- 5-column grid (Mon-Fri)
- Color-coded cells for session status
- Highlights scheduled day for the subject
- Compact legend

### Logic
```typescript
const hasSession = d === day && week === 10; // Current week
const isVerified = sessions.some(s => s.ack === "QR Verified");
const isPending = sessions.some(s => s.ack === "Pending");
```

### Visual States
- **Regular day**: Light gray background
- **Session verified**: Green background with ring
- **Session pending**: Amber background with ring

## Responsive Behavior

### Desktop (≥768px)
- Two-column layout (Left: info, Right: calendar/actions)
- Full card width with generous spacing
- Side-by-side progress and calendar

### Mobile (<768px)
- Single column layout
- Calendar and actions stack below info
- Progress bars full width

## User Experience

### Faculty Flow
1. Navigate to **My Schedule → Classes**
2. See all assigned classes at a glance
3. Identify at-risk courses by amber/red badges
4. Check assigned laboratory and schedule
5. Review recent sessions on mini calendar
6. Verify QR acknowledgement status
7. Schedule make-up sessions if needed

### Information Hierarchy
1. **Status** (most prominent) - Color-coded badges
2. **Laboratory assignment** - Featured card
3. **Progress** - Visual progress bar
4. **Schedule** - Mini calendar with history
5. **Actions** - Make-up session button

## Future Enhancements

1. **Interactive Calendar**
   - Click on date to see session details
   - Add make-up session directly from calendar

2. **Session History List**
   - Expandable list of all past sessions
   - Filter by verified/pending

3. **QR Scanner Integration**
   - Scan QR code directly from this page
   - Instant verification feedback

4. **Export Options**
   - Download compliance report
   - Print class schedule

5. **Notifications**
   - Badge count for pending QR acknowledgements
   - Weekly progress reminders

---

**Page Route**: `/schedule/classes`
**Parent Route**: `/_app/schedule/`
**Layout**: Two-column per class card
**Primary Focus**: Laboratory assignment + compliance tracking
**Status**: ✅ Complete and functional
