# Step-by-Step App Store Launch Guide

## Current Status: App is Building ✨

Your app is currently rebuilding with all the new App Store compliance features. While it builds (5-10 minutes), let's prepare everything else.

---

## Step 1: Update Your Contact Information (DO THIS NOW - 5 minutes)

You need to replace placeholder text in the legal documents with your actual information.

### What You Need
- Your email address for support
- Your website (or create a simple one later)
- Your full name or company name

### Files to Update

#### 1. PRIVACY_POLICY.md
Find and replace these placeholders:
- `[YOUR CONTACT EMAIL]` → info@atlanticground.com
- `[YOUR WEBSITE]` → https://atlanticground.com
- `[YOUR SUPPORT URL]` → info@atlanticground.com

#### 2. TERMS_OF_SERVICE.md
Find and replace the same placeholders:
- `[YOUR CONTACT EMAIL]` → info@atlanticground.com
- `[YOUR WEBSITE]` → https://atlanticground.com
- `[YOUR SUPPORT URL]` → info@atlanticground.com

**Example**:
```
Before: **Email**: [YOUR CONTACT EMAIL]
After:  **Email**: info@atlanticground.com
```

---

## Step 2: Set Up GitHub Pages for Legal Documents (15 minutes)

You need to host your Privacy Policy and Terms of Service online so Apple can review them. GitHub Pages is FREE and easy.

### Instructions

#### A. Create a New GitHub Repository
1. Go to https://github.com/new
2. Repository name: `meeting-cost-calculator-legal`
3. Description: "Privacy Policy and Terms of Service for Meeting Cost Calculator"
4. Make it **Public** (required for GitHub Pages)
5. Click "Create repository"

#### B. Upload Your Legal Documents
1. In your new repository, click "Add file" → "Upload files"
2. Drag these TWO files from your project folder:
   - `PRIVACY_POLICY.md`
   - `TERMS_OF_SERVICE.md`
3. Click "Commit changes"

#### C. Enable GitHub Pages
1. In your repository, click "Settings" tab
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 2-3 minutes for it to build
6. You'll see a message: "Your site is published at https://[your-username].github.io/meeting-cost-calculator-legal/"

#### D. Get Your URLs
Your legal documents will be at:
- **Privacy Policy**: `https://[your-username].github.io/meeting-cost-calculator-legal/PRIVACY_POLICY`
- **Terms of Service**: `https://[your-username].github.io/meeting-cost-calculator-legal/TERMS_OF_SERVICE`

**Important**: Test these URLs in a browser to make sure they work!

---

## Step 3: Test Your App (30 minutes)

Once the app finishes building and opens on the simulator, test these new features:

### A. Privacy Policy Screen
1. Open the app
2. Go to **Settings** tab (bottom right)
3. Scroll to "Legal" section
4. Tap "Privacy Policy"
5. ✅ Verify it displays correctly
6. Tap back button to return

### B. Terms of Service Screen
1. In Settings, tap "Terms of Service"
2. ✅ Verify it displays correctly
3. Tap back button to return

### C. Calendar Permissions
1. In Settings → Privacy & Permissions section
2. Tap "Calendar Access"
3. ✅ Verify alert shows with instructions
4. Tap "Open Settings" to see it works
5. Return to app

### D. Export All Data
1. First, make sure you have some data:
   - Add at least 1 employee
   - Start and end at least 1 meeting
2. In Settings → Privacy & Permissions
3. Tap "Export All Data"
4. ✅ Verify sharing sheet appears with CSV files
5. You can share to Files, Mail, etc.

