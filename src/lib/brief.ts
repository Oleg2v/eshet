import type { Brief } from "@/lib/types";
import { money, pick } from "@/lib/locale";

const labels: Record<string, [string, string, string]> = {
  mood: ["העדפות לחופשה", "Настроение поездки", "Holiday preferences"],
  values: ["הבחירות שלכם", "Ваши настройки", "Your selections"],
  dialSettings: ["העדפות לחופשה", "Настройки поездки", "Holiday preferences"],
  processingConsent: [
    "אישור לטיפול בפנייה",
    "Согласие на обработку заявки",
    "Consent to handle enquiry",
  ],
  marketingConsent: [
    "הסכמה לדיוור",
    "Согласие на рассылку",
    "Marketing consent",
  ],
  source: ["מקור", "Источник", "Source"],
  refinements: ["דיוקים לבקשה", "Уточнения", "Refinements"],
  region: ["אזור", "Регион", "Region"],
  style: ["סגנון", "Стиль", "Style"],
  party: ["הרכב נוסעים", "Состав группы", "Travelling party"],
  nights: ["לילות", "Ночей", "Nights"],
  budget: ["תקציב בשקלים", "Бюджет в шекелях", "Budget in ILS"],
  destination: ["יעד", "Направление", "Destination"],
  date: ["תאריך", "Дата", "Date"],
  adults: ["מבוגרים", "Взрослых", "Adults"],
  children: ["ילדים", "Детей", "Children"],
  rooms: ["חדרים", "Номеров", "Rooms"],
  flightPerPerson: [
    "טיסה לאדם בשקלים — דוגמה",
    "Перелёт на человека в шекелях — пример",
    "Flight per person in ILS — example",
  ],
  hotelPerRoomNight: [
    "חדר ללילה בשקלים — דוגמה",
    "Номер за ночь в шекелях — пример",
    "Room per night in ILS — example",
  ],
  extras: [
    "תוספות בשקלים — דוגמה",
    "Дополнения в шекелях — пример",
    "Extras in ILS — example",
  ],
  illustrativeTotalILS: [
    "סה״כ בשקלים — דוגמה",
    "Итого в шекелях — пример",
    "Total in ILS — example",
  ],
  phoneFeeUSD: [
    "דמי טיפול בטלפון בדולר — לאישור",
    "Сбор за оформление по телефону в долларах — уточнить",
    "Phone handling fee in USD — to confirm",
  ],
  allAmountsAreExamples: [
    "כל הסכומים להמחשה",
    "Все суммы демонстрационные",
    "All amounts are examples",
  ],
  pace: ["קצב", "Темп", "Pace"],
  fitness: ["הליכה וכושר", "Ходьба и нагрузка", "Walking and fitness"],
  interests: ["תחומי עניין", "Интересы", "Interests"],
  groupSize: ["גודל קבוצה", "Размер группы", "Group size"],
  month: ["חודש", "Месяц", "Month"],
  comparison: ["השוואת אפשרויות", "Сравнение вариантов", "Option comparison"],
  documentToCheck: [
    "מסמך לבדיקה",
    "Документ для проверки",
    "Document to check",
  ],
  officialSource: ["מקור רשמי", "Официальный источник", "Official source"],
  days: ["ימים לדוגמה", "Дней — пример", "Days — example"],
  illustrativeDistanceKm: [
    "מרחק בק״מ — דוגמה",
    "Расстояние в км — пример",
    "Distance in km — example",
  ],
  examplePricePerCouplePerNightILS: [
    "מחיר בשקלים לזוג ללילה — דוגמה",
    "Цена в шекелях за пару за ночь — пример",
    "ILS per couple per night — example",
  ],
  exampleBoard: ["בסיס אירוח לדוגמה", "Питание — пример", "Board — example"],
  exampleScore: [
    "ציון התאמה לדוגמה",
    "Оценка соответствия — пример",
    "Fit score — example",
  ],
  exampleWalkingKm: [
    "הליכה בק״מ — דוגמה",
    "Ходьба в км — пример",
    "Walking in km — example",
  ],
  exampleGroupSize: [
    "משתתפים — דוגמה",
    "Участников — пример",
    "Travellers — example",
  ],
  guaranteedDepartureToConfirm: [
    "יציאה מובטחת דורשת אישור",
    "Гарантия выезда требует подтверждения",
    "Guaranteed departure requires confirmation",
  ],
  temperature: ["חום וקור", "Тепло и прохлада", "Warmth and cool"],
  energy: ["שקט ותנועה", "Спокойствие и активность", "Quiet and energy"],
  landscape: ["תרבות וטבע", "Культура и природа", "Culture and nature"],
  comfort: ["פשטות ופינוק", "Простота и комфорт", "Simple and indulgent"],
  title: ["שם", "Название", "Title"],
  hotel: ["סגנון לינה", "Размещение", "Stay style"],
  price: [
    "מחיר בשקלים — דוגמה",
    "Цена в шекелях — пример",
    "Price in ILS — example",
  ],
  distance: ["מרחק לדוגמה", "Расстояние — пример", "Distance — example"],
  weather: ["מזג אוויר לדוגמה", "Погода — пример", "Weather — example"],
  notes: ["הערות", "Примечания", "Notes"],
  id: ["מזהה אפשרות", "Номер варианта", "Option reference"],
  event: ["סוג בקשה", "Тип заявки", "Enquiry type"],
  headcount: ["מספר משתתפים", "Количество участников", "Headcount"],
  annualTrips: ["חופשות בשנה", "Поездок в год", "Trips per year"],
  typicalSpend: [
    "הוצאה רגילה בשקלים",
    "Обычные расходы в шекелях",
    "Typical spend in ILS",
  ],
  exampleSavings: [
    "חיסכון בשקלים — דוגמה",
    "Экономия в шекелях — пример",
    "Savings in ILS — example",
  ],
};
const enums: Record<string, [string, string, string]> = {
  planner: ["מתכנן הנסיעות", "Планировщик", "Trip planner"],
  package: ["חבילת נופש", "Турпакет", "Holiday package"],
  packages: ["חבילות נופש", "Турпакеты", "Holiday packages"],
  tours: ["טיולים מאורגנים", "Организованные туры", "Organised tours"],
  cruise: ["שייט", "Круиз", "Cruise"],
  cruises: ["שייט", "Круизы", "Cruises"],
  group: ["קבוצה", "Группа", "Group"],
  groups: ["קבוצות", "Группы", "Groups"],
  "club-signup": ["הצטרפות למועדון", "Вступление в клуб", "Club signup"],
  "abandoned-search": [
    "חיפוש שלא הושלם",
    "Незавершённый поиск",
    "Unfinished search",
  ],
  israel: ["חופשה בארץ", "Отдых в Израиле", "Holiday in Israel"],
  flights: ["טיסות", "Авиабилеты", "Flights"],
  hotels: ["מלונות", "Отели", "Hotels"],
  ribbon: ["המסלול שלי", "Мой маршрут", "My itinerary"],
  visa: ["כניסה ואשרות", "Документы для въезда", "Entry and visas"],
  flex: ["גמישות בביטול", "Гибкая отмена", "Cancellation flexibility"],
  culture: ["תרבות", "Культура", "Culture"],
  nature: ["טבע", "Природа", "Nature"],
  family: ["משפחה", "Семья", "Family"],
  easy: ["מעט הליכה", "Небольшие прогулки", "Light walking"],
  moderate: ["מתון", "Умеренный", "Moderate"],
  active: ["פעיל", "Активный", "Active"],
  small: ["קבוצה קטנה", "Небольшая группа", "Small group"],
  any: ["גמישים", "Не принципиально", "Flexible"],
  simple: ["פשוט", "Простой", "Simple"],
  boutique: ["בוטיק", "Бутик", "Boutique"],
  luxury: ["יוקרה", "Премиум", "Luxury"],
  spa: ["ספא", "Спа", "Spa"],
  kosher: ["כשר — לבדיקה", "Кашрут — проверить", "Kosher — to check"],
  glamping: ["גלמפינג", "Глэмпинг", "Glamping"],
  "all-inclusive": [
    "הכול כלול — לאישור",
    "Всё включено — уточнить",
    "All inclusive — to confirm",
  ],
  Asia: ["אסיה", "Азия", "Asia"],
  Europe: ["אירופה", "Европа", "Europe"],
  Africa: ["אפריקה", "Африка", "Africa"],
  "South America": ["דרום אמריקה", "Южная Америка", "South America"],
  January: ["ינואר", "Январь", "January"],
  February: ["פברואר", "Февраль", "February"],
  March: ["מרץ", "Март", "March"],
  April: ["אפריל", "Апрель", "April"],
  May: ["מאי", "Май", "May"],
  June: ["יוני", "Июнь", "June"],
  July: ["יולי", "Июль", "July"],
  August: ["אוגוסט", "Август", "August"],
  September: ["ספטמבר", "Сентябрь", "September"],
  October: ["אוקטובר", "Октябрь", "October"],
  November: ["נובמבר", "Ноябрь", "November"],
  December: ["דצמבר", "Декабрь", "December"],
};
function localLabel(key: string, locale: Brief["locale"]) {
  const value = labels[key];
  return value ? pick(locale, ...value) : key;
}
function renderValue(value: unknown, locale: Brief["locale"]): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean")
    return value
      ? pick(locale, "כן", "Да", "Yes")
      : pick(locale, "לא", "Нет", "No");
  if (Array.isArray(value))
    return value.map((item) => renderValue(item, locale)).join(", ");
  if (typeof value === "object")
    return Object.entries(value as Record<string, unknown>)
      .map(
        ([key, item]) =>
          `${localLabel(key, locale)}: ${renderValue(item, locale)}`,
      )
      .join("; ");
  const translated = typeof value === "string" ? enums[value] : undefined;
  return translated ? pick(locale, ...translated) : String(value);
}
/** The same pure serializer is used by the review screen, webhook and WhatsApp. */
export function buildBriefText(brief: Brief): string {
  const locale = brief.locale;
  const lines = [
    pick(
      locale,
      "אשת טורס — בריף נסיעה להמחשה",
      "Eshet Tours — демонстрационная заявка",
      "Eshet Tours — illustrative travel brief",
    ),
    `${pick(locale, "מקור", "Источник", "Source")}: ${renderValue(brief.source, locale)}`,
    `${pick(locale, "במילים שלכם", "Вашими словами", "In your words")}: ${brief.travellerWords || "—"}`,
    ...Object.entries(brief.selections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([key, value]) =>
          `${localLabel(key, locale)}: ${renderValue(value, locale)}`,
      ),
  ];
  if (brief.options?.length) {
    lines.push(
      pick(
        locale,
        "הכיוונים שנבחרו (דוגמאות בלבד):",
        "Выбранные варианты (только примеры):",
        "Selected directions (examples only):",
      ),
    );
    for (const option of brief.options)
      lines.push(
        `${option.title} | ${option.destination} | ${money(option.priceMin, locale)}–${money(option.priceMax, locale)} | ${option.priceUnit}`,
      );
  }
  if (brief.name)
    lines.push(`${pick(locale, "שם", "Имя", "Name")}: ${brief.name}`);
  if (brief.contact)
    lines.push(
      `${pick(locale, "פרטי קשר", "Контакт", "Contact")}: ${brief.contact}`,
    );
  if (brief.notes)
    lines.push(
      `${pick(locale, "הערות", "Примечания", "Notes")}: ${brief.notes}`,
    );
  lines.push(
    pick(
      locale,
      "כל המחירים והפרטים הם דוגמאות. יש לבדוק זמינות, תנאים ומחיר סופי עם נציג. אין כאן הזמנה או אישור שירות.",
      "Все цены и детали — примеры. Наличие мест, условия и итоговую цену нужно уточнить у агента. Это не бронирование и не подтверждение услуги.",
      "All prices and details are examples. Confirm availability, terms and final price with an agent. This is not a booking or service confirmation.",
    ),
  );
  return lines.join("\n");
}
