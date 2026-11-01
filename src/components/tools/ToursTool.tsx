"use client";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Locale, TripOption } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import {
  Example,
  Field,
  handoff,
  request,
  saveOption,
  tryAgain,
} from "./shared";
export default function ToursTool({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const [pace, setPace] = useState(35);
  const [fitness, setFitness] = useState("moderate");
  const [interests, setInterests] = useState("culture");
  const [region, setRegion] = useState("Asia");
  const [groupSize, setGroupSize] = useState("small");
  const [month, setMonth] = useState("April");
  const [budget, setBudget] = useState(15000);
  const [options, setOptions] = useState<TripOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  async function match() {
    setBusy(true);
    setMessage("");
    try {
      const result = await request<{
        options: TripOption[];
        mode: string;
        disclaimer: string;
      }>("/api/tours", {
        locale,
        pace,
        fitness,
        interests,
        region,
        groupSize,
        month,
        budget,
      });
      setOptions(result.options.slice(0, 3));
      setSelected(result.options.slice(0, 3).map((o) => o.id));
    } catch {
      setMessage(tryAgain(locale));
    } finally {
      setBusy(false);
    }
  }
  const compared = options.filter((o) => selected.includes(o.id));
  const position = (id: string) =>
    Math.max(
      0,
      options.findIndex((option) => option.id === id),
    );
  return (
    <div className="tool-tours">
      <div className="tool-panel">
        <div className="tool-section-heading">
          <h2>
            {t(
              "הטיול צריך להתאים לקצב שלכם.",
              "У поездки должен быть ваш ритм.",
              "The trip should move at your pace.",
            )}
          </h2>
          <Example locale={locale} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void match();
          }}
        >
          <div className="tool-filter-bar">
            <Field
              label={t(
                "איזה אזור מושך אתכם?",
                "Какой регион вам интересен?",
                "Which region draws you in?",
              )}
            >
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {[
                  ["Asia", "אסיה", "Азия", "Asia"],
                  ["Europe", "אירופה", "Европа", "Europe"],
                  ["Africa", "אפריקה", "Африка", "Africa"],
                  [
                    "South America",
                    "דרום אמריקה",
                    "Южная Америка",
                    "South America",
                  ],
                ].map((v) => (
                  <option key={v[0]} value={v[0]}>
                    {t(v[1], v[2], v[3])}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label={t(
                "כושר והליכה",
                "Ходьба и нагрузка",
                "Walking and fitness",
              )}
            >
              <select
                value={fitness}
                onChange={(e) => setFitness(e.target.value)}
              >
                <option value="easy">
                  {t("מעט הליכה", "Небольшие прогулки", "Light walking")}
                </option>
                <option value="moderate">
                  {t("הליכה מתונה", "Умеренная нагрузка", "Moderate walking")}
                </option>
                <option value="active">
                  {t("אוהבים ללכת", "Любим ходить", "Happy to hike")}
                </option>
              </select>
            </Field>
            <Field
              label={t(
                "מה מעניין אתכם?",
                "Что вам интересно?",
                "What interests you?",
              )}
            >
              <select
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              >
                <option value="culture">
                  {t("תרבות ואוכל", "Культура и кухня", "Culture and food")}
                </option>
                <option value="nature">
                  {t(
                    "טבע ונופים",
                    "Природа и пейзажи",
                    "Nature and landscapes",
                  )}
                </option>
                <option value="family">
                  {t("טיול משפחתי", "Семейная поездка", "A family trip")}
                </option>
              </select>
            </Field>
            <Field
              label={t(
                "גודל קבוצה מועדף",
                "Размер группы",
                "Preferred group size",
              )}
            >
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
              >
                <option value="small">{t("קטנה", "Небольшая", "Small")}</option>
                <option value="any">
                  {t("גמישים", "Не принципиально", "Flexible")}
                </option>
              </select>
            </Field>
            <Field label={t("חודש מועדף", "Желаемый месяц", "Preferred month")}>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {[
                  ["January", "ינואר", "Январь"],
                  ["February", "פברואר", "Февраль"],
                  ["March", "מרץ", "Март"],
                  ["April", "אפריל", "Апрель"],
                  ["May", "מאי", "Май"],
                  ["June", "יוני", "Июнь"],
                  ["July", "יולי", "Июль"],
                  ["August", "אוגוסט", "Август"],
                  ["September", "ספטמבר", "Сентябрь"],
                  ["October", "אוקטובר", "Октябрь"],
                  ["November", "נובמבר", "Ноябрь"],
                  ["December", "דצמבר", "Декабрь"],
                ].map((m) => (
                  <option key={m[0]} value={m[0]}>
                    {t(m[1], m[2], m[0])}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label={t(
                "תקציב לאדם · ₪",
                "Бюджет на человека · ₪",
                "Budget per person · ILS",
              )}
            >
              <input
                type="number"
                min={1000}
                max={100000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label={t("קצב הטיול", "Темп поездки", "Trip pace")}>
            <input
              type="range"
              min={0}
              max={100}
              value={pace}
              onChange={(e) => setPace(Number(e.target.value))}
              aria-valuetext={
                pace < 40
                  ? t("נינוח", "Спокойный", "Relaxed")
                  : pace < 70
                    ? t("מאוזן", "Умеренный", "Balanced")
                    : t("פעיל", "Активный", "Active")
              }
            />
            <span className="tool-range-labels">
              <span>
                {t(
                  "לאט, עם זמן להסתכל",
                  "Неспешно, с паузами",
                  "Slow, with time to look",
                )}
              </span>
              <span>
                {t(
                  "יותר דרך, יותר תנועה",
                  "Больше маршрутов и движения",
                  "More ground, more movement",
                )}
              </span>
            </span>
          </Field>
          <button className="button button-dark" disabled={busy}>
            {busy
              ? t(
                  "מתאימים כיוונים…",
                  "Подбираем варианты…",
                  "Matching your pace…",
                )
              : t("להשוות טיולים", "Сравнить маршруты", "Compare tours")}
            <ArrowUpRight size={17} />
          </button>
        </form>
        <p role="status" className="tool-status">
          {message}
        </p>
      </div>
      {options.length > 0 && (
        <section className="tool-tour-comparison" data-testid="tour-results">
          <div className="tool-section-heading">
            <h3>
              {t(
                "רואים את ההבדל.",
                "Разница — перед глазами.",
                "See the difference.",
              )}
            </h3>
            <Example locale={locale} />
          </div>
          <fieldset className="tool-comparison-choices">
            <legend>
              {t(
                "עד שלושה טיולים להשוואה",
                "До трёх маршрутов для сравнения",
                "Compare up to three tours",
              )}
            </legend>
            {options.map((option) => (
              <label key={option.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, option.id]
                        : selected.filter((id) => id !== option.id),
                    )
                  }
                />
                {option.title}
              </label>
            ))}
          </fieldset>
          {compared.length > 0 ? (
            <div
              className="tool-table-scroll"
              role="region"
              tabIndex={0}
              aria-label={t(
                "טבלת השוואת טיולים",
                "Таблица сравнения маршрутов",
                "Tour comparison table",
              )}
            >
              <table className="tool-table">
                <caption>
                  {t(
                    "כל המסלולים והפרטים להמחשה בלבד. יציאה מובטחת תאושר מול אשת.",
                    "Все маршруты и детали демонстрационные. Гарантию выезда нужно подтвердить у Eshet.",
                    "All routes and details are illustrative. Guaranteed departures must be confirmed with Eshet.",
                  )}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      {t("מה משווים", "Что сравниваем", "What matters")}
                    </th>
                    {compared.map((option) => (
                      <th scope="col" key={option.id}>
                        {option.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      {t("המסלול", "Маршрут", "Itinerary shape")}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>{o.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "למה מתאים לכם",
                        "Почему вам подходит",
                        "Why it fits you",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>{o.why}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "מה צריך לאשר",
                        "Что нужно уточнить",
                        "What to confirm",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        <ul className="tool-comparison-checks">
                          {o.checks.map((check) => (
                            <li key={check}>{check}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "משך לדוגמה",
                        "Пример длительности",
                        "Example duration",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {o.days} {t("ימים", "дней", "days")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "הליכה ביום · דוגמה",
                        "Ходьба в день · пример",
                        "Daily walking · example",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {[2, 4, 6][position(o.id)]}–{[4, 6, 9][position(o.id)]}{" "}
                        {t("ק״מ", "км", "km")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t("קבוצה · דוגמה", "Группа · пример", "Group · example")}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {[12, 18, 24][position(o.id)]}{" "}
                        {t("משתתפים", "участников", "travellers")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "יציאה מובטחת",
                        "Гарантия выезда",
                        "Guaranteed departure",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {position(o.id) === 0
                          ? t(
                              "סימון לדוגמה — נדרש אישור",
                              "Пример отметки — подтвердить",
                              "Example flag — to confirm",
                            )
                          : t("לבדיקה", "Уточнить", "To check")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "מה כלול · דוגמה",
                        "Что включено · пример",
                        "Included · example",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {t(
                          "הדרכה, לינה והסעות. פירוט לאישור.",
                          "Гид, проживание и переезды. Состав уточняется.",
                          "Guiding, stays and transfers. Details to confirm.",
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "טווח מחיר לדוגמה",
                        "Пример цены",
                        "Example price range",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        {money(o.priceMin, locale)}–{money(o.priceMax, locale)}
                        <small>{o.priceUnit}</small>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">
                      {t(
                        "שומרים כיוון",
                        "Сохранить вариант",
                        "Keep a direction",
                      )}
                    </th>
                    {compared.map((o) => (
                      <td key={o.id}>
                        <button
                          className="button button-outline"
                          onClick={() => {
                            try {
                              saveOption(o);
                              setSaved([...saved, o.id]);
                            } catch {
                              setMessage(tryAgain(locale));
                            }
                          }}
                        >
                          {saved.includes(o.id) ? <Check size={15} /> : null}
                          {saved.includes(o.id)
                            ? t("נשמר", "Сохранено", "Saved")
                            : t(
                                "למסלול שלי",
                                "В мой маршрут",
                                "Save to ribbon",
                              )}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>
              {t(
                "בחרו לפחות טיול אחד להשוואה.",
                "Выберите хотя бы один маршрут.",
                "Select at least one tour to compare.",
              )}
            </p>
          )}
          <button
            className="button button-dark"
            disabled={!compared.length}
            onClick={() =>
              handoff({
                source: "tours",
                travellerWords: t(
                  "אשמח לעזרה בבחירה בין הטיולים",
                  "Помогите выбрать между маршрутами",
                  "Help me choose between these tours",
                ),
                selections: {
                  region,
                  pace,
                  fitness,
                  interests,
                  groupSize,
                  month,
                  budget,
                  comparison: compared.map((o) => ({
                    id: o.id,
                    days: o.days,
                    exampleWalkingKm: `${[2, 4, 6][position(o.id)]}–${[4, 6, 9][position(o.id)]}`,
                    exampleGroupSize: [12, 18, 24][position(o.id)],
                    guaranteedDepartureToConfirm: true,
                  })),
                },
                options: compared,
                notes: t(
                  "כל פרטי ההשוואה הם דוגמאות ודורשים אימות.",
                  "Все детали сравнения — примеры, требующие подтверждения.",
                  "All comparison details are illustrative and require confirmation.",
                ),
              })
            }
          >
            {t(
              "לשלוח את ההשוואה לנציג",
              "Передать сравнение консультанту",
              "Send this comparison to an agent",
            )}
            <ArrowUpRight size={17} />
          </button>
        </section>
      )}
    </div>
  );
}
