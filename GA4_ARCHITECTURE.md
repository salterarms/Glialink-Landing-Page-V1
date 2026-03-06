# Analytics Architecture & Data Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│ USER BROWSER                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layout.tsx (Root)                                          │
│  ├─ VariantInitializer → Detects A/B variant              │
│  ├─ ScrollTrackerClient → Listens for scroll events        │
│  └─ GA4 Script Loader                                       │
│                                                              │
│  Components:                                                │
│  ├─ Hero → Tracks CTA clicks                               │
│  ├─ SignUpForm → Email + Survey tracking                   │
│  └─ Other sections                                          │
│                                                              │
│  Session Storage:                                           │
│  ├─ assigned_variant (A/B variant)                         │
│  ├─ utm_source, utm_medium, utm_campaign, etc.            │
│  └─ document.referrer (HTTP referrer)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ GA4 Events (gtag.js)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ GOOGLE ANALYTICS 4                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Events Received:                                           │
│  ├─ scroll_depth (25%, 50%, 75%, 100%)                     │
│  ├─ form_start                                              │
│  ├─ form_submit                                             │
│  ├─ form_submit_success                                    │
│  ├─ form_submit_error                                      │
│  ├─ survey_submit                                           │
│  ├─ hero_cta_click                                          │
│  └─ copy_link                                               │
│                                                              │
│  User Properties:                                           │
│  ├─ variant (control, v1, v2, etc.)                        │
│  ├─ utm_source                                              │
│  ├─ utm_medium                                              │
│  ├─ utm_campaign                                            │
│  ├─ utm_term                                                │
│  └─ utm_content                                             │
│                                                              │
│  Event Parameters:                                          │
│  ├─ scroll_percentage                                       │
│  ├─ email_domain                                            │
│  ├─ career_stage                                            │
│  ├─ field                                                   │
│  ├─ interest_reason                                         │
│  └─ institution_type                                        │
│                                                              │
│  Real-time Dashboard:                                       │
│  └─ View live events as they happen                        │
│                                                              │
│  Reports:                                                   │
│  ├─ Acquisition (UTM, referrer, sources)                   │
│  ├─ Engagement (scroll depth, time on page)                │
│  ├─ Conversion (form submissions, survey)                  │
│  └─ Custom Reports (variant comparison, etc.)              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ Optional: Form Data
         │
         ▼ (if backend configured)
┌─────────────────────────────────────────────────────────────┐
│ YOUR BACKEND (Next.js API Routes)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  POST /api/signup                                           │
│  └─ Receives: email, UTM params, referrer, variant         │
│     Stores in: Email Signups Table                          │
│                                                              │
│  POST /api/survey                                           │
│  └─ Receives: email, survey responses, variant             │
│     Stores in: Survey Responses Table                       │
│                                                              │
│  Database:                                                  │
│  ├─ email_signups                                           │
│  │  ├─ id, email, variant, utm_*, referrer, timestamp      │
│  │  └─ Indexed by: email, variant, created_at              │
│  │                                                          │
│  └─ survey_responses                                        │
│     ├─ id, signup_id (FK), career_stage, field, ...        │
│     └─ Indexed by: signup_id, created_at                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Page Load → Variant Assignment

```
User visits: https://glialink.com?variant=v1
     │
     ▼
VariantInitializer runs (useEffect on mount)
     │
     ├─ getVariant()
     │  ├─ Check URL query param (?variant=v1) ✓ Found
     │  └─ Return "v1"
     │
     ├─ persistVariant("v1")
     │  ├─ sessionStorage.setItem("assigned_variant", "v1")
     │  └─ window.gtag("set", { variant: "v1" })
     │
     └─ captureUTM()
        ├─ Extract utm_source, utm_medium, etc.
        └─ Store in sessionStorage
```

### 2. Form Submission → Event Tracking

```
User enters email and clicks "Get early access"
     │
     ▼
SignUpForm.handleSubmit() runs
     │
     ├─ event("form_submit", { email_domain: "mit.edu", variant: "v1" })
     │  └─ window.gtag("event", "form_submit", { ... })
     │     └─ Sent to GA4 immediately
     │
     ├─ Fetch POST /api/signup (if endpoint configured)
     │  ├─ Body: email, variant, utm_*, referrer, timestamp
     │  └─ Response: { success: true }
     │
     ├─ event("form_submit_success", { variant: "v1" })
     │  └─ Sent to GA4
     │
     └─ setShowSurvey(true)
        └─ Display survey form
```

### 3. Survey Completion → Data Storage

```
User completes survey and clicks "Submit"
     │
     ▼
SignUpForm.handleSurveySubmit() runs
     │
     ├─ event("survey_submit", { 
     │    career_stage: "grad",
     │    field: "Neuroscience",
     │    interest_reason: "collaboration",
     │    institution_type: "university",
     │    variant: "v1"
     │  })
     │  └─ Sent to GA4
     │
     └─ Fetch POST /api/survey (if endpoint configured)
        ├─ Body: email, career_stage, field, interest_reason, variant
        └─ Response: { success: true }
           └─ Stored in survey_responses table linked to email
```

