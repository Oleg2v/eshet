import {
  errorResponse,
  isObject,
  json,
  localeOf,
  rateLimit,
  readJson,
} from "@/lib/server/http";
import { deliverBrief } from "@/lib/server/delivery";
import type { Brief } from "@/lib/types";
import { parseBrief } from "@/lib/server/brief-validation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "events", 10))
    return errorResponse(429, "he", "busy");
  const body = await readJson(request, 6000);
  const locale = localeOf(body?.locale);
  if (!body || body.consent !== true) return errorResponse(422, locale);
  if (
    body.event !== "abandoned-search" &&
    body.type !== "abandoned-search" &&
    body.source !== "abandoned-search"
  )
    return errorResponse(422, locale);
  const brief: Brief = {
    locale,
    source: "abandoned-search",
    travellerWords: "",
    selections: {
      ...(isObject(body.selections) ? body.selections : {}),
      ...(isObject(body.preferences) ? body.preferences : {}),
      ...(isObject(body.dials) ? { dials: body.dials } : {}),
      ...(isObject(body.dialSettings)
        ? { dialSettings: body.dialSettings }
        : {}),
    },
    notes: "Consented anonymous demo search event",
    consent: true,
  };
  if (!parseBrief(brief)) return errorResponse(422, locale);
  try {
    const result = await deliverBrief(brief);
    return json({ id: result.id, delivery: result.delivery }, 201);
  } catch {
    return errorResponse(503, locale, "storage");
  }
}
