import type { Locale } from "./types";

type Copy = Record<Locale, string>;
export type ContentSection = { title: Copy; body: Copy };
export type ContentPage = {
  title: Copy;
  eyebrow: Copy;
  intro: Copy;
  tool?: string;
  sections: ContentSection[];
};
const c = (he: string, ru: string, en: string): Copy => ({ he, ru, en });
const section = (title: Copy, body: Copy): ContentSection => ({ title, body });

/** Editorial copy is a closed fact set. Product examples belong to the labelled tools. */
export const pages: Record<string, ContentPage> = {
  israel: {
    title: c(
      "לא חייבים להתרחק.",
      "Хорошее рядом.",
      "A little closer. A little slower.",
    ),
    eyebrow: c("חופשות בארץ", "Отдых в Израиле", "HOLIDAYS IN ISRAEL"),
    intro: c(
      "בוקר מול ים המלח. ערב בגליל. קודם נבחר איך רוצים להרגיש, אחר כך איפה לישון.",
      "Утро у Мёртвого моря. Вечер в Галилее. Сначала решим, как хочется отдохнуть, а потом — где остановиться.",
      "An early morning by the Dead Sea. A slow evening in Galilee. Start with the feeling, then find a place to stay.",
    ),
    tool: "israel",
    sections: [
      section(
        c("מקום לשנות בו קצב", "Сменить ритм", "Find your own pace"),
        c(
          "אילת, ים המלח, תל אביב, ירושלים, הגליל או טבריה. בחרו אזור וסגנון — בוטיק, יוקרה, ספא, כשר, גלמפינג או הכול כלול — ותראו אילו כיוונים מתאימים לבקשה שלכם.",
          "Эйлат, Мёртвое море, Тель-Авив, Иерусалим, Галилея или Тверия. Выберите район и формат: бутик-отель, отдых с комфортом, спа, кошерное питание, глэмпинг или всё включено.",
          "Eilat, the Dead Sea, Tel Aviv, Jerusalem, Galilee or Tiberias. Choose a region and a style: boutique, luxury, spa, kosher, glamping or all inclusive.",
        ),
      ),
      section(
        c("לפני שאורזים", "До того, как собирать чемодан", "Before you pack"),
        c(
          "כל מלון, ציון התאמה ומחיר בכלי הם דוגמה בלבד. המחיר מוצג לזוג ללילה, לצד בסיס האירוח. נציג יאמת את המלון, סוג החדר, גילי הילדים, ההרכב, התאריכים והכשרות לפני הזמנה.",
          "Все отели, оценки соответствия и цены в подборке — демонстрационные. Цена указана за пару за ночь, рядом обозначен тип питания. Отель, номер, возраст детей, даты и требования к кашруту нужно подтвердить перед бронированием.",
          "Hotels, match scores and prices in the finder are illustrative. Prices are shown per couple per night with the board basis. Confirm the hotel, room, child ages, dates and kosher requirements before booking.",
        ),
      ),
    ],
  },
  tours: {
    title: c(
      "לצאת יחד. בקצב שלכם.",
      "Вместе, в своём темпе.",
      "Go together. Keep your own pace.",
    ),
    eyebrow: c("טיולים מאורגנים", "Организованные туры", "ORGANISED TOURS"),
    intro: c(
      "פחות רשימות של מקומות. יותר הבנה של היום עצמו: כמה הולכים, כמה נוסעים וכמה זמן נשאר להסתכל מסביב.",
      "Важен не только список мест. Сколько вы будете идти, сколько ехать и останется ли время просто осмотреться?",
      "A good itinerary is more than a list of places. Compare the walking, the travelling and the time left to take it all in.",
    ),
    tool: "tours",
    sections: [
      section(
        c(
          "לבחור לפי היום שלכם",
          "Как проходит ваш день",
          "What does a day feel like?",
        ),
        c(
          "אשת טורס מציעה טיולים מאורגנים באסיה, אירופה, אפריקה ודרום אמריקה, לצד טיולי הליכה ומשפחות. כאן אפשר להשוות כיוונים לפי קצב, כושר, תחומי עניין והרכב הקבוצה.",
          "У Eshet Tours есть организованные туры по Азии, Европе, Африке и Южной Америке, а также пешие и семейные поездки. Здесь можно сравнить форматы по темпу, нагрузке, интересам и предпочтениям к группе.",
          "Eshet Tours offers organised tours in Asia, Europe, Africa and South America, alongside walking and family tours. Compare travel styles by pace, fitness, interests and group preference.",
        ),
      ),
      section(
        c(
          "מה אומרת יציאה מובטחת?",
          "Что означает гарантированный выезд?",
          "What is a guaranteed departure?",
        ),
        c(
          "באתר הקיים מסומנות יציאות מובטחות. הסימון בהשוואה כאן הוא להמחשה בלבד, ואינו אישור לטיול או לתאריך מסוים. לפני הזמנה יש לאמת את סטטוס היציאה, המסלול, המדריך וכל מה שכלול במחיר.",
          "На действующем сайте некоторые выезды отмечены как гарантированные. В этой демонстрации отметка служит примером и не подтверждает конкретный тур или дату. Статус выезда, маршрут, сопровождение и состав цены нужно проверить перед бронированием.",
          "The current site marks guaranteed departures. Any such flag in this comparison is illustrative and does not confirm a particular tour or date. Verify departure status, itinerary, guide and inclusions before booking.",
        ),
      ),
    ],
  },
  packages: {
    title: c(
      "כל החלקים. תמונה אחת.",
      "Вся поездка — по частям.",
      "Every part. One clear picture.",
    ),
    eyebrow: c("חבילות נופש", "Пакеты и города", "PACKAGES & CITIES"),
    intro: c(
      "טיסה, מלון ותוספות. בונים יחד ורואים מה מרכיב את הסכום — לפני שמבקשים הצעה.",
      "Перелёт, отель и дополнительные услуги. Соберите поездку и посмотрите, из чего складывается сумма, прежде чем запрашивать предложение.",
      "Flights, a place to stay and the little extras. See the parts that make the total before asking for a quote.",
    ),
    tool: "packages",
    sections: [
      section(
        c("מספר שאפשר להבין", "Понятная сумма", "A total you can understand"),
        c(
          "החישוב מפריד בין עלות לנוסע, עלות לחדר ללילה ותוספות. כל הסכומים כאן לדוגמה ובשקלים, אלא אם מצוין במפורש מטבע אחר. אין כאן שערי חליפין בזמן אמת או מלאי להזמנה.",
          "В расчёте отдельно указаны стоимость на пассажира, номер за ночь и дополнительные услуги. Все суммы демонстрационные и приведены в шекелях, если явно не указан другой номинал. Актуальных курсов и доступных для бронирования мест здесь нет.",
          "The calculation separates per-traveller costs, room costs per night and extras. Every amount is illustrative and in shekels unless another currency is explicitly labelled. There are no live exchange rates or bookable inventory here.",
        ),
      ),
      section(
        c(
          "השאלה הבאה כבר מוכנה",
          "К следующему разговору всё готово",
          "Ready for the next conversation",
        ),
        c(
          "שמרו את היעד, התאריכים וההרכב בסיכום אחד. הנציג יקבל גם את התוספות שבחרתם ואת הדברים שעדיין צריך לבדוק, כדי להתחיל את השיחה מהמקום הנכון.",
          "В одном запросе сохраняются направление, даты, состав путешественников и дополнительные услуги. Менеджер увидит ваши пожелания и вопросы, которые ещё нужно уточнить.",
          "Keep the destination, dates and party in a single brief. The agent also receives your extras and open questions, so the conversation starts with useful context.",
        ),
      ),
    ],
  },
  flights: {
    title: c(
      "מתחילים בטיסה שמתאימה.",
      "Начнём с подходящего перелёта.",
      "Start with the right flight.",
    ),
    eyebrow: c("טיסות לחו״ל", "Перелёты за границу", "FLIGHTS"),
    intro: c(
      "לא רק לאן ומתי. גם מי נוסע, מה לוקחים ומה חשוב לכם בדרך.",
      "Не только куда и когда. Кто летит, какой нужен багаж и что важно в дороге?",
      "More than where and when. Who is travelling, what are you bringing and what matters on the way?",
    ),
    tool: "flights",
    sections: [
      section(
        c(
          "מה כדאי לציין בבקשה",
          "Что указать в запросе",
          "What to put in your request",
        ),
        c(
          "תאריכים גמישים, מספר נוסעים, גילי ילדים, כבודה וצרכי נגישות עוזרים לדייק את החיפוש. מסלולים, זמני טיסה, מדיניות כבודה ותנאי כרטיס אינם מאומתים בקונספט הזה.",
          "Гибкость дат, число пассажиров, возраст детей, багаж и потребности в доступности помогут уточнить поиск. Маршруты, расписание, нормы багажа и условия тарифа в этом концепте не подтверждены.",
          "Date flexibility, party size, child ages, baggage and access needs help narrow the search. Routes, flight times, baggage rules and ticket conditions are not verified in this concept.",
        ),
      ),
      section(
        c(
          "הזמנה בטלפון: פרט שכדאי לדעת",
          "Бронирование по телефону: важная деталь",
          "Phone booking: a detail to check",
        ),
        c(
          "לפי האתר הקיים, בהזמנת טיסות סדירות בטלפון נגבים דמי טיפול של 25 דולר לנוסע. הסכום, תחולתו והתנאים טעונים אישור מול אשת טורס. דמי הטיפול מוצגים בנפרד, ללא המרה או חיבור לסכום בשקלים.",
          "По данным действующего сайта, за бронирование регулярного рейса по телефону взимается сбор 25 долларов США с пассажира. Размер, применимость и условия нужно подтвердить у Eshet Tours. Сбор показан отдельно и не прибавляется к сумме в шекелях без курса обмена.",
          "The current site reports a US$25 handling fee per passenger for scheduled flights booked by phone. Confirm the amount, applicability and terms with Eshet Tours. The fee is shown separately and is not converted or added to a shekel total.",
        ),
      ),
    ],
  },
  hotels: {
    title: c(
      "מקום טוב להתחיל ממנו.",
      "Место, с которого начинается поездка.",
      "A good place to begin.",
    ),
    eyebrow: c("מלונות בחו״ל", "Отели за границей", "HOTELS ABROAD"),
    intro: c(
      "לפעמים כל מה שצריך הוא מלון שמתאים ליום שתכננתם. נספר מה חשוב, ונשאיר מקום לבדוק את הפרטים.",
      "Иногда главное — отель, который подходит вашему ритму. Соберём пожелания и отдельно отметим, что ещё нужно проверить.",
      "Sometimes the right hotel is simply the one that fits your day. Describe what matters, then check the details.",
    ),
    tool: "hotels",
    sections: [
      section(
        c(
          "לפני שבוחרים חדר",
          "Перед выбором номера",
          "Before you choose a room",
        ),
        c(
          "אזור, מספר לילות, הרכב, בסיס אירוח וגמישות בביטול משנים את ההצעה. בקשו לאמת גם מיקום, נגישות, מסים מקומיים ותוספות. אין בקונספט שמות מלונות מאומתים או ביקורות שהומצאו.",
          "Район, число ночей, состав гостей, питание и гибкость отмены влияют на предложение. Уточните расположение, доступность, местные налоги и доплаты. В концепте нет вымышленных отзывов или отелей, представленных как проверенные.",
          "Location, nights, party, board basis and cancellation flexibility shape the quote. Also verify access, local taxes and supplements. This concept does not invent reviews or present unverified hotels as verified.",
        ),
      ),
      section(
        c("מחיר עם הקשר", "Цена с пояснениями", "A price with context"),
        c(
          "השוו רק הצעות באותו הרכב ובאותו בסיס אירוח. סכומים, סגנונות וחדרים בכלי הם נתוני המחשה; הצעה מחייבת מגיעה רק לאחר בדיקת מלאי ותנאים.",
          "Сравнивайте предложения для одинакового состава гостей и типа питания. Суммы, категории и номера здесь демонстрационные; реальное предложение требует проверки наличия и условий.",
          "Compare offers for the same party and board basis. Amounts, styles and rooms in the tool are illustrative. A confirmed offer requires an inventory and terms check.",
        ),
      ),
    ],
  },
  cruises: {
    title: c(
      "כמה ים מתאים לכם?",
      "Сколько моря вам нужно?",
      "How much sea feels right?",
    ),
    eyebrow: c("קרוזים", "Круизы", "CRUISES"),
    intro: c(
      "יש מי שסופרים נמלים. יש מי שמחכים ליום שלם בים. נתחיל שם.",
      "Кто-то ждёт каждый новый порт. Кто-то — целый день в море. Начнём с этого.",
      "Some people count the ports. Others look forward to an entire day at sea. Start there.",
    ),
    tool: "cruises",
    sections: [
      section(
        c(
          "פנימי, חלון או מרפסת?",
          "Внутренняя каюта, окно или балкон?",
          "Inside, window or balcony?",
        ),
        c(
          "מידע כללי: תא פנימי בדרך כלל ללא חלון חיצוני; תא עם חלון נותן מבט החוצה; תא עם מרפסת מוסיף מרחב חיצוני פרטי. התכנון, הגודל והנגישות משתנים בין אוניות ותאים — צריך לבדוק את התא המסוים לפני הזמנה.",
          "Общая информация: во внутренней каюте обычно нет внешнего окна; каюта с окном позволяет смотреть на море; балкон добавляет отдельное открытое пространство. Планировка, размер и доступность различаются — проверьте конкретную каюту перед бронированием.",
          "General information: an inside cabin usually has no external window; a window cabin offers a view outside; a balcony adds private outdoor space. Layout, size and accessibility vary by ship and cabin. Check the specific cabin before booking.",
        ),
      ),
      section(
        c("מה כלול, ומה לא?", "Что входит в стоимость?", "What is included?"),
        c(
          "מידע כללי: לינה וארוחות מסוימות עשויות להיכלל בתעריף. משקאות, סיורי חוף, טיפים, שירותי אינטרנט והעברות עשויים להיות בתשלום נוסף. זו רשימת בדיקה, לא תנאי חבילה; ההרכב המדויק טעון אישור.",
          "Общая информация: проживание и часть питания могут входить в тариф. Напитки, береговые экскурсии, чаевые, интернет и трансферы могут оплачиваться отдельно. Это список вопросов для проверки, а не условия конкретного круиза.",
          "General information: accommodation and some meals may be included. Drinks, shore excursions, gratuities, internet and transfers may cost extra. This is a checking list, not the terms of a particular package.",
        ),
      ),
    ],
  },
  "tour-asia": {
    title: c(
      "אסיה, עם זמן להסתכל.",
      "Азия без гонки за впечатлениями.",
      "Asia, with time to look around.",
    ),
    eyebrow: c(
      "מסלול מאורגן לדוגמה · אסיה",
      "Пример организованного тура · Азия",
      "ILLUSTRATIVE TOUR · ASIA",
    ),
    intro: c(
      "רעיון לטיול שמאזן בין תרבות לטבע. זהו מבנה מסלול להמחשה בלבד, לא טיול זמין להזמנה.",
      "Идея поездки, в которой чередуются культура и природа. Это пример структуры маршрута, а не доступный для бронирования тур.",
      "An idea that balances culture with nature. This is an illustrative itinerary shape, not a tour available to book.",
    ),
    sections: [
      section(
        c(
          "איך הימים מתחברים",
          "Как складываются дни",
          "How the days fit together",
        ),
        c(
          "דוגמה בלבד: פתיחה רגועה בעיר, יום תרבות, מעבר לאזור טבע, יום הליכה לבחירה וסיום עם זמן חופשי. המקומות, מספר הימים, זמני הנסיעה והתאריכים ייקבעו רק במסלול מאומת.",
          "Только пример: спокойное знакомство с городом, день культуры, переезд к природе, прогулка по желанию и свободное время в конце. Места, длительность, время в дороге и даты определяются только в подтверждённом маршруте.",
          "Example only: a gentle city arrival, a cultural day, a move into nature, an optional walking day and free time at the end. Places, duration, travel times and dates require a verified itinerary.",
        ),
      ),
      section(
        c("הפרטים להשוואה", "Параметры для сравнения", "Details to compare"),
        c(
          "נתוני המחשה: כ־2–4 שעות הליכה ביום פעיל, העדפה לקבוצה של עד 20 משתתפים, ולינה והדרכה כרכיבים לבדיקה. אלה אינם תנאי טיול; יש לאמת כושר נדרש, נגישות, הרכב קבוצה, ארוחות, טיסות וסטטוס יציאה.",
          "Демонстрационные параметры: около 2–4 часов пешком в активный день, предпочтение группы до 20 человек, проживание и сопровождение как пункты для проверки. Это не условия тура. Уточните нагрузку, доступность, состав группы, питание, перелёты и статус выезда.",
          "Illustrative parameters: around 2–4 hours walking on an active day, a preference for a group of up to 20, and accommodation and guiding as items to verify. These are not tour terms. Confirm fitness, access, group, meals, flights and departure status.",
        ),
      ),
    ],
  },
  "tour-europe": {
    title: c(
      "אירופה, בין רחוב לשולחן.",
      "Европа: между прогулкой и разговором.",
      "Europe, between a walk and a long lunch.",
    ),
    eyebrow: c(
      "מסלול מאורגן לדוגמה · אירופה",
      "Пример организованного тура · Европа",
      "ILLUSTRATIVE TOUR · EUROPE",
    ),
    intro: c(
      "רעיון לטיול עם תרבות, הליכה וזמן לשבת. כל הפרטים כאן להמחשה; יעד, תאריך ומחיר טעונים בדיקה.",
      "Идея поездки с культурой, прогулками и временем для паузы. Все подробности служат примером; направление, даты и стоимость требуют проверки.",
      "An idea with culture, walking and time to pause. All details are illustrative; destination, date and price require checking.",
    ),
    sections: [
      section(
        c(
          "איך הימים מתחברים",
          "Как складываются дни",
          "How the days fit together",
        ),
        c(
          "דוגמה בלבד: בסיס עירוני אחד, ימי תרבות והליכה, יציאה אחת מחוץ לעיר וזמן חופשי לבחירה. מבנה כזה עוזר להשוות קצב בלי להבטיח מקום, אתר או פעילות מסוימים.",
          "Только пример: одна городская база, культурные дни и прогулки, один выезд за город и свободное время. Такая структура помогает сравнивать темп, не обещая конкретных мест или мероприятий.",
          "Example only: one city base, cultural days and walks, one day outside the city and free time. This shape helps compare pace without promising specific places or activities.",
        ),
      ),
      section(
        c("הפרטים להשוואה", "Параметры для сравнения", "Details to compare"),
        c(
          "נתוני המחשה: כ־1–3 שעות הליכה ביום, העדפה לקבוצה של עד 24 משתתפים ובדיקת אפשרות ללינה עם ארוחת בוקר והדרכה. יש לאמת את כל הרכיבים, דמי הכניסה, ההסעות, הנגישות וסטטוס היציאה לפני הזמנה.",
          "Демонстрационные параметры: около 1–3 часов пешком в день, предпочтение группы до 24 человек, проверка проживания с завтраком и сопровождения. Все составляющие, входные билеты, трансферы, доступность и статус выезда уточняются до бронирования.",
          "Illustrative parameters: around 1–3 hours walking daily, a preference for up to 24 people and checking accommodation with breakfast and guiding. Verify all inclusions, entrance fees, transport, access and departure status before booking.",
        ),
      ),
    ],
  },
  "tour-south-america": {
    title: c(
      "דרום אמריקה, במרחב הנכון.",
      "Южная Америка: оставьте место дороге.",
      "South America, with room for the journey.",
    ),
    eyebrow: c(
      "מסלול מאורגן לדוגמה · דרום אמריקה",
      "Пример организованного тура · Южная Америка",
      "ILLUSTRATIVE TOUR · SOUTH AMERICA",
    ),
    intro: c(
      "רעיון למסלול עם מעברים, טבע וזמן להסתגל. אין כאן רשימת אתרים או זמינות מאומתת — זו נקודת פתיחה לשיחה.",
      "Идея маршрута с переездами, природой и временем на адаптацию. Это начало разговора, без подтверждённого списка мест или наличия тура.",
      "An idea with travel days, nature and time to settle in. A starting point for a conversation, without verified stops or availability.",
    ),
    sections: [
      section(
        c(
          "איך הימים מתחברים",
          "Как складываются дни",
          "How the days fit together",
        ),
        c(
          "דוגמה בלבד: יום הגעה רגוע, פרקי עיר וטבע לסירוגין, יום מעבר מרווח וזמן חופשי לפני החזרה. אורך המסלול והמעברים תלויים ביעד הסופי ובבדיקת הטיסות.",
          "Только пример: спокойный день прибытия, чередование города и природы, день с запасом времени на переезд и свободное время перед возвращением. Продолжительность и перемещения зависят от конкретных направлений и проверки перелётов.",
          "Example only: a gentle arrival, alternating city and nature days, an unhurried transfer day and free time before returning. Length and transfers depend on the final destinations and confirmed flights.",
        ),
      ),
      section(
        c("הפרטים להשוואה", "Параметры для сравнения", "Details to compare"),
        c(
          "נתוני המחשה: כ־2–5 שעות פעילות ביום, העדפה לקבוצה של עד 18 משתתפים ולינה, הסעות והדרכה כפריטים לבדיקה. עומס ההליכה, תנאי השטח, צרכי בריאות אישיים, כבודה וסטטוס יציאה מחייבים בדיקה פרטנית.",
          "Демонстрационные параметры: около 2–5 часов активности в день, предпочтение группы до 18 человек; проживание, переезды и сопровождение как пункты для проверки. Нагрузку, рельеф, личные медицинские потребности, багаж и статус выезда нужно уточнять индивидуально.",
          "Illustrative parameters: around 2–5 active hours daily, a preference for up to 18 people, with accommodation, transfers and guiding as items to verify. Walking demands, terrain, individual health needs, bags and departure status require specific checks.",
        ),
      ),
    ],
  },
  "last-minute": {
    title: c(
      "עוד אפשר לצאת.",
      "Ещё можно собраться.",
      "There is still time to go.",
    ),
    eyebrow: c("הרגע האחרון", "Ближайшие поездки", "THE DEPARTURE BOARD"),
    intro: c(
      "סוף השבוע, השבוע הבא או החופשה הקרובה. לוח אחד, כמה כיוונים, וכל הפרטים לפני ההחלטה.",
      "На выходные, на следующей неделе или к празднику. Все варианты — на одном табло, подробности — до принятия решения.",
      "This weekend, next week or the next holiday. One board, a few directions and the details before you decide.",
    ),
    sections: [
      section(
        c(
          "לוח הדגמה, לא מלאי חי",
          "Демонстрационное табло",
          "A demonstration, not live inventory",
        ),
        c(
          "היעדים, התאריכים היחסיים, המחירים והטבות החבר בלוח נועדו להמחיש את החוויה. פתיחת שורה מאפשרת לבדוק את פרטי הדוגמה ולהכין בקשה לנציג. זמינות ומחיר חייבים אישור לפני הזמנה.",
          "Направления, относительные даты, цены и клубные преимущества на табло показывают возможности интерфейса. Откройте строку, изучите пример и подготовьте запрос менеджеру. Наличие мест и стоимость нужно подтвердить.",
          "Destinations, relative dates, prices and member benefits on the board demonstrate the experience. Open a row to inspect the example and prepare an agent request. Availability and prices need confirmation.",
        ),
      ),
    ],
  },
  planner: {
    title: c(
      "ספרו איך בא לכם לנסוע.",
      "Расскажите, какой будет ваша поездка.",
      "Tell us how you want to go.",
    ),
    eyebrow: c("המתכנן של אשת", "Планировщик Eshet", "ESHET PLANNER"),
    intro: c(
      "עם מי, מתי, מה חשוב ומה פחות. גם חצי רעיון מספיק כדי להתחיל.",
      "С кем, когда, что важно и без чего можно обойтись. Даже приблизительного замысла хватит для начала.",
      "Who is coming, when, what matters and what does not. Half an idea is enough to start.",
    ),
    tool: "planner",
    sections: [
      section(
        c(
          "הצעה לשיחה טובה",
          "Основа для полезного разговора",
          "The start of a useful conversation",
        ),
        c(
          "המתכנן מציע כיוונים ומסביר למה הם מתאימים. המחירים והמסלולים להמחשה בלבד. הוא לא מאשר זמינות, שעות טיסה, פרטי מלון או כללי כניסה; הנציג יקבל את הבחירות והשאלות שלכם כדי לבדוק אותם.",
          "Планировщик предлагает направления и объясняет, почему они могут подойти. Цены и маршруты демонстрационные. Он не подтверждает наличие мест, расписание, сведения об отелях или правила въезда. Ваши пожелания и вопросы можно передать менеджеру для проверки.",
          "The planner suggests directions and explains the fit. Prices and itineraries are illustrative. It does not confirm availability, flight times, hotel details or entry rules. An agent can receive your choices and questions to check them.",
        ),
      ),
    ],
  },
  ribbon: {
    title: c(
      "הטיול שלכם, יום אחרי יום.",
      "Ваша поездка, день за днём.",
      "Your trip, day by day.",
    ),
    eyebrow: c("סרט המסלול", "Лента маршрута", "YOUR TRIP RIBBON"),
    intro: c(
      "מזיזים יום, מוסיפים עצירה, משנים את הקצב. הסכום נשאר גלוי לאורך הדרך.",
      "Передвиньте день, добавьте остановку, измените ритм. Расчёт всё время остаётся перед глазами.",
      "Move a day, add a stop, change the pace. Keep the running total in view.",
    ),
    tool: "ribbon",
    sections: [
      section(
        c(
          "מסלול שנשאר אצלכם",
          "Маршрут остаётся у вас",
          "A plan that stays with you",
        ),
        c(
          "המסלול נשמר בדפדפן הזה וניתן לשנות אותו לפני העברה לנציג. טווחי מזג האוויר, המרחקים, סגנונות הלינה והמחירים הם להמחשה בלבד ואינם תחזית, מדידת דרך או הצעת מחיר.",
          "Маршрут сохраняется в этом браузере. Его можно отредактировать перед отправкой менеджеру. Погода, расстояния, варианты проживания и цены приведены для примера: это не прогноз, не расчёт дороги и не коммерческое предложение.",
          "The ribbon is saved in this browser and can be edited before sharing with an agent. Weather ranges, distances, stay styles and prices are illustrative, not forecasts, route measurements or a quote.",
        ),
      ),
    ],
  },
  visa: {
    title: c(
      "לפני הכרטיס. בודקים כניסה.",
      "До билета — проверка въезда.",
      "Before the ticket, check entry.",
    ),
    eyebrow: c("אשרות וכניסה", "Визы и въезд", "VISA & ENTRY"),
    intro: c(
      "מידע כללי לבעלי דרכון ישראלי. מתחילים במקור הרשמי, בודקים את הנסיבות האישיות, ורק אז מתקדמים.",
      "Общая информация для владельцев израильского паспорта. Начните с официального источника и проверьте условия именно для своей поездки.",
      "General information for Israeli passport holders. Start with the official source and check the circumstances of your own trip.",
    ),
    tool: "visa",
    sections: [
      section(
        c(
          "ראשי תיבות הם רק ההתחלה",
          "Аббревиатура — только начало",
          "An acronym is only the start",
        ),
        c(
          "ESTA, ETIAS, TDAC, ETA ואשרה אלקטרונית מתארים מערכות שונות. התאמה לדרכון, מטרת הנסיעה, משך השהייה, מעבר במדינה אחרת ותאריך הנסיעה עשויים לשנות את הדרישה. שם מערכת אינו הבטחת זכאות או אישור כניסה.",
          "ESTA, ETIAS, TDAC, ETA и электронные визы относятся к разным системам. Требования могут зависеть от паспорта, цели поездки, длительности пребывания, транзита и даты. Название системы не означает, что вы имеете право ею воспользоваться или что въезд разрешён.",
          "ESTA, ETIAS, TDAC, ETA and e-visas refer to different systems. Passport, purpose, length of stay, transit and travel date may change the requirement. A system name does not establish eligibility or permission to enter.",
        ),
      ),
      section(
        c("הכללים משתנים", "Правила меняются", "Rules change"),
        c(
          "תמיד יש לבדוק במקור הרשמי לפני הזמנה ושוב לפני הנסיעה. המידע כאן כללי ולהמחשה, ללא בדיקת זכאות אישית או אימות עדכני של כללי כניסה. אישור מערכת אינו מבטיח כניסה בגבול.",
          "Проверьте официальный источник перед бронированием и ещё раз перед поездкой. Здесь приведена общая демонстрационная информация без индивидуальной проверки права на въезд и без подтверждения актуальности правил. Разрешение системы не гарантирует допуск на границе.",
          "Always check the official source before booking and again before travel. This is general illustrative information, without individual eligibility checks or live verification of entry rules. System approval does not guarantee admission at the border.",
        ),
      ),
    ],
  },
  club: {
    title: c(
      "טוב להיות בעניינים.",
      "Хорошо узнавать раньше.",
      "Good things, a little earlier.",
    ),
    eyebrow: c("אשת קלאב", "Eshet Club", "ESHET CLUB"),
    intro: c(
      "הצטרפו למועדון ותהנו ממבצעים שווים לפני כולם. כאן אפשר לראות איך הטבה עשויה להשתלב בחופשות שלכם.",
      "Узнавайте о предложениях раньше и пользуйтесь клубными скидками. Посмотрите на примере, что это может дать вашему отдыху.",
      "Join the club for member discounts and early access to offers. See an illustration of what membership could mean for your holidays.",
    ),
    tool: "club",
    sections: [
      section(
        c(
          "הטבה ברגע שבוחרים",
          "Преимущество видно при выборе",
          "See the benefit while choosing",
        ),
        c(
          "אשת קלאב מציע הנחות לחברים וגישה מוקדמת למבצעים. כאן המחיר לחבר מופיע לצד המחיר לציבור כדוגמה, כדי שיהיה קל להשוות. שיעורי ההנחה, תנאי הזכאות ועלות החברות, אם קיימת, טעונים אישור.",
          "Eshet Club предлагает скидки участникам и ранний доступ к предложениям. В концепте демонстрационная клубная цена стоит рядом с обычной. Размер скидок, условия участия и возможную стоимость членства нужно подтвердить.",
          "Eshet Club offers member discounts and early access to deals. The concept places an illustrative member price beside the public price. Discount rates, eligibility and any membership charge need confirmation.",
        ),
      ),
      section(
        c("בחירה שלכם", "Вы решаете сами", "Your choice"),
        c(
          "הטופס יוצר בקשת הצטרפות בהדגמה. אישור דיוור הוא בחירה נפרדת; אין הצטרפות אמיתית למועדון או חיוב עד לחיבור ולאישור מערכת המועדון.",
          "Форма создаёт демонстрационный запрос на вступление. Согласие на рассылку оформляется отдельно. Реальное членство и списание средств невозможны без подключения и подтверждения клубной системы.",
          "The form creates a demonstration membership request. Marketing consent is a separate choice. Actual membership and charging require the club system to be connected and confirmed.",
        ),
      ),
    ],
  },
  flex: {
    title: c(
      "גם לשינוי בתוכניות יש מקום.",
      "Планы могут меняться.",
      "Leave room for a change of plan.",
    ),
    eyebrow: c(
      "אשת FLEX וביטולים",
      "Eshet FLEX и отмена",
      "ESHET FLEX & CANCELLATION",
    ),
    intro: c(
      "לפני שמתחייבים, מבינים מה אפשר לשנות ומה צריך לבדוק. הסבר פשוט, בלי הבטחות קטנות באותיות קטנות.",
      "Перед бронированием разберёмся, что можно изменить и какие условия нужно проверить. Без обещаний, скрытых в мелком шрифте.",
      "Before committing, understand what can change and what needs checking. Plain explanations, without promises hidden in the small print.",
    ),
    tool: "flex",
    sections: [
      section(
        c("מה אנחנו יודעים", "Что известно", "What we know"),
        c(
          "אשת FLEX הוא מוצר גמישות בביטול של אשת טורס. התנאים, העלות, המועדים, החריגים ואופן הבקשה לא נמסרו לקונספט. אין לראות בהסבר כאן תנאי מוצר, ביטוח, ייעוץ משפטי או הבטחת החזר.",
          "Eshet FLEX — продукт Eshet Tours для более гибкой отмены. Условия, стоимость, сроки, исключения и порядок обращения для концепта не предоставлены. Этот материал не является условиями продукта, страховкой, юридической консультацией или обещанием возврата.",
          "Eshet FLEX is a flexible cancellation product from Eshet Tours. Terms, cost, deadlines, exclusions and the claim process were not supplied for this concept. This explanation is not product terms, insurance, legal advice or a refund promise.",
        ),
      ),
      section(
        c(
          "מדיניות ביטול: מה לבקש",
          "Что уточнить об отмене",
          "Cancellation: what to ask for",
        ),
        c(
          "לפני תשלום בקשו את מדיניות הביטול החלה על ההזמנה, כולל מועדים, דמי ביטול, זכויות לפי הדין ואופן מסירת הודעה. מחלה, שינוי תוכניות או שינוי טיסה בדוגמאות אינם הוכחה לכיסוי. כל אלה טעונים אישור בתנאים הרשמיים.",
          "До оплаты запросите условия отмены именно вашей брони: сроки, сборы, применимые законные права и способ уведомления. Болезнь, изменение планов или рейса в примерах не подтверждают покрытие. Всё это нужно сверить с официальными условиями.",
          "Before payment, request the cancellation policy for the actual booking: deadlines, charges, applicable statutory rights and how to notify. Illness, changed plans or flight changes in the examples do not establish coverage. Check the official terms.",
        ),
      ),
    ],
  },
  collection: {
    title: c(
      "פחות אפשרויות. יותר כוונה.",
      "Меньше вариантов. Точнее выбор.",
      "Fewer choices. More intention.",
    ),
    eyebrow: c("אשת Collection", "Eshet Collection", "ESHET COLLECTION"),
    intro: c(
      "לבחור חופשה סביב הדברים שעושים לכם את ההבדל. מרחב, קצב, פרטיות או מקום פשוט לשבת בו עוד קצת.",
      "Выбирать поездку вокруг того, что важно именно вам: пространства, ритма, уединения или возможности никуда не спешить.",
      "Build a holiday around the things that matter to you: space, pace, privacy or the chance to stay a little longer.",
    ),
    sections: [
      section(
        c("על Collection", "О Collection", "About Collection"),
        c(
          "אשת Collection מוצג באתר הקיים כמסלול פרימיום עם הנחות של עד 30%. זהו ניסוח מדווח מהאתר, לא הבטחה להזמנה מסוימת. היקף המסלול, ההטבות, תנאי ההנחה והזכאות טעונים אישור מול אשת טורס.",
          "На действующем сайте Eshet Collection представлен как премиальное предложение со скидками до 30%. Это заявленная на сайте информация, а не гарантия скидки для конкретной брони. Состав программы, преимущества и условия необходимо подтвердить у Eshet Tours.",
          "The current site presents Eshet Collection as a premium tier advertised with up to 30% off. This reports the site wording and does not promise a discount on a particular booking. Scope, benefits, discount terms and eligibility need confirmation.",
        ),
      ),
      section(
        c("מתחילים במה שחשוב", "Начнём с главного", "Start with what matters"),
        c(
          "במתכנן אפשר לציין סגנון אירוח, הרכב, תקציב ורמת גמישות רצויה. העבירו את הסיכום לנציג ובקשו לבדוק התאמה ל-Collection ולהצעה עדכנית.",
          "Укажите в планировщике формат проживания, состав путешественников, бюджет и пожелания к гибкости. Передайте запрос менеджеру и попросите проверить подходящие варианты Collection.",
          "Describe your stay style, party, budget and desired flexibility in the planner. Share the brief with an agent and ask them to check Collection options and a current quote.",
        ),
      ),
    ],
  },
  groups: {
    title: c(
      "כולם באותו כיוון.",
      "Все в одном направлении.",
      "Everyone, heading the same way.",
    ),
    eyebrow: c("קבוצות וחברות", "Группы и компании", "GROUPS & CORPORATE"),
    intro: c(
      "משפחה גדולה, יום הולדת או צוות שיוצא יחד. כשיש הרבה אנשים, כדאי להתחיל מסיכום ברור.",
      "Большая семья, день рождения или поездка команды. Чем больше людей, тем полезнее начать с чёткого запроса.",
      "A bigger family, a birthday or a team travelling together. More people makes a clear brief even more useful.",
    ),
    tool: "groups",
    sections: [
      section(
        c(
          "הדגמה של פנייה קבוצתית",
          "Демонстрация группового запроса",
          "A group enquiry demonstration",
        ),
        c(
          "זהו מוקאפ של דסק קבוצות, ופעילות הדסק והשירותים לחברות טעונים אישור מול אשת טורס. הכלי מרכז מספר משתתפים, תקציב, יעד, מטרת הנסיעה וצרכים מיוחדים. הוא אינו מאשר זמינות, תנאי קבוצה או שירותי כנס.",
          "Это демонстрация группового отдела; его работу и услуги для компаний нужно подтвердить у Eshet Tours. Инструмент собирает число участников, бюджет, направление, цель и особые пожелания. Наличие мест, групповые условия и услуги для конференций не подтверждаются.",
          "This is a mock of a group desk; the desk and corporate services need confirmation with Eshet Tours. The tool collects headcount, budget, destination, purpose and access needs. It does not confirm inventory, group terms or conference services.",
        ),
      ),
    ],
  },
  magazine: {
    title: c(
      "קצת לקרוא. יותר לדעת.",
      "Немного чтения перед дорогой.",
      "A little reading. A clearer plan.",
    ),
    eyebrow: c("המגזין של אשת", "Журнал Eshet", "THE ESHET MAGAZINE"),
    intro: c(
      "מדריכים קצרים לשאלות שעולות בדיוק כשמתחילים לתכנן. מידע כללי, שאפשר לקחת לשיחה עם הנציג.",
      "Короткие заметки о вопросах, которые возникают в начале планирования. Общая информация, с которой удобнее говорить с менеджером.",
      "Short guides to the questions that appear when a plan starts taking shape. General information to bring to your agent.",
    ),
    sections: [
      section(
        c(
          "קרוז ראשון: להתחיל מהקצב",
          "Первый круиз: начните с ритма",
          "A first cruise: start with pace",
        ),
        c(
          "לפני שמסתכלים על אורך המסלול, שאלו כמה זמן תרצו לבלות בנמלים וכמה על האונייה. אחר כך בדקו סוג תא, נגישות ומה כלול. מידע כללי: מספר עצירות אינו מלמד לבדו כמה זמן יהיה בכל מקום. את שעות העגינה והסיורים יש לאמת מול מסלול רשמי.",
          "Прежде чем выбирать длительность круиза, решите, сколько времени хочется проводить в портах и сколько на судне. Затем проверьте каюту, доступность и включённые услуги. Общая информация: число остановок само по себе не показывает, сколько времени будет на берегу. Расписание стоянок и экскурсии уточняют по официальному маршруту.",
          "Before choosing a cruise length, decide how much time you want in ports and on board. Then check cabin type, access and inclusions. General information: the number of stops alone does not tell you how long you will spend ashore. Verify port schedules and excursions against the official itinerary.",
        ),
      ),
      section(
        c(
          "טיול מאורגן: להשוות יום רגיל",
          "Организованный тур: сравните обычный день",
          "An organised tour: compare an ordinary day",
        ),
        c(
          "בקשו תיאור של יום אחד: שעת יציאה, זמן נסיעה, הליכה ועצירות. זו דרך טובה להבין אם הקצב מתאים לכם. שעות, מרחקים, גודל קבוצה ומידע על נגישות חייבים אישור; נתונים בכלי ההשוואה כאן הם להמחשה בלבד.",
          "Попросите описать один день: время выезда, дорогу, прогулки и остановки. Так проще понять, подходит ли темп. Время, расстояния, размер группы и доступность нужно подтвердить; данные в сравнении на этом сайте демонстрационные.",
          "Ask for the shape of one day: departure time, driving, walking and stops. It is a useful way to judge the pace. Times, distances, group size and accessibility must be confirmed; data in this comparison tool is illustrative.",
        ),
      ),
      section(
        c(
          "מה לקחת לשיחת ההזמנה?",
          "Что подготовить к разговору?",
          "What should you bring to the booking conversation?",
        ),
        c(
          "הרכב מדויק וגילי ילדים, תאריכים או טווח גמישות, תקציב ומה לא תרצו לוותר עליו. הוסיפו שאלות על כבודה, בסיס אירוח וביטול. אפשר לשמור את הכול במתכנן ולראות את סיכום הבקשה לפני שליחה.",
          "Точный состав и возраст детей, даты или допустимый диапазон, бюджет и то, от чего вы не готовы отказаться. Добавьте вопросы о багаже, питании и отмене. Всё можно собрать в планировщике и проверить перед отправкой.",
          "An accurate party and child ages, dates or flexibility, budget and your non-negotiables. Add questions about bags, board basis and cancellation. Collect it in the planner and review the entire brief before sending.",
        ),
      ),
      section(
        c("שאלות קצרות", "Короткие ответы", "Quick answers"),
        c(
          "האם אפשר להזמין כאן? זהו קונספט ולא אתר הזמנות פעיל. האם המחיר מחייב? לא, כל סכום הוא להמחשה. האם הנציג רואה את הבחירות? רק לאחר הצגת הסיכום, הסכמה ושליחה דרך חיבור פעיל. האם יש תשלומים? באתר הקיים מפורסמת פריסה לתשלומים; התנאים המדויקים טעונים אישור.",
          "Можно ли здесь забронировать? Это концепт, а не действующий сервис бронирования. Цена окончательная? Нет, все суммы приведены для примера. Видит ли менеджер мои выборы? Только после просмотра запроса, согласия и отправки через подключённую систему. Есть ли рассрочка? Она указана на действующем сайте; точные условия нужно подтвердить.",
          "Can I book here? This is a concept, not a working booking service. Is the price binding? No, every amount is illustrative. Does an agent see my choices? Only after you review, consent and submit through a configured connection. Are instalments available? The current site advertises instalments; exact terms need confirmation.",
        ),
      ),
    ],
  },
  russian: {
    title: c(
      "אותה חופשה. בשפה שלכם.",
      "Планируйте на своём языке.",
      "The same journey. In your language.",
    ),
    eyebrow: c("אשת ברוסית", "Eshet на русском", "ESHET IN RUSSIAN"),
    intro: c(
      "אפשר לתכנן, להשוות ולספר מה חשוב גם ברוסית. הבחירות נשארות שלכם בכל שפה.",
      "Объясняйте пожелания, сравнивайте варианты и собирайте маршрут по-русски. Не нужно переводить свои планы на язык формы.",
      "Plan, compare and describe what matters in Russian too. Your choices belong to you, in every language.",
    ),
    tool: "planner",
    sections: [
      section(
        c(
          "מהרעיון ועד הסיכום לנציג",
          "От первой идеи до запроса менеджеру",
          "From the first thought to the agent brief",
        ),
        c(
          "באתר הקיים יש אזור ברוסית לטיולים ולמבצעים. בקונספט אפשר לעבור בין עברית, רוסית ואנגלית באותו עמוד, להשתמש בכלי התכנון ולהעביר את הבקשה בשפה שנוחה לכם.",
          "На действующем сайте есть русскоязычный раздел с турами и предложениями. В концепте можно переключаться между ивритом, русским и английским, оставаясь на той же странице, пользоваться инструментами и передавать запрос на удобном языке.",
          "The current site has a Russian section for tours and deals. In this concept, switch between Hebrew, Russian and English on the same page, use the planning tools and share a brief in the language you prefer.",
        ),
      ),
    ],
  },
  about: {
    title: c(
      "אשת טורס. מאז 1987.",
      "Eshet Tours. С 1987 года.",
      "Eshet Tours. Since 1987.",
    ),
    eyebrow: c("נעים להכיר", "О компании", "A LITTLE ABOUT ESHET"),
    intro: c(
      "חברה ישראלית לתיירות. חופשות בארץ ובעולם, דרך האתר ובשיחה עם נציג.",
      "Израильская туристическая компания. Поездки по стране и за границу — онлайн и в разговоре с менеджером.",
      "An Israeli travel company. Holidays at home and abroad, online and over a conversation with an agent.",
    ),
    sections: [
      section(
        c(
          "הרבה דרכים לצאת",
          "Разные способы отправиться в путь",
          "More ways to go",
        ),
        c(
          "מאז 1987 אשת טורס פועלת בענף התיירות. תחומי הפעילות כוללים חופשות בישראל, טיולים מאורגנים, חבילות נופש, טיסות לחו״ל, מלונות בחו״ל וקרוזים. החברה חברה ב-IATA.",
          "Eshet Tours работает в сфере туризма с 1987 года. Направления работы — отдых в Израиле, организованные туры, турпакеты, зарубежные перелёты и отели, а также круизы. Компания является членом IATA.",
          "Eshet Tours has been in business since 1987. Its categories include domestic holidays, organised tours, packages, flights abroad, overseas hotels and cruises. The company is a member of IATA.",
        ),
      ),
      section(
        c(
          "מידע שאפשר לבדוק",
          "Информация, которую можно проверить",
          "Information you can check",
        ),
        c(
          "באתר הקיים משולב רכיב ביקורות של TrustYou. בקונספט לא מוצגים ציוני ביקורות או המלצות שהומצאו. חיבור נתוני ביקורות עדכניים, הרשאות שימוש וסימני המסחר דורשים אישור לפני פרסום רשמי.",
          "На действующем сайте используется виджет отзывов TrustYou. В концепте нет придуманных оценок или рекомендаций. Для официального запуска нужно подтвердить подключение актуальных отзывов, права использования и оформление товарных знаков.",
          "The current site includes a TrustYou review widget. This concept displays no invented review scores or endorsements. Current review data, usage rights and trademark presentation require approval before an official launch.",
        ),
      ),
      section(
        c("על האתר הזה", "Об этом сайте", "About this website"),
        c(
          "זהו קונספט עיצובי עצמאי המדגים דרך לבחור חופשה ולפנות לנציג עם בקשה מסודרת. הוא אינו האתר הרשמי של אשת טורס, אינו מחובר למלאי הזמנות ואינו גובה תשלום.",
          "Это независимый дизайн-концепт: он показывает, как выбирать поездку и передавать менеджеру понятный запрос. Это не официальный сайт Eshet Tours; он не подключён к системе наличия мест и не принимает платежи.",
          "This is an independent design concept demonstrating a way to choose a holiday and send an agent a structured brief. It is not the official Eshet Tours website, is not connected to booking inventory and does not collect payment.",
        ),
      ),
    ],
  },
  contact: {
    title: c(
      "אפשר פשוט לדבר.",
      "Можно просто поговорить.",
      "We can start with a conversation.",
    ),
    eyebrow: c("יוצרים קשר", "Связаться", "CONTACT"),
    intro: c(
      "לשיחה טובה לא חייבים להגיע עם תוכנית מלאה. גם יעד אחד, כמה תאריכים ושאלה זה מספיק.",
      "Для полезного разговора не нужен готовый маршрут. Достаточно направления, примерных дат и вопроса.",
      "You do not need a finished plan for a useful conversation. A place, a few dates and a question will do.",
    ),
    tool: "contact",
    sections: [
      section(
        c("חופשות בארץ", "Отдых в Израиле", "Holidays in Israel"),
        c(
          "03-7771032. מספר הטלפון נמסר בבריף האתר. שעות הפעילות וזמני המענה טעונים אישור; אין כאן הבטחה למענה בזמן מסוים.",
          "03-7771032. Номер приведён в брифе сайта. Часы работы и сроки ответа нужно подтвердить; конкретное время ответа здесь не обещается.",
          "03-7771032. This number was supplied in the website brief. Opening hours and response times need confirmation; no particular response time is promised here.",
        ),
      ),
      section(
        c("חופשות בחו״ל", "Поездки за границу", "Holidays abroad"),
        c(
          "03-7771039. אפשר להכין סיכום לפני השיחה ולציין מה כבר בחרתם. מספר WhatsApp רשמי לא נמסר; כפתור שליחה זמין רק לאחר הגדרת מספר מאומת.",
          "03-7771039. Перед звонком можно подготовить запрос с уже выбранными параметрами. Официальный номер WhatsApp не предоставлен; отправка становится доступна после настройки подтверждённого номера.",
          "03-7771039. Prepare a brief before calling to keep your choices together. No official WhatsApp number was supplied; sending is available only after a verified number is configured.",
        ),
      ),
      section(
        c(
          "להזמנה קלה ופריסה נוחה לתשלומים",
          "Удобное бронирование и оплата частями",
          "Easy booking and convenient instalments",
        ),
        c(
          "האתר הקיים מפרסם אפשרות לפריסה לתשלומים. מספר התשלומים, אמצעי התשלום, חיובים ותנאי הזכאות טעונים אישור בהצעה בפועל. הקונספט אינו מבצע חיוב.",
          "На действующем сайте заявлена возможность оплаты частями. Число платежей, способы оплаты, комиссии и условия уточняются в реальном предложении. В концепте деньги не списываются.",
          "The current site advertises instalment payments. The number of payments, methods, charges and eligibility need confirmation in the actual offer. This concept does not charge you.",
        ),
      ),
    ],
  },
  accessibility: {
    title: c(
      "לתכנן, בדרך שנוחה לכם.",
      "Планировать удобным способом.",
      "Plan in the way that works for you.",
    ),
    eyebrow: c(
      "הצהרת נגישות לקונספט",
      "Доступность концепта",
      "CONCEPT ACCESSIBILITY STATEMENT",
    ),
    intro: c(
      "החוויה נבנית למקלדת, למגע ולטכנולוגיות מסייעות, בעברית מימין לשמאל וברוסית ובאנגלית משמאל לימין.",
      "Интерфейс рассчитан на клавиатуру, сенсорный экран и вспомогательные технологии. Иврит отображается справа налево, русский и английский — слева направо.",
      "The experience is designed for keyboard, touch and assistive technology, with Hebrew right to left and Russian and English left to right.",
    ),
    sections: [
      section(
        c("מה מיושם כאן", "Что предусмотрено", "What is implemented"),
        c(
          "ניווט מקלדת, סימון מיקוד גלוי, שמות לשדות ולכפתורים, קישור לדילוג לתוכן ותמיכה בהפחתת תנועה. לבקרי החוגה יש קלט טווח נגיש. ניתן לערוך את סדר הימים גם באמצעות כפתורים, ולגלובוס יש חלופת מפה.",
          "Навигация с клавиатуры, видимый фокус, подписи полей и кнопок, переход к основному содержимому и режим уменьшенного движения. Регуляторы доступны как ползунки. Порядок дней можно менять кнопками, а у глобуса есть карта-альтернатива.",
          "Keyboard navigation, visible focus, field and button names, a skip link and reduced-motion support. Dials expose accessible range inputs. Days can also be reordered with buttons, and the globe has a map alternative.",
        ),
      ),
      section(
        c(
          "בדיקה והיקף ההצהרה",
          "Проверка и границы заявления",
          "Testing and the scope of this statement",
        ),
        c(
          "יעד העבודה הוא WCAG 2.2 ברמה AA והתאמה לדרישות הרלוונטיות של ת״י 5568. בדיקות אוטומטיות אינן אישור עמידה משפטי או בדיקה מלאה. נדרשים סקר נגישות מקצועי, בדיקות משתמשים ואישור הלקוח לפני הצהרת תאימות רשמית. תוצאות הבדיקות המקומיות מתועדות ב-CHECKLIST.md.",
          "Цель разработки — WCAG 2.2 AA и применимые требования израильского стандарта IS 5568. Автоматические проверки не являются юридическим подтверждением соответствия или полной оценкой. Перед официальным заявлением нужны профессиональный аудит, пользовательские проверки и согласование клиента. Результаты локальных проверок фиксируются в CHECKLIST.md.",
          "The development target is WCAG 2.2 AA and the applicable requirements of Israeli standard IS 5568. Automated checks do not establish legal compliance or a complete assessment. Professional audit, user testing and client approval are required before an official compliance statement. Local results are recorded in CHECKLIST.md.",
        ),
      ),
      section(
        c(
          "משהו לא נגיש?",
          "Что-то неудобно или недоступно?",
          "Something difficult to use?",
        ),
        c(
          "אפשר לתאר את העמוד, המכשיר והפעולה בטופס יצירת הקשר. פרטי רכז נגישות, כתובת פנייה ייעודית, תאריך סקר והסדרי נגישות פיזיים טעונים אישור; הטופס כאן הוא הדגמה בלבד.",
          "Опишите страницу, устройство и действие в контактной форме. Контакт ответственного за доступность, специальный адрес, дата аудита и физическая доступность помещений требуют подтверждения. Форма здесь работает как демонстрация.",
          "Describe the page, device and action in the contact form. Accessibility coordinator details, a dedicated contact, audit date and physical access arrangements need confirmation. The form here is a demonstration.",
        ),
      ),
    ],
  },
  privacy: {
    title: c(
      "הפרטים שלכם, בצורה ברורה.",
      "Что происходит с вашими данными.",
      "Your information, explained clearly.",
    ),
    eyebrow: c(
      "פרטיות בקונספט",
      "Конфиденциальность",
      "CONCEPT PRIVACY NOTICE",
    ),
    intro: c(
      "זהו הסבר על הדגמה זו, ולא מדיניות הפרטיות הרשמית של אשת טורס. אין להזין מספרי דרכון, פרטי תשלום או מידע רפואי.",
      "Это описание работы демонстрации, а не официальная политика Eshet Tours. Не вводите номера паспортов, платёжные реквизиты или медицинские данные.",
      "This explains the demonstration, not the official Eshet Tours privacy policy. Do not enter passport numbers, payment details or medical information.",
    ),
    sections: [
      section(
        c(
          "מה נשמר בדפדפן",
          "Что хранится в браузере",
          "What stays in your browser",
        ),
        c(
          "העדפות עוגיות, בחירות במסלול ונתוני הדגמה של המועדון עשויים להישמר באחסון המקומי כדי שתוכלו להמשיך לתכנן. אפשר לשנות הסכמה בהגדרות העוגיות ולמחוק נתונים דרך הגדרות האתר בדפדפן. מחיקת אחסון מקומי אינה מוחקת בקשה שכבר נשלחה.",
          "Настройки согласия, маршрут и демонстрационное состояние клуба могут храниться локально, чтобы вы могли продолжить планирование. Согласие меняется в настройках cookies, локальные данные удаляются в настройках сайта в браузере. Это не удаляет запрос, который уже был отправлен.",
          "Consent preferences, the ribbon and demonstration club state may be stored locally so you can continue planning. Change consent in cookie settings and clear local data through browser site settings. Clearing local storage does not delete a request already submitted.",
        ),
      ),
      section(
        c("מה נשלח מהטפסים", "Что отправляется из форм", "What forms send"),
        c(
          "המתכנן מעבד את הטקסט וההעדפות שהזנתם; כשספק AI מוגדר בשרת, הם עשויים להישלח אליו ליצירת כיוונים. בקשה לנציג מציגה סיכום לפני שליחה ודורשת הסכמה. בחיבור פעיל נשלחים פרטי הבקשה והקשר ל-webhook שהוגדר. ללא חיבור היא נשמרת כהדגמה בלבד.",
          "Планировщик обрабатывает введённый текст и предпочтения; если на сервере настроен AI-провайдер, они могут передаваться ему для подготовки вариантов. Запрос менеджеру сначала показывается для проверки и требует согласия. При активном подключении запрос и контактные данные передаются настроенному webhook; без него сохраняется демонстрационный запрос.",
          "The planner processes your text and preferences; when an AI provider is configured on the server, those may be sent to it to generate suggestions. Agent requests are previewed and require consent. A configured connection sends the brief and contact details to its webhook; otherwise the request is retained as a demonstration.",
        ),
      ),
      section(
        c(
          "מה צריך להסדיר לפני השקה",
          "Что нужно согласовать до запуска",
          "Before a public launch",
        ),
        c(
          "זהות בעל המאגר, מטרות העיבוד, ספקים, מקום אחסון, תקופות שמירה, זכויות המשתמשים וכתובת לפניות טעונים אישור משפטי ותפעולי. תיבת ההדגמה אינה מערכת CRM מאובטחת לשימוש ייצור; אין להשתמש בה למידע אישי אמיתי לפני השלמת הבדיקות.",
          "Нужно подтвердить оператора данных, цели обработки, поставщиков, место хранения, сроки, права пользователей и адрес для обращений. Демонстрационная входящая очередь не заменяет защищённую производственную CRM. Не используйте её для реальных персональных данных до проверки.",
          "Confirm the data controller, processing purposes, providers, storage location, retention, user rights and contact address with legal and operations teams. The demonstration inbox is not a production CRM. Do not use it for real personal data before completing those checks.",
        ),
      ),
    ],
  },
  cookies: {
    title: c("ההעדפות שלכם.", "Ваши настройки.", "Your preferences."),
    eyebrow: c(
      "עוגיות ואחסון",
      "Cookies и локальное хранение",
      "COOKIES & LOCAL STORAGE",
    ),
    intro: c(
      "אפשר לבחור מה לזכור ומה למדוד. האפשרויות הלא הכרחיות כבויות עד שתבחרו אחרת.",
      "Выберите, что запоминать и что измерять. Необязательные функции отключены, пока вы их не разрешите.",
      "Choose what to remember and what to measure. Optional settings stay off until you choose otherwise.",
    ),
    sections: [
      section(
        c("הכרחי לתפעול", "Необходимое для работы", "Necessary operation"),
        c(
          "שמירת החלטת ההסכמה מאפשרת לא לשאול אתכם שוב בכל עמוד. כניסת מנהל משתמשת בעוגיית session מאובטחת לפי סביבת ההפעלה. פעולות שביקשתם, כמו שמירת מסלול, משתמשות באחסון הדפדפן.",
          "Сохранение вашего решения позволяет не задавать один и тот же вопрос на каждой странице. Для входа администратора используется сессионная cookie с защитой, соответствующей среде. Запрошенные вами действия, например сохранение маршрута, используют локальное хранилище браузера.",
          "Remembering consent avoids repeating the question on every page. Admin login uses a session cookie secured for its environment. Actions you request, such as saving a ribbon, use browser storage.",
        ),
      ),
      section(
        c(
          "מדידה והתאמה אישית",
          "Измерение и персонализация",
          "Measurement and personalisation",
        ),
        c(
          "הקונספט אינו טוען שירותי פרסום או מעקב מצד שלישי. העדפות המדידה וההתאמה האישית נשמרות לצורך ההתנהגות המודגמת והחיבור העתידי. לפני הפעלת שירות חיצוני יש לבדוק שהוא מכבד את ההסכמה ואת אפשרות הביטול.",
          "Концепт не загружает сторонние рекламные или отслеживающие сервисы. Настройки измерения и персонализации сохраняются для демонстрации и будущего подключения. Перед запуском внешнего сервиса нужно проверить соблюдение согласия и его отзыва.",
          "The concept loads no third-party advertising or tracking services. Measurement and personalisation preferences support the demonstrated behaviour and a future connection. Before enabling an external service, verify that consent and withdrawal are respected.",
        ),
      ),
    ],
  },
  admin: {
    title: c(
      "מאחורי כל בקשה, כוונה.",
      "За каждым запросом — намерение.",
      "Behind every enquiry, an intention.",
    ),
    eyebrow: c(
      "תיבת הפניות · הדגמה",
      "Входящие запросы · демо",
      "INTENT INBOX · DEMONSTRATION",
    ),
    intro: c(
      "מה המטייל כתב, אילו כיוונים הוצעו ומה עדיין פתוח. כניסה מוגנת לצפייה בתהליך ההדגמה.",
      "Что написал путешественник, какие варианты получил и что ещё нужно уточнить. Защищённый вход в демонстрационную очередь запросов.",
      "What the traveller said, what was proposed and what is still open. Protected access to the demonstration pipeline.",
    ),
    sections: [
      section(
        c(
          "לפני חיבור צוות אמיתי",
          "Перед подключением команды",
          "Before connecting a real team",
        ),
        c(
          "תיבת ההדגמה דורשת סיסמה שהוגדרה בסביבת השרת. בייצור נדרשים משתמשים אישיים, הרשאות, תיעוד גישה, שמירה מוסדרת וחיבור CRM. סטטיסטיקות מתארות רק את הפניות שנשמרו בהדגמה ולא נתוני עסק אמיתיים.",
          "Для входа нужен пароль, заданный в окружении сервера. Для рабочего использования необходимы личные учётные записи, роли, журнал доступа, правила хранения и CRM. Статистика относится только к сохранённым демонстрационным запросам и не отражает реальные показатели компании.",
          "The demonstration inbox requires a server-configured password. Production needs individual accounts, roles, access logs, retention rules and CRM integration. Statistics describe saved demonstration requests, not real company performance.",
        ),
      ),
    ],
  },
};
