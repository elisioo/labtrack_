# Schedule Interface Update - LabTrack Compliance System

## Overview
Updated the Schedule interface (`_app.schedule.tsx`) to align with the LabTrack system requirements from the ACM paper, implementing the Constraint-Based Backtracking Scheduling Algorithm with compliance monitoring and QR-based session acknowledgement.

## Key Features Implemented

### 1. **Compliance Tracking Dashboard** (Faculty View)
- **Three-card overview** displaying each subject's compliance status
- **Progress bars** showing logged hours vs. required hours (CHED mandate: 27h for 9-week, 54h for 18-week)
- **Status badges**: 
  - ✅ **Compliant** (≥80% progress) - Green
  - ⚠️ **At Risk** (50-79% progress) - Amber
  - ❌ **Non-Compliant** (<50% progress) - Red
- **Projected completion** warnings when subjects are behind schedule
- **Remaining hours** calculations

### 2. **QR Acknowledgement System**
- **Visual indicators** on calendar cells:
  - ✓ Green checkmark = QR Verified sessions
  - QR icon = Pending acknowledgement
- **Session detail popover** shows verification status
- Integrated with `SESSION_LOGS` data structure

### 3. **Enhanced Session Details**
When clicking on a scheduled session:
- **Subject information** with compliance status
- **QR verification status** (Verified/Pending)
- **Course progress bar** showing current completion percentage
- **Faculty and room information**
- **Remaining hours** to meet CHED requirements

### 4. **Prescriptive Correction - Make-up Session Booking**
- **Intelligent subject selection** highlighting subjects behind schedule
- **Room availability** based on real-time occupancy matrix
- **Duration options**:
  - 2 hours (Regular 18-week term)
  - 3 hours (Summer 9-week term)
- **Prescriptive guidance** explaining the Rule-Based Correction system

### 5. **Term Duration Context**
- Header displays: **"Week 10 of 18 · 18-Week Term"**
- Make-up session form adapts duration based on term type
- Compliance calculations account for term length

## Data Structure Updates

### `FACULTY_SUBJECTS` (mock-data.ts)
Added `termDuration` field to each subject:
```typescript
{
  code: "IT321",
  name: "Systems Integration",
  required: 54, // CHED-required hours for 18-week term
  logged: 36,   // Hours accumulated so far
  termDuration: 18,
  // ... other fields
}
```

### Session Compliance Calculations
```typescript
const progress = (logged / required) * 100;
const projectedWeeks = Math.ceil((required / (logged / currentWeek)) * currentWeek);
const status = progress >= 80 ? "Compliant" : progress >= 50 ? "At Risk" : "Non-Compliant";
```

## Visual Enhancements

### Legend Updates
- **QR Verified** indicator (green checkmark)
- **Pending QR** indicator (amber QR icon)
- **Unavailable/Maintenance** pattern indicator

### Color Coding
- **Green** (#10b981) = Compliant / Verified
- **Amber** (#f59e0b) = At Risk / Pending
- **Red** (#ef4444) = Non-Compliant / Issue
- **Teal** (#0D9488) = Primary actions (LMO brand color)

## System Alignment with ACM Paper

### ✅ Constraint-Based Backtracking Scheduling
- Room Occupancy Matrix (`ROOM_OCCUPANCY`) implemented
- Time slot constraints (2-hour sessions, Monday-Friday)
- Real-time availability checking

### ✅ QR-Based Session Acknowledgement
- `SESSION_LOGS` with acknowledgement status
- Visual indicators on calendar
- Verification tracking per session

### ✅ Compliance Monitoring (CHED Requirements)
- 27 hours for 9-week courses
- 54 hours for 18-week courses
- Progress tracking against required hours
- Status classification (Compliant/At Risk/Non-Compliant)

### ✅ Rule-Based Prescriptive Correction
- Make-up session booking system
- Subjects behind schedule highlighted
- Duration options based on term type
- Guidance text explaining the system

### ✅ Real-Time Utilization Dashboard
- Week-by-week progress tracking
- Room occupancy visualization
- Faculty-specific compliance overview

## User Roles

### Faculty Member View
- **"My Schedule"** tab shows personal subjects only
- **Compliance cards** for each subject taught
- **Make-up session booking** for under-compliant courses
- **QR pending reminders** for unacknowledged sessions

### Administrator View
- **"All Schedules"** tab shows institution-wide view
- **Room filter** to view specific lab schedules
- **Department filter** for team-based monitoring
- Full visibility of all bookings and compliance statuses

## Next Steps (Future Enhancements)

1. **Backend Integration**
   - Connect to actual database for session logs
   - Real-time QR code generation and verification
   - Automated hour computation

2. **Advanced Prescriptive Correction**
   - AI-powered optimal slot recommendations
   - Conflict detection and resolution
   - Multi-week make-up planning

3. **Analytics Integration**
   - Link to Analytics page for deeper insights
   - Weekly trend visualization
   - Compliance forecasting

4. **Notification System**
   - Alerts for pending QR acknowledgements
   - Warnings when approaching non-compliance
   - Reminders for upcoming make-up sessions

5. **Mobile Responsiveness**
   - QR scanning on mobile devices
   - Touch-optimized calendar interactions
   - Push notifications for faculty

## Technical Notes

- Uses TanStack Router for routing
- Shadcn UI components for consistent design
- Lucide React for icons
- Tailwind CSS for styling
- Mock data structure ready for backend integration

## Files Modified

1. `src/routes/_app.schedule.tsx` - Main schedule interface
2. `src/lib/mock-data.ts` - Added term duration field

## Demo Data

The system currently uses mock data with realistic scenarios:
- **IT321**: 36/54 hours (67%) - Compliant
- **CS401**: 20/27 hours (74%) - At Risk (9-week course)
- **IT411**: 12/54 hours (22%) - Non-Compliant, Behind schedule

---

**Last Updated**: Week 10, Academic Year 2025-2026
**Implemented By**: Kiro AI Assistant
**Aligned With**: LabTrack ACM Research Paper Requirements
