"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { DialValues, Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
export type PlannerMood = {
  values: DialValues;
  party: "couple" | "family" | "friends";
  budget: string;
};
function subscribe(callback: () => void) {
  window.addEventListener("eshet:mood", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("eshet:mood", callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot() {
  try {
    return sessionStorage.getItem("eshet-mood") || "";
  } catch {
    return "";
  }
}
export function usePlannerMood() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  return useMemo<PlannerMood | null>(() => {
    try {
      const parsed = JSON.parse(raw);
      const keys: Array<keyof DialValues> = [
        "temperature",
        "energy",
        "landscape",
        "comfort",
      ];
      if (
        !parsed?.values ||
        !keys.every(
          (key) =>
            typeof parsed.values[key] === "number" &&
            parsed.values[key] >= 0 &&
            parsed.values[key] <= 100,
        ) ||
        !["couple", "family", "friends"].includes(parsed.party) ||
        !/^\d{2,6}-\d{2,6}$/.test(parsed.budget)
      )
        return null;
      return parsed as PlannerMood;
    } catch {
      return null;
    }
  }, [raw]);
}
export default function MoodContext({
  locale,
  mood,
}: {
  locale: Locale;
  mood: PlannerMood | null;
}) {
  if (!mood) return null;
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const choices = [
    mood.values.temperature < 45
      ? t("מזג אוויר חם", "Тёплая погода", "Warm weather")
      : mood.values.temperature > 55
        ? t("אוויר קריר", "Прохладный воздух", "Cooler air")
        : t("מזג אוויר נעים", "Мягкая погода", "Mild weather"),
    mood.values.energy < 45
      ? t("קצב שקט", "Спокойный ритм", "A quiet pace")
      : mood.values.energy > 55
        ? t("קצת יותר תנועה", "Больше движения", "A livelier pace")
        : t("קצב מאוזן", "Умеренный темп", "A balanced pace"),
    mood.values.landscape < 45
      ? t("קרוב לתרבות", "Ближе к культуре", "Closer to culture")
      : mood.values.landscape > 55
        ? t("יותר טבע", "Больше природы", "More nature")
        : t("תרבות וטבע", "Культура и природа", "Culture and nature"),
    mood.values.comfort < 45
      ? t("נעים ופשוט", "Просто и удобно", "Simple and comfortable")
      : mood.values.comfort > 55
        ? t("קצת להתפנק", "Немного роскоши", "A little indulgence")
        : t("נוחות במידה", "Комфорт без излишеств", "Comfort in balance"),
    mood.party === "couple"
      ? t("זוג", "Вдвоём", "Two of us")
      : mood.party === "family"
        ? t("משפחה", "С семьёй", "Family")
        : t("חברים", "С друзьями", "Friends"),
    `${mood.budget.replace("-", "–")} ₪ · ${t("ללילה לדוגמה", "за ночь, пример", "per night, example")}`,
  ];
  return (
    <aside className="tool-mood-context" data-testid="planner-mood">
      <div>
        <span className="eyebrow">
          {t(
            "הכיוון שהבאתם מהבית",
            "Ваши настройки поездки",
            "The feeling you brought with you",
          )}
        </span>
        <p>
          {t(
            "הבחירות האלה מצטרפות לבקשה שלכם. אפשר להוסיף או לשנות כל פרט במילים.",
            "Учтём эти настройки вместе с запросом. Любую деталь можно уточнить или изменить словами.",
            "These choices travel with your request. Add or change any detail in your own words.",
          )}
        </p>
      </div>
      <ul>
        {choices.map((choice) => (
          <li key={choice}>{choice}</li>
        ))}
      </ul>
      <button
        type="button"
        className="tool-text-link"
        onClick={() => {
          try {
            sessionStorage.removeItem("eshet-mood");
            window.dispatchEvent(new Event("eshet:mood"));
          } catch {
            /* Functional preferences are optional when storage is blocked. */
          }
        }}
      >
        {t(
          "להתחיל בלי ההעדפות האלה",
          "Начать без этих настроек",
          "Start without these preferences",
        )}
      </button>
    </aside>
  );
}
