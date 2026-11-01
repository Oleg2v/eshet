"use client";
import type { ReactNode } from "react";
import { pick, exampleLabel } from "@/lib/locale";
import type { Brief, Locale, RibbonDay, TripOption } from "@/lib/types";
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field tool-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Example({ locale }: { locale: Locale }) {
  return (
    <p className="example-note tool-example">
      <span aria-hidden="true">◌</span> {exampleLabel(locale)}
    </p>
  );
}
export function handoff(
  detail: Pick<Brief, "source" | "travellerWords" | "selections" | "notes"> & {
    options?: TripOption[];
  },
) {
  window.dispatchEvent(new CustomEvent("eshet:brief", { detail }));
}
export function saveOption(option: TripOption) {
  const previous = readRibbon();
  const count = Math.max(1, Math.min(option.days, 31));
  const nightly = /ללילה|за ночь|per night/i.test(option.priceUnit);
  const perDay = nightly
    ? option.priceMin
    : Math.round(option.priceMin / count);
  const days: RibbonDay[] = Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    title: option.title,
    destination: option.destination,
    hotel: "simple",
    price: perDay,
    distance: i ? 35 : 0,
    weather: "18–26°C",
    notes: `${option.description} · ${option.priceUnit}`,
  }));
  localStorage.setItem("eshet-ribbon", JSON.stringify([...previous, ...days]));
  window.dispatchEvent(new Event("eshet:ribbon"));
}
export function readRibbon(): RibbonDay[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("eshet-ribbon") || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (v): v is RibbonDay =>
            v &&
            typeof v.id === "string" &&
            typeof v.price === "number" &&
            typeof v.destination === "string",
        )
      : [];
  } catch {
    return [];
  }
}
export async function request<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("request");
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
export const tryAgain = (locale: Locale) =>
  pick(
    locale,
    "לא הצלחנו להשלים כרגע. אפשר לנסות שוב או לדבר עם נציג.",
    "Сейчас не удалось завершить запрос. Попробуйте ещё раз или свяжитесь с консультантом.",
    "We couldn’t complete that just now. Please try again or speak to an agent.",
  );
