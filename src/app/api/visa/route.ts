import {
  errorResponse,
  json,
  localeOf,
  rateLimit,
  readJson,
  textOf,
} from "@/lib/server/http";
import { classifyIntent } from "@/lib/server/llm";
import { visaResult } from "@/lib/server/visa";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "visa", 50)) return errorResponse(429, "he", "busy");
  const body = await readJson(request);
  const locale = localeOf(body?.locale);
  if (!body || !textOf(body.destination, 150))
    return errorResponse(422, locale);
  const destination = textOf(body.destination, 150);
  const classified = await classifyIntent(
    `Visa and entry enquiry: ${destination}`,
    locale,
  );
  // The model never writes entry rules. The official-source guidance stays curated.
  return json(visaResult(destination, locale, classified ? "live" : "demo"));
}
