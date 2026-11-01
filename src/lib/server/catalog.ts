import type { Locale, PlannerResult, TripOption } from "@/lib/types";
import { pick } from "@/lib/locale";

type Local = [string, string, string];
type Scenario = {
  id: string;
  match: RegExp;
  destination: Local;
  title: Local;
  description: Local;
  why: Local;
  alternative: Local;
  alternativeWhy: Local;
  price: [number, number];
  days: number;
  domestic: boolean;
  tag: Local;
};

// All amounts, durations and itinerary shapes in this catalogue are examples.
// They are not inventory, quotes, departure guarantees, hotel facts or legal advice.
export const scenarios: Scenario[] = [
  {
    id: "family-eilat",
    match: /אילת|eilat|эйлат|חנוכה|hanukkah|ханук|פעוט|toddler|малыш/i,
    destination: ["אילת", "Эйлат", "Eilat"],
    title: [
      "אילת, בקצב של המשפחה",
      "Эйлат без спешки",
      "Eilat, at your family’s pace",
    ],
    description: [
      "כמה ימים עם מרווח לשנ״צ ולזמן יחד. כיוון לתכנון, ללא מלון משויך.",
      "Несколько дней с паузами на дневной сон и время вместе. Это идея маршрута, без конкретного отеля.",
      "A few days with room for naps and time together. A planning direction, without a named hotel.",
    ],
    why: [
      "בחרתם זמן משפחתי. התכנון משאיר מרווחים ומאפשר לבקש כשרות.",
      "Вы хотите отдохнуть всей семьёй. В плане остаётся свободное время, а требование кошерного питания передаётся агенту.",
      "You want family time. The plan leaves breathing room and passes kosher requirements to an agent.",
    ],
    alternative: [
      "ים המלח, עם פחות מעברים",
      "Мёртвое море, меньше переездов",
      "The Dead Sea, with fewer moves",
    ],
    alternativeWhy: [
      "חלופה לבקשה שלכם, עם בסיס אחד לכל השהייה.",
      "Альтернатива с одной базой на всё время отдыха.",
      "An alternative with one base for the whole stay.",
    ],
    price: [1200, 1800],
    days: 4,
    domestic: true,
    tag: ["זמן משפחתי", "Время для семьи", "Family time"],
  },
  {
    id: "japan-slow",
    match: /יפן|japan|япони|япон/i,
    destination: ["יפן", "Япония", "Japan"],
    title: [
      "יפן. עשרה ימים, בלי לרוץ",
      "Япония: десять дней без гонки",
      "Japan. Ten days, without rushing.",
    ],
    description: [
      "מתווה לדוגמה לטיול ראשון: מעט בסיסים, זמן פנוי בין ימים מלאים. תחנות ייבחרו עם נציג.",
      "Пример первого путешествия: меньше смен отеля, больше свободного времени. Остановки подберёт агент.",
      "An example first visit: fewer hotel changes and open time between fuller days. An agent will choose the stops.",
    ],
    why: [
      "ביקשתם היכרות ראשונה וקצב רגוע. נשאיר מקום לשנות בדרך.",
      "Для первой поездки важнее удобный ритм, чем длинный список мест. Оставляем время на изменения.",
      "For a first visit, a comfortable pace matters more than a long checklist. We leave room to adjust.",
    ],
    alternative: [
      "אותו כיוון, יותר זמן פנוי",
      "Тот же маршрут, больше свободного времени",
      "The same direction, more free time",
    ],
    alternativeWhy: [
      "חלופה עם פחות פעילויות מתוכננות.",
      "Вариант с меньшим количеством запланированных занятий.",
      "An alternative with fewer scheduled activities.",
    ],
    price: [14000, 20000],
    days: 10,
    domestic: false,
    tag: ["קצב רגוע", "Спокойный ритм", "Unhurried"],
  },
  {
    id: "friends-europe",
    match:
      /birthday|יום הולדת|день рожден|восьм|eight|שמונה|חברים|друз|friends/i,
    destination: ["אירופה", "Европа", "Europe"],
    title: [
      "סוף שבוע שמתחיל בשמונה חברים",
      "Выходные для восьмерых друзей",
      "A weekend that starts with eight friends",
    ],
    description: [
      "בסיס משותף, ערב יחד וזמן חופשי. מחלקים את התקציב לטיסה, לינה ותוספות.",
      "Общая база, вечер вместе и свободное время. Бюджет отдельно на перелёт, проживание и дополнения.",
      "One shared base, an evening together and free time. Split the budget into flights, rooms and extras.",
    ],
    why: [
      "קבוצה אחת, אבל לא כולם חייבים לעשות הכול יחד.",
      "Одна компания — но не обязательно одна программа на каждую минуту.",
      "One group, without everyone needing to do everything together.",
    ],
    alternative: [
      "חגיגה עם עוד לילה",
      "Праздник с дополнительной ночью",
      "A celebration with another night",
    ],
    alternativeWhy: [
      "אפשרות לדוגמה להפחית לחץ ביום החזרה.",
      "Пример варианта с более спокойным днём возвращения.",
      "An example option to take pressure off the return day.",
    ],
    price: [2800, 4200],
    days: 3,
    domestic: false,
    tag: ["עם החברים", "С друзьями", "With friends"],
  },
  {
    id: "parents-cruise",
    match: /cruise|שייט|круиз|הורים|parents|родител/i,
    destination: ["שייט", "Круиз", "Cruise"],
    title: [
      "שייט עם יותר מרחב לנשום",
      "Круиз в спокойном ритме",
      "A cruise with room to breathe",
    ],
    description: [
      "מתחילים מהקצב ומהעדפת התא, ואז משווים ימי ים ועגינות. אונייה ומסלול טרם נבחרו.",
      "Начинаем с темпа и пожеланий к каюте, затем сравниваем дни в море и заходы в порты. Судно и маршрут ещё не выбраны.",
      "Start with pace and cabin preferences, then compare sea days and port calls. No ship or itinerary is selected yet.",
    ],
    why: [
      "העדפה לפחות עומס מועברת לנציג לבדיקת אונייה, תאריכים ואזורי ישיבה.",
      "Пожелание избегать толпы передаём агенту: нужно проверить судно, даты и зоны отдыха.",
      "An agent receives the preference for less crowding and will check ship, dates and seating areas.",
    ],
    alternative: [
      "שייט עם דגש על העגינות",
      "Круиз с акцентом на порты",
      "A cruise focused on port calls",
    ],
    alternativeWhy: [
      "משווים את היחס בין ימי ים לבין יציאה לחוף.",
      "Сравниваем соотношение дней в море и выходов на берег.",
      "Compare the balance of sea days and time ashore.",
    ],
    price: [6000, 9500],
    days: 7,
    domestic: false,
    tag: ["לבחור את הקצב", "Выбрать свой ритм", "Choose your pace"],
  },
  {
    id: "kosher-tiberias",
    match: /טבריה|tiberias|тивер|כשר|kosher|кошер/i,
    destination: ["טבריה", "Тверия", "Tiberias"],
    title: [
      "טבריה, עם מקום לכולם",
      "Тверия: место для всей семьи",
      "Tiberias, with room for everyone",
    ],
    description: [
      "בקשת מלון למשפחה עם דגש על כשרות והרכב החדרים. סיווג הכשרות ייבדק מול המלון.",
      "Запрос семейного отеля с учётом кашрута и размещения. Уровень кашрута нужно уточнить у отеля.",
      "A family hotel enquiry focusing on kosher requirements and room layout. Certification must be checked with the hotel.",
    ],
    why: [
      "הצרכים החשובים כבר בבריף, לפני שיחת הטלפון.",
      "Главные требования уже в заявке — ещё до звонка.",
      "The important requirements are in the brief before the phone call.",
    ],
    alternative: [
      "הגליל, אותה בקשה משפחתית",
      "Галилея, те же семейные пожелания",
      "Galilee, the same family priorities",
    ],
    alternativeWhy: [
      "עוד אזור להשוואה, בכפוף לבדיקת כשרות והתאמה.",
      "Ещё один регион для сравнения после проверки кашрута и условий.",
      "Another region to compare, subject to kosher and suitability checks.",
    ],
    price: [1000, 1600],
    days: 3,
    domestic: true,
    tag: ["משפחה וכשרות", "Семья и кашрут", "Family & kosher"],
  },
  {
    id: "hiking-asia",
    match: /hiking|trek|הליכ|טיולי רגל|אסיה|asia|азия|пеш|поход/i,
    destination: ["אסיה", "Азия", "Asia"],
    title: ["אסיה, דרך הרגליים", "Азия пешком", "Asia, on foot"],
    description: [
      "מתווה לטיול מאורגן עם הליכות. עומס יומי, שטח וקצב קבוצה נבדקים לפני הזמנה.",
      "Идея организованного тура с прогулками. Нагрузку, рельеф и темп группы проверяем до бронирования.",
      "An organised tour direction with walking. Daily effort, terrain and group pace need checking before booking.",
    ],
    why: [
      "משווים את המאמץ, לא רק את רשימת התחנות.",
      "Сравниваем нагрузку, а не только список остановок.",
      "Compare the effort, not just the list of stops.",
    ],
    alternative: [
      "אסיה, שילוב של הליכה ותרבות",
      "Азия: прогулки и культура",
      "Asia, walking and culture",
    ],
    alternativeWhy: [
      "חלופה עם זמן פנוי בין ימים פעילים.",
      "Вариант со свободным временем между активными днями.",
      "An alternative with free time between active days.",
    ],
    price: [10000, 16000],
    days: 10,
    domestic: false,
    tag: ["לצאת לשביל", "Выйти на тропу", "Take the path"],
  },
  {
    id: "usa-entry",
    match: /united states|usa|america|ארצות הברית|ארה״ב|ארה"ב|сша|esta/i,
    destination: ["ארצות הברית", "США", "United States"],
    title: [
      "מתחילים מבדיקת הכניסה",
      "Начните с правил въезда",
      "Start with entry requirements",
    ],
    description: [
      "לפני תכנון הטיול, בודקים את מסלול האישור המתאים במקור הרשמי. אין כאן קביעה לזכאות.",
      "Прежде чем планировать поездку, проверьте подходящую процедуру на официальном сайте. Здесь не определяется право на въезд.",
      "Before planning, check the appropriate authorisation route at the official source. Eligibility is not determined here.",
    ],
    why: [
      "שאלתם על כניסה. זה השלב הראשון לפני מחירים ותאריכים.",
      "Вы спросили о въезде. Это первый шаг до обсуждения цен и дат.",
      "You asked about entry. This comes before prices and dates.",
    ],
    alternative: [
      "מתווה תכנון לאחר הבדיקה",
      "План после проверки документов",
      "A planning outline after the check",
    ],
    alternativeWhy: [
      "נציג יעזור לאסוף את פרטי הנסיעה לאחר בדיקת הדרישות.",
      "После проверки требований агент поможет собрать параметры поездки.",
      "An agent can collect the travel details after requirements are checked.",
    ],
    price: [0, 0],
    days: 1,
    domestic: false,
    tag: [
      "מידע כללי בלבד",
      "Только общая информация",
      "General information only",
    ],
  },
  {
    id: "south-america",
    match: /south america|דרום אמריקה|южн.*америк/i,
    destination: ["דרום אמריקה", "Южная Америка", "South America"],
    title: [
      "דרום אמריקה, עם מסגרת נוחה",
      "Южная Америка с продуманным ритмом",
      "South America, with a comfortable structure",
    ],
    description: [
      "כיוון לטיול מאורגן: משווים קצב, מעברים וזמן חופשי. המסלול המפורט לדוגמה בלבד.",
      "Идея организованного тура: сравниваем темп, переезды и свободное время. Детали маршрута — пример.",
      "An organised tour direction: compare pace, transfers and free time. Itinerary details are examples.",
    ],
    why: [
      "ההשוואה עוזרת לבחור קבוצה שמתאימה לקצב שלכם.",
      "Сравнение помогает выбрать группу с подходящим вам темпом.",
      "The comparison helps you choose a group that matches your pace.",
    ],
    alternative: [
      "יותר זמן בכל תחנה",
      "Больше времени на каждой остановке",
      "More time at each stop",
    ],
    alternativeWhy: [
      "חלופה עם פחות מעברים מתוכננים.",
      "Вариант с меньшим количеством переездов.",
      "An alternative with fewer planned transfers.",
    ],
    price: [15000, 22000],
    days: 14,
    domestic: false,
    tag: ["לטייל יחד", "Путешествовать вместе", "Travel together"],
  },
  {
    id: "dead-sea-spa",
    match: /dead sea|ים המלח|м[её]ртв|spa|ספא|спа|quiet|שקט|тишин/i,
    destination: ["ים המלח", "Мёртвое море", "Dead Sea"],
    title: [
      "ים המלח. קצת פחות תוכניות",
      "Мёртвое море. Меньше планов",
      "The Dead Sea. A little less planned.",
    ],
    description: [
      "שהייה קצרה עם זמן למנוחה. מתקני ספא, שעות פתיחה וטיפולים ייבדקו מול ספק.",
      "Короткий отдых с паузой для себя. Спа, часы работы и процедуры уточняются у поставщика.",
      "A short stay with time to rest. Spa facilities, hours and treatments must be checked with the provider.",
    ],
    why: [
      "בחרתם שקט וקצב רגוע. נשאיר את היומן פתוח.",
      "Вы выбрали тишину и спокойный темп. Оставляем расписание свободным.",
      "You chose quiet and a relaxed pace. We leave the calendar open.",
    ],
    alternative: [
      "עוד לילה של שקט",
      "Ещё одна спокойная ночь",
      "Another quiet night",
    ],
    alternativeWhy: [
      "משווים את התוספת ללילה מול התקציב שלכם.",
      "Сравниваем стоимость дополнительной ночи с вашим бюджетом.",
      "Compare the extra night with your budget.",
    ],
    price: [1100, 1700],
    days: 3,
    domestic: true,
    tag: ["מרווח לנשום", "Время выдохнуть", "Room to breathe"],
  },
  {
    id: "tel-aviv-boutique",
    match: /tel aviv|תל אביב|тель.авив|boutique|בוטיק|бутик/i,
    destination: ["תל אביב", "Тель-Авив", "Tel Aviv"],
    title: [
      "תל אביב, לשנות רגע את הקצב",
      "Тель-Авив: сменить ритм",
      "Tel Aviv, for a change of pace",
    ],
    description: [
      "בקשת לינה בעיר בסגנון בוטיק. מלון, שכונה ובסיס האירוח ייבחרו עם נציג.",
      "Запрос городского отдыха в бутик-стиле. Отель, район и питание подберёт агент.",
      "A city stay enquiry with a boutique preference. An agent will help choose hotel, area and board.",
    ],
    why: [
      "עיר, זמן פנוי ובסיס אחד. בלי להעמיס על סוף השבוע.",
      "Город, свободное время и одна база. Без перегруженных выходных.",
      "A city, free time and one base. Without overfilling the weekend.",
    ],
    alternative: [
      "סוף שבוע עם לילה נוסף",
      "Выходные с дополнительной ночью",
      "A weekend with an extra night",
    ],
    alternativeWhy: [
      "אפשר להשוות גם יציאה במוצאי שבת.",
      "Можно сравнить и вариант с выездом после субботы.",
      "You can also compare a Saturday-night departure.",
    ],
    price: [950, 1550],
    days: 2,
    domestic: true,
    tag: ["קצת עיר", "Немного города", "A little city"],
  },
  {
    id: "jerusalem-culture",
    match: /jerusalem|ירושלים|иерусалим|culture|תרבות|культур/i,
    destination: ["ירושלים", "Иерусалим", "Jerusalem"],
    title: [
      "ירושלים, בין יום מלא לזמן פנוי",
      "Иерусалим: впечатления и паузы",
      "Jerusalem, between full days and free time",
    ],
    description: [
      "בסיס בעיר וזמן לבנות תוכנית שמתאימה לכם. אתרים, שעות וכניסות ייבדקו בהמשך.",
      "База в городе и время на свою программу. Места, часы работы и билеты проверяются отдельно.",
      "A city base and time to make a plan that suits you. Sites, hours and admission need separate checks.",
    ],
    why: [
      "עניין בתרבות עם מקום להחליט גם בדרך.",
      "Интерес к культуре и возможность менять планы по пути.",
      "An interest in culture, with room to decide along the way.",
    ],
    alternative: [
      "ירושלים בקצב איטי יותר",
      "Иерусалим в более спокойном темпе",
      "Jerusalem at a gentler pace",
    ],
    alternativeWhy: [
      "פחות תחנות ויותר מרווח בכל יום.",
      "Меньше остановок и больше свободного времени каждый день.",
      "Fewer stops and more room in each day.",
    ],
    price: [900, 1500],
    days: 3,
    domestic: true,
    tag: ["לראות מקרוב", "Рассмотреть ближе", "Look a little closer"],
  },
  {
    id: "galilee-glamping",
    match: /galilee|גליל|галиле|glamping|גלמפינג|глэмпинг|nature|טבע|природ/i,
    destination: ["הגליל", "Галилея", "Galilee"],
    title: [
      "הגליל, עם מקום לטבע",
      "Галилея: оставить место природе",
      "Galilee, with room for nature",
    ],
    description: [
      "כיוון לשהייה בסגנון גלמפינג. סוג היחידה, נגישות ושירותים ייבדקו עם הספק.",
      "Идея отдыха в стиле глэмпинга. Тип размещения, доступность и удобства нужно проверить у поставщика.",
      "A glamping-style stay direction. Unit type, accessibility and facilities must be checked with the provider.",
    ],
    why: [
      "בחרתם טבע. נבנה את הפרטים סביב רמת הנוחות שלכם.",
      "Вы выбрали природу. Детали подберём под нужный вам уровень комфорта.",
      "You chose nature. The details will follow your preferred comfort level.",
    ],
    alternative: [
      "אותו אזור, לינה במלון",
      "Тот же регион, проживание в отеле",
      "The same region, a hotel stay",
    ],
    alternativeWhy: [
      "חלופה להשוואה אם חשובים לכם יותר שירותים במקום.",
      "Вариант для сравнения, если удобства на месте важнее.",
      "An alternative if more on-site services matter to you.",
    ],
    price: [750, 1350],
    days: 3,
    domestic: true,
    tag: ["בחוץ, בנחת", "На природе, без спешки", "Outside, at ease"],
  },
];
const at = (locale: Locale, value: Local) =>
  value[locale === "he" ? 0 : locale === "ru" ? 1 : 2];
