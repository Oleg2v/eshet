"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
export default function CookieControls({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose?: () => void;
}) {
  const [analytics, setAnalytics] = useState(false);
  const [personalisation, setPersonalisation] = useState(false);
  const [saved, setSaved] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("eshet-consent") || "{}");
      queueMicrotask(() => {
        setAnalytics(stored.analytics === true);
        setPersonalisation(stored.personalisation === true);
      });
    } catch {
      /* Keep optional consent off if storage is unavailable. */
    }
  }, []);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const target = panel.current;
    target?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
      if (event.key === "Tab" && onClose && target) {
        const nodes = Array.from(
          target.querySelectorAll<HTMLElement>("button,input:not(:disabled),a"),
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last?.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first?.focus();
          event.preventDefault();
        }
      }
    };
    target?.addEventListener("keydown", handler);
    return () => {
      target?.removeEventListener("keydown", handler);
      if (onClose) previous?.focus();
    };
  }, [onClose]);
  function save(a = analytics, p = personalisation) {
    localStorage.setItem(
      "eshet-consent",
      JSON.stringify({
        analytics: a,
        personalisation: p,
        updatedAt: new Date().toISOString(),
      }),
    );
    window.dispatchEvent(new Event("eshet:consent"));
    setSaved(true);
    onClose?.();
  }
  return (
    <div className="cookie-controls" ref={panel} tabIndex={-1}>
      <p className="eyebrow">YOUR CHOICE</p>
      <h2>
        {pick(
          locale,
          "נוח לכם. בדרך שלכם.",
          "Удобно — на ваших условиях.",
          "Comfortable. On your terms.",
        )}
      </h2>
      <p>
        {pick(
          locale,
          "העדפות ומסלול נשמרים בדפדפן כשאתם בוחרים לשמור אותם. מידע לניתוח או להתאמה אישית ייאסף רק באישורכם.",
          "Предпочтения и маршрут сохраняются в браузере по вашему запросу. Аналитика и персонализация включаются только с вашего согласия.",
          "Preferences and saved trips stay in this browser when you choose to save them. Analytics and personalisation require your permission.",
        )}
      </p>
      <label className="consent-row">
        <input type="checkbox" checked disabled />
        <span>
          {pick(
            locale,
            "הכרחי — תפקוד הטפסים ושמירת הבחירה שלכם",
            "Необходимое — формы и сохранение вашего выбора",
            "Essential — forms and your consent choice",
          )}
        </span>
      </label>
      <label className="consent-row">
        <input
          type="checkbox"
          data-testid="cookie-analytics"
          checked={analytics}
          onChange={(e) => setAnalytics(e.target.checked)}
        />
        <span>
          {pick(
            locale,
            "ניתוח שימוש אנונימי (הדגמה)",
            "Анонимная аналитика (демонстрация)",
            "Anonymous usage analytics (demo)",
          )}
        </span>
      </label>
      <label className="consent-row">
        <input
          type="checkbox"
          checked={personalisation}
          onChange={(e) => setPersonalisation(e.target.checked)}
        />
        <span>
          {pick(
            locale,
            "הצעות מותאמות בדפדפן הזה",
            "Подбор предложений в этом браузере",
            "Personalised suggestions in this browser",
          )}
        </span>
      </label>
      <div className="button-row">
        <button
          className="button button-dark"
          data-testid="cookie-save"
          onClick={() => save()}
        >
          {pick(locale, "שמירת הבחירה", "Сохранить выбор", "Save my choices")}
        </button>
        <button
          className="button button-outline"
          onClick={() => save(false, false)}
        >
          {pick(locale, "רק הכרחי", "Только необходимое", "Essential only")}
        </button>
        {onClose && (
          <button className="text-link" onClick={onClose}>
            {pick(locale, "סגירה", "Закрыть", "Close")}
          </button>
        )}
      </div>
      {saved && (
        <p role="status">
          {pick(
            locale,
            "הבחירה נשמרה.",
            "Выбор сохранён.",
            "Your choices have been saved.",
          )}
        </p>
      )}
    </div>
  );
}
