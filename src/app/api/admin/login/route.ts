import {
  adminConfigured,
  checkPassword,
  cookieOptions,
  issueSession,
  sessionCookie,
} from "@/lib/server/auth";
import {
  errorResponse,
  json,
  localeOf,
  rateLimit,
  readJson,
} from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "admin-login", 5, 15 * 60000))
    return errorResponse(429, "he", "busy");
  const body = await readJson(request, 2000);
  const locale = localeOf(body?.locale);
  if (!adminConfigured()) return errorResponse(503, locale, "disabled");
  if (
    !body ||
    typeof body.password !== "string" ||
    body.password.length > 300 ||
    !checkPassword(body.password)
  )
    return errorResponse(401, locale, "auth");
  const response = json({ ok: true });
  response.cookies.set(sessionCookie, issueSession(), cookieOptions(request));
  return response;
}
