"use client";
import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Locale } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import { Example, Field, handoff } from "./shared";
const regions = [
  ["eilat", "אילת", "Эйлат", "Eilat"],
  ["dead-sea", "ים המלח", "Мёртвое море", "Dead Sea"],
  ["tel-aviv", "תל אביב", "Тель-Авив", "Tel Aviv"],
  ["jerusalem", "ירושלים", "Иерусалим", "Jerusalem"],
  ["galilee", "הגליל", "Галилея", "Galilee"],
  ["tiberias", "טבריה", "Тверия", "Tiberias"],
];
const styles = [
  ["boutique", "בוטיק", "Бутик", "Boutique"],
  ["luxury", "יוקרה", "Премиум", "Luxury"],
  ["spa", "ספא", "Спа", "Spa"],
  ["kosher", "כשר", "Кошерный", "Kosher"],
  ["glamping", "גלמפינג", "Глэмпинг", "Glamping"],
  ["all-inclusive", "הכול כלול", "Всё включено", "All inclusive"],
];
export default function IsraelTool({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const l = (v: string[]) =>
    locale === "he" ? v[1] : locale === "ru" ? v[2] : v[3];
  const [region, setRegion] = useState("dead-sea");
  const [style, setStyle] = useState("spa");
  const [nights, setNights] = useState(2);
  const [party, setParty] = useState("couple");
  const [budget, setBudget] = useState(1800);
  const regionName = l(regions.find((r) => r[0] === region)!);
  const styleName = l(styles.find((s) => s[0] === style)!);
  const offers = [
    {
      name: t("בוקר איטי", "Неспешное утро", "A slow morning"),
      price: 890,
      board: t("ארוחת בוקר", "Завтрак", "Bed and breakfast"),
      score: 91,
    },
    {
      name: t("עוד קצת שקט", "Ещё немного тишины", "A little more quiet"),
      price: 1280,
      board: t("חצי פנסיון", "Полупансион", "Half board"),
      score: 96,
    },
    {
      name: t("להישאר עוד לילה", "Остаться ещё на ночь", "Stay another night"),
      price: 1690,
      board: t("חצי פנסיון", "Полупансион", "Half board"),
      score: 88,
    },
  ].filter((o) => o.price <= budget);
  return (
    <div className="tool-israel">
      <div className="tool-filter-bar">
        <Field label={t("אזור", "Регион", "Region")}>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r[0]} value={r[0]}>
                {l(r)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("מי נוסע?", "Кто едет?", "Who’s coming?")}>
          <select value={party} onChange={(e) => setParty(e.target.value)}>
            <option value="couple">{t("זוג", "Пара", "A couple")}</option>
            <option value="family">{t("משפחה", "Семья", "Family")}</option>
            <option value="friends">{t("חברים", "Друзья", "Friends")}</option>
          </select>
        </Field>
        <Field label={t("לילות", "Ночей", "Nights")}>
          <input
            type="number"
            min={1}
            max={14}
            value={nights}
            onChange={(e) =>
              setNights(Math.max(1, Math.min(14, Number(e.target.value))))
            }
          />
        </Field>
        <Field
          label={t(
            "תקציב לזוג ללילה · ₪",
            "Бюджет на двоих за ночь · ₪",
            "Budget per couple per night · ILS",
          )}
        >
          <input
            type="number"
            min={500}
            max={10000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
          />
        </Field>
      </div>
      <fieldset className="tool-styles">
        <legend>{t("הסגנון שלכם", "Ваш стиль", "Your kind of stay")}</legend>
        {styles.map((s) => (
          <label key={s[0]} className={style === s[0] ? "is-selected" : ""}>
            <input
              type="radio"
              name="israel-style"
              checked={style === s[0]}
              onChange={() => setStyle(s[0])}
            />
            {l(s)}
          </label>
        ))}
      </fieldset>
      <div className="tool-israel-results">
        <aside className="tool-israel-map">
          <div className="tool-map-caption">
            <span className="eyebrow">
              {t(
                "קרוב. אבל אחרת.",
                "Недалеко. Но по-другому.",
                "Close. But different.",
              )}
            </span>
            <h3>{regionName}</h3>
            <p>
              {t(
                "מפה סכמטית לבחירת אזור",
                "Схема для выбора региона",
                "Schematic region selector",
              )}
            </p>
          </div>
          <svg
            viewBox="0 0 280 460"
            role="img"
            aria-label={t(
              "מפת אזורי ישראל להמחשה",
              "Схематичная карта регионов Израиля",
              "Illustrative map of Israel’s regions",
            )}
          >
            <defs>
              <pattern
                id="map-lines"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".5"
                  opacity=".2"
                />
              </pattern>
            </defs>
            <rect width="280" height="460" fill="url(#map-lines)" />
            <path
              d="M155 30 L202 46 L183 90 L195 143 L169 174 L181 231 L142 305 L133 419 L114 369 L94 290 L72 239 L107 177 L129 110 Z"
              fill="#e6dccb"
              stroke="#7b8378"
              strokeWidth="1.5"
            />
            <path
              d="M195 143 L181 231"
              fill="none"
              stroke="#2f7f77"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <g fill="#2f7f77">
              {[
                [137, 387],
                [177, 217],
                [112, 172],
                [159, 195],
                [166, 71],
                [184, 104],
              ].map(([x, y], i) => (
                <g key={regions[i][0]}>
                  <circle cx={x} cy={y} r={region === regions[i][0] ? 9 : 5} />
                  {region === regions[i][0] && (
                    <circle
                      cx={x}
                      cy={y}
                      r="17"
                      fill="none"
                      stroke="#2f7f77"
                      opacity=".5"
                    />
                  )}
                </g>
              ))}
            </g>
          </svg>
          <div className="tool-map-regions">
            {regions.map((r) => (
              <button
                key={r[0]}
                onClick={() => setRegion(r[0])}
                aria-pressed={region === r[0]}
              >
                <MapPin size={13} />
                {l(r)}
              </button>
            ))}
          </div>
        </aside>
        <div>
          <div className="tool-section-heading">
            <h3>
              {t(
                "שלושה כיוונים לסוף שבוע.",
                "Идеи для выходных.",
                "Directions for a weekend.",
              )}
            </h3>
            <Example locale={locale} />
          </div>
          <p className="tool-note">
            {t(
              "אלה כיווני חיפוש להמחשה, לא מלונות או מלאי אמיתי. כשרות, הרכב חדרים ופנסיון יאושרו מול המלון.",
              "Это примеры для подбора, не реальные отели и не наличие мест. Кашрут, номера и питание нужно подтвердить у отеля.",
              "These are illustrative search directions, not real hotels or inventory. Kosher status, room occupancy and board must be confirmed with the hotel.",
            )}
          </p>
          {offers.length ? (
            offers.map((o, i) => (
              <article key={o.name} className="tool-hotel-row">
                <div
                  className={`tool-landscape tool-landscape-${i}`}
                  aria-hidden="true"
                >
                  <span>0{i + 1}</span>
                </div>
                <div className="tool-hotel-content">
                  <span className="eyebrow">
                    {regionName} / {styleName}
                  </span>
                  <h4>{o.name}</h4>
                  <p>
                    {o.board} ·{" "}
                    {t(
                      "לזוג ללילה",
                      "На двоих за ночь",
                      "Per couple per night",
                    )}
                  </p>
                  <details>
                    <summary>
                      {t(
                        "מדד סוף שבוע לדוגמה",
                        "Пример оценки выходных",
                        "Example weekend score",
                      )}{" "}
                      {o.score}/100
                    </summary>
                    <p>
                      {t(
                        "הציון מדגים התאמה לאזור ולסגנון שבחרתם. הוא אינו דירוג של מלון או חוות דעת.",
                        "Оценка показывает пример соответствия региону и стилю. Это не рейтинг отеля и не отзыв.",
                        "This illustrates fit with your selected region and style. It is not a hotel rating or review.",
                      )}
                    </p>
                  </details>
                </div>
                <div className="tool-hotel-action">
                  <strong>{money(o.price, locale)}</strong>
                  <span className="example-note">
                    {t("מחיר לדוגמה", "Пример цены", "Example price")}
                  </span>
                  <button
                    className="tool-round-button"
                    aria-label={`${t("לבדוק את", "Уточнить", "Enquire about")} ${o.name}`}
                    onClick={() =>
                      handoff({
                        source: "israel",
                        travellerWords: o.name,
                        selections: {
                          region: regionName,
                          style: styleName,
                          party,
                          nights,
                          budget,
                          examplePricePerCouplePerNightILS: o.price,
                          exampleBoard: o.board,
                          exampleScore: o.score,
                        },
                        notes: t(
                          "כיוון חיפוש להמחשה; נדרש אימות מלון, כשרות והרכב חדרים.",
                          "Пример подбора; уточнить отель, кашрут и размещение.",
                          "Illustrative direction; confirm hotel, kosher status and occupancy.",
                        ),
                      })
                    }
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="tool-empty">
              {t(
                "אין דוגמה בטווח הזה. עדכנו תקציב או שלחו את הבקשה לנציג.",
                "В этом диапазоне нет демонстрационного варианта. Измените бюджет или отправьте запрос консультанту.",
                "No example in that range. Adjust your budget or send your request to an agent.",
              )}
            </p>
          )}
          <button
            className="button button-outline"
            onClick={() =>
              handoff({
                source: "israel",
                travellerWords: t(
                  "עזרו לי למצוא מלון בארץ",
                  "Помогите подобрать отель в Израиле",
                  "Help me find a hotel in Israel",
                ),
                selections: {
                  region: regionName,
                  style: styleName,
                  party,
                  nights,
                  budget,
                },
                notes: "",
              })
            }
          >
            {t(
              "מצאו לי מלון בארץ",
              "Подобрать отель в Израиле",
              "Find me a hotel in Israel",
            )}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
