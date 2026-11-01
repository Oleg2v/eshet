import type { Locale, PlannerResult } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import { isObject } from "./http";
import type { QuestionKey } from "./llm";

export function plannerContext(prompt: string, preferences: unknown): string {
  if (!isObject(preferences)) return prompt;
  const refinements = Array.isArray(preferences.refinements)
    ? preferences.refinements
        .filter(
          (item): item is string =>
            typeof item === "string" && item.length <= 1000,
        )
        .slice(0, 2)
    : [];
  const mood = isObject(preferences.mood) ? preferences.mood : null;
  return [
    prompt,
    ...refinements,
    mood ? `Traveller preferences: ${JSON.stringify(mood).slice(0, 1500)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
export function preferenceScenario(preferences: unknown): string | undefined {
  if (!isObject(preferences) || !isObject(preferences.mood)) return undefined;
  const mood = preferences.mood;
  const values = isObject(mood.values) ? mood.values : {};
  if (mood.party === "friends") return "friends-europe";
  if (mood.party === "family") return "family-eilat";
  if (typeof values.landscape === "number" && values.landscape > 60)
    return "galilee-glamping";
  if (typeof values.energy === "number" && values.energy > 60)
    return "tel-aviv-boutique";
  if (typeof values.landscape === "number" && values.landscape < 35)
    return "jerusalem-culture";
  return "dead-sea-spa";
}
export function applyPreferences(
  result: PlannerResult,
  preferences: unknown,
  locale: Locale,
): PlannerResult {
  if (!isObject(preferences)) return result;
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const mood = isObject(preferences.mood) ? preferences.mood : null;
  const values = mood && isObject(mood.values) ? mood.values : null;
  const descriptions: string[] = [];
  const checks: string[] = [];
  if (values) {
    const num = (key: string) =>
      typeof values[key] === "number" ? Number(values[key]) : 50;
    descriptions.push(
      num("temperature") < 40
        ? t("מעדיפים חום", "предпочитаете тепло", "you prefer warmth")
        : num("temperature") > 60
          ? t(
              "מעדיפים מזג אוויר קריר",
              "предпочитаете прохладу",
              "you prefer cooler weather",
            )
          : t(
              "גמישים במזג האוויר",
              "гибко относитесь к погоде",
              "you are flexible about weather",
            ),
    );
    descriptions.push(
      num("energy") < 40
        ? t("מחפשים שקט", "ищете спокойствие", "you are looking for quiet")
        : num("energy") > 60
          ? t(
              "רוצים יותר תנועה",
              "хочется больше движения",
              "you want more energy",
            )
          : t(
              "רוצים קצב מאוזן",
              "нужен умеренный темп",
              "you want a balanced pace",
            ),
    );
    descriptions.push(
      num("landscape") > 60
        ? t("נמשכים לטבע", "интересует природа", "you are drawn to nature")
        : num("landscape") < 40
          ? t(
              "נמשכים לתרבות",
              "интересует культура",
              "you are drawn to culture",
            )
          : t(
              "משלבים טבע ותרבות",
              "сочетаете природу и культуру",
              "you want nature and culture",
            ),
    );
    checks.push(
      num("comfort") > 60
        ? t(
            "לבקש רמת נוחות גבוהה; לאשר שירותים ומחיר לפני הזמנה",
            "Запросить высокий уровень комфорта; уточнить услуги и цену до бронирования",
            "Request a higher comfort level; verify services and price before booking",
          )
        : num("comfort") < 40
          ? t(
              "לבקש אפשרות פשוטה ולבדוק בדיוק מה כלול",
              "Запросить простой вариант и уточнить, что включено",
              "Request a simple option and check exactly what is included",
            )
          : t(
              "להשוות רמות נוחות ומה כלול בכל אפשרות",
              "Сравнить уровень комфорта и состав каждого варианта",
              "Compare comfort levels and inclusions",
            ),
    );
    checks.push(
      t(
        "העדפת מזג האוויר אינה תחזית; צריך לבדוק אותה לפי תאריכי הנסיעה",
        "Предпочтение по погоде не является прогнозом: проверьте его для дат поездки",
        "A weather preference is not a forecast; check conditions for your travel dates",
      ),
    );
  }
  if (mood?.party === "family")
    checks.push(
      t(
        "לבדוק גילאי ילדים, הרכב חדרים וצרכים משפחתיים",
        "Уточнить возраст детей, размещение и семейные пожелания",
        "Check children’s ages, room arrangements and family needs",
      ),
    );
  if (mood?.party === "friends")
    checks.push(
      t(
        "לבדוק מספר חברים וחלוקת חדרים לפני הצעת מחיר",
        "Уточнить количество друзей и распределение номеров до расчёта",
        "Check group headcount and room sharing before a quote",
      ),
    );
  if (mood?.budget !== undefined) {
    const budget =
      typeof mood.budget === "number"
        ? money(mood.budget, locale)
        : String(mood.budget).slice(0, 80);
    checks.push(
      `${t("התקציב שבחרתם", "Выбранный бюджет", "Your selected budget")}: ${budget}. ${t("יש להתאים אליו מחיר אמיתי ולוודא את יחידת התמחור", "Нужно сверить с реальной ценой и уточнить, за кого и за какой период она указана", "Match this against a real quote and confirm the pricing unit")}`,
    );
  }
  const refinements = Array.isArray(preferences.refinements)
    ? preferences.refinements
        .filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
        .slice(0, 2)
    : [];
  if (refinements.length)
    checks.push(
      `${t("הדיוק שהוספתם", "Ваше уточнение", "Your refinement")}: ${refinements.join(" · ").slice(0, 600)}`,
    );
  return {
    ...result,
    options: result.options.map((option) => ({
      ...option,
      why: descriptions.length
        ? `${option.why} ${t("מהבחירות שלכם", "Из ваших настроек", "From your selections")}: ${descriptions.join(", ")}.`
        : option.why,
      checks: [...option.checks, ...checks],
    })),
    followUps: refinements.length ? [] : result.followUps,
  };
}
export function questionText(key: QuestionKey, locale: Locale): string {
  const text: Record<QuestionKey, [string, string, string]> = {
    dates: [
      "התאריכים שלכם קבועים או גמישים?",
      "Даты уже определены или их можно сдвинуть?",
      "Are your dates fixed or flexible?",
    ],
    party: [
      "מי נוסע, ומה גילאי הילדים אם יש?",
      "Кто едет и какого возраста дети, если они с вами?",
      "Who is travelling, and how old are any children?",
    ],
    priority: [
      "מה הדבר האחד שלא תרצו להתפשר עליו?",
      "Что для вас важнее всего сохранить в этой поездке?",
      "What is the one thing you do not want to compromise on?",
    ],
    budget: [
      "מה התקציב, והאם הוא לכל הנסיעה או ללילה?",
      "Какой бюджет и указан ли он на всю поездку или за ночь?",
      "What is your budget, and is it for the trip or per night?",
    ],
    pace: [
      "כמה הליכה ופעילות מתאימות לכם ביום?",
      "Сколько прогулок и активности вам подходит на день?",
      "How much walking and activity suits you in a day?",
    ],
    accessibility: [
      "יש צרכי נגישות שכדאי להעביר לנציג?",
      "Есть ли пожелания по доступности, которые важно передать агенту?",
      "Are there accessibility needs to pass to an agent?",
    ],
    kosher: [
      "איזו רמת כשרות חשוב לכם לבדוק?",
      "Какой уровень кашрута важно проверить?",
      "Which kosher requirements should we check?",
    ],
    cabin: [
      "איזה סוג תא תרצו להשוות?",
      "Какие типы кают хотите сравнить?",
      "Which cabin types would you like to compare?",
    ],
  };
  return pick(locale, ...text[key]);
}
