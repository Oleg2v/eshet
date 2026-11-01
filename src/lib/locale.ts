import type { Locale } from "./types";
export function pick(locale: Locale, he: string, ru: string, en: string) {
  return locale === "he" ? he : locale === "ru" ? ru : en;
}
export function money(value: number, locale: Locale = "he") {
  return new Intl.NumberFormat(
    locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : "en-IL",
    { style: "currency", currency: "ILS", maximumFractionDigits: 0 },
  ).format(value);
}
export const exampleLabel = (locale: Locale) =>
  pick(
    locale,
    "נתוני המחשה בלבד",
    "Демонстрационные данные",
    "Illustrative data only",
  );
