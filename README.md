# Meeting Cost Calculator

A mobile application for iOS and Android that calculates and displays the real-time cost of meetings based on comprehensive employee compensation including salary, bonuses, and Bermuda employment costs.

## Features

- **True Cost Calculation**: Includes salary, bonuses, health insurance, payroll tax, and social insurance
- **Calendar Integration**: Automatically reads scheduled meetings and matches attendees
- **Real-Time Tracking**: Per-second cost updates during active meetings
- **Milestone Notifications**: Alerts at 15-minute intervals (15, 30, 45, 60+ min)
- **Pre-Calculation**: Shows meeting costs before they start
- **Detailed Reports**: Generate comprehensive cost analysis via email
- **Privacy First**: All data stored locally, no cloud sync

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── screens/       # All application screens
├── components/    # Reusable UI components
├── services/      # Business logic and calculations
├── navigation/    # React Navigation setup
├── constants/     # Design system and defaults
└── utils/        # Helper functions
```

## Technology Stack

- **Framework**: React Native with Expo (managed workflow)
- **Navigation**: React Navigation
- **Storage**: AsyncStorage (local, secure)
- **Calendar**: expo-calendar
- **Notifications**: expo-notifications
- **Animations**: React Native Reanimated

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for detailed architecture, development phases, and implementation guidelines.

## License

Proprietary - All rights reserved
