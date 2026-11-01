import { cookieOptions, sessionCookie } from "@/lib/server/auth";
import { errorResponse, json, sameOrigin } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403);
  const response = json({ ok: true });
  response.cookies.set(sessionCookie, "", {
    ...cookieOptions(request),
    maxAge: 0,
  });
  return response;
}
