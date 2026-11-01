import type { Locale, VisaResult } from "@/lib/types";
import { pick } from "@/lib/locale";
type Local = [string, string, string];
const at = (locale: Locale, text: Local) =>
  text[locale === "he" ? 0 : locale === "ru" ? 1 : 2];
const sources: Record<
  string,
  { destination: Local; document: Local; url: string; label: string }
> = {
  "united-states": {
    destination: ["ארצות הברית", "США", "United States"],
    document: [
      "ESTA עשוי להיות רלוונטי — יש לבדוק זכאות וסוג נסיעה",
      "ESTA может подходить — проверьте право на участие и цель поездки",
      "ESTA may be relevant — check eligibility and purpose of travel",
    ],
    url: "https://esta.cbp.dhs.gov/",
    label: "U.S. Customs and Border Protection",
  },
  europe: {
    destination: ["אירופה", "Европа", "Europe"],
    document: [
      "ETIAS — יש לבדוק אם המערכת פעילה ואם היא חלה על הנסיעה",
      "ETIAS — проверьте, работает ли система и относится ли она к вашей поездке",
      "ETIAS — check whether the system is operational and applies to your trip",
    ],
    url: "https://travel-europe.europa.eu/etias_en",
    label: "European Union · Travel to Europe",
  },
  thailand: {
    destination: ["תאילנד", "Таиланд", "Thailand"],
    document: [
      "TDAC עשוי להיות רלוונטי כטופס הגעה; הוא אינו מחליף בדיקת אשרה",
      "TDAC может потребоваться как карта прибытия; это не заменяет проверку визовых требований",
      "TDAC may be relevant as an arrival form; it does not replace a visa check",
    ],
    url: "https://tdac.immigration.go.th/",
    label: "Thailand Immigration Bureau",
  },
  "united-kingdom": {
    destination: ["בריטניה", "Великобритания", "United Kingdom"],
    document: [
      "ETA עשוי להיות רלוונטי — יש לבדוק זכאות וחריגים",
      "ETA может подходить — проверьте условия и исключения",
      "ETA may be relevant — check eligibility and exceptions",
    ],
    url: "https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta",
    label: "GOV.UK · UK Government",
  },
  japan: {
    destination: ["יפן", "Япония", "Japan"],
    document: [
      "יש לבדוק פטור מאשרה או מסלול אשרה בהתאם לדרכון ולמטרת הנסיעה",
      "Проверьте визовый режим для вашего паспорта и цели поездки",
      "Check visa exemption or visa requirements for your passport and purpose",
    ],
    url: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    label: "Ministry of Foreign Affairs of Japan",
  },
  other: {
    destination: ["יעד אחר", "Другое направление", "Another destination"],
    document: [
      "הדרישה טרם נבדקה — פנו למקור הרשמי של מדינת היעד",
      "Требования ещё не проверены — обратитесь к официальному источнику страны назначения",
      "Requirements have not been checked — consult the destination’s official source",
    ],
    url: "https://www.gov.il/en/departments/ministry_of_foreign_affairs",
    label: "Israel Ministry of Foreign Affairs · Consular guidance",
  },
};
export function visaDestination(raw: string): string {
  if (raw in sources) return raw;
  if (/united states|usa|ארצות|ארה|сша|esta/i.test(raw)) return "united-states";
  if (/europe|eu|אירופ|европ|etias/i.test(raw)) return "europe";
  if (/thailand|תאילנד|таиланд|tdac/i.test(raw)) return "thailand";
  if (/united kingdom|uk|בריט|великобритан|англи/i.test(raw))
    return "united-kingdom";
  if (/japan|יפן|япон/i.test(raw)) return "japan";
  return "other";
}
export function visaResult(
  destination: string,
  locale: Locale,
  mode: "demo" | "live" = "demo",
): VisaResult {
  const item = sources[visaDestination(destination)];
  return {
    destination: at(locale, item.destination),
    document: at(locale, item.document),
    mode,
    warning: pick(
      locale,
      "מידע כללי בלבד לבעלי דרכון ישראלי, ללא קביעה לזכאות. הכללים משתנים: חובה לבדוק במקור הרשמי לפני הזמנה ושוב לפני היציאה. תאריכים, תוקף דרכון, מטרת נסיעה ונסיבות אישיות עשויים לשנות את הדרישות. אין כאן ייעוץ משפטי או אישור כניסה.",
      "Только общая информация для владельцев израильского паспорта, без определения права на въезд. Правила меняются: проверьте официальный источник до бронирования и снова перед поездкой. Требования зависят от дат, срока действия паспорта, цели поездки и личных обстоятельств. Это не юридическая консультация и не разрешение на въезд.",
      "General information for Israeli passport holders only; eligibility is not determined here. Rules change: check the official source before booking and again before departure. Dates, passport validity, travel purpose and personal circumstances may change the requirements. This is not legal advice or permission to enter.",
    ),
    steps: [
      pick(
        locale,
        "פתחו את המקור הרשמי ובחרו את סוג הדרכון ומטרת הנסיעה.",
        "Откройте официальный сайт и укажите тип паспорта и цель поездки.",
        "Open the official source and select your passport type and travel purpose.",
      ),
      pick(
        locale,
        "בדקו זכאות, מועדים, אגרות ודרישות מעבר במדינות ביניים. אין להסתמך על דוגמה זו.",
        "Проверьте условия, сроки, сборы и правила транзита. Не полагайтесь только на этот пример.",
        "Check eligibility, timing, fees and transit requirements. Do not rely on this example alone.",
      ),
      pick(
        locale,
        "הגישו בקשה רק במסלול הרשמי הרלוונטי ושמרו אישור לפני התחייבות להזמנה.",
        "Подавайте заявление только через подходящий официальный канал и сохраните подтверждение до бронирования.",
        "Apply only through the relevant official route and retain confirmation before committing to a booking.",
      ),
    ],
    sourceUrl: item.url,
    sourceLabel: item.label,
  };
}
