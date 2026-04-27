import crypto from "crypto";

const SECRET =
  process.env.SUCCESS_COOKIE_SECRET ||
  process.env.STRIPE_WEBHOOK_SECRET ||
  "dev-only-secret-change-me";

/** Sign a short token: `<value>.<hmac>`. Tamper-evident, not encrypted. */
export function sign(value: string): string {
  const h = crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 24);
  return `${value}.${h}`;
}

export function verify(token: string | undefined | null): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const value = token.slice(0, i);
  if (sign(value) !== token) return null;
  return value;
}
