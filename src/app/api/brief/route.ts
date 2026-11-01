import {
  errorResponse,
  json,
  localeOf,
  rateLimit,
  readJson,
} from "@/lib/server/http";
import { parseBrief } from "@/lib/server/brief-validation";
import { deliverBrief } from "@/lib/server/delivery";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "brief", 20)) return errorResponse(429, "he", "busy");
  const body = await readJson(request, 40000);
  const locale = localeOf(body?.locale);
  if (!body) return errorResponse(422, locale);
  const brief = parseBrief(body);
  if (!brief) return errorResponse(422, locale);
  try {
    return json(await deliverBrief(brief), 201);
  } catch {
    return errorResponse(503, locale, "storage");
  }
}
