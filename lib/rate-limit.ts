import { kv } from "@vercel/kv";

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

/**
 * Fixed-window IP-based rate limit, KV-backed.
 *
 * Quietly allows everything when KV isn't configured (local dev). Production
 * has KV, so the limit applies there.
 */
export async function rateLimit(opts: {
  bucket: string;
  ip: string;
  limit: number;
  windowSec: number;
}): Promise<RateLimitResult> {
  if (!HAS_KV) return { ok: true };
  const key = `gb:rl:${opts.bucket}:${opts.ip}`;
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, opts.windowSec);
  }
  if (count > opts.limit) {
    const ttl = await kv.ttl(key);
    return { ok: false, retryAfter: Math.max(1, ttl ?? opts.windowSec) };
  }
  return { ok: true };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