### 4. Scroll Tracking → Event Capture

```
User scrolls page
     │
     ▼
ScrollTrackerClient listens to scroll events
     │
     ├─ Calculate scroll percentage
     │  └─ scrollPercentage = (scrollTop + windowHeight) / documentHeight * 100
     │
     ├─ Is scrollPercentage >= 25% AND not already fired?
     │  └─ event("scroll_depth", { scroll_percentage: 25 })
     │     └─ Sent to GA4
     │
     ├─ Is scrollPercentage >= 50% AND not already fired?
     │  └─ event("scroll_depth", { scroll_percentage: 50 })
     │
     └─ ... repeat for 75%, 100%
        └─ scrollDepths.add(threshold) prevents duplicate events
```

---

## Event Taxonomy

### Navigation Events

```javascript
// User interacts with CTAs
event("hero_cta_click", { variant: "v1" })
event("copy_link", { variant: "v1" })

// Both tracked to GA4
// Helps measure engagement and sharing behavior
```

### Form Events

```javascript
// User focuses on email input
event("form_start", { variant: "v1" })

// User attempts to submit
event("form_submit", { 
  email_domain: "mit.edu",  // Classify institutional vs personal
  variant: "v1" 
})

// Backend responds with success
event("form_submit_success", { variant: "v1" })

// Backend returns error or network fails
event("form_submit_error", { 
  variant: "v1",
  error: "Network error" 
})
```

### Survey Events

```javascript
// User completes survey and submits
event("survey_submit", {
  career_stage: "grad",           // Job level
  field: "Neuroscience",          // Research area
  interest_reason: "collaboration", // Motivation
  institution_type: "university",  // Organization type
  variant: "v1"                    // A/B variant
})
```

### Engagement Events

```javascript
// Automatically fired at scroll thresholds
event("scroll_depth", {
  scroll_percentage: 25,   // or 50, 75, 100
  page_location: "/",      // Helps identify page variations
  variant: "v1"            // (Added by VariantInitializer)
})
```

---

## Data Persistence Strategy

### Session Storage (Client-side)

Survives page refresh within same tab:

```javascript
// Set on page load
sessionStorage.setItem("assigned_variant", "v1")
sessionStorage.setItem("utm_source", "linkedin")

// Persists throughout session
sessionStorage.getItem("assigned_variant") // Returns "v1"

// Cleared when tab is closed
```

### GA4 (Server-side)

Persistent storage with 24-month retention:

```javascript
// User properties (tied to user across sessions)
gtag("set", { variant: "v1" })

// Events (timestamped, tied to user and session)
gtag("event", "form_submit_success", { /* data */ })

// Query in GA4 reports 24 months later
```

### Database (Optional backend)

Permanent storage under your control:

```sql
-- Email Signups
INSERT INTO email_signups 
(email, variant, utm_source, referrer, timestamp)
VALUES ('user@mit.edu', 'v1', 'linkedin', 'https://...', NOW())

-- Survey Responses
INSERT INTO survey_responses
(signup_id, career_stage, field, institution_type, timestamp)
VALUES (123, 'grad', 'Neuroscience', 'university', NOW())
```

---

## User Journey Tracking Example

### Scenario: Student discovers landing page from LinkedIn

```
1. PAGE LOAD
   URL: https://glialink.com?utm_source=linkedin&utm_campaign=launch&variant=v1
   
   VariantInitializer runs:
   ├─ Detects variant=v1 → sessionStorage
   ├─ Captures utm_source=linkedin → sessionStorage
   └─ GA4 receives: variant user property + utm_source
   
   GA4 Real-time: 1 user, variant="v1"

2. USER SCROLLS
   After 30 seconds, student scrolled 75% down page
   
   ScrollTrackerClient fires:
   ├─ event("scroll_depth", { scroll_percentage: 75 })
   └─ GA4 Records: scroll depth event at 75%

3. USER CLICKS CTA
   Student clicks "Get early access" button
   
   Hero.tsx fires:
   ├─ event("hero_cta_click", { variant: "v1" })
   └─ GA4 Records: hero_cta_click event

4. USER FILLS FORM
   Student enters email: student@mit.edu
   
   SignUpForm.tsx fires:
   ├─ event("form_start", { variant: "v1" }) [on focus]
   └─ GA4 Records: form_start event

5. USER SUBMITS EMAIL
   Student clicks submit
   
   SignUpForm fires:
   ├─ event("form_submit", { 
   │    email_domain: "mit.edu",  ← Classified as institution
   │    variant: "v1"
   │  })
   │
   ├─ Fetch POST /api/signup (if configured)
   │  └─ Backend stores: student@mit.edu, v1, linkedin, referrer, timestamp
   │
   ├─ event("form_submit_success", { variant: "v1" })
   │
   └─ setShowSurvey(true) → Display survey

6. USER COMPLETES SURVEY
   Student fills: grad, Neuroscience, collaboration, university
   
   SignUpForm fires:
   ├─ event("survey_submit", {
   │    career_stage: "grad",
   │    field: "Neuroscience",
   │    interest_reason: "collaboration",
   │    institution_type: "university",
   │    variant: "v1"
   │  })
   │
   └─ Fetch POST /api/survey
      └─ Backend stores survey linked to student@mit.edu

7. GA4 ANALYSIS
   In GA4 Reports, we see:
   
   ├─ User profile:
   │  ├─ Source: LinkedIn
   │  ├─ Campaign: launch
   │  ├─ Variant: v1
   │  └─ Referrer: https://linkedin.com/...
   │
   ├─ User events:
   │  ├─ scroll_depth: 75%
   │  ├─ hero_cta_click: 1
   │  ├─ form_start: 1
   │  ├─ form_submit: 1
   │  ├─ form_submit_success: 1
   │  └─ survey_submit: 1
   │
   ├─ Conversion funnel:
   │  ├─ Page views: 1
   │  ├─ Form starts: 1
   │  ├─ Form submissions: 1 ✓
   │  └─ Survey completions: 1 ✓
   │
   └─ Survey insights:
      ├─ Career stage: Grad student
      ├─ Field: Neuroscience
      ├─ Interest: Collaboration
      └─ Institution: University
```

