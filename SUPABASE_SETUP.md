# Supabase Setup & Integration Guide

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- ✅ PostgreSQL database (fully SQL-compatible)
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Free tier (500MB storage, millions of API calls)
- ✅ Easy scaling
- ✅ Dashboard to view/edit data

---

## Step 1: Get Supabase Credentials

### What Are These Keys?

**`NEXT_PUBLIC_SUPABASE_URL`** (Public, safe to expose)
- Your Supabase project's base URL
- Format: `https://[project-id].supabase.co`
- Used by frontend to know where your database is
- Like a home address - tells clients where to connect

**`SUPABASE_SERVICE_ROLE_KEY`** (Secret, NEVER expose)
- Admin API key with full database access
- Format: Long JWT token starting with `eyJhbGciOi...`
- **NEVER** put this in frontend code
- Only use in server routes (`/api/*`)
- Like master password - full control of database

**Note:** These are NOT the same as GA4 API keys. Supabase keys are database credentials.

### Find Your Keys

1. Go to **[supabase.com](https://supabase.com)**
2. Click your project name
3. Click **Settings** (bottom left of sidebar)
4. Click **API** (under Configuration)
5. You'll see:
   - **Project URL** → Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys** section:
     - **anon key** (publicly safe) - we won't use this
     - **service_role** (secret!) → Copy this for `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: Create Database Tables

### In Supabase Dashboard

1. Go to **[supabase.com](https://supabase.com)** → Your project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste this SQL and click **Run**:

```sql
-- Create email_signups table
CREATE TABLE email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  variant VARCHAR(50),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast email lookups
CREATE INDEX idx_email_signups_email ON email_signups(email);
CREATE INDEX idx_email_signups_created ON email_signups(created_at DESC);

-- Create survey_responses table (flexible JSONB for responses)
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  responses JSONB,
  variant VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast email lookups
CREATE INDEX idx_survey_responses_email ON survey_responses(email);
CREATE INDEX idx_survey_responses_created ON survey_responses(created_at DESC);

-- Enable Row Level Security for security
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for form submissions)
CREATE POLICY "Allow anonymous inserts on email_signups" ON email_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on survey_responses" ON survey_responses
  FOR INSERT
  WITH CHECK (true);
```

5. Check that tables appear in **Table Editor** (left sidebar)

---

## Step 3: Update Environment Variables

### Local Development

Create `.env.local` (never commit this):

```bash
# Google Analytics
NEXT_PUBLIC_GA4_ID=G-VWSTLSTTM4

# Supabase (from Step 1 above)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Form endpoints
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3000/api/signup
NEXT_PUBLIC_SURVEY_ENDPOINT=http://localhost:3000/api/survey
```

Replace:
- `your-project-id` with your actual Supabase project ID
- The long token with your actual Service Role Key

### Production (Vercel)

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Select project `glialink-landing-page-v1`
3. Click **Settings** → **Environment Variables**
4. Add each variable:

```
Name: NEXT_PUBLIC_GA4_ID
Value: G-VWSTLSTTM4
Environments: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: Production, Preview, Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_FORM_ENDPOINT
Value: https://glialink-landing-page-v1.vercel.app/api/signup
Environments: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SURVEY_ENDPOINT
Value: https://glialink-landing-page-v1.vercel.app/api/survey
Environments: Production, Preview, Development
```

5. Click **Save** for each
6. Go to **Deployments** tab and click the three dots on latest deployment
7. Click **Redeploy** to apply new variables

---

## Step 4: Install Supabase Client

Run in your project:

```bash
npm install @supabase/supabase-js
```

---

## Step 5: Implement API Routes

### Create `/api/signup` Route

Your `src/app/api/signup/route.ts` should already exist. Update it:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email,
          variant: body.variant || 'control',
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          utm_term: body.utm_term || null,
          utm_content: body.utm_content || null,
          referrer: body.referrer || null,
          user_agent: body.user_agent || null,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`✅ Signup saved: ${email}`);

    return NextResponse.json(
      {
        success: true,
        id: data[0].id,
        email: data[0].email,
        timestamp: data[0].created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving signup:', error);
    return NextResponse.json(
      { error: 'Failed to save signup' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}
```

### Create `/api/survey` Route

