"use client";
import { useState } from "react";
import { ArrowUpRight, Plane, BedDouble, Plus } from "lucide-react";
import type { Locale } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import { Example, Field, handoff } from "./shared";
export default function ComposerTool({
  locale,
  kind = "packages",
}: {
  locale: Locale;
  kind?: string;
}) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const [destination, setDestination] = useState("Europe");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState(3);
  const [flight, setFlight] = useState(1250);
  const [hotel, setHotel] = useState(600);
  const [extras, setExtras] = useState(200);
  const party = adults + children;
  const rooms = Math.ceil(party / 2);
  const flightTotal = kind === "hotels" ? 0 : flight * party;
  const hotelTotal = kind === "flights" ? 0 : hotel * rooms * nights;
  const total = flightTotal + hotelTotal + extras;
  const hasFlight = kind !== "hotels",
    hasHotel = kind !== "flights";
  return (
    <div className="tool-composer tool-split">
      <div className="tool-panel">
        <div className="tool-section-heading">
          <span className="eyebrow">
            01 / {t("הבחירות שלכם", "Ваш выбор", "Your choices")}
          </span>
          <Example locale={locale} />
        </div>
        <div className="tool-fields tool-grid">
          <Field label={t("לאן?", "Куда?", "Where?")}>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="Europe">{t("אירופה", "Европа", "Europe")}</option>
              <option value="Asia">{t("אסיה", "Азия", "Asia")}</option>
              <option value="Africa">{t("אפריקה", "Африка", "Africa")}</option>
              <option value="South America">
                {t("דרום אמריקה", "Южная Америка", "South America")}
              </option>
            </select>
          </Field>
          <Field label={t("תאריך רצוי", "Желаемая дата", "Preferred date")}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label={t("מבוגרים", "Взрослые", "Adults")}>
            <input
              data-testid="composer-adults"
              type="number"
              min={1}
              max={20}
              value={adults}
              onChange={(e) =>
                setAdults(Math.max(1, Math.min(20, Number(e.target.value))))
              }
            />
          </Field>
          <Field label={t("ילדים", "Дети", "Children")}>
            <input
              data-testid="composer-children"
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) =>
                setChildren(Math.max(0, Math.min(10, Number(e.target.value))))
              }
            />
          </Field>
          {hasHotel && (
            <Field label={t("לילות", "Ночей", "Nights")}>
              <input
                data-testid="composer-nights"
                type="number"
                min={1}
                max={30}
                value={nights}
                onChange={(e) =>
                  setNights(Math.max(1, Math.min(30, Number(e.target.value))))
                }
              />
            </Field>
          )}
        </div>
        <div className="tool-divider" />
        <h3>
          {t(
            "כל חלק על השולחן.",
            "Каждая составляющая — на виду.",
            "Every part, out in the open.",
          )}
        </h3>
        <p className="tool-note">
          {t(
            "ערכו את המספרים כדי להבין איך התקציב מתחלק. זו המחשה, לא הצעת מחיר או בדיקת זמינות.",
            "Меняйте суммы, чтобы понять структуру бюджета. Это пример расчёта, не предложение и не проверка наличия.",
            "Edit the figures to see where your budget goes. This is an illustration, not a quote or an availability check.",
          )}
        </p>
        <div className="tool-fields">
          {hasFlight && (
            <Field
              label={t(
                "טיסה לאדם · ₪ לדוגמה",
                "Перелёт на человека · пример в ₪",
                "Flight per person · example ILS",
              )}
            >
              <input
                data-testid="composer-flight"
                type="number"
                min={0}
                max={100000}
                step={50}
                value={flight}
                onChange={(e) =>
                  setFlight(
                    Math.max(0, Math.min(100000, Number(e.target.value))),
                  )
                }
              />
            </Field>
          )}
          {hasHotel && (
            <Field
              label={t(
                "חדר זוגי ללילה · ₪ לדוגמה",
                "Двухместный номер за ночь · пример в ₪",
                "Double room per night · example ILS",
              )}
            >
              <input
                data-testid="composer-hotel"
                type="number"
                min={0}
                max={50000}
                step={50}
                value={hotel}
                onChange={(e) =>
                  setHotel(Math.max(0, Math.min(50000, Number(e.target.value))))
                }
              />
            </Field>
          )}
          <Field
            label={t(
              "תוספות לכל הנסיעה · ₪ לדוגמה",
              "Дополнения на всю поездку · пример в ₪",
              "Extras for the whole trip · example ILS",
            )}
          >
            <input
              data-testid="composer-extras"
              type="number"
              min={0}
              max={100000}
              step={50}
              value={extras}
              onChange={(e) =>
                setExtras(Math.max(0, Math.min(100000, Number(e.target.value))))
              }
            />
          </Field>
        </div>
      </div>
      <aside className="tool-receipt">
        <span className="eyebrow">
          02 / {t("החשבון הפתוח", "Открытый расчёт", "The open calculation")}
        </span>
        <h3>
          {t(
            "ככה זה מתחבר.",
            "Вот как всё складывается.",
            "Here’s how it adds up.",
          )}
        </h3>
        <Example locale={locale} />
        <dl className="tool-costs">
          {hasFlight && (
            <div>
              <dt>
                <Plane size={17} />
                {t("טיסות", "Перелёт", "Flights")}
                <small>
                  {party} × {money(flight, locale)}
                </small>
              </dt>
              <dd>{money(flightTotal, locale)}</dd>
            </div>
          )}
          {hasHotel && (
            <div>
              <dt>
                <BedDouble size={17} />
                {t("לינה", "Проживание", "Stay")}
                <small>
                  {rooms} {t("חדרים", "ном.", "rooms")} × {nights}{" "}
                  {t("לילות", "ноч.", "nights")} × {money(hotel, locale)}
                </small>
              </dt>
              <dd>{money(hotelTotal, locale)}</dd>
            </div>
          )}
          <div>
            <dt>
              <Plus size={17} />
              {t("תוספות", "Дополнения", "Extras")}
            </dt>
            <dd>{money(extras, locale)}</dd>
          </div>
        </dl>
        <div className="tool-total">
          <span>
            {t("סך הכול לדוגמה", "Итого в примере", "Illustrative total")}
          </span>
          <strong data-testid="composer-total" data-value={total}>
            {money(total, locale)}
          </strong>
        </div>
        {hasFlight && (
          <p className="tool-fee-note">
            {t(
              "לפי האתר הנוכחי, בהזמנת טיסה סדירה בטלפון נגבים דמי טיפול של $25 לנוסע — לאישור מול אשת.",
              "По данным текущего сайта, оформление регулярного рейса по телефону стоит $25 на пассажира — уточнить у Eshet.",
              "The current site reports a $25 handling fee per passenger for scheduled flights booked by phone — to confirm with Eshet.",
            )}
            <br />
            <b>
              {t("לקבוצה שלכם:", "Для вашей группы:", "For your party:")} $
              {25 * party}
            </b>{" "}
            ·{" "}
            {t(
              "דולר ארה״ב, בנפרד מהסכום בשקלים.",
              "Доллары США, отдельно от суммы в шекелях.",
              "USD, separate from the shekel total.",
            )}
          </p>
        )}
        <button
          className="button button-dark"
          onClick={() =>
            handoff({
              source: kind,
              travellerWords: t(
                "אשמח לבדוק את הרכב הנסיעה הזה",
                "Хочу уточнить такой вариант поездки",
                "I would like to check this trip",
              ),
              selections: {
                destination,
                date: date || t("לבחירה", "Пока не выбрана", "To decide"),
                adults,
                children,
                nights: hasHotel ? nights : 0,
                rooms: hasHotel ? rooms : 0,
                flightPerPerson: hasFlight ? flight : 0,
                hotelPerRoomNight: hasHotel ? hotel : 0,
                extras,
                illustrativeTotalILS: total,
                phoneFeeUSD: hasFlight ? 25 * party : 0,
                allAmountsAreExamples: true,
              },
              notes: "",
            })
          }
        >
          {t("לבדוק עם נציג", "Уточнить у консультанта", "Check with an agent")}
          <ArrowUpRight size={18} />
        </button>
        <p className="tool-note">
          {t(
            "לפני השליחה תראו בדיוק מה הנציג יקבל.",
            "Перед отправкой вы увидите всё сообщение.",
            "You’ll see exactly what the agent receives before sending.",
          )}
        </p>
      </aside>
    </div>
  );
}
