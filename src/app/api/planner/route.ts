import { makePlannerResult, scenarios } from "@/lib/server/catalog";
import { planWithAI } from "@/lib/server/llm";
import {
  errorResponse,
  json,
  localeOf,
  rateLimit,
  readJson,
  textOf,
} from "@/lib/server/http";
import {
  applyPreferences,
  plannerContext,
  preferenceScenario,
  questionText,
} from "@/lib/server/planner-preferences";
import { pick } from "@/lib/locale";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!rateLimit(request, "planner", 60))
    return errorResponse(429, "he", "busy");
  const body = await readJson(request);
  const locale = localeOf(body?.locale);
  if (
    !body ||
    typeof body.prompt !== "string" ||
    body.prompt.length > 4000 ||
    !body.prompt.trim()
  )
    return errorResponse(422, locale);
  const prompt = textOf(body.prompt);
  const context = plannerContext(prompt, body.preferences);
  const live = await planWithAI(context, locale);
  // Scripted requests retain explicit destination priority; refinements and mood
  // enrich the rationale and checks without changing any authored sample price.
  const scriptedScenario = scenarios.some((scenario) =>
    scenario.match.test(prompt),
  )
    ? undefined
    : preferenceScenario(body.preferences);
  let result = applyPreferences(
    makePlannerResult(
      prompt,
      locale,
      live?.scenarioId ?? scriptedScenario,
      live ? "live" : "demo",
    ),
    body.preferences,
    locale,
  );
  if (live) {
    result = {
      ...result,
      options: result.options.map((option) => {
        const evidence = live.rationales.find(
          (item) => item.optionId === option.id,
        )?.userPreference;
        return evidence
          ? {
              ...option,
              why: `${pick(locale, "ביקשתם", "Вы написали", "You asked for")}: “${evidence}”. ${option.why}`,
            }
          : option;
      }),
      followUps: live.followUpKeys.map((key) => questionText(key, locale)),
    };
  }
  return json(result);
}
