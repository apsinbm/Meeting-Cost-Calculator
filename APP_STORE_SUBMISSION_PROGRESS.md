# App Store Submission Progress - Meeting Cost Calculator

**Last Updated:** Oct 17, 2025 at 5:29 PM

## Current Status

- **App Version:** 1.0.12 with Build 1.0.13 (18)
- **Build Number:** 18
- **Current State:** Waiting for Apple Review (Resubmission #2)
- **Submitted:** Oct 17, 2025 at 5:29 PM
- **Submission ID:** dc25b8c1-fe0c-494c-b984-6f9ba14fa743

## Build Information

### Current Build (Resubmission #2 - Oct 17)
- **Version:** 1.0.13
- **Build Number:** 18
- **IPA URL:** https://expo.dev/artifacts/eas/oRaXzXvPbMp5S641JXW7wZ.ipa
- **Build ID:** b906a1df-4a8f-4580-b994-3792ade8857d
- **EAS Build Command:** `eas build --platform ios --non-interactive`
- **Upload Method:** xcrun altool (iTMSTransporter)
- **Upload Command:** `xcrun altool --upload-app --type ios --file ~/Downloads/MeetingCostCalculator-v1.0.13-build18.ipa --username singleton33@yahoo.com --password [APP_SPECIFIC_PASSWORD]`
- **Node Version:** 20
- **Bundle ID:** com.aps.meetingcostcalculator

### Previous Build (Rejected)
- **Version:** 1.0.12
- **Build Number:** 17
- **IPA URL:** https://expo.dev/artifacts/eas/w2BuFK4KK13pixN29E3z3n.ipa
- **Rejection Date:** Oct 17, 2025 at 2:29 PM
- **Submission ID (Rejected):** ac4ab9b0-a1c8-4c76-84c2-c52d89df1dab

## Apple Rejection #1 - Oct 17, 2025 at 2:29 PM

### Rejection Reason: Guideline 5.1.1 - Privacy - Data Collection and Storage

**Issue #1: Permission Button Text**
- **Problem:** Permission request screen had a button labeled "Grant Access" before the system permission dialog
- **Apple's Feedback:** Use neutral button text like "Continue" or "Next" instead
- **Root Cause:** Custom UI button before system permission request violated user control principles
- **File:** `src/screens/Today/TodayScreen.js:376`
- **Fix Applied:** Changed button text from `"Grant Access"` to `"Continue"`

**Issue #2: Vague Reminders Purpose String**
- **Problem:** NSRemindersUsageDescription was too vague and didn't provide specific usage example
- **Old String:** "Meeting Cost Calculator uses reminders to send you notifications when meetings reach milestone durations..."
- **Apple's Feedback:** Must clearly explain HOW the app uses reminders with a specific example
- **File:** `app.json:31`
- **Fix Applied:** Updated to: `"This app accesses your reminders to send you milestone notifications during active meetings. For example, when a meeting reaches 15 minutes, you'll receive a notification showing the cost accumulated so far, helping you make decisions about meeting efficiency."`

### Resolution Steps (Oct 17)

1. ✅ Changed button text in TodayScreen.js from "Grant Access" to "Continue"
2. ✅ Updated NSRemindersUsageDescription in app.json with specific example
3. ✅ Bumped version from 1.0.12 to 1.0.13
4. ✅ Committed changes: `758c7c2` and `c519b45`
5. ✅ Pushed to GitHub
6. ✅ Built new EAS Build #18
7. ✅ Verified Build #18 signature (properly signed with Team ID R78YN38525)
8. ✅ Downloaded IPA to ~/Downloads/MeetingCostCalculator-v1.0.13-build18.ipa
9. ✅ Uploaded IPA using xcrun altool
10. ✅ Attached Build 18 to version 1.0.12 in App Store Connect
11. ✅ Added review notes explaining fixes
12. ✅ Submitted for review (Oct 17, 5:29 PM)

### App Review Notes Added

```
Resubmission addressing Guideline 5.1.1 rejection:

1. Changed permission request button text from "Grant Access" to "Continue" to use neutral language that respects user control

2. Updated NSRemindersUsageDescription to clearly explain the feature with a specific example: "This app accesses your reminders to send you milestone notifications during active meetings. For example, when a meeting reaches 15 minutes, you'll receive a notification showing the cost accumulated so far, helping you make decisions about meeting efficiency."

All privacy guideline issues have been resolved in Build 1.0.13 (18).
```

---

## Critical Issue: RESOLVED - IPA Signing Confusion

**Problem:** Initially appeared that EAS Build was producing unsigned IPAs due to codesign verification errors.

**Resolution (Oct 17, 2025):** Expo Support clarified that the IPA is a **zip archive** that must be extracted before verification. The builds ARE properly signed.

**Correct Verification Process:**
```bash
unzip meeting-cost-calculator-build17.ipa
codesign -dv "Payload/MeetingCostCalculator.app"
Result: ✅ Properly signed with Team ID R78YN38525
```

**Verification Confirmed:**
- Build #17 is correctly signed
- Bundle ID: com.aps.meetingcostcalculator
- Team ID: R78YN38525
- Signed: Oct 16, 2025 at 8:15:01 PM
- Status: **READY FOR APP STORE**

## Actions Taken

1. ✅ Created Codemagic CI/CD integration with GitHub
2. ✅ Generated Expo personal access token: `PQlrElmgcsZW2abD25dnsoUiI8O8Cje3Ieku8Q9Y`
3. ✅ Built version 1.0.12 (Build #17) successfully
4. ✅ Submitted app to App Store (Oct 16, 8:38 PM)
5. ✅ **Contacted Expo support** about signing concerns
6. ✅ **Expo Support Response (Oct 17):** Confirmed build IS properly signed - IPA must be extracted before verification
7. ✅ **Verified Build #17:** Confirmed properly signed with Team ID R78YN38525
8. ✅ **Fixed iPad screenshot issues** (Oct 17) - Uploaded proper iPad screenshots to App Store Connect

## Pending Actions

### Immediate (Next 24-48 hours)

1. **Check App Store Connect Status**
   - Go to https://appstoreconnect.apple.com
   - Check current submission status for build #17
   - Possible states:
     - ✅ "Waiting for Review" - Everything is fine, just wait
     - ✅ "In Review" - Apple is actively reviewing
     - ✅ "Pending Developer Release" - APPROVED! Ready to release
     - ❌ "Rejected" - See resolution steps below

2. **Wait for Apple Review Result**
   - Time frame: 24-48 hours from submission (Oct 16, 8:38 PM)
   - Expected outcome: **APPROVAL** (build is properly signed)
   - Watch email for updates from App Store Connect

### If Apple Rejects (Unlikely Now)

Since the build IS properly signed, rejection is unlikely. However, if rejected for other reasons:

1. Go to App Store Connect → Resolution Center
2. Read the rejection reason carefully
3. Address the specific issue mentioned
4. Resubmit with fixes

## Credentials

- **Expo Account:** patopopo
- **Apple Developer Account:** singleton33@yahoo.com
- **Bundle ID:** com.aps.meetingcostcalculator
- **Team ID:** R78YN38525
- **Distribution Certificate Serial:** 595369F65FAD7BE10F108836E1220774 (expires Oct 15, 2026)
- **Provisioning Profile ID:** 9WA8TBLZ7J (updated 3 hours ago)

## Key Decisions Made

1. **Chose not to pursue local builds** - Requires Fastlane/CocoaPods installation which had permission issues
2. **Chose Codemagic over local build** - Simplified CI/CD approach (hit EXPO_TOKEN issues)
3. **Reverted to direct EAS CLI** - Used `eas build --platform ios --non-interactive` which worked for auth but produced unsigned IPA
4. **Submitted unsigned IPA to Apple** - Strategy: Appeal if rejected explaining infrastructure issue

## Alternative Approaches (if needed)

1. **Local Xcode build** - Install Fastlane locally and build with `eas build --platform ios --local`
2. **Different build service** - Bitrise or other CI/CD providers
3. **TestFlight-only release** - Deploy to internal testing instead of App Store

## Files Modified

- `app.json` - Removed notifications plugin to fix entitlements issue
- `codemagic.yaml` - CI/CD configuration for Codemagic/EAS integration
- Various screen files updated in `src/screens/`

## GitHub Branch

- **Main branch:** master
- **Latest commit:** 1687168 "Fix EXPO_TOKEN variable reference"
- **Repository:** https://github.com/apsinbm/Meeting-Cost-Calculator

## Summary & Next Steps

**STATUS: BUILD IS GOOD - WAITING FOR APPLE REVIEW ✅**

The "unsigned IPA" issue was a **misunderstanding**. IPAs are zip archives that must be extracted before verification. Build #17 is properly signed and ready for App Store.

**What to Do Now:**

1. **Check App Store Connect** at https://appstoreconnect.apple.com
   - Sign in with singleton33@yahoo.com
   - Check your app's current status

2. **Wait for Apple Review**
   - Expected timeframe: 24-48 hours from Oct 16, 8:38 PM
   - You'll receive email updates

3. **If Approved:**
   - Release the app to App Store
   - Celebrate! 🎉

4. **If Rejected:**
   - Read the rejection reason carefully
   - Address specific issues mentioned
   - Build is properly signed, so unlikely to be signing-related

**Key Learning:**
To verify an IPA's signature correctly:
```bash
unzip your-app.ipa
codesign -dv "Payload/YourApp.app"
```
NOT: `codesign -v your-app.ipa` (checks the zip, not the app)

---

---

## Quick Reference: If Rejected Again

### Common Rejection Reasons & Fixes

**If rejected for permission issues again:**
1. Check `src/screens/Today/TodayScreen.js` for button text (should be "Continue" or "Next", NOT "Grant Access")
2. Verify `NSRemindersUsageDescription` in `app.json` is specific and includes an example
3. Ensure custom permission UI doesn't pressure users before system dialog appears

**If rejected for other Guideline 5.1.1 issues:**
- Check `NSCalendarsUsageDescription` in `app.json` - must also be specific with example
- Check all purpose strings for Calendar, Contacts, Photos, etc.
- Example format: "[Feature name] uses [resource] to [specific action]. For example, [concrete example]."

**General App Store Process:**
1. Fix code/config → commit → push to GitHub
2. Build with EAS: `eas build --platform ios --non-interactive`
3. Wait 5-15 min for build to process in TestFlight
4. Download IPA: https://expo.dev/accounts/patopopo/projects/meeting-cost-calculator/builds
5. Upload with: `xcrun altool --upload-app --type ios --file [IPA_PATH] --username singleton33@yahoo.com --password [APP_SPECIFIC_PASSWORD]`
6. Go to App Store Connect Distribution tab
7. Add/change build to newest build
8. Add review notes explaining fixes
9. Click "Add for Review" → "Submit for Review"

### Important Credentials

- **Apple ID:** singleton33@yahoo.com
- **Bundle ID:** com.aps.meetingcostcalculator
- **Team ID:** R78YN38525
- **Expo Account:** patopopo
- **GitHub:** https://github.com/apsinbm/Meeting-Cost-Calculator
- **App Store Connect:** https://appstoreconnect.apple.com

### Key Files to Check

- `src/screens/Today/TodayScreen.js` - Permission UI button text
- `app.json` - All purpose strings (NSRemindersUsageDescription, NSCalendarsUsageDescription)
- `package.json` - Version numbers
- `eas.json` - Build and submit configuration

---

## Faster Upload Methods for Next Time

### ⚡ Recommended: xcrun altool (FASTEST - What We Used)

**Status:** ✅ WORKS - Already tested successfully

**Advantages:**
- Already installed on your Mac (part of Xcode)
- No app store download needed
- Fastest method (11.8 seconds for 16MB IPA)
- Works offline
- Reliable and direct

**Command:**
```bash
xcrun altool --upload-app \
  --type ios \
  --file ~/Downloads/MeetingCostCalculator-v1.0.13-build18.ipa \
  --username singleton33@yahoo.com \
  --password "YOUR-APP-SPECIFIC-PASSWORD"
```

**Why this is best:**
- Built into Xcode (no extra downloads)
- Works every time (unlike EAS Submit which had outages)
- Fastest upload speed
- Direct to Apple (no middleman)

### Alternative 1: Download Transporter Without App Store

**Problem:** Mac App Store won't download Transporter for you

**Solution #1: Direct from Apple (Requires macOS Monterey+)**
```bash
# Install via Mac App Store command-line
mas install 1450874784
```
(Note: Requires `mas` CLI installed: `brew install mas`)

**Solution #2: Manual Installation via Homebrew**
```bash
# Alternative: Try installing via homebrew cask (if available)
brew tap --custom-home homebrew/cask
brew install --cask transporter
```

**Solution #3: Download Direct from Apple**
1. Visit: https://apps.apple.com/us/app/transporter/id1450874784
2. Right-click "View in Mac App Store"
3. Look for direct download link
4. May require creating temporary Mac App Store account

**Solution #4: Use Previous Versions**
If you have another Mac with Transporter installed:
- Copy from: `/Applications/Transporter.app`
- Paste to your Mac: `/Applications/Transporter.app`
- Right-click → Open to approve

### Alternative 2: Web Upload via App Store Connect

**Status:** ✅ WORKS - But slower UI

**Steps:**
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → Your App → TestFlight tab
3. Look for "Upload Build" or "New Build" section
4. Drag/drop IPA directly into browser
5. Wait for processing

**Pros:** No tools needed
**Cons:** Slower, depends on browser stability

### Alternative 3: Xcode Direct Upload (If Building Locally)

**Status:** ⚠️ Complex - not recommended for EAS builds

```bash
# If you were doing local Xcode builds:
xcode-build-for-app-store -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release
```

Then upload via Xcode's Archive organizer

### Why NOT to Use EAS Submit

**Issues Encountered (Oct 17, 2025):**
- EAS Submit had service outage ("Increased iOS submission times")
- Required interactive mode for API key setup
- Added unnecessary middleman
- Much slower than direct upload

**When to use EAS Submit:** Never for production (use xcrun altool instead)

---

## Complete Fast Upload Workflow (For Next Time)

### Step 1: Build
```bash
eas build --platform ios --non-interactive
```
(Wait ~3-5 minutes for build to complete)

### Step 2: Verify Build is Ready
Go to: https://expo.dev/accounts/patopopo/projects/meeting-cost-calculator/builds
Look for status: **"Complete"**

### Step 3: Download IPA (5-10 seconds)
```bash
cd ~/Downloads
curl -L -o MyApp-v1.0.13-build18.ipa "https://expo.dev/artifacts/eas/[BUILD_ID].ipa"
```

### Step 4: Upload Directly to App Store (Fastest - 11 seconds)
```bash
xcrun altool --upload-app \
  --type ios \
  --file ~/Downloads/MyApp-v1.0.13-build18.ipa \
  --username singleton33@yahoo.com \
  --password "kuqw-cufs-jkut-ilji"
```

**Total time:** ~10-15 minutes (vs 45+ minutes with EAS Submit complications)

---

## App-Specific Password (For Uploads)

**What it is:** A one-time password specifically for app uploads (NOT your Apple ID password)

**Where to get it:**
1. Go to: https://appleid.apple.com
2. Sign in with `singleton33@yahoo.com`
3. Click **Security** → **App-Specific Passwords**
4. Click **"+"**
5. Label: "App Store Upload"
6. Copy the generated password (format: `xxxx-xxxx-xxxx-xxxx`)

**Current password (saved for quick reference):** `kuqw-cufs-jkut-ilji`

**Security note:** This password is only for uploads, not your main Apple ID

---

## Troubleshooting Upload Issues

**If xcrun altool fails:**
```bash
# Verify Xcode is installed
xcode-select --print-path
# Should output: /Applications/Xcode.app/Contents/Developer

# If not, install Command Line Tools
xcode-select --install
```

**If "Invalid credentials":**
- Verify app-specific password (not Apple ID password)
- Regenerate a new app-specific password
- Try again with new password

**If "Couldn't communicate with server":**
- Check internet connection
- Verify Apple servers are up: https://developer.apple.com/system-status/
- Wait 5 minutes and retry

---

**Contact Info:**
- Expo Help: https://expo.dev/help
- App Store Connect: https://appstoreconnect.apple.com
- Expo Build Dashboard: https://expo.dev/accounts/patopopo/projects/meeting-cost-calculator/builds
- Apple Developer: https://developer.apple.com/app-store/review/guidelines/
