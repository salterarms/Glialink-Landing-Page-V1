// In-memory rate limiter — sliding window per IP.
//
// ⚠️  NOTE: This is intentionally lightweight for the landing page demo.
// In-memory state does NOT persist across serverless function cold starts
// (Vercel spins up fresh instances). For production, swap this for
// Upstash Ratelimit + Redis (drop-in replacement, ~10 lines of change).

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

// Configuration for different endpoints
const DEFAULT_WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX_REQUESTS = 10;

export function checkRateLimit(
  ip: string,
  options?: { windowMs?: number; maxRequests?: number }
): { allowed: boolean; remaining: number } {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;
  
  const now = Date.now();
  const storeKey = `${ip}:${windowMs}:${maxRequests}`; // Unique key per config
  const entry = store.get(storeKey) ?? { timestamps: [] };

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    store.set(storeKey, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  store.set(storeKey, entry);

  return { allowed: true, remaining: maxRequests - entry.timestamps.length };
}
