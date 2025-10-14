# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meeting Cost Calculator is a React Native/Expo mobile application (iOS/Android) that calculates and displays real-time costs of meetings based on comprehensive employee compensation including salary, bonuses, and Bermuda employment costs (payroll tax, social insurance, health insurance). The app integrates with device calendars, tracks active meetings with milestone notifications, pre-calculates costs for scheduled meetings, predicts costs before scheduling, generates detailed cost reports, and supports multiple currencies with customizable company settings.

**Core Principle**: Calculate true employee meeting costs accurately and create psychological pressure for shorter, more efficient meetings through prominent cost display.

**Privacy First**: All data stored locally on device. NO cloud sync, NO backend, NO accounts, NO external transmission of salary data.

## Essential Commands

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run web            # Run in web browser (limited functionality)

# Dependencies
npx expo install [package]  # Install Expo-compatible packages

# Project Management
npx expo doctor        # Check for configuration issues
```

## Architecture

### Three-Layer Architecture

**1. PRESENTATION LAYER** (`src/screens/`, `src/components/`)
- React components for display and user interaction
- Components must be small, focused, and contain NO business logic
- No salary calculations in UI components
- Each component does one thing

**2. BUSINESS LOGIC LAYER** (`src/services/`)
- Pure functions containing all calculations and business rules
- No UI code in services
- All Bermuda employment cost calculations isolated here
- Key services:
  - `CalendarService`: Reads calendar events and attendee information
  - `EmployeeCostCalculator`: Calculates true cost to company including all Bermuda expenses
  - `MeetingCostCalculator`: Calculates meeting costs using employee costs and duration
  - `EmployeeService`: Manages employee profiles and compensation data
  - `MeetingService`: Manages meeting records, tracking, and history
  - `CompanyService`: Manages company settings (name, currency, work week hours)
  - `StorageService`: Handles AsyncStorage for sensitive data
  - `EmailService`: Formats and sends meeting reports via native email
  - `ValidationService`: Validates all user inputs

**3. DATA LAYER** (`src/services/StorageService.js`)
- Simple storage using AsyncStorage for sensitive employee data
- One source of truth for each data type
- All reads/writes go through this layer
- Local storage only - NO cloud sync, NO accounts, NO tracking

### Project Structure

```
src/
├── screens/           # All application screens
│   ├── Onboarding/    # Welcome screen with first-time user flow
│   ├── Today/         # Calendar meetings with manual start option
│   ├── ActiveMeeting/ # Real-time cost tracking with prominent display
│   ├── MeetingPredictor/ # Predict meeting costs before scheduling
│   ├── History/       # Past meetings with edit/delete capabilities
│   ├── Employees/     # Single-screen employee management
│   └── Settings/      # App configuration and calculation details
├── components/        # Reusable UI components
│   ├── AttendeePickerModal.js  # Employee selection with add capability
│   ├── CurrencyPickerModal.js  # Currency selection modal
│   ├── EditTextModal.js        # Reusable text editing modal
│   ├── Button.js      # Primary UI component
│   ├── Card.js        # Container component
│   ├── Input.js       # Form input with validation
│   └── AppText.js     # Typography component
├── services/          # Business logic layer
├── navigation/        # React Navigation setup
├── constants/         # Design system, Bermuda defaults
└── utils/            # Helper functions
```

## Bermuda Employment Cost Calculations

### Simplified Formula (Used in App)

```javascript
// Annual Cost Components:
totalCompensation = baseSalary + annualBonus
healthInsuranceCompanyPortion = standardHealthInsurance / 2  // Company pays half ($6,000)
payrollTax = totalCompensation * 0.10                        // Simplified 10%
socialInsurance = baseSalary * 0.05                          // Simplified 5%

totalAnnualCost = totalCompensation + healthInsuranceCompanyPortion + payrollTax + socialInsurance

// Time-Based Costs:
hourlyCost = totalAnnualCost / 2080    // 40 hours/week * 52 weeks
perMinuteCost = hourlyCost / 60

