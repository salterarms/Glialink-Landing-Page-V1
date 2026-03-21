# Rate Limiting Implementation

## Overview
Rate limiting has been implemented for the signup form to prevent spam and abuse. The system uses an in-memory sliding window rate limiter.

## Current Configuration

### Signup Endpoint (`/api/signup`)
- **Limit**: 5 signups per IP per minute
- **Response**: HTTP 429 (Too Many Requests) when exceeded
- **User Message**: "Too many signup attempts. Please wait a minute and try again."

## How It Works

### Backend (Server-side)
1. **Rate Limiter** (`/src/lib/ratelimit.ts`)
   - Tracks request timestamps per IP address
   - Uses sliding window algorithm
   - Cleans up old timestamps outside the window
   - Configurable per endpoint

2. **Signup Route** (`/src/app/api/signup/route.ts`)
   - Extracts client IP from headers (`x-forwarded-for` or `x-real-ip`)
   - Checks rate limit before processing request
   - Returns 429 status code if limit exceeded
   - Includes rate limit info in response headers

### Frontend (Client-side)
1. **Error Handling** (`/src/components/SignUpForm.tsx`)
   - Detects 429 status code from API
   - Shows user-friendly error message
   - Tracks rate limit event in analytics
   - Allows user to retry after cooldown

## Production Deployment

⚠️ **Important**: The current implementation uses in-memory storage. This means:
- Rate limits **reset on cold starts** (when Vercel spins up new serverless instances)
- Not suitable for high-traffic production with multiple instances

### For Production, Use Upstash Redis
Replace the rate limiter with [Upstash](https://upstash.com/) for persistent, distributed rate limiting:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

const { success } = await ratelimit.limit("signup:" + ip);
```

This is a drop-in replacement requiring minimal code changes.

## Testing Rate Limits

### Manual Testing
1. Submit the signup form 5 times rapidly from the same IP
2. On the 6th attempt, you should see: "Too many signup attempts. Please wait a minute and try again."
3. After 1 minute, the limit resets and you can submit again

### Server Logs
```bash
# Rate limited request
429 - Too many signup attempts. Please try again in a minute.

# Allowed request
201 - Signup saved: user@example.com
```

## Other Endpoints Needing Rate Limiting

Based on the codebase review, these endpoints should also have rate limiting:

1. **Survey** (`/api/survey`) - Recommended: 3 per minute per IP
2. **Calendly Webhook** (`/api/calendly/webhook`) - Recommended: 10 per minute per IP
3. **Share** (Client-side) - Recommended: 10 per minute per IP

To add rate limiting to other endpoints, simply follow the same pattern:

```typescript
const { allowed } = checkRateLimit(ip, {
  windowMs: 60_000,
  maxRequests: 3,
});

if (!allowed) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

## Analytics

Rate limit events are tracked:
- `form_submit_rate_limited` - User hit rate limit
- Useful for monitoring abuse patterns

## References
- [MDN Rate Limiting](https://developer.mozilla.org/en-US/docs/Glossary/rate_limit)
- [Upstash Ratelimit](https://upstash.com/docs/redis/features/ratelimiting)
