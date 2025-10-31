# ITMS-91054 Fix Documentation

**Error Code:** ITMS-91054: Invalid API category declaration

**App:** Meeting Cost Calculator v1.0.14 Build 20
**Date Fixed:** October 30, 2025
**Status:** ✅ RESOLVED

---

## The Problem

### Apple's Rejection Email (Oct 17, 2025 at 5:30 PM)

```
ITMS-91054: Invalid API category declaration

The PrivacyInfo.xcprivacy file at the "PrivacyInfo.xcprivacy" path contains
"NSPrivacyAccessedAPICategoryCalendars" as the value for a NSPrivacyAccessedAPIType
key, which is invalid. Values for NSPrivacyAccessedAPIType keys in your app's
privacy manifests must be valid API categories.
```

### What This Means

The app declared calendar access as a **"Required Reason API"** using an **invalid API category name** in the privacy manifest file.

**The Invalid Claim:**
```json
"NSPrivacyAccessedAPITypes": [
  {
    "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryCalendars",
    "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
  }
]
```

---

## Root Cause Analysis

### The Misunderstanding

**Incorrect Assumption:** "Since we access calendars, we need to declare it in the privacy manifest"

**The Reality:**
- Calendar access is a **standard permission-based API** (like Photos, Contacts, etc.)
- It uses **Info.plist usage descriptions**, NOT Required Reason API declarations
- It uses **system permission dialogs** that users must grant at runtime

### What Are Required Reason APIs?

Required Reason APIs are specific system APIs that Apple requires apps to declare with justification reasons. There are **ONLY 5 valid categories:**

1. **NSPrivacyAccessedAPICategoryFileTimestamp** - File timestamp APIs
2. **NSPrivacyAccessedAPICategorySystemBootTime** - System boot time APIs
3. **NSPrivacyAccessedAPICategoryDiskSpace** - Disk space APIs
4. **NSPrivacyAccessedAPICategoryActiveKeyboards** - Active keyboard APIs
5. **NSPrivacyAccessedAPICategoryUserDefaults** - UserDefaults APIs

**⚠️ Calendar is NOT on this list!**

### Why Calendar Access is Different

| Aspect | Calendar | File Timestamp (Required Reason) |
|--------|----------|----------------------------------|
| Declaration Method | Info.plist only | Privacy Manifest (NSPrivacyAccessedAPITypes) |
| Usage Description | NSCalendarsUsageDescription | Not needed (already implied) |
| User Permission | System permission dialog | Implicit (no dialog) |
| Reason Code Required | No | Yes (C617.1, etc.) |

---

## The Fix

### What Was Changed

**File:** `app.json`
**Lines Removed:** 61-68
**Commit:** `85318d7`

### Removed Code

```json
"NSPrivacyAccessedAPITypes": [
  {
    "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryCalendars",
    "NSPrivacyAccessedAPITypeReasons": [
      "CA92.1"
    ]
  }
]
```

### What Remains (Correct Configuration)

The app's calendar access was already correctly configured in `app.json`:

```json
{
  "ios": {
    "infoPlist": {
      "NSCalendarsUsageDescription": "Meeting Cost Calculator reads your calendar to display scheduled meetings, match attendees to employee profiles, and pre-calculate meeting costs. Your calendar data never leaves your device.",
      "NSRemindersUsageDescription": "This app accesses your reminders to send you milestone notifications during active meetings. For example, when a meeting reaches 15 minutes, you'll receive a notification showing the cost accumulated so far, helping you make decisions about meeting efficiency."
    }
  },
  "plugins": [
    [
      "expo-calendar",
      {
        "calendarPermission": "Meeting Cost Calculator reads your calendar to display scheduled meetings, match attendees to employee profiles, and pre-calculate meeting costs. Your calendar data never leaves your device."
      }
    ]
  ]
}
```

✅ **All of these declarations are correct and remain in place.**

---

## Resolution Timeline

### Oct 30, 2025 - Fix Implementation

1. **Identified the issue** (10:00 AM)
   - Found invalid NSPrivacyAccessedAPITypes declaration in app.json
   - Researched Apple's Required Reason API documentation

2. **Applied the fix** (10:30 AM)
   - Removed invalid NSPrivacyAccessedAPITypes section
   - Verified Info.plist declarations are correct
   - Updated version to 1.0.14
   - Committed changes (85318d7)

3. **Built and tested** (11:00 AM)
   - Generated iOS project with expo prebuild
   - Built with EAS: `eas build --platform ios --non-interactive`
   - Build took ~1 hour (EAS processing time)

4. **Uploaded to App Store** (12:49 PM)
   - Downloaded IPA from Expo dashboard
   - Uploaded with xcrun altool (35 seconds)
   - Delivery UUID: 82f84e89-6bcc-41d7-92d3-2c8b654a6986