---

## Variant Comparison Logic

### A/B Test: Control vs V1

```
Visit URLs:
- Control: https://glialink.com (default)
- Variant: https://glialink.com?variant=v1

GA4 tracks both under variant user property

In GA4 Reports:
┌─────────────────────────────────────────┐
│ Metric          │ Control  │ V1       │
├─────────────────────────────────────────┤
│ Users           │ 100      │ 95       │
│ Form Submit     │ 12 (12%) │ 19 (20%) │ ← V1 is better
│ Avg Scroll %    │ 62%      │ 71%      │ ← V1 engages more
│ Survey Complete │ 10       │ 16       │
├─────────────────────────────────────────┤
│ Conclusion: V1 variant has higher      │
│ conversion rate and better engagement  │
└─────────────────────────────────────────┘
```

---

## API Contract Examples

### POST /api/signup

Request:
```json
{
  "email": "user@mit.edu",
  "timestamp": "2024-03-06T15:30:00Z",
  "variant": "v1",
  "utm_source": "linkedin",
  "utm_medium": "social",
  "utm_campaign": "launch",
  "utm_term": "research",
  "utm_content": "post-123",
  "referrer": "https://linkedin.com/feed",
  "user_agent": "Mozilla/5.0..."
}
```

Response:
```json
{
  "success": true,
  "id": "signup_12345"
}
```

### POST /api/survey

Request:
```json
{
  "email": "user@mit.edu",
  "career_stage": "grad",
  "field": "Neuroscience",
  "interest_reason": "collaboration",
  "institution_type": "university",
  "variant": "v1",
  "timestamp": "2024-03-06T15:32:00Z"
}
```

Response:
```json
{
  "success": true,
  "id": "survey_response_12345"
}
```

---

## Custom Report Examples

### Query 1: Variant Performance

```
Dimensions: variant
Metrics: users, event_count (form_submit_success)
Filter: event_name = "form_submit_success"

Result: Compare conversion rate between v1, v2, control
```

### Query 2: Scroll Depth by Source

```
Dimensions: utm_source, scroll_percentage
Metrics: user_count
Filter: event_name = "scroll_depth"

Result: Which traffic sources engage most (scroll deepest)
```

### Query 3: Survey Insights

```
Dimensions: career_stage, field, institution_type
Metrics: count, avg_session_duration
Filter: event_name = "survey_submit"

Result: Profile of who's most interested
```

---

## Error Handling

### Network Errors

```javascript
try {
  const res = await fetch(formEndpoint, { /* ... */ })
  if (!res.ok) throw new Error("HTTP " + res.status)
  event("form_submit_success", { variant })
} catch (err) {
  event("form_submit_error", { 
    variant,
    error: err.message 
  })
  // User sees: "Something went wrong. Please try again."
}
```

### Graceful Degradation

- If GA4_ID missing: Analytics doesn't load (silent fail)
- If backend endpoint missing: Form still works, just no database storage
- If backend down: GA4 still tracks (decoupled systems)

---

## Performance Implications

### Scroll Tracking

- Passive event listener (doesn't block scrolling)
- Only fires events at 4 thresholds max
- Minimal impact on page performance

### GA4 Script

- Loaded async (doesn't block page rendering)
- ~100KB gzipped
- Typical latency: <50ms for event logging

### Form Submission

- Fetch is non-blocking
- User sees success immediately
- Backend logs happen in background

---

You now have a complete understanding of how the analytics system works!
