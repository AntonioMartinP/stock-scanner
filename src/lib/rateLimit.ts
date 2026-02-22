/**
 * Simple token-bucket rate limiter for API routes.
 *
 * NOTE — serverless environments (Vercel): each cold-start creates a fresh
 * module instance, so the counters reset per instance. This protects against
 * bursts within a single warm instance; for cross-instance limiting use an
 * external store such as Vercel KV / Redis.
 *
 * Usage:
 *   const result = rateLimiter.check(ip, { max: 30, windowMs: 60_000 });
 *   if (!result.ok) return Response.json({ error: 'Too Many Requests' }, { status: 429 });
 */

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

export interface RateLimitOptions {
  /** Maximum requests allowed per window */
  max: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Number of requests remaining in the current window */
  remaining: number;
  /** Timestamp (ms) when the window resets */
  resetAt: number;
}

/**
 * Returns the client IP from a Request, falling back to a fixed key.
 * Supports Vercel's forwarding headers.
 */
export function getClientIp(req: Request): string {
  const headers = req instanceof Request ? req.headers : new Headers();
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

export const rateLimiter = {
  check(key: string, opts: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now >= entry.resetAt) {
      // New window
      store.set(key, { count: 1, resetAt: now + opts.windowMs });
      return { ok: true, remaining: opts.max - 1, resetAt: now + opts.windowMs };
    }

    if (entry.count >= opts.max) {
      return { ok: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { ok: true, remaining: opts.max - entry.count, resetAt: entry.resetAt };
  },
};
