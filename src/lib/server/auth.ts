import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { NextRequest } from "next/server";

export const sessionCookie = "eshet_inbox_session";
const sessionSeconds = 3600;
export function adminConfigured() {
  return (
    !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12
  );
}
function signingKey() {
  return createHash("sha256")
    .update(
      `eshet-inbox-v1:${process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""}`,
    )
    .digest();
}
export function checkPassword(password: string) {
  if (!adminConfigured()) return false;
  const supplied = createHash("sha256").update(password).digest();
  const expected = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD!)
    .digest();
  return timingSafeEqual(supplied, expected);
}
export function issueSession() {
  const payload = Buffer.from(
    JSON.stringify({
      expires: Date.now() + sessionSeconds * 1000,
      nonce: randomBytes(18).toString("hex"),
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", signingKey()).update(payload).digest("base64url")}`;
}
export function authenticated(request: NextRequest): boolean {
  if (!adminConfigured()) return false;
  const value = request.cookies.get(sessionCookie)?.value;
  if (!value || value.length > 1000) return false;
  try {
    const [payload, signature, ...rest] = value.split(".");
    if (!payload || !signature || rest.length) return false;
    const actual = Buffer.from(signature, "base64url");
    const expected = createHmac("sha256", signingKey())
      .update(payload)
      .digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return false;
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { expires?: unknown };
    return (
      typeof session.expires === "number" &&
      session.expires > Date.now() &&
      session.expires < Date.now() + (sessionSeconds + 60) * 1000
    );
  } catch {
    return false;
  }
}
export function cookieOptions(request: Request) {
  return {
    httpOnly: true,
    secure:
      new URL(request.url).protocol === "https:" ||
      request.headers.get("x-forwarded-proto") === "https",
    sameSite: "strict" as const,
    path: "/api/admin",
    maxAge: sessionSeconds,
  };
}