// Meeting Cost (updates every second):
meetingCost = sum(attendee.perMinuteCost * elapsedMinutes) for all attendees
```

**Example**: Employee with $80K salary + $10K bonus:
- Total compensation: $90,000
- Health insurance (company half of $12K): $6,000
- Payroll tax (10% of $90K): $9,000
- Social insurance (5% of $80K): $4,000
- **Total annual cost: $109,000**
- Hourly: $52.40 | Per-minute: $0.873

### Actual Bermuda Rates (Documented in "About Calculations")

**Payroll Tax** (Graduated by company total payroll):
- < $200K → 1.00%
- $200K-$350K → 2.50%
- Hotels/restaurants ≥ $350K → 5.00%
- $350K-$500K → 5.25%
- Retail > $500K → 6.00%
- $500K-$1M → 7.50%
- > $1M → 10.00%

**Social Insurance** (Fixed weekly, not percentage):
- Employer pays BMD $37.65/week = $1,957.80/year
- Not percentage-based

**Note**: App uses simplified 10%/5% rates for ease of use. Actual rates documented in Settings → About Our Calculations.

### Default Settings
- Payroll tax: 10% (simplified)
- Social insurance: 5% (simplified)
- Standard health insurance: $12,000 annually
- Default currency: BMD (Bermuda Dollar)
- Work week: 40 hours

## Key Data Models

### Employee Profile
```javascript
{
  id: string,
  name: string,
  role: string,
  email: string,                    // OPTIONAL - for calendar attendee matching
  annualSalary: number,
  annualBonus: number,
  includesHealthInsurance: boolean, // Default true
  hourlyCost: number,               // Calculated from annual cost
  perMinuteCost: number,            // Hourly / 60
  totalAnnualCost: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Meeting Record
```javascript
{
  id: string,
  calendarEventId: string,          // If from calendar
  title: string,
  scheduledStart: timestamp,
  scheduledEnd: timestamp,
  durationMinutes: number,
  actualStart: timestamp,
  actualEnd: timestamp,
  actualMinutes: number,
  attendees: [                      // Array of employee objects
    {
      id: string,
      name: string,
      role: string,
      perMinuteCost: number,
      hourlyCost: number
    }
  ],
  actualCost: number,
  costDifference: number,           // vs scheduled
  ranOver: boolean,
  endedEarly: boolean,
  minutesDifference: number,
  status: 'scheduled' | 'in_progress' | 'completed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Key UX Design Decisions

### Active Meeting Screen - Maximum Pressure Design

**Purpose**: Create psychological pressure for shorter meetings

**Layout** (top to bottom):
1. Meeting title
2. "MEETING COST" label (small, uppercase)
3. **$XX.XX** (72pt, bold, primary color) - THE FOCAL POINT
4. "and counting..." (italic)
5. Timer in large font (48pt) showing MM:SS or HH:MM:SS
6. "elapsed" label
7. "IN THIS MEETING" label
8. Simple list of attendee names with small avatars and roles
9. Divider line
10. Detailed breakdown (scrollable): milestones, per-attendee costs

**Why**: Large cost number counting up every second creates urgency. Attendee list reminds everyone who's burning money. Timer shows how long the burn has been happening.

### Employee Management - Single Screen Form

**Key Decision**: Changed from 4-step wizard to single scrolling form

**Why**:
- User feedback: "I would like to be able to set up an employee using one screen"
- Faster data entry
- Live cost preview as user types
- See all fields at once

**Features**:
- Real-time cost calculation (updates as salary changes)
- Email is OPTIONAL (not required)
- Supports both add and edit modes
- Shows calculated per-minute, hourly, and annual costs
- No back button on first employee (guided flow)

### Attendee Selection - Manual Override

**Problem**: Calendar email matching doesn't work if employees don't have emails
**Solution**: Manual attendee picker with checkboxes

**Features**:
- Selects from all employees in system
- Shows per-minute cost for each
- "Add Employee" button at bottom to add during selection
- Empty state with "Add Employee" call-to-action
- Reopens automatically after adding employee

### Meeting History - Editable

**Problem**: People arrive late or leave early
**Solution**: Edit duration after meeting ends

**Features**:
- Edit button on each meeting → prompts for new duration
- Recalculates cost based on new duration
- Delete button with confirmation
- Shows "Ran over" or "Ended early" badges

### Start Meeting - Single Floating Button

**Design**: One prominent button at bottom of Today screen
**Position**: Floating above content with shadow
**Label**: "Start Meeting"
**Flow**: Button → Attendee picker → Meeting starts immediately

### First-Time User Flow

**Welcome Screen**:
1. Shows value proposition
2. "Get Started" button
3. Checks if any employees exist
4. If none: Routes to "Add Your First Employee" (no back button)
5. If exists: Routes to Main app

**Goal**: Guide new users to add at least one employee before using app

## Time Milestone Tracking

**Primary Milestones**: 1, 15, 30, 45, 60, 75, 90, 105, 120 minutes (then continuing at 15-min intervals)

During active meetings:
- Cost updates every second
- Timer shows elapsed time
- Next milestone preview with progress bar
- Milestone history shown below

## Calendar Integration

### Attendee Matching Strategy
1. Read calendar events from device calendar
2. Extract attendee emails
3. Match emails to employee profiles (case-insensitive)
4. For unmatched: Show "Select Attendees" button for manual selection
5. Manual selection overrides automatic matching

### Permissions
- Request `expo-calendar` permission with clear explanation
- Handle denied state gracefully - show permission screen
- Calendar and Reminders permissions both required (iOS requirement)
- Privacy emphasis: "Your data never leaves this device"

### Manual Meeting Start
- Doesn't require calendar access
- Opens attendee picker immediately
- Creates "Ad-hoc Meeting" with current timestamp
- Same real-time tracking as calendar meetings

## Email Reports

### How It Works
- Uses device's native email app (Mail, Gmail, Outlook, etc.)
- Pre-fills subject and body with formatted report
- User adds recipients and sends from their own email
- NO backend server - uses native `mailto:` URL scheme

### Report Contents
- Executive summary (total cost, meetings, hours, average)
- Top 10 most expensive meetings
- Meeting patterns (ran over, ended early, on time)
- Cost of overruns
- Generated date

## Development Guidelines

### Stability is Non-Negotiable
- The app must NEVER crash
- Comprehensive error handling and input validation mandatory
- Graceful failure modes for all operations
- Users must trust this app with sensitive salary information

### Validation Requirements
- Annual salary: 1,000 to 10,000,000
- Annual bonus: 0 to 10,000,000
- Email: OPTIONAL - validate format only if provided
- Duration: 1 minute to 24 hours
- All calculations must handle null/undefined/zero gracefully
- Never allow division by zero
- Round monetary values to 2 decimals, per-minute costs to 3 decimals

### Privacy by Default
- All data stored locally using AsyncStorage
- NO cloud sync, NO backend services, NO accounts
- NO tracking of user behavior
- Employee salary data never transmitted
- Reports generated on-device
- Email sent via user's own email account
- Data protected by device encryption (iOS/Android built-in)

### Essential Libraries Only
**Use**:
- expo-calendar (read device calendar)
- expo-notifications (milestone notifications)
- @react-native-async-storage/async-storage (secure local storage)
- React Navigation (navigation)
- react-native-safe-area-context (safe areas)

**DO NOT Use**:
- Redux/MobX (use local state)
- UI libraries (NativeBase/React Native Paper)
- Firebase/Supabase (exposes salary data)
- Any backend services

## Component Guidelines

### Back Button Styling
- Text: "‹ Back"
- Variant: secondary
- Width: 80
- Positioned in header with margin bottom

### Button Variants
- **primary**: Main actions (blue background)
- **secondary**: Cancel/back actions (gray background)

### Modal Pattern
- Full screen from bottom
- SafeAreaView with edges
- Header with title and selection count
- Scrolling content area
- Footer with Cancel and Confirm buttons

## Common Pitfalls to Avoid

1. **Don't put calculations in UI components** - Keep presentation and business logic separate
2. **Don't skip input validation** - Salary data requires careful validation
3. **Don't use external services** - All data must stay on device
4. **Don't make email required** - It's optional for privacy
5. **Don't batch todo completions** - Mark each task complete immediately when done
6. **Don't use circular imports** - Import direct components, not from index.js when there's a cycle

## Implementation Status

### ✅ Completed Features

**Phase 1-2: Foundation & Employees**
- Three-layer architecture implemented
- Design system (colors, spacing, typography)
- Reusable components (Button, Card, Input, AppText)
- Single-screen employee form with live cost preview
- Email made optional
- Employee list with search
- Employee detail with cost breakdown
- Employee edit and delete
- Back buttons on all screens

**Phase 3: Calendar Integration**
- CalendarService with permission handling
- Reads device calendar events
- Attendee email matching to employees
- Manual attendee selection with AttendeePickerModal
- "Add Employee" within attendee picker
- Pre-calculated costs for calendar meetings

**Phase 4: Meeting Tracking**
- Real-time cost tracking with per-second updates
- Prominent cost display (72pt font, primary color)
- Large timer display (48pt font)
- Attendee list on meeting screen
- Pause/Resume functionality (fixed with ref)
- End meeting with summary
- Meeting data persistence

**Phase 5: History & Analysis**
- Meeting history with summary statistics
- Edit duration (for late arrivals/early departures)
- Delete meetings with confirmation
- "Ran over" and "Ended early" badges
- Cost difference calculations

**Phase 6: Reporting**
- Email report generation
- Executive summary with statistics
- Top 10 most expensive meetings
- Meeting patterns analysis
- Native email client integration

**Phase 7: Polish**
- First-time user flow (guides to add first employee)
- Floating "Start Meeting" button on Today screen
- Loading/empty/error states
- "About Our Calculations" screen with disclaimers
- Actual vs simplified Bermuda rates documented
- Settings showing employee count

**Phase 8: Company Settings & Predictions**
- Editable company settings (name, currency, work week hours)
- Multi-currency support (BMD, USD, EUR, GBP, CAD, AUD, JPY, CHF)
- CurrencyPickerModal component
- EditTextModal component for text editing
- CompanyService for managing company settings
- Meeting Cost Predictor screen
- Pre-meeting cost calculation with duration options

**Phase 9: UI Polish & Assets (v1.0.7)**
- Swipe-to-delete functionality for employees
- iOS-style back buttons across all screens
- PNG illustrations for empty states (Cal.png, employee-empty-state.png, history-empty-state.png, play-button.png)
- Consistent 180×180 pictogram sizes across Calendar, Start, and History screens
- Motivational quotes on empty states (18pt, italic)
- Fixed email functionality with LSApplicationQueriesSchemes
- Version updated to 1.0.7 with October 2025 date

### 🚧 Pending Enhancements

**Settings Management**
- ✅ Make company settings editable (name, currency, work week hours) - COMPLETED
- Implement graduated payroll tax calculation
- Per-employee work hours (currently company-wide)

**Notifications**
- Milestone notifications at 15, 30, 45, 60 min intervals
- Haptic feedback on milestones

**Additional Features**
- Meeting notes/comments
- Export history to CSV
- Dark mode support

## Testing Strategy

Before declaring any component/service complete:
- Test with edge case data (very high/low salaries, missing fields)
- Verify calculations match manual computation
- Test storage persistence across app restarts
- Verify no crashes with invalid inputs
- Test calendar permission denied state
- Test pause/resume functionality
- Test manual meeting start without calendar
- Verify attendee picker add employee flow
- Test history edit and delete
- Verify email report generation

## Configuration Files

### app.json Requirements
```json
{
  "expo": {
    "name": "Meeting Cost Calculator",
    "slug": "meeting-cost-calculator",
    "version": "1.0.7",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.meetingcostcalculator.app",
      "supportsTablet": true,
      "infoPlist": {
        "NSCalendarsUsageDescription": "This app reads your calendar to calculate meeting costs and match attendees to employee profiles.",
        "NSRemindersUsageDescription": "This app needs access to reminders to track meeting schedules.",
        "LSApplicationQueriesSchemes": ["mailto"]
      }
    },
    "android": {
      "package": "com.meetingcostcalculator.app",
      "permissions": [
        "READ_CALENDAR",
        "POST_NOTIFICATIONS"
      ]
    },
    "plugins": [
      ["expo-calendar", {
        "calendarPermission": "The app needs to read your calendar to calculate meeting costs."
      }],
      ["expo-notifications", {
        "icon": "./assets/notification-icon.png",
        "color": "#2563EB"
      }]
    ]
  }
}
```

## Quality Standards

Every feature must meet these standards before completion:
- ✓ No crashes under any usage scenario
- ✓ Accurate calculations verified against manual computation
- ✓ Complete input validation
- ✓ Helpful error messages
- ✓ Professional visual design
- ✓ Privacy preserved (local storage only)
- ✓ Graceful handling of missing data (optional emails)

## File References

When referencing code, use pattern `file_path:line_number` for easy navigation.

Example: "Employee cost calculation occurs in src/services/EmployeeCostCalculator.js:45"
