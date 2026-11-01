"use client";

import { useId, useState, type FormEvent, type PointerEvent } from "react";
import { pick, money } from "@/lib/locale";
import type { Brief, Locale } from "@/lib/types";
import { Example, Field, handoff, request } from "./shared";

type Props = { locale: Locale };
const translator = (locale: Locale) => (he: string, ru: string, en: string) =>
  pick(locale, he, ru, en);
const bounded = (value: string, min: number, max: number) =>
  Math.max(min, Math.min(max, Number(value) || 0));

/** A preference brief, not an invented cruise inventory. */
export function CruiseTool({ locale }: Props) {
  const t = translator(locale);
  const [party, setParty] = useState("couple");
  const [balance, setBalance] = useState(40);
  const [style, setStyle] = useState("quiet");
  const [cabin, setCabin] = useState("balcony");
  const [show, setShow] = useState(false);
  const parties = {
    couple: t("זוג", "Пара", "A couple"),
    family: t("משפחה", "Семья", "A family"),
    parents: t("הורים", "Родители", "Parents"),
    friends: t("חברים", "Друзья", "Friends"),
  };
  const cabins = {
    inside: t("חדר פנימי", "Внутренняя каюта", "Inside cabin"),
    window: t("חלון לים", "Каюта с окном", "Ocean-view cabin"),
    balcony: t("מרפסת", "Каюта с балконом", "Balcony cabin"),
    suite: t("סוויטה", "Сьют", "Suite"),
  };
  const styles = {
    quiet: t("קצב שקט", "Спокойный ритм", "A quieter pace"),
    active: t("הרבה מה לעשות", "Больше развлечений", "Plenty to do"),
    small: t("אווירה אינטימית", "Камерная атмосфера", "An intimate atmosphere"),
  };
  const cabinDescriptions: Record<string, string> = {
    inside: t(
      "חדר פנימי בדרך כלל ללא חלון חיצוני. כדאי לבדוק שטח, סידור מיטות ומיקום לפני הבחירה.",
      "Внутренняя каюта обычно без внешнего окна. Уточните площадь, расположение кроватей и место на судне.",
      "Inside cabins generally have no exterior window. Check floor area, bed layout and position on the ship.",
    ),
    window: t(
      "חלון יכול להכניס אור יום, אך לא תמיד נפתח. חשוב לבדוק אם הנוף מוגבל.",
      "Окно даёт дневной свет, но может не открываться. Уточните, не перекрыт ли вид.",
      "A window can bring daylight, but may not open. Ask whether the view is obstructed.",
    ),
    balcony: t(
      "מרפסת יכולה לתת פינה פרטית בחוץ. הגודל, הפרטיות והגישה משתנים בין אוניות.",
      "Балкон — своё место на воздухе. Его размер, приватность и доступность зависят от судна.",
      "A balcony can offer private outdoor space. Size, privacy and accessibility vary by ship.",
    ),
    suite: t(
      "סוויטה בדרך כלל מציעה יותר מקום. שירותים והטבות נוספים תלויים באונייה ובתעריף.",
      "Сьют обычно просторнее. Дополнительные услуги зависят от судна и тарифа.",
      "Suites generally offer more room. Additional services depend on the ship and fare.",
    ),
  };
  const brief = () =>
    handoff({
      source: "cruise",
      travellerWords: t(
        "בואו נמצא הפלגה שמתאימה לקצב שלנו.",
        "Хотим подобрать круиз в своём ритме.",
        "Help us find a cruise at our pace.",
      ),
      selections: {
        [t("הרכב", "Кто едет", "Travellers")]:
          parties[party as keyof typeof parties],
        [t(
          "נמלים לעומת ימי ים",
          "Порты и дни в море",
          "Ports versus sea days",
        )]:
          balance < 50
            ? t(
                "יותר זמן בנמלים",
                "Больше времени в портах",
                "More time in ports",
              )
            : t("יותר ימים בים", "Больше дней в море", "More days at sea"),
        [t("אופי האונייה", "Атмосфера на судне", "Ship atmosphere")]:
          styles[style as keyof typeof styles],
        [t("חדר", "Каюта", "Cabin")]: cabins[cabin as keyof typeof cabins],
      },
      notes: t(
        "יש לאמת נגישות, מסלול, תנאי ביטול ומה כלול. העדפות בלבד, לא הזמנה.",
        "Уточнить доступность, маршрут, условия отмены и состав тарифа. Это пожелания, не бронирование.",
        "Confirm accessibility, itinerary, cancellation terms and inclusions. Preferences only; not a booking.",
      ),
    });
  return (
    <div className="tool-panel">
      <p className="eyebrow">
        {t(
          "איזו הפלגה מתאימה לכם?",
          "Какой круиз вам подойдёт?",
          "Which cruise is yours?",
        )}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
        }}
        className="tool-fields"
      >
        <div className="tool-grid">
          <Field
            label={t("מי מפליג?", "Кто отправляется?", "Who is travelling?")}
          >
            <select value={party} onChange={(e) => setParty(e.target.value)}>
              {Object.entries(parties).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t(
              "אווירה על הסיפון",
              "Атмосфера на борту",
              "The atmosphere on board",
            )}
          >
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              {Object.entries(styles).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label={t(
            "יותר נמלים או יותר זמן בים?",
            "Больше портов или дней в море?",
            "More ports or more sea days?",
          )}
        >
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={balance}
            aria-valuetext={
              balance < 50
                ? t("יותר נמלים", "Больше портов", "More ports")
                : t("יותר זמן בים", "Больше времени в море", "More sea days")
            }
            onChange={(e) => setBalance(Number(e.target.value))}
          />
        </Field>
        <div className="tool-range-labels">
          <span>{t("לצאת לגלות", "Выходить на берег", "Explore ashore")}</span>
          <span>
            {t("להישאר מול הים", "Остаться у моря", "Stay with the sea")}
          </span>
        </div>
        <Field label={t("סוג החדר", "Тип каюты", "Cabin preference")}>
          <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
            {Object.entries(cabins).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <button className="button button-dark" type="submit">
          {t(
            "מצאו את הכיוון שלי",
            "Подобрать направление",
            "Find my direction",
          )}
        </button>
      </form>
      {show && (
        <section className="tool-result" aria-live="polite">
          <p className="eyebrow">
            {t(
              "כיוון לשיחה עם מומחה",
              "Основа для разговора со специалистом",
              "A starting point for your specialist",
            )}
          </p>
          <h3>
            {styles[style as keyof typeof styles]} ·{" "}
            {cabins[cabin as keyof typeof cabins]}
          </h3>
          <p>{cabinDescriptions[cabin]}</p>
          <p>
            {balance < 50
              ? t(
                  "נבקש מסלול עם יותר הזדמנויות לרדת לחוף. נבדוק זמני עגינה, מרחקים וקצב טיולי החוף.",
                  "Подберём маршрут с большим количеством выходов на берег. Проверим время стоянок, расстояния и темп экскурсий.",
                  "Ask for more opportunities to go ashore. Check port time, distances and the pace of shore excursions.",
                )
              : t(
                  "נבקש יותר ימים בים ונבדוק מה פתוח על הסיפון, אזורי מנוחה ומדיניות כניסה למתקנים.",
                  "Нужны дни без спешки в море. Уточним зоны отдыха, развлечения на борту и условия доступа к ним.",
                  "Ask for more unhurried sea days. Check quiet spaces, onboard activities and access conditions.",
                )}
          </p>
          <p className="tool-note">
            {t(
              "מידע כללי: לינה וארוחות מסוימות עשויות להיות כלולות; משקאות, טיפים, סיורי חוף והעברות עשויים להיות בתשלום נפרד. הכול דורש בדיקה לפי ההצעה.",
              "Общая информация: проживание и часть питания могут входить в тариф. Напитки, чаевые, экскурсии и трансферы могут оплачиваться отдельно. Проверяйте конкретное предложение.",
              "General information: accommodation and some meals may be included. Drinks, gratuities, shore excursions and transfers may cost extra. Confirm the specific offer.",
            )}
          </p>
          <button type="button" className="button button-dark" onClick={brief}>
            {t(
              "להכנת פנייה לנציג",
              "Подготовить запрос специалисту",
              "Prepare an agent brief",
            )}
          </button>
        </section>
      )}
    </div>
  );
}