### E. Delete All Data
1. In Settings → Privacy & Permissions
2. Tap "Delete All Data"
3. ✅ Verify warning alert appears
4. Tap "Cancel" (don't actually delete yet)
5. ✅ Verify it requires confirmation

### F. Overall App Test
Test the full flow:
1. ✅ Add an employee
2. ✅ Start a meeting
3. ✅ Track for 30 seconds
4. ✅ End meeting
5. ✅ View history
6. ✅ Check all tabs work
7. ✅ No crashes!

---

## Step 4: Take Screenshots (20 minutes)

You need 5 screenshots of your app for the App Store. Take them on the iPhone simulator.

### Screenshot Dimensions Needed
- **6.5" Display**: iPhone 14 Pro Max, 15 Pro Max (1284 x 2778 px)
- **5.5" Display**: iPhone 8 Plus (1242 x 2208 px)

### How to Take Screenshots on Simulator
1. Open the simulator
2. Navigate to the screen you want
3. Press `Cmd + S` to save screenshot
4. Screenshots save to your Desktop automatically

### 5 Required Screenshots (in order)

#### Screenshot 1: Active Meeting Screen
- **Purpose**: Show the main feature - real-time cost tracking
- **Setup**:
  1. Add an employee first
  2. Start a meeting
  3. Let it run for 30 seconds so cost shows clearly
  4. Take screenshot showing large cost display
- **Key Elements**: Large dollar amount, timer, attendees

#### Screenshot 2: Today Screen with Calendar Meetings
- **Purpose**: Show calendar integration
- **Setup**:
  1. Make sure you have calendar events
  2. Go to Today tab
  3. Show list of meetings with costs
- **Key Elements**: Meeting cards, costs, "Start Meeting" button

#### Screenshot 3: Employee Management
- **Purpose**: Show how to add employees
- **Setup**:
  1. Go to Settings → Manage Employees
  2. Show employee list OR add employee screen
  3. Show the cost preview
- **Key Elements**: Employee data, cost breakdown

#### Screenshot 4: Meeting History
- **Purpose**: Show cost analysis
- **Setup**:
  1. Have at least 3 completed meetings
  2. Go to History tab
  3. Show meeting list with costs
- **Key Elements**: Summary stats, meeting cards, badges

#### Screenshot 5: Meeting Cost Predictor
- **Purpose**: Show prediction feature
- **Setup**:
  1. Go to Settings → scroll down
  2. Tap "Meeting Cost Predictor" (or access from Today screen)
  3. Select attendees and duration
  4. Show predicted cost
- **Key Elements**: Duration options, cost prediction, attendee list

### Screenshot Tips
- Use actual data (real names, realistic salaries)
- Make sure status bar shows good signal, battery, time
- Fill the screen - make it look professional
- No errors or empty states (except where appropriate)
- Good contrast and readable text

### Take Screenshots for BOTH Sizes
You'll need to:
1. Take screenshots on iPhone 14 Pro Max simulator (6.5")
2. Take same 5 screenshots on iPhone 8 Plus simulator (5.5")

**To switch simulators**:
1. Stop the current app
2. Open Xcode → Window → Devices and Simulators
3. Add iPhone 8 Plus if not available
4. Run: `npx expo run:ios` and select iPhone 8 Plus

---

## Step 5: Organize Your Screenshots (10 minutes)

Create a folder structure:

```
MobileApps/
  Meeting-Cost-Calculator/
    AppStoreAssets/
      Screenshots/
        6.5-inch/
          1-active-meeting.png
          2-today-calendar.png
          3-employee-management.png
          4-meeting-history.png
          5-cost-predictor.png
        5.5-inch/
          1-active-meeting.png
          2-today-calendar.png
          3-employee-management.png
          4-meeting-history.png
          5-cost-predictor.png
```

Rename your screenshots with descriptive names so you remember what each one is.

---

## Step 6: Create App Store Metadata Document (10 minutes)

Create a text file with all your App Store information ready to copy/paste.

### Create: AppStoreMetadata.txt

```
APP NAME:
Meeting Cost Calculator

SUBTITLE:
Track Meeting Expenses

KEYWORDS:
meeting cost, productivity, business, time tracker, employee cost, meeting efficiency, salary calculator, business tool

SUPPORT URL:
https://atlanticground.com

PRIVACY POLICY URL:
https://github.com/apsinbm/Meeting-Cost-Calculator/blob/master/PRIVACY_POLICY.md

PROMOTIONAL TEXT (Optional, 170 chars):
Calculate meeting costs in real-time. Track expenses and make data-driven decisions. All data stays on your device - complete privacy guaranteed.

DESCRIPTION:
[Copy the full description from APP_STORE_SUBMISSION_GUIDE.md]

WHAT'S NEW (Version 1.0.0):
Initial release! Calculate meeting costs, track expenses in real-time, and make data-driven decisions. Complete privacy - all data stays on your device.

COPYRIGHT:
2025 Atlantic Ground

CONTACT EMAIL:
info@atlanticground.com

CONTACT PHONE:
[YOUR PHONE NUMBER]
```

---

## Step 7: Pay for Apple Developer Program ($99/year)

Now that everything is ready, it's time to pay Apple!

### Instructions
1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID (the one you want to use)
3. Click "Enroll"
4. Choose:
   - **Individual** if it's just you
   - **Organization** if it's a company (requires D-U-N-S number)
5. Accept the Apple Developer Agreement
6. Pay $99 USD (annual subscription)
7. Wait for approval (usually instant, but can take up to 24 hours)

### After Approval
You'll receive an email: "Welcome to the Apple Developer Program"

---

## Step 8: Create App in App Store Connect (20 minutes)

### A. Access App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click "My Apps"
4. Click the "+" button
5. Select "New App"

### B. Fill Out Initial Information
- **Platform**: iOS
- **Name**: Meeting Cost Calculator
- **Primary Language**: English (U.S.)
- **Bundle ID**: Select `com.meetingcostcalculator.app` (from dropdown)
  - If not there, you need to register it first in "Certificates, Identifiers & Profiles"
- **SKU**: meetingcostcalculator (unique identifier, any string you want)
- **User Access**: Full Access

Click "Create"

### C. Fill Out App Information Tab

#### 1. Localizable Information
- **Name**: Meeting Cost Calculator
- **Subtitle**: Track Meeting Expenses
- **Privacy Policy URL**: [Your GitHub Pages Privacy URL]

#### 2. General Information
- **Bundle ID**: com.meetingcostcalculator.app
- **Category**:
  - Primary: Business
  - Secondary: Productivity
- **Content Rights**: Check the box if you own all rights
- **Age Rating**: Click "Edit" and answer questions
  - All should be "None" → Result: 4+

#### 3. App Review Information
- **Contact Information**:
  - First Name: [Your first name]
  - Last Name: [Your last name]
  - Phone: [Your phone]
  - Email: [Your email]
- **Notes**: Copy the "Notes for Reviewer" from APP_STORE_SUBMISSION_GUIDE.md

### D. Fill Out Pricing and Availability
- **Price**: Free (or select price tier)
- **Availability**: All territories (or select specific countries)
- Click "Save"

### E. Add Version 1.0 Information

Click "1.0 Prepare for Submission" on the left

#### 1. App Store Localization
- **Description**: Copy from your AppStoreMetadata.txt
- **Keywords**: Copy from your AppStoreMetadata.txt
- **Support URL**: Your website or GitHub Pages URL
- **Marketing URL**: (Optional) Leave blank for now

#### 2. Screenshots and App Previews
Upload your screenshots:
- **6.5" Display**: Upload all 5 screenshots
- **5.5" Display**: Upload all 5 screenshots

Drag files in the order you want them displayed (most important first)

#### 3. Promotional Text (Optional)
Copy from your AppStoreMetadata.txt

#### 4. App Icon
- This is pulled from your app automatically
- Verify it shows correctly (1024x1024)

---

## Step 9: Answer Privacy Questions (10 minutes)

This is CRITICAL for approval!

### In App Store Connect → App Privacy
1. Click "App Privacy" in the left sidebar
2. Click "Get Started"

### Question 1: Data Collection
**Do you or your third-party partners collect data from this app?**
- Answer: **NO**
- Explanation: "All data is stored locally on the user's device. We have no servers, no analytics, and no data collection."

### Question 2: Data Types
For each category, select "Not Collected":
- Contact Info: Not Collected
- Health & Fitness: Not Collected
- Financial Info: Not Collected *(salary data is local only)*
- Location: Not Collected
- Sensitive Info: Not Collected
- Contacts: Not Collected
- User Content: Not Collected
- Browsing History: Not Collected
- Search History: Not Collected
- Identifiers: Not Collected
- Purchases: Not Collected
- Usage Data: Not Collected
- Diagnostics: Not Collected
- Other Data: Not Collected

Click "Save" and "Publish"

---

## Step 10: Build Production Version (30-60 minutes)

Now you need to create the actual app file to upload to App Store.

### Option A: Using EAS Build (Easiest, Recommended)

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Log in to Expo
```bash
eas login
```

#### 3. Configure EAS
```bash
eas build:configure
```

#### 4. Build for iOS Production
```bash
eas build --platform ios --profile production
```

This builds in the cloud (takes 10-20 minutes). When done, it will give you a download link.

#### 5. Download and Submit
- Download the .ipa file
- Go to App Store Connect → Your App → TestFlight
- Click "+" to add build
- Use Transporter app (download from Mac App Store) to upload .ipa

### Option B: Using Xcode (Traditional Way)

#### 1. Open Xcode Project
```bash
open ios/MeetingCostCalculator.xcworkspace
```

#### 2. Configure Signing
- Click on project name in left panel
- Select "MeetingCostCalculator" target
- Go to "Signing & Capabilities" tab
- Check "Automatically manage signing"
- Select your Apple Developer Team
- Verify Bundle Identifier: `com.meetingcostcalculator.app`

#### 3. Archive the App
- Select "Any iOS Device (arm64)" as destination (top bar)
- Go to menu: Product → Archive
- Wait 5-10 minutes for archive to complete

#### 4. Distribute to App Store
- When archive finishes, window opens automatically
- Click "Distribute App"
- Select "App Store Connect"
- Click "Upload"
- Select your signing certificate
- Click "Upload"
- Wait for upload to complete (5-10 minutes)

---

## Step 11: Submit for Review (10 minutes)

### A. Wait for Build Processing
- After upload, build needs to process (10-30 minutes)
- You'll get email: "Your build is ready for submission"
- Check App Store Connect → TestFlight tab
- Build should show "Ready to Submit"

### B. Add Build to Version
1. Go to "App Store" tab (not TestFlight)
2. Click on "1.0 Prepare for Submission"
3. Scroll to "Build" section
4. Click "+" next to build
5. Select your uploaded build
6. Click "Done"

### C. Final Checks
Go through and verify EVERYTHING is filled out:
- [ ] App name
- [ ] Subtitle
- [ ] Description
- [ ] Keywords
- [ ] Screenshots (both sizes)
- [ ] Privacy policy URL works
- [ ] Support URL works
- [ ] Category selected
- [ ] Age rating set
- [ ] Price set
- [ ] Build selected
- [ ] Privacy questions answered
- [ ] Contact information filled
- [ ] Review notes added

### D. Submit!
1. Click "Save" (top right)
2. Click "Submit for Review" (top right)
3. Confirm submission
4. 🎉 **YOU'RE DONE!**

---

## Step 12: Wait for Review

### Timeline
- **In Review**: Usually 24-48 hours
- **If Approved**: Available on App Store within 24 hours
- **If Rejected**: You'll get email with reason - fix and resubmit

### What to Do While Waiting
1. Test your app more on real devices
2. Prepare marketing materials
3. Set up social media accounts
4. Create a landing page
5. Draft launch announcement
6. Line up beta testers

### Monitoring
- Check App Store Connect regularly
- Watch your email for updates
- Status will change: "Waiting for Review" → "In Review" → "Pending Developer Release" (approved!)

---

## Need Help?

If you get stuck on any step, let me know and I'll help you through it!

### Common Issues

**Issue**: Can't find bundle identifier in App Store Connect
**Solution**: You need to register it first:
1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click "+" to add identifier
3. Select "App IDs"
4. Enter Bundle ID: `com.meetingcostcalculator.app`
5. Enable capabilities (Calendar, etc.)
6. Save

**Issue**: Build upload fails
**Solution**:
- Make sure you're logged into correct Apple Developer account
- Verify bundle ID matches exactly
- Check signing certificates are valid
- Try using EAS Build instead of Xcode

**Issue**: Privacy Policy URL doesn't work
**Solution**:
- Wait 5 minutes after enabling GitHub Pages
- Make sure repository is Public (not Private)
- Test URL in incognito browser window
- Check file name is exactly right (case-sensitive)

---

## Checklist: Ready to Submit?

Before paying Apple $99, make sure you have:

- [ ] App builds and runs without crashes
- [ ] All new features tested (Privacy Policy, Terms, Export, Delete)
- [ ] Legal documents updated with your contact info
- [ ] Privacy Policy and Terms hosted online (GitHub Pages)
- [ ] 5 screenshots taken on 6.5" simulator
- [ ] 5 screenshots taken on 5.5" simulator
- [ ] App Store metadata document created
- [ ] App icon looks good
- [ ] Bundle identifier decided: com.meetingcostcalculator.app
- [ ] Support email address set up

Once ALL of these are ✅, you're ready to pay for Apple Developer Program and submit!

---

**Good luck! You've got this! 🚀**