Your `src/app/api/survey/route.ts` should already exist. Update it:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // Build flexible responses object
    const responses = {
      careerStage: body.careerStage,
      field: body.field,
      interestReason: body.interestReason,
      institutionType: body.institutionType,
      // Any additional fields are automatically stored
      ...Object.entries(body).reduce((acc, [key, value]) => {
        if (!['email', 'variant', 'timestamp'].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>),
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          email,
          responses,
          variant: body.variant || 'control',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`✅ Survey saved for: ${email}`);

    return NextResponse.json(
      {
        success: true,
        id: data[0].id,
        email: data[0].email,
        timestamp: data[0].created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}
```

---

## Step 6: Test Locally

### Start Dev Server

```bash
npm run dev
```

### Test Email Signup

1. Open `http://localhost:3000`
2. Scroll to form
3. Enter test email: `test@example.com`
4. Click "Get early access"
5. Check Supabase:
   - Go to supabase.com → Your project
   - Click **Table Editor** → **email_signups**
   - Should see your test email there!

### Test Survey

1. Complete the form from above
2. Survey form should appear
3. Fill it out and submit
4. Check Supabase:
   - Go to **Table Editor** → **survey_responses**
   - Should see your survey response with all answers in the `responses` column

### Monitor in DevTools

While testing:
1. Open DevTools (F12)
2. **Console** tab - should see no errors
3. **Network** tab - look for POST requests to `/api/signup` and `/api/survey`
4. Click on request → **Response** tab - should see `{ "success": true }`

---

## Testing on Production (Vercel)

### Deploy

After setting environment variables in Vercel:

1. Go to **Deployments** tab
2. Click three dots on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (should take 1-2 min)

### Test Production Site

1. Go to your production URL: `https://glialink-landing-page-v1.vercel.app`
2. Test email form same as above
3. Check Supabase for new entries

### Monitor GA4

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Select your property
3. Click **Reports** → **Real-time**
4. You should see live events as you interact with the site

---

## Viewing Data in Supabase

### Option 1: Table Editor (Easiest)

1. Go to **supabase.com** → Your project
2. Click **Table Editor** (left sidebar)
3. Click **email_signups** table
4. Browse all signups
5. Click on a row to see all fields
6. Click on **survey_responses** to see survey data

### Option 2: SQL Queries

1. Go to **SQL Editor**
2. Click **New Query**
3. Write queries like:

**Get all signups:**
```sql
SELECT * FROM email_signups ORDER BY created_at DESC;
```

**Get signups from LinkedIn:**
```sql
SELECT email, created_at, utm_source FROM email_signups 
WHERE utm_source = 'linkedin' 
ORDER BY created_at DESC;
```

**Get survey responses:**
```sql
SELECT email, responses, created_at FROM survey_responses 
ORDER BY created_at DESC;
```

**Get most common career stages:**
```sql
SELECT 
  responses->>'careerStage' as career_stage,
  COUNT(*) as count
FROM survey_responses
GROUP BY responses->>'careerStage'
ORDER BY count DESC;
```

### Option 3: Export Data

1. Go to **Table Editor** → **email_signups**
2. Click three dots (top right) → **Download as CSV**
3. Save to your computer

---

## Troubleshooting

### "Cannot find module @supabase/supabase-js"

You need to install the package:

```bash
npm install @supabase/supabase-js
npm run dev
```

### "Invalid API key" or "Authentication failed"

The `SUPABASE_SERVICE_ROLE_KEY` is wrong:

1. Go to supabase.com → Your project
2. Settings → API
3. Copy the **service_role** key (not the anon key)
4. Update `.env.local` and Vercel environment variables

### "Form submits but no data in database"

1. Check environment variables are set:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Check browser DevTools Network tab:
   - Find POST request to `/api/signup`
   - Check the **Response** tab
   - Should show `{ "success": true }`

4. Check Vercel logs:
   - Go to Vercel dashboard
   - Click your project
   - Go to **Deployments** → Latest → **Logs**
   - Look for any error messages

### "Supabase table not found"

The tables weren't created. Repeat Step 2:

1. Go to supabase.com → Your project
2. SQL Editor → New Query
3. Paste the full SQL from Step 2
4. Click Run
5. Check Table Editor shows both tables

### "Database connection timeout"

Supabase might be starting up. Wait 30 seconds and try again.

---

## Key Features of This Setup

### ✅ Flexible Survey Questions

Add new survey questions anytime without database changes:

```typescript
// Current
{ careerStage: "grad", field: "Neuroscience", ... }

// Later add new questions
{ 
  careerStage: "grad", 
  field: "Neuroscience",
  yearsExperience: "3-5",  // ← New!
  fundingSource: "NSF"      // ← New!
}
// No database migration needed!
```

### ✅ Variant Tracking

Compare performance between A/B variants:

```sql
SELECT 
  variant,
  COUNT(*) as signups
FROM email_signups
GROUP BY variant;
```

### ✅ UTM Analysis

Track which marketing campaigns work best:

```sql
SELECT 
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(*) as count
FROM email_signups
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY count DESC;
```

### ✅ Referrer Tracking

See where traffic comes from:

```sql
SELECT 
  referrer,
  COUNT(*) as count
FROM email_signups
GROUP BY referrer
ORDER BY count DESC;
```

---

## Security Notes

### API Key Security

- ✅ `NEXT_PUBLIC_SUPABASE_URL` can be public (no sensitive data)
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` MUST stay secret:
  - Never commit to git
  - Never expose in client code
  - Only use in server routes (`/api/*`)
  - Treat like master password

### Row Level Security

Tables have RLS enabled with policies that:
- Allow anonymous inserts (for form submissions)
- Prevent unauthorized reads/deletes

### Best Practices

1. ✅ Use Service Role Key only in server routes
2. ✅ Validate all input in API routes
3. ✅ Sanitize email addresses
4. ✅ Log submissions for debugging
5. ✅ Monitor Supabase dashboard for issues

---

## Next Steps

1. ✅ Install package: `npm install @supabase/supabase-js`
2. ✅ Update API routes (signup & survey)
3. ✅ Test locally with `.env.local`
4. ✅ Deploy to Vercel with environment variables
5. ✅ Test on production URL
6. ✅ Monitor data in Supabase dashboard
7. ✅ Create GA4 custom reports

You're now fully set up with Supabase! 🚀

---

## Quick Reference

| Task | Location |
|------|----------|
| View signups | supabase.com → Table Editor → email_signups |
| View surveys | supabase.com → Table Editor → survey_responses |
| Query data | supabase.com → SQL Editor |
| Export CSV | supabase.com → Table Editor → (three dots) → Download |
| Check API logs | supabase.com → Logs → API Activity |
| Monitor usage | supabase.com → Usage (shows API calls, storage) |
