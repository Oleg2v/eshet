"use client";
import { useState } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Locale, VisaResult } from "@/lib/types";
import { pick } from "@/lib/locale";
import { Field, handoff, request, tryAgain } from "./shared";
export default function VisaTool({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const [destination, setDestination] = useState("united-states");
  const [result, setResult] = useState<VisaResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const warning = t(
    "כללי הכניסה משתנים. יש לבדוק את הדרישות במקור הרשמי לפני ההזמנה. המידע כללי ואינו קביעה לגבי זכאות או אישור כניסה.",
    "Правила въезда меняются. До бронирования проверьте требования на официальном сайте. Это общая информация, а не подтверждение права на въезд.",
    "Entry rules change. Check the official source before booking. This is general information, not a determination of eligibility or permission to enter.",
  );
  async function check() {
    setBusy(true);
    setMessage("");
    try {
      setResult(
        await request<VisaResult>("/api/visa", { locale, destination }),
      );
    } catch {
      setMessage(tryAgain(locale));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="tool-visa tool-split">
      <div className="tool-panel">
        <span className="eyebrow">
          {t("לפני שמזמינים", "До бронирования", "Before you book")}
        </span>
        <h2>
          {t(
            "הדרך מתחילה בדרכון.",
            "Начнём с паспорта.",
            "It starts with your passport.",
          )}
        </h2>
        <p>
          {t(
            "נקודת פתיחה לבעלי דרכון ישראלי. את ההחלטה בודקים תמיד מול הרשויות.",
            "Отправная точка для владельцев израильского паспорта. Окончательные требования всегда уточняйте у официальных органов.",
            "A starting point for Israeli passport holders. Always verify requirements with the relevant authorities.",
          )}
        </p>
        <form
          className="tool-fields"
          onSubmit={(e) => {
            e.preventDefault();
            void check();
          }}
        >
          <Field label={t("יעד הנסיעה", "Куда вы едете?", "Your destination")}>
            <select
              data-testid="visa-destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setResult(null);
              }}
            >
              <option value="united-states">
                {t("ארצות הברית", "США", "United States")}
              </option>
              <option value="europe">{t("אירופה", "Европа", "Europe")}</option>
              <option value="thailand">
                {t("תאילנד", "Таиланд", "Thailand")}
              </option>
              <option value="united-kingdom">
                {t("בריטניה", "Великобритания", "United Kingdom")}
              </option>
              <option value="japan">{t("יפן", "Япония", "Japan")}</option>
            </select>
          </Field>
          <button
            className="button button-dark"
            data-testid="visa-submit"
            disabled={busy}
          >
            {busy
              ? t(
                  "בודקים כיוון…",
                  "Ищем ориентиры…",
                  "Finding a starting point…",
                )
              : t(
                  "מה צריך לבדוק?",
                  "Что нужно проверить?",
                  "What should I check?",
                )}
            <ArrowUpRight size={17} />
          </button>
        </form>
        <p role="status" className="tool-status">
          {message}
        </p>
        <div className="tool-warning" data-testid="visa-warning">
          <ShieldCheck size={21} />
          <p>{warning}</p>
        </div>
      </div>
      <div
        className="tool-visa-result"
        data-testid="visa-result"
        aria-live="polite"
      >
        {result ? (
          <>
            <span className="eyebrow">
              {t(
                "מידע כללי בלבד",
                "Только общая информация",
                "General information only",
              )}
            </span>
            <h3>{result.document}</h3>
            <p>{result.destination}</p>
            <ol className="tool-steps">
              {result.steps.map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <p className="tool-note">{result.warning}</p>
            <a
              className="button button-outline"
              href={result.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.sourceLabel}
              <ArrowUpRight size={16} />
            </a>
            <button
              className="tool-text-link"
              onClick={() =>
                handoff({
                  source: "visa",
                  travellerWords: t(
                    "אשמח לעזרה בבדיקת מסמכי כניסה",
                    "Нужна помощь с проверкой въездных документов",
                    "Please help me check entry documents",
                  ),
                  selections: {
                    destination: result.destination,
                    documentToCheck: result.document,
                    officialSource: result.sourceUrl,
                  },
                  notes: warning,
                })
              }
            >
              {t(
                "לבדוק גם עם נציג",
                "Уточнить у консультанта",
                "Check with an agent too",
              )}
              <ArrowUpRight size={16} />
            </button>
          </>
        ) : (
          <div className="tool-visa-empty">
            <div className="tool-passport" aria-hidden="true">
              <span>ESHET</span>
              <ShieldCheck size={52} strokeWidth={1} />
              <span>{t("מוכנים לצאת", "Можно собираться", "Ready to go")}</span>
            </div>
            <p>
              {t(
                "בחרו יעד. נרכז את השאלות הנכונות ואת המקור הרשמי.",
                "Выберите направление — покажем, что проверить и где найти официальный ответ.",
                "Choose a destination. We’ll gather the right questions and the official source.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
