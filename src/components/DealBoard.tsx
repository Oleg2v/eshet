"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import type { Locale } from "@/lib/types";
import { pick, money } from "@/lib/locale";
const rows = [
  {
    id: "dead-sea",
    name: ["ים המלח", "Мёртвое море", "Dead Sea"],
    type: ["מלון · חצי פנסיון", "Отель · полупансион", "Hotel · half board"],
    price: 1280,
    tags: ["weekend", "holiday"],
    nights: 2,
  },
  {
    id: "eilat",
    name: ["אילת", "Эйлат", "Eilat"],
    type: ["מלון · ארוחת בוקר", "Отель · завтрак", "Hotel · breakfast"],
    price: 1490,
    tags: ["weekend", "next"],
    nights: 3,
  },
  {
    id: "jerusalem",
    name: ["ירושלים", "Иерусалим", "Jerusalem"],
    type: ["מלון · ארוחת בוקר", "Отель · завтрак", "Hotel · breakfast"],
    price: 990,
    tags: ["next", "holiday"],
    nights: 2,
  },
  {
    id: "europe",
    name: ["אירופה", "Европа", "Europe"],
    type: ["טיסה + מלון", "Перелёт + отель", "Flight + hotel"],
    price: 3200,
    tags: ["next", "tel-aviv"],
    nights: 4,
  },
];
export default function DealBoard({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("weekend");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [member, setMember] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const label = (texts: string[]) => pick(locale, texts[0], texts[1], texts[2]);
  return (
    <section className="deal-board" aria-labelledby="board-heading">
      <div className="board-heading">
        <div>
          <p className="eyebrow">THE DEPARTURE BOARD</p>
          <h2 id="board-heading">
            {pick(
              locale,
              "לא חייבים לחכות הרבה.",
              "Не обязательно ждать долго.",
              "You don’t have to wait long.",
            )}
          </h2>
        </div>
        <span className="board-live">
          <span />
          {pick(locale, "לוח להמחשה", "Демонстрация", "Illustrative board")}
        </span>
      </div>
      <div className="board-controls">
        <div
          className="board-filters"
          aria-label={pick(
            locale,
            "סינון הצעות",
            "Фильтр предложений",
            "Filter offers",
          )}
        >
          {[
            ["weekend", "בסופ״ש הקרוב", "Эти выходные", "This weekend"],
            ["next", "בשבוע הבא", "Следующая неделя", "Next week"],
            ["holiday", "בחגים", "Праздники", "Holidays"],
            ["tel-aviv", "מתל אביב", "Из Тель-Авива", "From Tel Aviv"],
          ].map(([value, he, ru, en]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => {
                setFilter(value);
                setExpanded(null);
              }}
            >
              {pick(locale, he, ru, en)}
            </button>
          ))}
        </div>
        <button
          className="member-switch"
          aria-pressed={member}
          onClick={() => setMember(!member)}
        >
          {pick(locale, "מחיר חברי קלאב", "Цена для участников", "Club price")}
          <span className={member ? "switch-on" : "switch-off"} aria-hidden />
        </button>
      </div>
      <div className="board-table">
        <div className="board-labels" aria-hidden>
          <span>{pick(locale, "היעד", "Направление", "Destination")}</span>
          <span>
            {pick(locale, "מה מחכה לכם", "Что вас ждёт", "What’s waiting")}
          </span>
          <span>
            {pick(locale, "מחיר לדוגמה", "Пример цены", "Example price")}
          </span>
          <span />
        </div>
        {rows
          .filter((row) => row.tags.includes(filter))
          .map((row, index) => (
            <div
              className="board-entry"
              key={`${filter}-${row.id}`}
              onPointerEnter={() => setHovered(row.id)}
              onPointerLeave={() => setHovered(null)}
            >
              <button
                className="board-row"
                aria-expanded={expanded === row.id}
                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                style={{ "--row": index } as React.CSSProperties}
              >
                <span className="board-destination">
                  <span className="board-number">0{index + 1}</span>
                  {label(row.name)}
                </span>
                <span className="board-type">{label(row.type)}</span>
                <span className="board-price">
                  <span className="flap-price" dir="ltr">
                    {money(row.price, locale)
                      .split("")
                      .map((char, i) => (
                        <span key={i}>{char}</span>
                      ))}
                  </span>
                  {(member || hovered === row.id) && (
                    <small>
                      {pick(
                        locale,
                        "קלאב לדוגמה",
                        "Клуб: пример",
                        "Example club",
                      )}
                      : {money(Math.round(row.price * 0.92), locale)}
                    </small>
                  )}
                </span>
                {expanded === row.id ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {expanded === row.id && (
                <div className="deal-sheet">
                  <div>
                    <p className="eyebrow">
                      {pick(
                        locale,
                        "לפני שמחליטים",
                        "Перед решением",
                        "Before you decide",
                      )}
                    </p>
                    <h3>
                      {label(row.name)}.{" "}
                      {pick(
                        locale,
                        "בקצב שלכם.",
                        "В вашем ритме.",
                        "At your pace.",
                      )}
                    </h3>
                    <p>
                      {row.id === "europe"
                        ? pick(
                            locale,
                            "דוגמה לחבילה של ארבעה לילות, לאדם בחדר זוגי. הרכב הטיסה, המלון והכבודה ייבדק מול סוכן.",
                            "Пример пакета на четыре ночи, на человека в двухместном номере. Перелёт, отель и багаж нужно уточнить у агента.",
                            "A four-night package example, per person sharing a double room. Flight, hotel and baggage need agent confirmation.",
                          )
                        : pick(
                            locale,
                            `המחיר לדוגמה לזוג ללילה, לשהייה של ${row.nights} לילות. שם המלון, תאריכים ותנאי הביטול לאישור.`,
                            `Пример цены за пару за ночь при проживании ${row.nights} ночи. Отель, даты и условия отмены нужно подтвердить.`,
                            `Example price per couple per night for ${row.nights} nights. Hotel, dates and cancellation terms require confirmation.`,
                          )}
                    </p>
                    <p className="example-note">
                      {pick(
                        locale,
                        "אין כאן מלאי או מחיר להזמנה. הנחת החבר בדוגמה: 8%, לא הטבה מובטחת.",
                        "Это не доступное предложение. Скидка 8% показана для примера и не гарантирована.",
                        "No live inventory or bookable price. The illustrative 8% member discount is not guaranteed.",
                      )}
                    </p>
                  </div>
                  <button
                    className="button button-light"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("eshet:brief", {
                          detail: {
                            source: "deal-board",
                            travellerWords: label(row.name),
                            selections: {
                              destination: label(row.name),
                              examplePriceILS: row.price,
                              exampleNights: row.nights,
                              board: label(row.type),
                              memberPreview: member,
                            },
                            notes: pick(
                              locale,
                              "אשמח לבדוק תאריכים ומחיר עדכני.",
                              "Хочу уточнить даты и актуальную цену.",
                              "Please check dates and a current price.",
                            ),
                          },
                        }),
                      )
                    }
                  >
                    {pick(
                      locale,
                      "בואו נבדוק את זה",
                      "Уточнить предложение",
                      "Let’s check this",
                    )}
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="board-foot">
        <p>
          {pick(
            locale,
            "כל ההצעות והסכומים להמחשה בלבד. המחיר הסופי והזמינות דורשים בדיקה.",
            "Все предложения и суммы приведены для примера. Цену и наличие нужно уточнить.",
            "All offers and amounts are examples. Final prices and availability need confirmation.",
          )}
        </p>
        <Link href={`/${locale}/flex`}>
          {pick(
            locale,
            "רוצים יותר גמישות?",
            "Нужна гибкость?",
            "A little more flexibility?",
          )}{" "}
          ↗
        </Link>
      </div>
    </section>
  );
}
