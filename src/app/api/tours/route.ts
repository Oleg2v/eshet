import { demoDisclaimer } from "@/lib/server/catalog";
import { classifyIntent } from "@/lib/server/llm";
import {
  errorResponse,
  json,
  localeOf,
  rateLimit,
  readJson,
} from "@/lib/server/http";
import { money, pick } from "@/lib/locale";
import type { TripOption } from "@/lib/types";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "tours", 40)) return errorResponse(429, "he", "busy");
  const body = await readJson(request);
  const locale = localeOf(body?.locale);
  if (!body) return errorResponse(422, locale);
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const regions: Record<string, { name: string; band: [number, number] }> = {
    Asia: { name: t("אסיה", "Азия", "Asia"), band: [11000, 17000] },
    Europe: { name: t("אירופה", "Европа", "Europe"), band: [6500, 10000] },
    Africa: { name: t("אפריקה", "Африка", "Africa"), band: [10000, 16000] },
    "South America": {
      name: t("דרום אמריקה", "Южная Америка", "South America"),
      band: [15000, 22000],
    },
  };
  const regionKey =
    typeof body.region === "string" && body.region in regions
      ? body.region
      : "Asia";
  const region = regions[regionKey];
  const pace =
    typeof body.pace === "number" ? Math.max(0, Math.min(100, body.pace)) : 50;
  const fitness =
    typeof body.fitness === "number"
      ? body.fitness
      : body.fitness === "easy"
        ? 20
        : body.fitness === "active"
          ? 85
          : 50;
  const interest =
    body.interests === "nature"
      ? t("טבע ונופים", "природа и пейзажи", "nature and landscapes")
      : body.interests === "family"
        ? t("זמן משפחתי", "время с семьёй", "family time")
        : t("תרבות ואוכל", "культура и кухня", "culture and food");
  const budget =
    typeof body.budget === "number" && Number.isFinite(body.budget)
      ? body.budget
      : 15000;
  const small = body.groupSize === "small";
  const classified = await classifyIntent(
    JSON.stringify(body).slice(0, 4000),
    locale,
  );
  const styles = [
    {
      id: "slow",
      title: t(
        "עם זמן להסתכל",
        "С паузами на впечатления",
        "With time to look",
      ),
      description: t(
        "בסיסים מעטים, מרווחים בין ימים מלאים וזמן חופשי. מתווה לדוגמה.",
        "Меньше смен отеля, паузы между насыщенными днями и свободное время. Пример маршрута.",
        "Fewer bases, breathing room between full days and free time. An example outline.",
      ),
      days: 8,
      offset: 0,
    },
    {
      id: "balanced",
      title: t(
        "דרך ותוכן, באיזון",
        "Дорога и впечатления, в меру",
        "Ground covered, with balance",
      ),
      description: t(
        "שילוב של מעברים, ביקורים וזמן לעצמכם. סדר התחנות טרם נקבע.",
        "Переезды, посещения и время для себя. Порядок остановок пока не определён.",
        "A mix of transfers, visits and time to yourself. Stops have not been decided.",
      ),
      days: 10,
      offset: 1500,
    },
    {
      id: "active",
      title: t(
        "יותר תנועה בדרך",
        "Больше движения в пути",
        "More movement along the way",
      ),
      description: t(
        "ימים פעילים יותר, עם בדיקת עומס ההליכה והשטח לפני הזמנה. מתווה לדוגמה.",
        "Более активные дни: нагрузку и рельеф нужно проверить до бронирования. Пример маршрута.",
        "More active days, with walking effort and terrain checked before booking. An example outline.",
      ),
      days: 12,
      offset: 3000,
    },
  ];
  const preferred =
    pace > 65 && fitness > 60
      ? "active"
      : pace < 40 || fitness < 35
        ? "slow"
        : "balanced";
  styles.sort((a, b) => (a.id === preferred ? -1 : b.id === preferred ? 1 : 0));
  const month = typeof body.month === "string" ? body.month.slice(0, 30) : "";
  const monthNames: Record<string, [string, string]> = {
    January: ["ינואר", "январе"],
    February: ["פברואר", "феврале"],
    March: ["מרץ", "марте"],
    April: ["אפריל", "апреле"],
    May: ["מאי", "мае"],
    June: ["יוני", "июне"],
    July: ["יולי", "июле"],
    August: ["אוגוסט", "августе"],
    September: ["ספטמבר", "сентябре"],
    October: ["אוקטובר", "октябре"],
    November: ["נובמבר", "ноябре"],
    December: ["דצמבר", "декабре"],
  };
  const monthLabel = monthNames[month]
    ? t(monthNames[month][0], monthNames[month][1], month)
    : month;
  const options: TripOption[] = styles.map((style) => {
    const low = region.band[0] + style.offset,
      high = region.band[1] + style.offset;
    const over = low > budget;
    return {
      id: `tour-${regionKey.toLowerCase().replace(/ /g, "-")}-${style.id}`,
      destination: region.name,
      title: `${region.name} · ${style.title}`,
      description: style.description,
      why: `${t("כיוון להשוואה לפי ההעדפה שלכם ל־", "Вариант для сравнения с учётом интереса: ", "A direction to compare around your interest in ")}${interest}. ${style.id === preferred ? t("זה הקצב הקרוב ביותר לבחירה שלכם בדוגמה.", "Этот темп ближе всего к вашему выбору в примере.", "This example pace is closest to your selection.") : t("חלופה להשוואת קצב ומספר ימים.", "Альтернатива для сравнения темпа и длительности.", "An alternative pace and duration to compare.")} ${over ? t("טווח הדוגמה מעל התקציב שבחרתם; נבקש חלופה קצרה יותר.", "Примерный диапазон выше вашего бюджета; запросим более короткий вариант.", "The example band exceeds your budget; ask for a shorter alternative.") : t("יש לבדוק מחיר סופי מול התקציב שבחרתם.", "Окончательную цену нужно сверить с вашим бюджетом.", "Check the final price against your selected budget.")}`,
      priceMin: low,
      priceMax: high,
      priceUnit: t(
        "לאדם בחדר זוגי · דוגמה בלבד",
        "на человека в двухместном номере · только пример",
        "per person sharing a double room · example only",
      ),
      days: style.days,
      tag: t("מסלול לדוגמה", "Пример маршрута", "Example route"),
      checks: [
        `${t("תקציב מבוקש", "Ваш бюджет", "Requested budget")}: ${money(budget, locale)}. ${t("הדוגמה אינה הצעת מחיר", "Пример не является ценовым предложением", "The example is not a quote")}`,
        monthLabel
          ? t(
              "לבדוק תאריכי יציאה בחודש ",
              "Проверить даты выезда в ",
              "Check departure dates in ",
            ) + monthLabel
          : t(
              "לבדוק תאריכי יציאה",
              "Проверить даты выезда",
              "Check departure dates",
            ),
        small
          ? t(
              "לבקש קבוצה קטנה ולבדוק מספר משתתפים בפועל",
              "Запросить небольшую группу и уточнить фактический размер",
              "Request a small group and verify actual group size",
            )
          : t(
              "להשוות גדלי קבוצות זמינים",
              "Сравнить доступные размеры групп",
              "Compare available group sizes",
            ),
        fitness < 35
          ? t(
              "לבקש מעט הליכה ולבדוק נגישות ושטח",
              "Запросить небольшую нагрузку и проверить доступность и рельеф",
              "Request light walking and check accessibility and terrain",
            )
          : t(
              "לבדוק מרחקי הליכה, שטח וקצב בפועל",
              "Проверить расстояния, рельеф и фактический темп",
              "Check walking distances, terrain and actual pace",
            ),
        t(
          "מה כלול, תנאי ביטול ויציאה מובטחת — הכול לאישור",
          "Состав пакета, отмена и гарантия выезда — всё требует подтверждения",
          "Inclusions, cancellation and departure guarantee — all to confirm",
        ),
      ],
    };
  });
  return json({
    options,
    followUps: [],
    mode: classified ? "live" : "demo",
    disclaimer: demoDisclaimer(locale),
  });
}
