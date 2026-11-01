"use client";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GripVertical,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import type { Locale, RibbonDay } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import { Example, Field, handoff } from "./shared";
const empty = "[]";
function subscribe(callback: () => void) {
  window.addEventListener("eshet:ribbon", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("eshet:ribbon", callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem("eshet-ribbon") || empty;
  } catch {
    return empty;
  }
}
export default function RibbonTool({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const storage = useSyncExternalStore(subscribe, snapshot, () => empty);
  const [message, setMessage] = useState("");
  const [stop, setStop] = useState("");
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const days = useMemo<RibbonDay[]>(() => {
    try {
      const parsed: unknown = JSON.parse(storage);
      return Array.isArray(parsed)
        ? parsed.filter(
            (x): x is RibbonDay =>
              x &&
              typeof x.id === "string" &&
              typeof x.price === "number" &&
              typeof x.destination === "string",
          )
        : [];
    } catch {
      return [];
    }
  }, [storage]);
  const total = days.reduce((sum, day) => sum + day.price, 0);
  const km = days.reduce((sum, day) => sum + day.distance, 0);
  function write(next: RibbonDay[]) {
    try {
      localStorage.setItem("eshet-ribbon", JSON.stringify(next));
      window.dispatchEvent(new Event("eshet:ribbon"));
    } catch {
      setMessage(
        t(
          "השמירה בדפדפן לא זמינה. אפשר לשלוח את המסלול לנציג.",
          "Сохранение в браузере недоступно. Можно передать маршрут консультанту.",
          "Browser storage is unavailable. You can send the ribbon to an agent.",
        ),
      );
    }
  }
  function add() {
    const destination = stop.trim() || t("ים המלח", "Мёртвое море", "Dead Sea");
    write([
      ...days,
      {
        id: crypto.randomUUID(),
        title: t("זמן להכיר את המקום", "Время освоиться", "Time to settle in"),
        destination,
        hotel: "simple",
        price: 420,
        distance: 35,
        weather: "18–26°C",
        notes: t(
          "יום להמחשה. המלון, המרחק ומזג האוויר דורשים בדיקה.",
          "Демонстрационный день. Отель, расстояние и погоду нужно уточнить.",
          "Illustrative day. Confirm hotel, distance and weather.",
        ),
      },
    ]);
    setStop("");
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= days.length || from === to) return;
    const next = [...days];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    write(next);
    setMessage(
      t("סדר הימים עודכן", "Порядок дней изменён", "Day order updated"),
    );
  }
  function drop(source: string | null, target: string | null) {
    if (source && target)
      move(
        days.findIndex((d) => d.id === source),
        days.findIndex((d) => d.id === target),
      );
    setDragged(null);
    setOver(null);
  }
  return (
    <section className="tool-ribbon">
      <div className="tool-section-heading">
        <div>
          <span className="eyebrow">YOUR TRIP, YOUR RHYTHM</span>
          <h2>
            {t(
              "לא עוד רשימה. המסלול שלכם.",
              "Не список. Ваша поездка.",
              "Not another list. Your journey.",
            )}
          </h2>
        </div>
        <Example locale={locale} />
      </div>
      <p className="tool-note">
        {t(
          "גררו את הידית כדי לסדר ימים, או השתמשו בחצים. אפשר להחליף סגנון לינה ולהוסיף עצירה. כל מזג האוויר, המרחקים והסכומים להמחשה.",
          "Перетаскивайте дни за ручку или пользуйтесь стрелками. Меняйте тип проживания и добавляйте остановки. Погода, расстояния и суммы — примеры.",
          "Drag a handle to reorder days, or use the arrow buttons. Swap your stay and add a stop. All weather, distances and amounts are illustrative.",
        )}
      </p>
      {days.length > 0 ? (
        <div className="tool-ribbon-track" data-testid="ribbon-days">
          {days.map((day, i) => (
            <article
              className={`tool-day ${dragged === day.id ? "is-dragged" : ""} ${over === day.id ? "is-over" : ""}`}
              key={day.id}
              data-day-id={day.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(day.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop(dragged, day.id);
              }}
            >
              <div className="tool-day-top">
                <span className="eyebrow">
                  {t("יום", "День", "Day")} {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className="tool-drag-handle"
                  draggable
                  onDragStart={() => setDragged(day.id)}
                  onDragEnd={() => {
                    setDragged(null);
                    setOver(null);
                  }}
                  onPointerDown={(e) => {
                    if (e.pointerType === "mouse") return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    pointerStart.current = { x: e.clientX, y: e.clientY };
                    setDragged(day.id);
                  }}
                  onPointerMove={(e) => {
                    if (!pointerStart.current) return;
                    const target = document
                      .elementFromPoint(e.clientX, e.clientY)
                      ?.closest<HTMLElement>("[data-day-id]");
                    if (target) setOver(target.dataset.dayId || null);
                  }}
                  onPointerUp={(e) => {
                    if (!pointerStart.current) return;
                    const moved =
                      Math.hypot(
                        e.clientX - pointerStart.current.x,
                        e.clientY - pointerStart.current.y,
                      ) > 10;
                    pointerStart.current = null;
                    if (moved) drop(dragged, over);
                    else {
                      setDragged(null);
                      setOver(null);
                    }
                  }}
                  onPointerCancel={() => {
                    pointerStart.current = null;
                    setDragged(null);
                    setOver(null);
                  }}
                  aria-label={t(
                    `גרירת יום ${i + 1}. אפשר גם להשתמש בכפתורי הסדר.`,
                    `Перетащить день ${i + 1}. Также доступны кнопки порядка.`,
                    `Drag day ${i + 1}. Order buttons are also available.`,
                  )}
                >
                  <GripVertical size={21} />
                </button>
              </div>
              <div
                className={`tool-day-art tool-day-art-${i % 3}`}
                aria-hidden="true"
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>
                <MapPin size={16} />
                {day.destination}
              </h3>
              <p>{day.title}</p>
              <div className="tool-day-details">
                <span>{day.weather}</span>
                <span>
                  {day.distance} {t("ק״מ", "км", "km")}
                </span>
              </div>
              <Field
                label={t(
                  "סגנון לינה לדוגמה",
                  "Пример проживания",
                  "Illustrative stay",
                )}
              >
                <select
                  value={day.hotel}
                  onChange={(e) => {
                    const hotel = e.target.value as RibbonDay["hotel"];
                    write(
                      days.map((d) =>
                        d.id === day.id
                          ? {
                              ...d,
                              hotel,
                              price:
                                d.price + (hotel === "boutique" ? 250 : -250),
                            }
                          : d,
                      ),
                    );
                  }}
                >
                  <option value="simple">
                    {t(
                      "נעים ופשוט",
                      "Просто и удобно",
                      "Simple and comfortable",
                    )}
                  </option>
                  <option value="boutique">
                    {t(
                      "בוטיק · תוספת 250 ₪ לדוגמה",
                      "Бутик · пример доплаты 250 ₪",
                      "Boutique · example extra ILS 250",
                    )}
                  </option>
                </select>
              </Field>
              <div className="tool-day-price">
                <span>
                  {t(
                    "עלות יום לדוגמה",
                    "Пример суммы за день",
                    "Example day cost",
                  )}
                </span>
                <strong>{money(day.price, locale)}</strong>
              </div>
              <div className="tool-day-controls">
                <button
                  className="tool-round-button"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                  aria-label={t(
                    `להקדים את יום ${i + 1}`,
                    `Переместить день ${i + 1} раньше`,
                    `Move day ${i + 1} earlier`,
                  )}
                >
                  {locale === "he" ? (
                    <ArrowRight size={17} />
                  ) : (
                    <ArrowLeft size={17} />
                  )}
                </button>
                <button
                  className="tool-round-button"
                  disabled={i === days.length - 1}
                  onClick={() => move(i, i + 1)}
                  aria-label={t(
                    `לאחר את יום ${i + 1}`,
                    `Переместить день ${i + 1} позже`,
                    `Move day ${i + 1} later`,
                  )}
                >
                  {locale === "he" ? (
                    <ArrowLeft size={17} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
                <button
                  className="tool-round-button tool-delete"
                  onClick={() => write(days.filter((d) => d.id !== day.id))}
                  aria-label={t(
                    `להסיר את יום ${i + 1}`,
                    `Удалить день ${i + 1}`,
                    `Remove day ${i + 1}`,
                  )}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="tool-ribbon-empty">
          <span aria-hidden="true">01 — 02 — 03</span>
          <h3>
            {t(
              "המסלול מתחיל מכיוון אחד.",
              "Маршрут начинается с первой идеи.",
              "A journey starts with one direction.",
            )}
          </h3>
          <p>
            {t(
              "שמרו רעיון מהמתכנן למעלה, או הוסיפו כאן עצירה ראשונה.",
              "Сохраните вариант из планировщика выше или добавьте первую остановку здесь.",
              "Save an idea from the planner above, or add your first stop below.",
            )}
          </p>
        </div>
      )}
      <form
        className="tool-add-stop"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Field label={t("להוסיף עצירה", "Добавить остановку", "Add a stop")}>
          <input
            maxLength={80}
            placeholder={t(
              "למשל, ים המלח",
              "Например, Мёртвое море",
              "For example, the Dead Sea",
            )}
            value={stop}
            onChange={(e) => setStop(e.target.value)}
          />
        </Field>
        <button className="button button-outline">
          <Plus size={17} />
          {t("להוסיף יום", "Добавить день", "Add a day")}
        </button>
      </form>
      <p role="status" className="tool-status">
        {message}
      </p>
      {days.length > 0 && (
        <div className="tool-ribbon-summary">
          <div>
            <span className="eyebrow">
              {days.length} {t("ימים", "дней", "days")} · {km}{" "}
              {t("ק״מ לדוגמה", "км в примере", "example km")}
            </span>
            <div className="tool-total">
              <span>
                {t(
                  "סכום כל הימים · להמחשה",
                  "Сумма всех дней · пример",
                  "All days added up · example",
                )}
              </span>
              <strong>{money(total, locale)}</strong>
            </div>
          </div>
          <button
            className="button button-dark"
            onClick={() =>
              handoff({
                source: "ribbon",
                travellerWords: t(
                  "זה המסלול שהרכבתי",
                  "Вот маршрут, который я составил",
                  "Here is the ribbon I put together",
                ),
                selections: {
                  days,
                  illustrativeTotalILS: total,
                  illustrativeDistanceKm: km,
                },
                notes: t(
                  "כל הסכומים, המלונות, המרחקים ומזג האוויר להמחשה.",
                  "Все суммы, отели, расстояния и погода приведены для примера.",
                  "All amounts, hotels, distances and weather are illustrative.",
                ),
              })
            }
          >
            {t(
              "לקחת את זה לנציג",
              "Обсудить с консультантом",
              "Take this to an agent",
            )}
            <ArrowUpRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
