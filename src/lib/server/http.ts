import { NextResponse } from "next/server";
import type { Locale } from "@/lib/types";
import { pick } from "@/lib/locale";

export const localeOf = (value: unknown): Locale =>
  value === "ru" || value === "en" ? value : "he";
export const textOf = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
export const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
export function errorResponse(
  status: number,
  locale: Locale = "he",
  type: "input" | "busy" | "storage" | "auth" | "disabled" = "input",
) {
  const messages = {
    input: pick(
      locale,
      "כדאי לבדוק את הפרטים ולנסות שוב.",
      "Проверьте данные и попробуйте ещё раз.",
      "Please check the details and try again.",
    ),
    busy: pick(
      locale,
      "רגע קטן, ואז אפשר לנסות שוב. אפשר גם לדבר עם נציג.",
      "Подождите немного и попробуйте снова. Можно также позвонить агенту.",
      "Please pause briefly and try again. You can also call an agent.",
    ),
    storage: pick(
      locale,
      "הבקשה לא נשמרה כרגע. הפרטים נשארו אצלכם; אפשר לנסות שוב או לפנות בטלפון.",
      "Сейчас заявку сохранить не удалось. Данные остались у вас: попробуйте снова или позвоните.",
      "Your request could not be saved just now. Your details remain on screen; retry or call us.",
    ),
    auth: pick(
      locale,
      "פרטי הכניסה לא התאימו. נסו שוב.",
      "Не удалось войти. Проверьте пароль.",
      "Those sign-in details did not match. Please try again.",
    ),
    disabled: pick(
      locale,
      "תיבת הפניות זמינה לאחר הגדרת סיסמה פרטית בסביבה.",
      "Вход доступен после настройки личного пароля в среде.",
      "The inbox becomes available after a private password is configured in the environment.",
    ),
  };
  return NextResponse.json(
    { error: messages[type], code: type },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
// Memory bounded protection for the concept instance; use shared Redis limits in production.
const windows = new Map<string, { count: number; until: number }>();
export function rateLimit(
  request: Request,
  scope: string,
  maximum = 30,
  interval = 60000,
): boolean {
  const now = Date.now();
  if (windows.size > 2000)
    for (const [key, value] of windows)
      if (value.until < now) windows.delete(key);
  if (windows.size > 5000) return false;
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 80) ||
    "local";
  const key = `${scope}:${ip}`;
  const old = windows.get(key);
  if (!old || old.until < now) {
    windows.set(key, { count: 1, until: now + interval });
    return true;
  }
  old.count += 1;
  return old.count <= maximum;
}
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients are still subject to validation and rate limits
  try {
    // Next may reconstruct request.url from its bind address (0.0.0.0).
    // The HTTP Host header is the browser's actual origin target.
    const host = request.headers.get("host") || new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
export async function readJson(
  request: Request,
  maxBytes = 24000,
): Promise<Record<string, unknown> | null> {
  if (!sameOrigin(request)) return null;
  if (!request.headers.get("content-type")?.includes("application/json"))
    return null;
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes) return null;
  try {
    const reader = request.body?.getReader();
    if (!reader) return null;
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const raw = new TextDecoder().decode(Buffer.concat(chunks));
    const value: unknown = JSON.parse(raw);
    return isObject(value) ? value : null;
  } catch {
    return null;
  }
}
export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