/** Editable assumptions illustrate arithmetic without asserting FLEX policy coverage. */
export function FlexTool({ locale }: Props) {
  const t = translator(locale);
  const [trip, setTrip] = useState(8000);
  const [loss, setLoss] = useState(60);
  const [refund, setRefund] = useState(80);
  const [fee, setFee] = useState(240);
  const [scenario, setScenario] = useState("plans");
  const scenarios = {
    illness: t("מחלה", "Болезнь", "Illness"),
    plans: t("שינוי תוכניות", "Изменение планов", "A change of plans"),
    flight: t("שינוי בטיסה", "Изменение рейса", "A flight change"),
  };
  const exposure = Math.round((trip * loss) / 100);
  const illustrativeReturn = Math.round((exposure * refund) / 100);
  const remaining = exposure - illustrativeReturn + fee;
  return (
    <div className="tool-panel">
      <Example locale={locale} />
      <h3>
        {t(
          "אם התוכניות משתנות, מה כדאי לשאול?",
          "Планы меняются. Что уточнить заранее?",
          "If plans change, what should you ask?",
        )}
      </h3>
      <p>
        {t(
          "אשת FLEX הוא מוצר לביטול גמיש. המחשבון מציג תרחיש חשבוני בלבד, בלי לקבוע זכאות, כיסוי או תנאים.",
          "Eshet FLEX — продукт гибкой отмены. Здесь только пример расчёта: он не определяет покрытие, условия или право на возврат.",
          "Eshet FLEX is a flexible cancellation product. This calculator illustrates arithmetic only, without determining eligibility, coverage or policy terms.",
        )}
      </p>
      <div className="tool-grid">
        <div className="tool-fields">
          <Field
            label={t(
              "שווי הנסיעה לדוגמה, ₪",
              "Пример стоимости поездки, ₪",
              "Example trip value, ILS",
            )}
          >
            <input
              type="number"
              min={0}
              max={1000000}
              step={100}
              value={trip}
              onChange={(e) => setTrip(bounded(e.target.value, 0, 1000000))}
            />
          </Field>
          <Field
            label={t(
              "תרחיש לשיחה",
              "Ситуация для обсуждения",
              "A scenario to discuss",
            )}
          >
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              {Object.entries(scenarios).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t(
              "דמי ביטול משוערים בדוגמה, %",
              "Условный штраф за отмену, %",
              "Assumed cancellation charge, %",
            )}
          >
            <input
              type="number"
              min={0}
              max={100}
              value={loss}
              onChange={(e) => setLoss(bounded(e.target.value, 0, 100))}
            />
          </Field>
          <Field
            label={t(
              "החזר היפותטי מתוך דמי הביטול, %",
              "Гипотетический возврат от штрафа, %",
              "Hypothetical refund of the charge, %",
            )}
          >
            <input
              type="number"
              min={0}
              max={100}
              value={refund}
              onChange={(e) => setRefund(bounded(e.target.value, 0, 100))}
            />
          </Field>
          <Field
            label={t(
              "עלות מוצר היפותטית, ₪",
              "Гипотетическая стоимость продукта, ₪",
              "Hypothetical product fee, ILS",
            )}
          >
            <input
              type="number"
              min={0}
              max={100000}
              value={fee}
              onChange={(e) => setFee(bounded(e.target.value, 0, 100000))}
            />
          </Field>
        </div>
        <div className="tool-result" aria-live="polite">
          <p className="eyebrow">
            {t(
              "הדוגמה שלכם, שקוף",
              "Ваш пример, по частям",
              "Your example, explained",
            )}
          </p>
          <dl className="tool-breakdown">
            <div>
              <dt>
                {t(
                  "דמי ביטול בדוגמה",
                  "Условный штраф",
                  "Example cancellation charge",
                )}
              </dt>
              <dd>{money(exposure, locale)}</dd>
            </div>
            <div>
              <dt>
                {t(
                  "החזר היפותטי",
                  "Гипотетический возврат",
                  "Hypothetical refund",
                )}
              </dt>
              <dd>− {money(illustrativeReturn, locale)}</dd>
            </div>
            <div>
              <dt>
                {t(
                  "עלות היפותטית",
                  "Гипотетическая стоимость",
                  "Hypothetical fee",
                )}
              </dt>
              <dd>+ {money(fee, locale)}</dd>
            </div>
            <div className="tool-total">
              <dt>
                {t(
                  "יתרה בדוגמה בלבד",
                  "Остаток только в примере",
                  "Remaining in this example",
                )}
              </dt>
              <dd>{money(remaining, locale)}</dd>
            </div>
          </dl>
          <p className="tool-note">
            {t(
              "כל המספרים ניתנים לעריכה והם להמחשה בלבד. אף אחד מהתרחישים אינו מוצג כמכוסה. נציג צריך לאשר תנאים, חריגים, מועדים ועלויות במסמך ההזמנה.",
              "Все числа условные и редактируемые. Ни одна из ситуаций не заявлена как покрываемая. Условия, исключения, сроки и стоимость должен подтвердить специалист в документах бронирования.",
              "Every number is an editable assumption. No scenario is presented as covered. An agent must confirm terms, exclusions, deadlines and costs in the booking documents.",
            )}
          </p>
          <button
            type="button"
            className="button button-dark"
            onClick={() =>
              handoff({
                source: "flex",
                travellerWords: t(
                  "אשמח להבין את תנאי FLEX לנסיעה שלי.",
                  "Хочу уточнить условия FLEX для моей поездки.",
                  "I would like to understand FLEX terms for my trip.",
                ),
                selections: {
                  scenario: scenarios[scenario as keyof typeof scenarios],
                  exampleTripValueILS: trip,
                  hypotheticalChargePercent: loss,
                  hypotheticalRefundPercent: refund,
                  hypotheticalFeeILS: fee,
                },
                notes: t(
                  "הנחות חשבוניות בלבד; יש לאשר תנאים וזכאות.",
                  "Только расчётные предположения; условия и применимость требуют подтверждения.",
                  "Arithmetic assumptions only; confirm terms and eligibility.",
                ),
              })
            }
          >
            {t(
              "בדיקת תנאים עם נציג",
              "Уточнить условия у специалиста",
              "Check terms with an agent",
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClubTool({ locale }: Props) {
  const t = translator(locale);
  const prefix = useId();
  const [trips, setTrips] = useState(3);
  const [spend, setSpend] = useState(5000);
  const [discount, setDiscount] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState("");
  const annualValue = Math.round((trips * spend * discount) / 100);
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (
      e.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `perspective(900px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -7}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 7}deg)`;
  };
  async function join(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || busy) return;
    setBusy(true);
    setStatus("");
    const brief: Brief = {
      locale,
      source: "club",
      travellerWords: t(
        "בקשת הצטרפות לאשת קלאב.",
        "Запрос на вступление в Eshet Club.",
        "Request to join Eshet Club.",
      ),
      name: name.trim(),
      contact: email.trim(),
      consent,
      selections: {
        holidaysPerYear: trips,
        typicalSpendILS: spend,
        exampleDiscountPercent: discount,
        exampleAnnualValueILS: annualValue,
        processingConsent: consent,
        marketingConsent,
      },
      notes: t(
        "הרשמת הדגמה בלבד; תנאי החברות וכל הטבה דורשים אישור.",
        "Демонстрационная заявка; условия членства и льготы требуют подтверждения.",
        "Demo registration only; membership terms and benefits require confirmation.",
      ),
    };
    try {
      const result = await request<{ delivery: string }>("/api/brief", brief);
      setJoined(true);
      setStatus(
        result.delivery === "failed"
          ? t(
              "הבקשה נשמרה, אך ההעברה למערכת לא הושלמה. אפשר לפנות אלינו בטלפון.",
              "Заявка сохранена, но передача в систему не завершилась. Свяжитесь с нами по телефону.",
              "Your request was saved, but delivery to the connected system did not complete. Please contact us by phone.",
            )
          : result.delivery === "delivered"
            ? t(
                "הבקשה נשלחה. החברות עצמה כפופה לאישור.",
                "Заявка отправлена. Членство ещё требует подтверждения.",
                "Your request was sent. Membership still requires confirmation.",
              )
            : t(
                "הבקשה נשמרה בהדגמה. עדיין לא נפתחה חברות אמיתית.",
                "Заявка сохранена в демоверсии. Настоящее членство пока не оформлено.",
                "Your request was saved in the demo. No real membership has been created.",
              ),
      );
      try {
        localStorage.setItem("eshet-member", "true");
        window.dispatchEvent(new CustomEvent("eshet:member"));
      } catch {
        /* The enquiry still succeeds if browser storage is unavailable. */
      }
    } catch {
      setStatus(
        t(
          "לא הצלחנו לשמור כרגע. אפשר לנסות שוב או לפנות בטלפון.",
          "Не удалось сохранить заявку. Попробуйте ещё раз или позвоните нам.",
          "We could not save your request just now. Please try again or call us.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="tool-panel">
      <div className="tool-grid">
        <div>
          <div
            className="tool-club-card"
            onPointerMove={tilt}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            <div className="tool-club-card__number">
              ESHET <span>CLUB</span>
            </div>
            <p>
              {t(
                "קצת לפני כולם.",
                "Чуть раньше остальных.",
                "A little ahead of everyone.",
              )}
            </p>
            <div className="tool-club-card__footer">
              <span>
                {t(
                  "הנחות לחברי מועדון",
                  "Предложения для участников",
                  "Member offers",
                )}
              </span>
              <span>ESHET · 1987</span>
            </div>
          </div>
          <p className="tool-note">
            {t(
              "אשת קלאב מציע הנחות בלעדיות וגישה מוקדמת למבצעים. תנאי הצטרפות, עלות ושיעורי הנחה — לאישור.",
              "Eshet Club предлагает участникам скидки и ранний доступ к предложениям. Условия вступления, стоимость и размеры скидок требуют подтверждения.",
              "Eshet Club offers member discounts and early access to deals. Joining terms, fees and discount levels are to be confirmed.",
            )}
          </p>
        </div>
        <div className="tool-fields">
          <Example locale={locale} />
          <Field
            label={t(
              "כמה חופשות בשנה?",
              "Сколько поездок в год?",
              "How many holidays a year?",
            )}
          >
            <input
              type="number"
              min={1}
              max={30}
              value={trips}
              onChange={(e) => setTrips(bounded(e.target.value, 1, 30))}
            />
          </Field>
          <Field
            label={t(
              "הוצאה רגילה לחופשה, ₪",
              "Обычный бюджет поездки, ₪",
              "Typical spend per holiday, ILS",
            )}
          >
            <input
              type="number"
              min={0}
              max={1000000}
              step={100}
              value={spend}
              onChange={(e) => setSpend(bounded(e.target.value, 0, 1000000))}
            />
          </Field>
          <Field
            label={t(
              `הנחה היפותטית: ${discount}%`,
              `Условная скидка: ${discount}%`,
              `Hypothetical discount: ${discount}%`,
            )}
          >
            <input
              type="range"
              min={1}
              max={15}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </Field>
          <div className="tool-total" aria-live="polite">
            <span>
              {t(
                "חיסכון שנתי להמחשה",
                "Условная экономия за год",
                "Illustrative annual savings",
              )}
            </span>
            <strong className="tool-price">{money(annualValue, locale)}</strong>
          </div>
          <p className="tool-note">
            {trips} × {money(spend, locale)} × {discount}%.{" "}
            {t(
              "לפני עלות חברות אפשרית; לא הבטחת חיסכון.",
              "Без возможной платы за членство. Экономия не гарантирована.",
              "Before any membership fee; not a savings guarantee.",
            )}
          </p>
        </div>
      </div>
      {!joined && (
        <form className="tool-fields tool-result" onSubmit={join}>
          <h3>
            {t(
              "הצטרפו למועדון ותהנו ממבצעים שווים לפני כולם",
              "Узнавайте о предложениях раньше остальных",
              "Join the club and enjoy great deals before everyone",
            )}
          </h3>
          <p className="tool-note">
            {t(
              "בקשת הדגמה: הפרטים והמחשבון המוצגים כאן יישמרו עם הבקשה. אין חיוב ואין יצירת חברות אמיתית.",
              "Демонстрационная заявка: указанные данные и расчёт сохранятся вместе с запросом. Оплаты и реального вступления в клуб не произойдёт.",
              "Demo request: these details and calculator inputs will be saved with your enquiry. No charge or real membership is created.",
            )}
          </p>
          <div className="tool-grid">
            <Field label={t("שם", "Имя", "Name")}>
              <input
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label={t("דוא״ל", "Электронная почта", "Email")}>
              <input
                type="email"
                dir="ltr"
                autoComplete="email"
                required
                maxLength={200}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </div>
          <label className="tool-consent" htmlFor={`${prefix}-consent`}>
            <input
              id={`${prefix}-consent`}
              type="checkbox"
              checked={consent}
              required
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              {t(
                "אני מסכים/ה לשמירת הפרטים לצורך טיפול בבקשת ההצטרפות בלבד.",
                "Согласен/согласна на сохранение данных только для обработки заявки на вступление.",
                "I consent to storing these details only to handle my membership enquiry.",
              )}
            </span>
          </label>
          <label className="tool-consent" htmlFor={`${prefix}-marketing`}>
            <input
              id={`${prefix}-marketing`}
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
            />
            <span>
              {t(
                "אשמח לקבל הצעות ועדכונים, אם השירות יחובר. לא חובה להצטרפות. אפשר לבטל הסכמה בהמשך.",
                "Хочу получать предложения и новости, если сервис будет подключён. Необязательно для заявки. Согласие можно отозвать.",
                "I would like offers and updates if the service is connected. Optional for this request; consent can be withdrawn.",
              )}
            </span>
          </label>
          <button
            className="button button-dark"
            type="submit"
            disabled={busy || !consent}
          >
            {busy
              ? t("שומרים…", "Сохраняем…", "Saving…")
              : t(
                  "שליחת בקשת הצטרפות לדוגמה",
                  "Отправить демонстрационную заявку",
                  "Send demo membership request",
                )}
          </button>
        </form>
      )}
      {status && (
        <p role="status" className="tool-note">
          {status}
        </p>
      )}
      {joined && (
        <section className="tool-result">
          <p className="eyebrow">
            {t("הפיד שלכם · הדגמה", "Ваша подборка · демо", "Your feed · demo")}
          </p>
          <h3>
            {t(
              "סוף שבוע לפי הקצב שלכם",
              "Выходные в вашем ритме",
              "A weekend at your pace",
            )}
          </h3>
          <p>
            {t(
              "הפעילו תצוגת מחיר מועדון בלוח ההצעות כדי לראות את הדוגמה לצד המחיר הרגיל.",
              "Включите цены для участников на табло предложений: условная клубная цена появится рядом с обычной.",
              "Turn on member pricing on the deal board to compare an illustrative club price with the public price.",
            )}
          </p>
          <a className="button button-outline" href={`/${locale}/last-minute`}>
            {t("ללוח ההצעות", "К табло предложений", "To the deal board")}
          </a>
        </section>
      )}
    </div>
  );
}

export function GroupTool({ locale }: Props) {
  const t = translator(locale);
  const [count, setCount] = useState(12);
  const [budget, setBudget] = useState(4000);
  const [destination, setDestination] = useState("israel");
  const [event, setEvent] = useState("family");
  const [notes, setNotes] = useState("");
  const destinations = {
    israel: t("ישראל", "Израиль", "Israel"),
    europe: t("אירופה", "Европа", "Europe"),
    asia: t("אסיה", "Азия", "Asia"),
    africa: t("אפריקה", "Африка", "Africa"),
    southAmerica: t("דרום אמריקה", "Южная Америка", "South America"),
  };
  const events = {
    family: t("קבוצה משפחתית", "Семейная поездка", "A family group"),
    incentive: t("טיול חברה", "Корпоративная поездка", "An incentive trip"),
    conference: t("כנס", "Конференция", "A conference"),
  };
  return (
    <div className="tool-panel">
      <p className="eyebrow">
        {t(
          "כולם באותה תמונה",
          "Собрать всех вместе",
          "Everyone on the same page",
        )}
      </p>
      <p className="tool-note">
        {t(
          "הדגמה של דסק קבוצות ועסקים; קיום השירות והיקפו דורשים אישור מול אשת טורס.",
          "Демонстрация отдела групповых и корпоративных поездок. Наличие и объём этой услуги у Eshet Tours требуют подтверждения.",
          "A mock group and corporate desk. The availability and scope of this company service are to be confirmed with Eshet Tours.",
        )}
      </p>
      <form
        className="tool-fields"
        onSubmit={(e) => {
          e.preventDefault();
          handoff({
            source: "group",
            travellerWords:
              notes ||
              t(
                "נרצה לתכנן נסיעה לקבוצה.",
                "Хотим спланировать групповую поездку.",
                "We would like to plan a group trip.",
              ),
            selections: {
              [t("מספר משתתפים", "Количество участников", "Headcount")]: count,
              [t(
                "תקציב לאדם בשקלים",
                "Бюджет на человека в шекелях",
                "Budget per person in ILS",
              )]: budget,
              [t(
                "תקציב כולל בשקלים",
                "Общий бюджет в шекелях",
                "Total budget in ILS",
              )]: count * budget,
              [t("יעד", "Направление", "Destination")]:
                destinations[destination as keyof typeof destinations],
              [t("סוג האירוע", "Тип события", "Event type")]:
                events[event as keyof typeof events],
            },
            notes: t(
              "בקשת תכנון בלבד. דסק הקבוצות, המחירים והזמינות דורשים אישור.",
              "Только запрос на планирование. Групповая услуга, цены и наличие требуют подтверждения.",
              "Planning enquiry only. Group service, prices and availability require confirmation.",
            ),
          });
        }}
      >
        <div className="tool-grid">
          <Field
            label={t(
              "כמה נוסעים?",
              "Сколько участников?",
              "How many travellers?",
            )}
          >
            <input
              type="number"
              min={2}
              max={1000}
              required
              value={count}
              onChange={(e) => setCount(bounded(e.target.value, 2, 1000))}
            />
          </Field>
          <Field
            label={t(
              "תקציב לאדם, ₪",
              "Бюджет на человека, ₪",
              "Budget per person, ILS",
            )}
          >
            <input
              type="number"
              min={0}
              max={1000000}
              step={100}
              required
              value={budget}
              onChange={(e) => setBudget(bounded(e.target.value, 0, 1000000))}
            />
          </Field>
          <Field
            label={t(
              "לאן חושבים לנסוע?",
              "Куда хотите поехать?",
              "Where are you thinking?",
            )}
          >
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {Object.entries(destinations).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t(
              "מה מביא אתכם יחד?",
              "Что вас объединяет?",
              "What brings you together?",
            )}
          >
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              {Object.entries(events).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label={t(
            "מה חשוב שנדע?",
            "Что важно учесть?",
            "What should we know?",
          )}
        >
          <textarea
            rows={3}
            maxLength={3000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t(
              "תאריכים, חדרים, אוכל, נגישות, קצב…",
              "Даты, комнаты, питание, доступность, темп…",
              "Dates, rooms, meals, accessibility, pace…",
            )}
          />
        </Field>
        <div className="tool-total" aria-live="polite">
          <span>
            {t(
              "מסגרת התקציב לפי הבחירה",
              "Общий бюджет по вашим данным",
              "Your planning budget",
            )}
          </span>
          <strong>{money(count * budget, locale)}</strong>
        </div>
        <p className="tool-note">
          {t(
            "תקציב לתכנון בלבד, לא הצעת מחיר. ערכי הפתיחה הם דוגמה.",
            "Бюджет для планирования, не предложение цены. Начальные значения — пример.",
            "A planning budget, not a quote. Initial values are examples.",
          )}
        </p>
        <button className="button button-dark" type="submit">
          {t(
            "לראות את הפנייה לפני שליחה",
            "Посмотреть запрос перед отправкой",
            "Preview the brief before sending",
          )}
        </button>
      </form>
    </div>
  );
}

export function ContactTool({ locale }: Props) {
  const t = translator(locale);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("israel");
  const [message, setMessage] = useState("");
  return (
    <div className="tool-panel">
      <div className="tool-grid tool-contact-lines">
        <div>
          <p className="eyebrow">
            {t("חופשות בארץ", "Отдых в Израиле", "Holidays in Israel")}
          </p>
          <a className="tool-phone" dir="ltr" href="tel:+97237771032">
            03-7771032
          </a>
        </div>
        <div>
          <p className="eyebrow">
            {t("חופשות בחו״ל", "Зарубежные поездки", "Holidays abroad")}
          </p>
          <a className="tool-phone" dir="ltr" href="tel:+97237771039">
            03-7771039
          </a>
        </div>
      </div>
      <p className="tool-note">
        {t(
          "שעות הפעילות וערוץ WhatsApp רשמי — לאישור. אפשר להכין כאן פנייה מסודרת ולבחור ערוץ זמין לאחר התצוגה המקדימה.",
          "Часы работы и официальный WhatsApp требуют подтверждения. Здесь можно подготовить запрос и выбрать доступный канал после просмотра.",
          "Opening hours and an official WhatsApp channel are to be confirmed. Prepare your enquiry here, then choose an available channel after reviewing it.",
        )}
      </p>
      <form
        className="tool-fields tool-result"
        onSubmit={(e) => {
          e.preventDefault();
          handoff({
            source: "contact",
            travellerWords: message,
            selections: {
              [t("שם", "Имя", "Name")]: name,
              [t("פרטי קשר", "Контактные данные", "Contact details")]: contact,
              [t("נושא", "Тема", "Subject")]:
                subject === "israel"
                  ? t("חופשה בארץ", "Отдых в Израиле", "Holiday in Israel")
                  : subject === "abroad"
                    ? t("חופשה בחו״ל", "Поездка за границу", "Holiday abroad")
                    : t("שאלה כללית", "Общий вопрос", "General enquiry"),
            },
            notes: t(
              "פניית קשר; אין לבצע הזמנה או חיוב ללא אישור נוסף.",
              "Обращение для связи; без бронирования и оплаты до отдельного подтверждения.",
              "Contact enquiry; no booking or payment without separate confirmation.",
            ),
          });
        }}
      >
        <h3>
          {t(
            "בואו נתחיל מהפרטים החשובים.",
            "Начнём с того, что важно.",
            "Let’s start with what matters.",
          )}
        </h3>
        <div className="tool-grid">
          <Field label={t("שם", "Имя", "Name")}>
            <input
              required
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field
            label={t(
              "טלפון או דוא״ל",
              "Телефон или электронная почта",
              "Phone or email",
            )}
          >
            <input
              required
              maxLength={200}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </Field>
        </div>
        <Field
          label={t("על מה נדבר?", "О чём поговорим?", "What shall we discuss?")}
        >
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="israel">
              {t("חופשה בארץ", "Отдых в Израиле", "Holiday in Israel")}
            </option>
            <option value="abroad">
              {t("חופשה בחו״ל", "Поездка за границу", "Holiday abroad")}
            </option>
            <option value="general">
              {t("שאלה כללית", "Общий вопрос", "General enquiry")}
            </option>
          </select>
        </Field>
        <Field label={t("הפנייה שלכם", "Ваш вопрос", "Your message")}>
          <textarea
            required
            minLength={5}
            maxLength={3000}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
        <button className="button button-dark" type="submit">
          {t(
            "לתצוגה מקדימה של הפנייה",
            "Посмотреть готовый запрос",
            "Preview your enquiry",
          )}
        </button>
      </form>
    </div>
  );
}
