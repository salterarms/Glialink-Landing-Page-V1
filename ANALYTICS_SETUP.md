# Glialink Analytics Implementation Guide

This document covers the complete setup of Google Analytics 4 (GA4) and analytics features for the Glialink landing page.

## Table of Contents
1. [GA4 Account Setup](#ga4-account-setup)
2. [Environment Configuration](#environment-configuration)
3. [Using Analytics Dashboard](#using-analytics-dashboard)
4. [Understanding the Tracked Events](#understanding-the-tracked-events)
5. [A/B Testing Setup](#ab-testing-setup)
6. [Backend Integration (Optional)](#backend-integration-optional)
7. [Troubleshooting](#troubleshooting)

---

## GA4 Account Setup

### Step 1: Create Google Analytics Account

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Click **"Start measuring"** button (top-left corner)
3. Fill in your account info:
   - **Account name:** "Glialink"
   - **Data sharing settings:** Check all boxes (optional but recommended)
4. Click **"Next"**

### Step 2: Create a Property

1. **Property name:** "Glialink Landing Page V1"
2. **Reporting timezone:** Select your timezone
3. **Currency:** USD (or your currency)
4. Click **"Next"**

### Step 3: Provide Business Information

1. **Industry category:** Technology or Education
2. **Business size:** Small/Medium
3. **Goals:** Select "Get baseline data" and "Understand audience behavior"
4. Click **"Create"**

### Step 4: Choose Your Platform

1. When prompted, select **"Web"** (not iOS or Android)
2. Enter your website details:
   - **Website URL:** `https://glialink.com` (or `http://localhost:3000` for testing)
   - **Stream name:** "Glialink Landing Page"
3. Click **"Create stream"**

### Step 5: Copy Your Measurement ID

You'll see a screen with your **Measurement ID**. It looks like: `G_XXXXXXXXXX`

**This is the most important value.** Copy it and add to your `.env.local` file:

```bash
NEXT_PUBLIC_GA4_ID=G_XXXXXXXXXX
```

---

## Environment Configuration

### Add GA4 ID to Your Project

1. Open `.env.local` (create it if it doesn't exist) in your project root
2. Add your Measurement ID:
   ```bash
   NEXT_PUBLIC_GA4_ID=G_XXXXXXXXXX
   ```
3. Optionally add backend endpoints:
   ```bash
   NEXT_PUBLIC_FORM_ENDPOINT=https://api.glialink.com/api/signup
   NEXT_PUBLIC_SURVEY_ENDPOINT=https://api.glialink.com/api/survey
   ```

### Restart Your Dev Server

```bash
npm run dev
```

The analytics should now be active. Check the browser console for any warnings.

---

## Using Analytics Dashboard

### Access Your Analytics

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Select your property from the dropdown
3. You're now in the **Home** dashboard

### View Real-time Data

1. In the left sidebar, click **Reports** → **Real-time**
2. This shows live visitors on your site right now
3. You can see events as they happen

### View Traffic Overview

1. Click **Reports** → **Life cycle** → **Acquisition** → **Overview**
2. This shows:
   - Total users
   - Sessions
   - Bounce rate
   - Average session duration

### View Form Submissions

1. Click **Reports** → **Life cycle** → **Conversion**
2. Look for **Events** section
3. Filter for `form_submit_success` to see successful signups

### View Scroll Depth

1. Click **Reports** → **Engagement** → **Events**
2. Select `scroll_depth` from the event dropdown
3. See how many users scrolled to different depths (25%, 50%, 75%, 100%)

---

## Understanding the Tracked Events

The following events are automatically tracked:

| Event | When It Fires | Data Captured |
|-------|--------------|--------------|
| `form_start` | User focuses on email input | variant |
| `form_submit` | User submits email form | email_domain, variant |
| `form_submit_success` | Email successfully sent to backend | variant |
| `form_submit_error` | Email submission fails | variant, error |
| `survey_submit` | User completes survey | career_stage, field, interest_reason, institution_type, variant |
| `copy_link` | User copies share link | variant |
| `hero_cta_click` | User clicks "Get early access" button | variant |
| `scroll_depth` | User scrolls to 25%, 50%, 75%, 100% | scroll_percentage |

### Event Parameters

- **variant:** Which page version the user is seeing (control, v1, v2, etc.)
- **email_domain:** Domain of the email entered (e.g., "mit.edu", "gmail.com")
- **scroll_percentage:** How far down the page the user scrolled
- **career_stage:** Selected from survey (undergrad, grad, postdoc, faculty, etc.)
- **field:** User's research field (from survey)
- **institution_type:** Type of institution (from survey)

---

## A/B Testing Setup

### Option 1: URL Query Parameter (Simplest)

Share different links to different groups:

- **Control group:** `https://glialink.com`
- **V1 testers:** `https://glialink.com?variant=v1`
- **V2 testers:** `https://glialink.com?variant=v2`

All analytics will automatically tag which variant each user saw.

### Option 2: URL Path

Create separate landing page paths:
- `https://glialink.com/control`
- `https://glialink.com/v1`
- `https://glialink.com/v2`

The variant detection automatically picks this up from the URL path.

### Option 3: Random Assignment

Users are randomly assigned to variants. Currently disabled, but you can enable in `VariantInitializer.tsx`:

```typescript
// Uncomment this to enable random assignment:
// const assigned = assignRandomVariant(['control', 'v1', 'v2']);
```

---

## Backend Integration (Optional)

### Why Add a Backend?

Without a backend, form data is only tracked in GA4. With a backend, you get:
- Email addresses stored in your database
- Survey responses linked to emails
- Referrer information
- UTM parameters
- Ability to send follow-up emails

### Database Schema

If you add a backend, store data in this structure:

**Email Signups Table:**
```sql
id: UUID
email: VARCHAR(255)
variant: VARCHAR(50)
utm_source: VARCHAR(100)
utm_medium: VARCHAR(100)
utm_campaign: VARCHAR(100)
referrer: VARCHAR(255)
timestamp: TIMESTAMP
```

**Survey Responses Table:**
```sql
id: UUID
signup_id: UUID (foreign key to email)
career_stage: VARCHAR(50)
field: VARCHAR(255)
interest_reason: VARCHAR(100)
institution_type: VARCHAR(100)
timestamp: TIMESTAMP
```

### API Endpoint Example (Next.js)

Create `src/app/api/signup/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate email
    if (!body.email?.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // TODO: Store in your database
    // await db.emailSignups.create({
    //   email: body.email,
    //   variant: body.variant,
    //   utm_source: body.utm_source,
    //   referrer: body.referrer,
    //   timestamp: new Date(),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

Create `src/app/api/survey/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Store in your database
    // await db.surveyResponses.create({
    //   email: body.email,
    //   career_stage: body.careerStage,
    //   field: body.field,
    //   institution_type: body.institutionType,
    //   timestamp: new Date(),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

Then update `.env.local`:

```bash
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3000/api/signup
NEXT_PUBLIC_SURVEY_ENDPOINT=http://localhost:3000/api/survey
```

---

## Troubleshooting

### Analytics Not Showing Data

1. **Check GA ID is correct**
   - Make sure `NEXT_PUBLIC_GA4_ID` is set in `.env.local`
   - Restart dev server after changing `.env` file

2. **Check GA is loading**
   - Open browser DevTools → Network tab
   - Search for `googletagmanager`
   - Should see successful requests to `gtag.js` and `collect`

3. **Check 24-hour delay**
   - GA4 can take up to 24 hours to show initial data
   - Real-time view updates instantly

4. **Test event manually**
   - Open browser console
   - Run: `window.gtag("event", "scroll_depth", { scroll_percentage: 50 })`
   - Check GA Real-time report

### Variant Not Tracking

1. Make sure URL includes `?variant=v1` or similar
2. Check SessionStorage: `sessionStorage.getItem("assigned_variant")`
3. Open GA Real-time → see if `variant` parameter appears

### Form Data Not Submitting

1. Check browser console for errors
2. Open Network tab → look for POST request to your endpoint
3. Make sure `NEXT_PUBLIC_FORM_ENDPOINT` is set correctly
4. Verify backend endpoint is returning 200 status

### Survey Not Showing

1. Make sure form submission succeeded first
2. Check if `showSurvey` state is being set to `true`
3. Try hardcoding `showSurvey: true` in SignUpForm for testing

---

## GA4 Reports Setup (Optional Advanced)

### Create Custom Events Report

1. In GA4, go to **Reports** → **Create new report**
2. Click the **+** button
3. Add cards for:
   - Event: `form_submit_success` (count users)
   - Event: `scroll_depth` where `scroll_percentage >= 50`
   - Event: `survey_submit` (count users)

### Create Comparison Report (Variants)

1. Create a custom report
2. Add dimension: `variant`
3. Add metrics: `user_count`, `event_count`
4. Filter by event: `form_submit_success`
5. Save as "Variant Performance"

### Create Audience

1. Go to **Admin** → **Audiences**
2. Click **Create audience**
3. Name: "High Engagement Users"
4. Condition: `scroll_depth >= 75`
5. Save

This audience can be used for remarketing ads on Google Ads.

---

## Next Steps

1. ✅ Add GA4 ID to `.env.local`
2. ✅ Restart dev server
3. ✅ Test real-time reporting
4. ✅ Share landing page with test users (use `?variant=v1` for variants)
5. ✅ Monitor scroll_depth and form_submit_success in GA4
6. ✅ (Optional) Set up backend endpoints for data storage
7. ✅ (Optional) Create custom GA4 reports

---

## Questions or Issues?

Check the browser console for errors. GA4 debugging can be enabled by adding to your local URL:

```
https://localhost:3000/?gtm_debug=true
```

This opens the GA debugger console for real-time event tracking.
