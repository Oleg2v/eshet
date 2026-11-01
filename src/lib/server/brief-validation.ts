import type { Brief, TripOption } from "@/lib/types";
import { isObject, localeOf } from "./http";
const string = (v: unknown, max = 4000) =>
  typeof v === "string" && v.length <= max;
function validValue(value: unknown, depth = 0): boolean {
  if (depth > 6) return false;
  if (value === null || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length <= 4000;
  if (Array.isArray(value))
    return value.length <= 50 && value.every((v) => validValue(v, depth + 1));
  if (isObject(value))
    return (
      Object.keys(value).length <= 50 &&
      Object.entries(value).every(
        ([key, v]) => key.length <= 200 && validValue(v, depth + 1),
      )
    );
  return false;
}
function validOption(value: unknown): value is TripOption {
  if (!isObject(value)) return false;
  if (
    ![
      "id",
      "title",
      "destination",
      "description",
      "why",
      "priceUnit",
      "tag",
    ].every((key) => string(value[key], 2000))
  )
    return false;
  if (
    !["priceMin", "priceMax", "days"].every(
      (key) =>
        typeof value[key] === "number" &&
        Number.isFinite(value[key]) &&
        Number(value[key]) >= 0 &&
        Number(value[key]) <= 100000000,
    )
  )
    return false;
  return (
    Number(value.priceMax) >= Number(value.priceMin) &&
    Array.isArray(value.checks) &&
    value.checks.length <= 20 &&
    value.checks.every((v) => string(v, 2000))
  );
}
export function parseBrief(body: Record<string, unknown>): Brief | null {
  if (
    body.consent !== true ||
    !string(body.source, 100) ||
    !body.source ||
    !string(body.travellerWords) ||
    !isObject(body.selections) ||
    !validValue(body.selections) ||
    !string(body.notes)
  )
    return null;
  if (body.name !== undefined && !string(body.name, 150)) return null;
  if (body.contact !== undefined && !string(body.contact, 320)) return null;
  if (
    body.options !== undefined &&
    (!Array.isArray(body.options) ||
      body.options.length > 10 ||
      !body.options.every(validOption))
  )
    return null;
  return {
    locale: localeOf(body.locale),
    source: body.source as string,
    travellerWords: body.travellerWords as string,
    selections: body.selections,
    notes: body.notes as string,
    consent: true,
    ...(typeof body.name === "string" ? { name: body.name } : {}),
    ...(typeof body.contact === "string" ? { contact: body.contact } : {}),
    ...(Array.isArray(body.options)
      ? { options: body.options as TripOption[] }
      : {}),
  };
}
