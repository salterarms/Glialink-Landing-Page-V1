# Backend Integration Guide: Form & Survey Persistence

## Overview

This guide shows how to set up backend persistence for:
1. **Email signups** — Email + UTM parameters + referrer + variant + timestamp
2. **Survey responses** — Linked to email with flexible survey questions

The architecture is **fully flexible** — you can change form/survey fields later without code changes.

---

## Backend Options Comparison

| Option | Setup Time | Cost | Scalability | Flexibility | Recommended For |
|--------|-----------|------|-------------|------------|-----------------|
| **Vercel Postgres** | 5 min | $0-15/mo | High | High | 🟢 Best for Next.js |
| **Supabase** | 10 min | $0-100/mo | High | Very High | 🟡 Good all-around |
| **Firebase** | 10 min | $0-25/mo | Very High | Medium | 🟡 Good for no-SQL |
| **MongoDB Atlas** | 15 min | $0-57/mo | High | Very High | 🔵 Good for flexibility |
| **PlanetScale** | 15 min | $0-29/mo | High | High | 🔵 MySQL-based |

**Recommendation:** Start with **Vercel Postgres** (same company, easiest setup, free tier)

---

## Option 1: Vercel Postgres (Recommended) ✅

### Step 1: Create Vercel Postgres Database

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Select your project: `glialink-landing-page-v1`
3. Click **Storage** tab (top menu)
4. Click **Create Database** → **Postgres**
5. Name it: `glialink-db`
6. Select region near your users
7. Click **Create**
8. Copy the **Connection String** (you'll need this)

### Step 2: Install Postgres Client

```bash
npm install @vercel/postgres
```

### Step 3: Create Database Schema

Create `scripts/init-db.ts`:

```typescript
import { sql } from '@vercel/postgres';

async function initializeDatabase() {
  try {
    // Create email_signups table
    await sql`
      CREATE TABLE IF NOT EXISTS email_signups (
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
    `;

    // Create index on email for fast lookups
    await sql`CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_signups_created ON email_signups(created_at DESC);`;

    // Create survey_responses table (flexible JSON storage)
    await sql`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        responses JSONB,
        variant VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create index for email lookups
    await sql`CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON survey_responses(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_survey_responses_created ON survey_responses(created_at DESC);`;

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
```

Run it:
```bash
npx ts-node scripts/init-db.ts
```

### Step 4: Create API Routes

Create `src/app/api/signup/route.ts`:

```typescript
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO email_signups (
        email,
        variant,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        referrer,
        user_agent
      )
      VALUES (
        ${body.email},
        ${body.variant || 'control'},
        ${body.utm_source || null},
        ${body.utm_medium || null},
        ${body.utm_campaign || null},
        ${body.utm_term || null},
        ${body.utm_content || null},
        ${body.referrer || null},
        ${body.user_agent || null}
      )
      RETURNING id, email, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        id: result.rows[0].id,
        email: result.rows[0].email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create signup' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/survey/route.ts`:

```typescript
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Store all responses as flexible JSON
    const responses = {
      careerStage: body.careerStage,
      field: body.field,
      interestReason: body.interestReason,
      institutionType: body.institutionType,
      // Any additional fields will be automatically stored
      ...body.additionalFields,
    };

    const result = await sql`
      INSERT INTO survey_responses (
        email,
        responses,
        variant
      )
      VALUES (
        ${body.email},
        ${JSON.stringify(responses)},
        ${body.variant || 'control'}
      )
      RETURNING id, email, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        id: result.rows[0].id,
        email: result.rows[0].email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Survey error:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}
```

### Step 5: Update Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**:

Add:
```
POSTGRES_URL=<your connection string from Step 1>
```

Or if already set, just update `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_GA4_ID=G-VWSTLSTTM4
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3000/api/signup
NEXT_PUBLIC_SURVEY_ENDPOINT=http://localhost:3000/api/survey
POSTGRES_URL=postgres://...
```

---

## Option 2: Supabase (Most Flexible) ✅

### Step 1: Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)**
2. Click **New Project**
3. Organization: Your org
4. Name: `glialink`
5. Password: Generate strong password
6. Region: Select closest region
7. Click **Create new project** (waits 2 min)

### Step 2: Install Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Create Tables in Supabase

In Supabase dashboard → **SQL Editor**:

```sql
-- Email Signups Table
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

CREATE INDEX idx_email_signups_email ON email_signups(email);
CREATE INDEX idx_email_signups_created ON email_signups(created_at DESC);

-- Survey Responses Table (JSONB for flexibility)
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  responses JSONB,
  variant VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_survey_responses_email ON survey_responses(email);
CREATE INDEX idx_survey_responses_created ON survey_responses(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON email_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON survey_responses
  FOR INSERT
  WITH CHECK (true);
```

### Step 4: Create API Routes with Supabase

Create `src/app/api/signup/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email: body.email,
          variant: body.variant || 'control',
          utm_source: body.utm_source,
          utm_medium: body.utm_medium,
          utm_campaign: body.utm_campaign,
          utm_term: body.utm_term,
          utm_content: body.utm_content,
          referrer: body.referrer,
          user_agent: body.user_agent,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { success: true, id: data[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to save signup' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/survey/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          email: body.email,
          variant: body.variant || 'control',
          responses: {
            careerStage: body.careerStage,
            field: body.field,
            interestReason: body.interestReason,
            institutionType: body.institutionType,
            ...body.additionalFields,
          },
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { success: true, id: data[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}
```

### Step 5: Add Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3000/api/signup
NEXT_PUBLIC_SURVEY_ENDPOINT=http://localhost:3000/api/survey
```

---

## Flexible Schema Design

### Key Design Principle: Store Everything as JSON

This allows you to **add/remove form fields later without database migrations**:

```typescript
// Current survey questions
{
  "careerStage": "grad",
  "field": "Neuroscience",
  "interestReason": "collaboration",
  "institutionType": "university"
}

// Later add new questions without changing database
{
  "careerStage": "grad",
  "field": "Neuroscience",
  "interestReason": "collaboration",
  "institutionType": "university",
  "yearsExperience": "3-5",      // ← New question
  "fundingSource": "NSF",        // ← New question
  "projectType": "research"      // ← New question
  // ... no database schema changes needed!
}
```

### SignUpForm.tsx Already Handles This

Look at how it's structured (flexible):

```typescript
const signupData: SignupData = {
  email,
  timestamp: new Date().toISOString(),
  variant,
  context,  // ← Includes all UTM params automatically
};

// Survey just passes all responses as JSON
const { data, error } = await fetch(surveyEndpoint, {
  body: JSON.stringify({
    email,
    ...survey,  // ← All fields sent
    variant,
    timestamp: new Date().toISOString(),
  }),
});
```

**To add new survey fields later:**

1. Update `SignUpForm.tsx` to add new input field
2. Update survey state to include new field
3. That's it! Database already accepts JSON

---

## Adding New Form/Survey Fields Later

### Example: Add "Years of Experience" to Survey

#### Step 1: Update SignUpForm Component

```tsx
interface SurveyResponse {
  careerStage: string;
  field: string;
  interestReason: string;
  institutionType: string;
  yearsExperience: string;  // ← Add this
}

// In form:
<div>
  <label className="block text-sm font-medium text-ink mb-2">
    Years of Experience *
  </label>
  <select
    value={survey.yearsExperience}
    onChange={(e) =>
      setSurvey({ ...survey, yearsExperience: e.target.value })
    }
    className="w-full rounded-lg border border-border px-4 py-2.5 text-ink bg-white"
    required
  >
    <option value="">Select...</option>
    <option value="0-2">0-2 years</option>
    <option value="2-5">2-5 years</option>
    <option value="5-10">5-10 years</option>
    <option value="10+">10+ years</option>
  </select>
</div>
```

#### Step 2: Track in GA4 Event

```tsx
event("survey_submit", {
  career_stage: survey.careerStage,
  field: survey.field,
  interest_reason: survey.interestReason,
  institution_type: survey.institutionType,
  years_experience: survey.yearsExperience,  // ← Add this
  variant,
});
```

#### Step 3: Done!

Backend automatically saves it as:
```json
{
  "careerStage": "grad",
  "field": "Neuroscience",
  "interestReason": "collaboration",
  "institutionType": "university",
  "yearsExperience": "3-5"
}
```

No database migration needed! 🎉

---

## Query Examples

### Get All Signups

**Vercel Postgres:**
```typescript
const signups = await sql`SELECT * FROM email_signups ORDER BY created_at DESC LIMIT 100;`;
```

**Supabase:**
```typescript
const { data } = await supabase
  .from('email_signups')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100);
```

### Get Survey Responses for Email

**Vercel Postgres:**
```typescript
const surveys = await sql`
  SELECT responses FROM survey_responses 
  WHERE email = $1 
  ORDER BY created_at DESC;
`;
```

**Supabase:**
```typescript
const { data } = await supabase
  .from('survey_responses')
  .select('responses')
  .eq('email', 'user@example.com')
  .order('created_at', { ascending: false });
```

### Find Most Common Career Stage

**Vercel Postgres:**
```typescript
const results = await sql`
  SELECT 
    responses->>'careerStage' as career_stage,
    COUNT(*) as count
  FROM survey_responses
  GROUP BY responses->>'careerStage'
  ORDER BY count DESC;
`;
```

**Supabase:**
```typescript
const { data } = await supabase
  .rpc('get_career_stage_stats');
```

---

## Production Checklist

- [ ] Choose backend (Vercel Postgres recommended)
- [ ] Create database instance
- [ ] Run database initialization script
- [ ] Create API routes (/api/signup, /api/survey)
- [ ] Add environment variables to Vercel
- [ ] Update `.env.local` for local testing
- [ ] Test form submission locally
- [ ] Test survey submission locally
- [ ] Deploy to Vercel
- [ ] Test on production URL
- [ ] Monitor database in dashboard
- [ ] Set up backups (if needed)

---

## Monitoring & Analytics

### Check Signup Volume

**Vercel Postgres Dashboard:**
1. Go to Vercel dashboard
2. Storage tab
3. Click your database
4. View query metrics

**Supabase Dashboard:**
1. Go to supabase.com
2. Select project
3. Explore tab → Query email_signups

### Export Data

**CSV Export (Vercel Postgres):**
```typescript
const result = await sql`SELECT * FROM email_signups;`;
const csv = convertToCSV(result.rows);
```

**CSV Export (Supabase):**
```typescript
const { data } = await supabase
  .from('email_signups')
  .select('*');
const csv = convertToCSV(data);
```

---

## Cost Estimates (Per Month)

### Vercel Postgres
- Free tier: 60 hours/month
- $0.25 per additional hour
- Most signups: ~$1-5/month

### Supabase
- Free tier: 500MB storage, 2 million API calls
- Most startups: Free forever
- Scale up: $25/month for more capacity

### Firebase
- Free tier: 1 GB storage
- Most startups: Free forever
- Scale up: $0.06/GB over limit

---

## Recommended Setup

**For Production:**
1. Use **Vercel Postgres** (same company, simplest setup)
2. API routes already in your Next.js app
3. Free tier handles ~10,000 signups/month
4. Cost: $0-5/month

**For Development:**
1. Use `.env.local` with Postgres connection
2. Or use Supabase free tier
3. Test locally before deploying

---

## Next Steps

1. Choose backend (Vercel Postgres recommended)
2. Create database instance
3. Run initialization script
4. Create API routes in your repo
5. Update environment variables
6. Test locally with `npm run dev`
7. Deploy to Vercel
8. Monitor in dashboard

You're now ready to persist form and survey data with a fully flexible schema! 🚀
