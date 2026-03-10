// In-memory rate limiter — sliding window per IP.
//
// ⚠️  NOTE: This is intentionally lightweight for the landing page demo.
// In-memory state does NOT persist across serverless function cold starts
// (Vercel spins up fresh instances). For production, swap this for
// Upstash Ratelimit + Redis (drop-in replacement, ~10 lines of change).
//
// Current limit: 10 requests per 60 seconds per IP.

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip) ?? { timestamps: [] };

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    store.set(ip, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  store.set(ip, entry);

  return { allowed: true, remaining: MAX_REQUESTS - entry.timestamps.length };
}
