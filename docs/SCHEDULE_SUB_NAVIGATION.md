# Schedule Sub-Navigation Update

## Overview
Split the "My Schedule" sidebar item into two sub-pages: **Calendar** and **Classes** to better organize the schedule viewing and compliance tracking features. Added **collapsible sub-navigation** with arrow indicators for better UX.

## Changes Made

### 1. **New Route Structure**
```
/_app/schedule/
  ├── calendar  → Weekly calendar grid view (original schedule page)
  ├── classes   → Course compliance tracking cards
  └── index     → Redirects to /calendar by default
```

### 2. **Collapsible Sidebar Sub-Items** (Faculty Role Only)
The "My Schedule" navigation now has:
- **Chevron arrow button** (right-aligned) to expand/collapse sub-items
- **ChevronDown** (▼) when expanded
- **ChevronRight** (▶) when collapsed
- **Independent state management** - remains collapsed/expanded regardless of navigation

Sub-items when expanded:
- **Calendar** - Weekly time slot grid with bookings
- **Classes** - Compliance cards for each subject

**Default State:** Expanded on first load (so users see the sub-items immediately)

### 3. **Calendar Page** (`_app.schedule.calendar.tsx`)
**Features:**
- Weekly calendar grid (Mon-Fri)
- Time slot booking system
- QR acknowledgement indicators
- Room occupancy visualization
- Make-up session booking
- Session details popover with compliance progress

**Purpose:** Weekly schedule management and time slot bookings

### 4. **Classes Page** (`_app.schedule.classes.tsx`)
**Features:**
- Individual compliance cards for each subject
- Progress bars with status (Compliant/At Risk/Non-Compliant)
- CHED-required hours display
- Projected completion forecasting
- Make-up session recommendations
- Weekly hour requirements calculation
- Summary cards (Total Required, Hours Logged, Remaining)

**Purpose:** Detailed compliance tracking per subject

## Sidebar Navigation Logic

### Collapsible State Management
```typescript
const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["/schedule/calendar"]));

const toggleExpanded = (to: string) => {
  setExpandedItems((prev) => {
    const next = new Set(prev);
    if (next.has(to)) {
      next.delete(to);
    } else {
      next.add(to);
    }
    return next;
  });
};
```

**Features:**
- Uses `Set` to track multiple expandable items (future-proof)
- Default expanded: `/schedule/calendar` (so sub-items visible on load)
- Independent of navigation - stays expanded/collapsed based on user action
- Clicking arrow toggles the state without navigating

### Arrow Button Positioning
```typescript
<button
  type="button"
  onClick={() => toggleExpanded(item.to)}
  className="absolute right-2 ..."
  style={{ width: 20, height: 20, color: active ? "#0d9488" : "#9ca3af" }}
>
  {isExpanded ? <ChevronDown /> : <ChevronRight />}
</button>
```