5. **Submitted for review** (3:00 PM)
   - Attached Build 20 to version 1.0.14
   - Added review notes explaining the fix
   - Submitted for Apple review
   - **Status: Waiting for Review** ✅

---

## Build Details

| Property | Value |
|----------|-------|
| Version | 1.0.14 |
| Build Number | 20 |
| Build ID | 171cb15a-23f8-4e60-8748-ce98d177fa3a |
| IPA URL | https://expo.dev/artifacts/eas/3RwMqcrj8z5bV5yAYWWs6y.ipa |
| Upload Time | 35 seconds |
| Upload Date | Oct 30, 2025 12:49 PM |
| Delivery UUID | 82f84e89-6bcc-41d7-92d3-2c8b654a6986 |
| Status | Ready to Submit (TestFlight) |

---

## App Review Notes

```
Resubmission addressing ITMS-91054 rejection:

The app incorrectly declared calendar access as a Required Reason API using
"NSPrivacyAccessedAPICategoryCalendars" which is not a valid Apple API category.

Calendar access is properly handled through:
- NSCalendarsUsageDescription in Info.plist (already present and approved in previous submissions)
- Runtime permission requests using system dialogs
- No Required Reason API declaration needed

Fix: Removed the invalid NSPrivacyAccessedAPITypes declaration from privacy manifest.
Calendar permissions remain properly declared in Info.plist as required.

Build 1.0.14 (20) resolves this issue completely.
```

---

## Key Learnings

### 1. Privacy Manifest Confusion is Common

The difference between:
- **Info.plist permissions** (standard APIs like Calendar, Photos, Contacts)
- **Privacy Manifest Required Reason APIs** (special APIs Apple tracks for privacy)

Is subtle and easy to misunderstand.

### 2. Apple's Validation is Strict

Invalid API category names are rejected immediately during build processing. There's no second chance - the build fails validation and is unusable for App Store submission.

### 3. Build Processing Times Vary

- Typical: 15-30 minutes
- This fix: ~1 hour (possibly due to queue time on EAS servers)
- Max observed: 2+ hours

Always factor in processing time when submitting fixes.

### 4. Documentation is Critical

The invalid configuration was added weeks earlier (Oct 10 during v1.0.10 submission). Without clear documentation of what was changed, debugging took longer.

---

## References

### Apple Official Documentation

- **Privacy Manifest Files:** https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
- **Required Reason APIs:** https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api
- **Calendar Permissions:** https://developer.apple.com/documentation/eventkit/requesting_access_to_calendars_and_reminders

### Expo Documentation

- **Permissions Guide:** https://docs.expo.dev/guides/permissions/#ios-privacy-manifests
- **expo-calendar:** https://docs.expo.dev/versions/latest/sdk/calendar/

### Related Issues

- **Oct 17, 2025:** Apple Rejection #1 - Guideline 5.1.1 (Permission UI wording) - Fixed with Build 18
- **Oct 17, 2025 5:30 PM:** Apple Rejection #2 - ITMS-91054 (Invalid Privacy Manifest) - **Fixed with Build 20** ✅

---

## Prevention for Future Submissions

### Checklist for Privacy Manifest

- [ ] Only declare actual Required Reason APIs (file timestamp, disk space, etc.)
- [ ] Never declare standard permission APIs (Calendar, Photos, Contacts, etc.) in Privacy Manifest
- [ ] Verify all declared categories exist in Apple's official list
- [ ] Keep Info.plist usage descriptions for all permission APIs
- [ ] Test privacy manifest validation before submitting

### Where to Check

**In app.json:**
- `ios.privacyManifests.NSPrivacyAccessedAPITypes` - Required Reason APIs ONLY
- `ios.infoPlist` - Standard permission usage descriptions (NSCalendarsUsageDescription, etc.)
- `plugins` - Expo plugins for permissions (expo-calendar, etc.)

**Before Submission:**
- [ ] Run `npx expo prebuild --platform ios` to generate native files
- [ ] Check `ios/MeetingCostCalculator/Info.plist` for correct usage descriptions
- [ ] Verify no unexpected privacy manifest entries

---

## Contact & Support

**If you encounter ITMS-91054:**

1. Check your app.json for `NSPrivacyAccessedAPITypes`
2. Verify each declared API is in Apple's official list (the 5 categories above)
3. Remove any standard permission APIs (Calendar, Photos, etc.)
4. Ensure Info.plist has correct usage descriptions
5. Rebuild and resubmit

**Apple's Error URL:** https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api

---

**Document created:** Oct 30, 2025
**Last updated:** Oct 30, 2025
**Fix status:** ✅ Deployed and submitted
