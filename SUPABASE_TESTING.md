# Supabase Testing & Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel, follow these steps:

- [ ] Supabase project created
- [ ] Tables created in SQL Editor
- [ ] Environment variables in `.env.local`
- [ ] Package installed: `npm install @supabase/supabase-js`
- [ ] Dev server restarted: `npm run dev`
- [ ] Form tested locally
- [ ] Survey tested locally
- [ ] Data verified in Supabase

---

## Local Testing (Step by Step)

### Step 1: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

### Step 2: Set Environment Variables

Create `.env.local` in your project root:

```bash
# Google Analytics
NEXT_PUBLIC_GA4_ID=G-VWSTLSTTM4

# Supabase (get from supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Form endpoints
NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3000/api/signup
NEXT_PUBLIC_SURVEY_ENDPOINT=http://localhost:3000/api/survey
```

**How to find these values:**
1. Go to **supabase.com** → Your project
2. Click **Settings** (bottom left)
3. Click **API** (under Configuration)
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **service_role** (not anon key!) → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Start Dev Server

```bash
npm run dev
```

### Step 4: Test Email Form

1. Open `http://localhost:3000` in browser
2. Scroll to email form
3. Enter a test email: `test@example.com`
4. Click **"Get early access"**
5. You should see success message

**Check DevTools:**
- Open **DevTools** (F12)
- Go to **Console** tab
- Should see: `✅ Signup saved: test@example.com`
- Go to **Network** tab
- Look for POST request to `/api/signup`
- Click it → **Response** tab → Should show `{ "success": true }`

### Step 5: Verify in Supabase

1. Go to **supabase.com** → Your project
2. Click **Table Editor** (left sidebar)
3. Click **email_signups** table
4. Should see your test email there!

If you don't see it:
- ❌ Check `.env.local` has correct credentials
- ❌ Restart dev server: `npm run dev`
- ❌ Check browser console for errors (F12)
- ❌ Check Supabase dashboard for error messages

### Step 6: Test Survey Form

1. Go back to `http://localhost:3000`
2. The form should still show success message
3. Survey form should be visible below
4. Fill out all fields:
   - Career Stage: Select one
   - Field of Research: Type something (e.g., "Neuroscience")
   - Interest Reason: Select one
   - Institution Type: Select one
5. Click **"Submit"**

**Check DevTools:**
- **Console** should show: `✅ Survey saved: test@example.com`
- **Network** should show POST to `/api/survey` with success response

### Step 7: Verify Survey in Supabase

1. Go to **supabase.com** → Your project
2. Click **Table Editor**
3. Click **survey_responses** table
4. Should see your survey response!
5. Click on the row to expand and see the `responses` JSON

---

## Production Testing (Vercel Deployment)

### Step 1: Add Environment Variables to Vercel

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Select project: `glialink-landing-page-v1`
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these variables:

```
Name: NEXT_PUBLIC_GA4_ID
Value: G-VWSTLSTTM4
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_FORM_ENDPOINT
Value: https://glialink-landing-page-v1.vercel.app/api/signup
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_SURVEY_ENDPOINT
Value: https://glialink-landing-page-v1.vercel.app/api/survey
Environments: ✅ Production ✅ Preview ✅ Development
```

6. Click **Save** for each one

### Step 2: Redeploy Project

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** (...) on the right
4. Click **Redeploy**
5. Wait for deployment to complete (1-2 minutes)

### Step 3: Test Production URL

1. Go to your production URL: `https://glialink-landing-page-v1.vercel.app`
2. Test the form (same as local testing steps 4-7)
3. Check Supabase dashboard for new entries

---

## Viewing Data in Supabase

### View Email Signups

1. Go to **supabase.com** → Your project
2. Click **Table Editor** (left sidebar)
3. Click **email_signups**
4. See all signups with columns:
   - `email` — The email address
   - `variant` — A/B test variant (control, v1, v2)
   - `utm_source` — Traffic source (linkedin, twitter, etc.)
   - `referrer` — Where they came from
   - `created_at` — When they signed up

### View Survey Responses

1. Click **survey_responses** table
2. See all survey responses
3. Click on a row to see the full `responses` JSON

### Query Data with SQL

1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste a query:

**Get all signups:**
```sql
SELECT email, variant, utm_source, created_at 
FROM email_signups 
ORDER BY created_at DESC;
```

**Get signups from specific source:**
```sql
SELECT email, created_at 
FROM email_signups 
WHERE utm_source = 'linkedin' 
ORDER BY created_at DESC;
```