**Styling:**
- **Position**: Absolute right (overlays on parent link)
- **Size**: 20x20px clickable area
- **Icon**: 3.5x3.5 chevron (ChevronDown when expanded, ChevronRight when collapsed)
- **Color**: Teal when parent active, gray otherwise
- **Hover**: Light gray background (#f9fafb)

### Visual Hierarchy
- **Parent items**: 13px font, left accent bar (3px teal)
- **Arrow button**: Absolute positioned right side, 20x20px clickable area
- **ChevronDown** (▼) when expanded, **ChevronRight** (▶) when collapsed
- **Sub-items**: 12px font, indented 27px, no accent bar
- **Active sub-item**: Teal text (#0d9488), light teal background (#f0fdfa)
- **Inactive sub-item**: Gray text (#9ca3af)

### Parent Item Detection
```typescript
const active = pathname === item.to || item.subItems?.some(sub => pathname === sub.to);
```
The parent "My Schedule" is highlighted when either:
- Direct match: `/schedule/calendar`
- Sub-item match: `/schedule/classes`

### Sub-Item Rendering
Sub-items render when:
1. The parent has `subItems` defined
2. The item is expanded (`isExpanded === true`)

```typescript
{hasSubItems && isExpanded && (
  <div className="ml-[27px] mt-1 space-y-[2px]">
    {/* Sub-navigation items */}
  </div>
)}
```

**Note:** Unlike auto-expand, sub-items now render based on user's collapse/expand action, independent of navigation state.

## Data Flow

### Shared Data
Both Calendar and Classes pages use:
- `FACULTY_SUBJECTS` - Subject metadata with hours
- `SESSION_LOGS` - QR acknowledgement records
- `ROOM_OCCUPANCY` - Booking matrix
- `TIME_SLOTS`, `DAYS`, `ROOMS` - Schedule constants

### Compliance Calculations
```typescript
const progress = (logged / required) * 100;
const status = progress >= 80 ? "Compliant" 
             : progress >= 50 ? "At Risk" 
             : "Non-Compliant";
const projectedWeeks = Math.ceil((required / (logged / currentWeek)) * currentWeek);
```

## User Experience Flow

### Faculty User Journey
1. Click **"My Schedule"** in sidebar
2. Default lands on **Calendar** page (weekly view)
3. See sub-items appear: Calendar (active) and Classes
4. Click **Classes** to switch to compliance view
5. Both pages share the same make-up session booking system

### Administrator View
Administrators see **"All Schedules"** without sub-items (single page view).

## Responsive Behavior

### Desktop (≥768px)
- Full sidebar with parent + sub-items visible
- Sub-items appear indented under parent
- Smooth transitions on hover and active states

### Mobile (<768px)
- Drawer sidebar (overlay)
- Same sub-navigation structure
- Drawer closes after navigation

## Styling Details

### Colors
- **Active parent**: Teal background (#f0fdfb), teal text (#0d9488)
- **Active sub-item**: Light teal background (#f0fdfa), teal text (#0d9488)
- **Hover state**: Light gray background (#f9fafb)
- **Accent bar**: 3px teal (#0d9488) on left edge (parent only)
- **Arrow icon**: Teal when parent active (#0d9488), gray otherwise (#9ca3af)
- **Arrow hover**: Light gray background (#f9fafb)

### Spacing
- Parent padding: `8px 10px`
- Sub-item padding: `6px 10px`
- Sub-item left margin: `27px` (aligns with icon+text)
- Gap between items: `2px`

## TypeScript Types

### Extended NavItem Type
```typescript
type NavItem = { 
  to: string; 
  label: string; 
  icon: ReactNode; 
  badge?: number; 
  subItems?: { to: string; label: string }[]  // NEW
};
```

## Files Created/Modified

### Created
1. `src/routes/_app.schedule.calendar.tsx` - Calendar view
2. `src/routes/_app.schedule.classes.tsx` - Classes/compliance view
3. `src/routes/_app.schedule.index.tsx` - Default redirect
4. `docs/SCHEDULE_SUB_NAVIGATION.md` - This file

### Modified
1. `src/components/AppShell.tsx`:
   - Added `ChevronDown` import from lucide-react
   - Added `subItems` to `NavItem` type
   - Updated `buildNav()` to include sub-items for Faculty role
   - Added `expandedItems` state with `useState<Set<string>>`
   - Added `toggleExpanded()` function for collapse/expand logic
   - Modified sidebar rendering to show chevron arrow button
   - Changed sub-item rendering from `active &&` to `isExpanded &&`
2. `src/routes/_app.schedule.tsx`:
   - Now redirects to `/calendar` (via index route)

## Future Enhancements

1. **Breadcrumb Navigation**
   - Show `My Schedule > Calendar` or `My Schedule > Classes` in header

2. **Quick Switch Toggle**
   - Add a toggle button in page header to switch between views

3. **Badge Indicators**
   - Show count of under-compliant subjects on "Classes" sub-item

4. **Mobile Tabs**
   - On mobile, show horizontal tabs instead of sidebar sub-items

5. **Deep Linking**
   - Preserve sub-page state in URL for direct access

---

**Implementation Date**: Week 10, AY 2025-2026
**Implemented By**: Kiro AI Assistant
**Status**: ✅ Complete and functional