export const demoDisclaimer = (locale: Locale) =>
  pick(
    locale,
    "כל המחירים, משכי הטיול והפרטים הם להמחשה בלבד. אין כאן זמינות או הצעת מחיר. נציג יבדוק את הפרטים לפני הזמנה.",
    "Все цены, длительность и детали приведены для примера. Это не предложение и не подтверждение наличия мест. Агент проверит условия до бронирования.",
    "All prices, durations and details are illustrative. This is not a quote or an availability check. An agent will verify the details before booking.",
  );
export function findScenario(prompt: string) {
  // Explicit destinations take precedence over generic mood words such as quiet.
  const explicit: [RegExp, string][] = [
    [/south america|דרום אמריקה|южн.*америк/i, "south-america"],
    [/גליל|galilee|галиле|glamping|גלמפינג|глэмпинг/i, "galilee-glamping"],
    [/טבריה|tiberias|тивер|тверия|тверию|тверии/i, "kosher-tiberias"],
    [/תל אביב|tel aviv|тель.авив/i, "tel-aviv-boutique"],
    [/ירושלים|jerusalem|иерусалим/i, "jerusalem-culture"],
    [/יפן|japan|япон/i, "japan-slow"],
    [/אילת|eilat|эйлат/i, "family-eilat"],
    [/ים המלח|dead sea|м[её]ртв/i, "dead-sea-spa"],
  ];
  const destination = explicit.find(([match]) => match.test(prompt));
  if (destination) return scenarios.find((s) => s.id === destination[1])!;
  return (
    scenarios.find((s) => s.match.test(prompt)) ??
    scenarios.find((s) => s.id === "dead-sea-spa")!
  );
}
export function optionsForScenario(id: string, locale: Locale): TripOption[] {
  const scenario = scenarios.find((s) => s.id === id) ?? scenarios[0];
  const checks = [
    pick(
      locale,
      "לבדוק תאריכים, זמינות ומחיר סופי עם נציג",
      "Уточнить даты, наличие мест и окончательную цену у агента",
      "Confirm dates, availability and final price with an agent",
    ),
    pick(
      locale,
      "לבדוק מה כלול, בסיס אירוח ותנאי ביטול",
      "Проверить состав пакета, питание и условия отмены",
      "Check inclusions, board and cancellation terms",
    ),
  ];
  if (id === "family-eilat" || id === "kosher-tiberias")
    checks.push(
      pick(
        locale,
        "לבדוק התאמה לילדים ואת דרישות הכשרות שלכם",
        "Уточнить размещение детей и ваши требования к кашруту",
        "Confirm child arrangements and your kosher requirements",
      ),
    );
  if (id === "usa-entry")
    checks.push(
      pick(
        locale,
        "לבדוק דרישות עדכניות רק במקור הרשמי לפני הזמנה",
        "Проверить актуальные требования только на официальном сайте до бронирования",
        "Check current requirements at the official source before booking",
      ),
    );
  const priceUnit = scenario.domestic
    ? pick(
        locale,
        "לזוג ללילה · בסיס אירוח לאישור",
        "за пару за ночь · питание уточняется",
        "per couple per night · board to confirm",
      )
    : pick(
        locale,
        "לאדם בחדר זוגי · להמחשה",
        "на человека в двухместном номере · пример",
        "per person sharing a double room · example",
      );
  const main: TripOption = {
    id: scenario.id + "-1",
    title: at(locale, scenario.title),
    destination: at(locale, scenario.destination),
    description: at(locale, scenario.description),
    why: at(locale, scenario.why),
    priceMin: scenario.price[0],
    priceMax: scenario.price[1],
    priceUnit,
    checks,
    days: scenario.days,
    tag: at(locale, scenario.tag),
  };
  return [
    main,
    {
      ...main,
      id: scenario.id + "-2",
      destination:
        id === "family-eilat"
          ? pick(locale, "ים המלח", "Мёртвое море", "Dead Sea")
          : id === "kosher-tiberias"
            ? pick(locale, "הגליל", "Галилея", "Galilee")
            : main.destination,
      title: at(locale, scenario.alternative),
      why: at(locale, scenario.alternativeWhy),
      priceMin: Math.round((scenario.price[0] * 1.1) / 50) * 50,
      priceMax: Math.round((scenario.price[1] * 1.1) / 50) * 50,
      days: scenario.days + 1,
    },
  ];
}
export function makePlannerResult(
  prompt: string,
  locale: Locale,
  scenarioId?: string,
  mode: "demo" | "live" = "demo",
): PlannerResult {
  const scenario = scenarioId ?? findScenario(prompt).id;
  return {
    options: optionsForScenario(scenario, locale),
    followUps: [
      pick(
        locale,
        "התאריכים שלכם קבועים או גמישים?",
        "Даты уже определены или их можно сдвинуть?",
        "Are your dates fixed or flexible?",
      ),
      pick(
        locale,
        "מה הדבר האחד שלא תרצו להתפשר עליו?",
        "На чём для вас важнее всего не экономить?",
        "What is the one thing you do not want to compromise on?",
      ),
    ],
    mode,
    disclaimer: demoDisclaimer(locale),
  };
}
