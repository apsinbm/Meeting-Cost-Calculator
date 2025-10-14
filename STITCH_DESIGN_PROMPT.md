# Google Stitch Design Prompt for Meeting Cost Calculator
## BATCH 1 of 2 (6 Core Screens)

## App Overview

Design a modern, professional mobile application UI (iOS/Android) called **Meeting Cost Calculator** - a productivity tool that calculates and displays the real-time cost of meetings to encourage shorter, more efficient meetings.

**Core Purpose**: Create psychological pressure for shorter meetings by prominently displaying costs that count up in real-time, making every second visible and expensive.

**Privacy-First Philosophy**: All data stored locally. No cloud sync, no accounts, no external services. This is a sensitive financial tool handling salary data.

---

## Key Screens to Design

### 1. **Active Meeting Screen** (MOST IMPORTANT - PRIMARY SCREEN)
**Psychology**: Maximum urgency and pressure design

**Layout Priority** (top to bottom):
1. Meeting title (subtle, small)
2. "MEETING COST" label (uppercase, small, secondary text)
3. **$1,234.56** (72-96pt, BOLD, primary color) - THE HERO ELEMENT
4. "and counting..." (italic, animated pulse effect)
5. Timer in large font showing MM:SS or HH:MM:SS (48pt)
6. "elapsed" label
7. Simple attendee avatars with names and roles
8. Cost breakdown section (scrollable)
9. Action buttons: Pause/Resume, End Meeting

**Design Goals**:
- Make the dollar amount impossible to ignore
- Create subtle anxiety about time passing
- Professional but urgent feeling
- Cost should feel like it's "bleeding" money

---

### 2. **Today Screen** (Calendar View)
Shows today's scheduled meetings with pre-calculated costs

**Elements**:
- List of calendar meetings with time, attendees, and predicted cost
- Each meeting card shows: time range, title, attendee count, cost estimate
- Visual indicator for current/upcoming meetings
- Floating action button at bottom: "Start Ad-hoc Meeting"
- Empty state if no meetings scheduled

**Design Goals**:
- Clean, scannable list
- Costs should stand out but not dominate
- Easy to see what meetings cost before they start

---

### 3. **Meeting Cost Predictor Screen** (NEW FEATURE)
Calculate predicted costs before scheduling a meeting

**Elements**:
- "What will this meeting cost?" headline
- Duration selector (15, 30, 45, 60, 90, 120 minutes) - pill-style buttons
- "Select Attendees" button with attendee picker
- Large predicted cost display (similar to active meeting but less urgent)
- Per-attendee cost breakdown
- "This meeting will cost $X per minute" insight
- Helpful suggestions: "Consider: Can this be an email?" or "Can we do this in 15 minutes instead?"

**Design Goals**:
- Decision-making tool
- Make users think twice about meeting length
- Clear, consultative tone

---

### 4. **Employee Management Screen**
Single-screen form for adding/editing employee profiles

**Elements**:
- Profile photo/avatar picker
- Text inputs: Name, Role, Email (optional)
- Salary input with large numbers, currency symbol
- Annual bonus input
- Health insurance toggle (company pays half)
- Live cost preview card showing: per-minute, hourly, annual cost
- Save button

**Design Goals**:
- Professional, trustworthy (handling sensitive salary data)
- Live preview creates transparency
- Form should feel efficient, not tedious

---

### 5. **Employee List Screen**
Browse all employee profiles

**Elements**:
- Search bar at top
- Card-based list of employees
- Each card: avatar, name, role, per-minute cost
- "Add Employee" floating button
- Tap card to edit
- Empty state: "Add your first employee to get started"

**Design Goals**:
- Quick scanning
- Costs visible but not intrusive
- Easy to find and edit profiles

---

### 6. **Meeting History Screen**
Past meetings with analysis

**Elements**:
- Summary statistics at top: total spent, total meetings, average cost
- List of past meetings with cards showing:
  - Meeting title, date, duration
  - Final cost (large, prominent)
  - Badges: "Ran over", "Ended early", "On time"
  - Attendee count
- Each card has edit/delete actions
- Filter options: This week, This month, All time

**Design Goals**:
- Data visualization feel
- Historical costs should feel like "money spent"
- Insights should encourage better meeting habits

---

## Current Design System

**Colors**:
- Primary Blue: #2563EB (actions, highlights)
- Secondary Gray: #64748B (secondary actions)
- Success Green: #10B981 (completed, saved)
- Warning Orange: #F59E0B (overrun, caution)
- Error Red: #EF4444 (errors)
- Neutral Grays: #F9FAFB to #111827 (backgrounds, text)

**Typography**:
- System fonts (iOS System, Android Roboto)
- Font sizes: 12-32pt (standard), 56pt+ (cost displays)
- Font weights: Regular (400), Medium (500), Semibold (600), Bold (700)

**Spacing**:
- 8px grid system
- Spacing scale: 4, 8, 16, 24, 32, 48, 64px

---

## Design Principles

1. **Urgency Without Anxiety**: Create pressure but keep it professional
2. **Numbers First**: Cost and time should dominate the active meeting screen
3. **Trust Through Professionalism**: This handles salary data - must feel secure
4. **Minimal Friction**: Fast data entry, quick meeting starts
5. **Privacy Visible**: Reinforce that data stays local
6. **Insights Over Data**: Help users make decisions, not just see numbers
7. **Mobile-First**: Design for one-handed use when possible
8. **Accessibility**: Good contrast, readable text sizes

---

## Target Users

- Managers and executives in Bermuda
- Small to medium-sized companies
- People who attend/run many meetings
- Cost-conscious business professionals
- Ages 30-55, professional environment

---

## Competitor Inspiration

Think of the simplicity of:
- Stripe (financial trust)
- Things 3 (clean productivity)
- Headspace (calm but effective)
- Robinhood (making finance accessible)

But with unique urgency for the active meeting timer screen.

---

## What to Deliver (BATCH 1 - 6 Screens)

Please design these 6 screens:
1. **Active Meeting Screen** (highest priority - 2-3 variations if possible)
2. **Today Screen** with meeting list
3. **Meeting Cost Predictor Screen**
4. **Employee List Screen**
5. **Employee Add/Edit Form**
6. **Meeting History Screen**

**Format**: High-fidelity mockups, mobile portrait (iOS/Android), show both light mode designs

**Include**:
- Visual hierarchy examples
- Interactive states (buttons, inputs)
- Empty states
- Micro-interactions suggestions (animations, transitions)
- Color palette usage examples
- Typography scale in action

---

## Special Notes

- The Active Meeting Screen should feel like a "cost meter running"
- Consider subtle animations: counting numbers, pulsing cost, time ticking
- Meeting cards should feel "expensive" - visual weight to costs
- Employee data entry should feel secure and trustworthy
- Calendar integration should feel seamless
- Multi-currency display should be clear (symbols: $, €, £, ¥, Fr)

Design a tool that makes people think: "Is this meeting really necessary?" before they even start it.