**Get survey responses for an email:**
```sql
SELECT responses 
FROM survey_responses 
WHERE email = 'test@example.com';
```

**Analyze career stages:**
```sql
SELECT 
  responses->>'careerStage' as career_stage,
  COUNT(*) as count
FROM survey_responses
GROUP BY responses->>'careerStage'
ORDER BY count DESC;
```

### Download Data as CSV

1. Go to **Table Editor**
2. Click **email_signups** or **survey_responses**
3. Click three dots (top right)
4. Click **Download as CSV**
5. Save to your computer

---

## Troubleshooting

### "Module not found: @supabase/supabase-js"

You haven't installed the package:

```bash
npm install @supabase/supabase-js
npm run dev
```

### "Supabase not configured" Message

Environment variables are missing:

**Local:**
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

**Production:**
- Check Vercel dashboard has all variables
- Make sure Service Role Key is set (not anon key)
- Redeploy project

### Form Submits but No Data in Database

**Check 1: Environment variables**
```bash
# Local - should show values
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

**Check 2: Restart dev server**
```bash
npm run dev
```

**Check 3: Check browser console (F12)**
- Should see: `✅ Signup saved: test@example.com`
- If you see error, copy-paste it below

**Check 4: Verify tables exist**
1. Go to supabase.com → Your project
2. Click **Table Editor**
3. Should see `email_signups` and `survey_responses` tables

**Check 5: Check API response**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Look for POST request to `/api/signup`
4. Click it
5. Click **Response** tab
6. Should show `{ "success": true }`

### "Authentication failed" or "Invalid API key"

The Service Role Key is wrong:

1. Go to supabase.com → Your project
2. Settings → API
3. Copy the **service_role** key (NOT the anon key)
4. Update `.env.local` and Vercel environment variables
5. Redeploy

### Tables Not Showing in Table Editor

You didn't create the tables. Follow SUPABASE_SETUP.md Step 2:

1. Go to supabase.com → Your project
2. SQL Editor → New Query
3. Paste the full SQL from SUPABASE_SETUP.md Step 2
4. Click Run
5. Check Table Editor now shows both tables

### "Row Level Security violation"

The RLS policies weren't created. Re-run the SQL from SUPABASE_SETUP.md Step 2, specifically:

```sql
-- Enable RLS
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous inserts on email_signups" ON email_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on survey_responses" ON survey_responses
  FOR INSERT
  WITH CHECK (true);
```

---

## Monitoring

### Check Real-time Activity

1. Go to supabase.com → Your project
2. Click **Logs** (left sidebar) → **API Activity**
3. See all recent API calls
4. Filter by errors to find issues

### Check Storage & Limits

1. Go to supabase.com → Your project
2. Click **Usage** (left sidebar)
3. See:
   - Storage used / limit
   - API call count
   - Database size
4. Free tier: 500MB storage, 2 million API calls/month

### Monitor from Vercel

1. Go to vercel.com → Your project
2. Click **Deployments**
3. Click latest deployment
4. Click **Logs**
5. See all API calls and errors from production

---

## Security Best Practices

✅ **Do:**
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (in `.env.local` + Vercel only)
- Validate all input in API routes
- Use parameterized queries (never concatenate user input)
- Monitor Supabase logs for suspicious activity

❌ **Don't:**
- Commit `.env.local` to git
- Expose Service Role Key in frontend code
- Use Supabase public key in API routes
- Send sensitive data without HTTPS

---

## Quick Reference

| Task | Steps |
|------|-------|
| View signups | supabase.com → Table Editor → email_signups |
| View surveys | supabase.com → Table Editor → survey_responses |
| Query data | supabase.com → SQL Editor → Write query |
| Export CSV | Table Editor → (three dots) → Download as CSV |
| Check errors | supabase.com → Logs → API Activity |
| Check usage | supabase.com → Usage |
| Monitor production | vercel.com → Deployments → Latest → Logs |

---

## Success Checklist

- ✅ Package installed: `npm install @supabase/supabase-js`
- ✅ Tables created in Supabase
- ✅ Environment variables set locally
- ✅ Form works locally
- ✅ Data appears in Supabase table
- ✅ Survey works locally
- ✅ Survey data appears in Supabase
- ✅ Environment variables set in Vercel
- ✅ Project redeployed
- ✅ Form works on production URL
- ✅ Data appears in Supabase (prod)
- ✅ GA4 tracking working
- ✅ Ready to go live!

🎉 You're all set!
