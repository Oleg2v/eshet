"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Mic,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { Locale, PlannerResult, TripOption } from "@/lib/types";
import { money, pick } from "@/lib/locale";
import {
  Example,
  Field,
  handoff,
  request,
  saveOption,
  tryAgain,
} from "./shared";
import MoodContext, { usePlannerMood } from "./MoodContext";

type SpeechEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};
type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
export default function PlannerTool({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const mood = usePlannerMood();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [refine, setRefine] = useState(false);
  const [answers, setAnswers] = useState(["", ""]);
  const examples = [
    t(
      "זוג עם פעוט בחנוכה, אילת או ים המלח, כשר, עד 1,800 ₪ ללילה",
      "Ханука с малышом: Эйлат или Мёртвое море, кошерный отель, до 1 800 ₪ за ночь",
      "Hanukkah with a toddler, Eilat or the Dead Sea, kosher, up to 1,800 shekels a night",
    ),
    t(
      "עשרה ימים ביפן באפריל. פעם ראשונה, בלי לרוץ",
      "Десять дней в Японии в апреле. Первый раз, без спешки",
      "Ten days in Japan in April. First time, we hate rushing",
    ),
    t(
      "יום הולדת לשמונה חברים באירופה, טיסות עד 400 אירו",
      "День рождения в Европе для восьмерых, перелёт до 400 евро",
      "Birthday weekend for eight friends in Europe, flights under 400 euros",
    ),
    t(
      "שייט להורים שמעדיפים שקט",
      "Круиз для родителей, которые любят тишину",
      "A cruise for my parents who do not like crowds",
    ),
  ];
  async function plan(value = prompt) {
    if (!value.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      const data = await request<PlannerResult>("/api/planner", {
        locale,
        prompt: value,
        preferences: { refinements: answers, ...(mood ? { mood } : {}) },
      });
      setResult(data);
      setRefine(false);
    } catch {
      setMessage(tryAgain(locale));
    } finally {
      setBusy(false);
    }
  }
  function voice() {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      setMessage(
        t(
          "הדפדפן הזה לא תומך בהקלטה. אפשר לכתוב כאן למטה.",
          "В этом браузере голосовой ввод недоступен. Напишите пожелания ниже.",
          "Voice input isn’t available in this browser. Type your wishes below.",
        ),
      );
      return;
    }
    const recognition = new Recognition();
    recognition.lang =
      locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => setPrompt(e.results[0][0].transcript);
    recognition.onerror = () => {
      setListening(false);
      setMessage(
        t(
          "לא הצלחנו לשמוע. אפשר לכתוב את הבקשה.",
          "Не удалось распознать речь. Можно написать запрос.",
          "We couldn’t hear that. You can type your request.",
        ),
      );
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }
  function save(option: TripOption) {
    try {
      saveOption(option);
      setSaved([...saved, option.id]);
    } catch {
      setMessage(
        t(
          "לא ניתן לשמור בדפדפן הזה. אפשר לשלוח לנציג.",
          "Сохранение в браузере недоступно. Можно передать консультанту.",
          "Browser storage is unavailable. You can send this to an agent.",
        ),
      );
    }
  }
  return (
    <div className="tool-planner">
      <div className="tool-planner-intro">
        <span className="eyebrow">ESHET PLANNER</span>
        <h2>
          {t(
            "ספרו לנו מה יעשה לכם טוב.",
            "Расскажите, чего хочется.",
            "Tell us what feels right.",
          )}
        </h2>
        <p>
          {t(
            "מי נוסע, מה הקצב, ועל מה לא מתפשרים. אנחנו נחבר את הנקודות.",
            "Кто едет, в каком темпе и что особенно важно. Соберём это в понятный маршрут.",
            "Who’s coming, your pace, and the things that matter. We’ll connect the dots.",
          )}
        </p>
      </div>
      <MoodContext locale={locale} mood={mood} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void plan();
        }}
        className="tool-prompt-form"
      >
        <Field
          label={t(
            "איך נראית החופשה שלכם?",
            "Какой вы представляете поездку?",
            "What does your trip look like?",
          )}
        >
          <textarea
            data-testid="planner-input"
            required
            maxLength={2000}
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={examples[0]}
          />
        </Field>
        <div className="tool-prompt-footer">
          <button
            type="button"
            className="tool-voice"
            onClick={voice}
            aria-pressed={listening}
          >
            <Mic size={19} />
            {listening
              ? t("מקשיבים…", "Слушаем…", "Listening…")
              : t("אפשר גם לספר", "Можно голосом", "Say it aloud")}
          </button>
          <button
            className="button button-dark"
            data-testid="planner-submit"
            disabled={busy}
          >
            {busy
              ? t(
                  "מחברים את הנקודות…",
                  "Собираем варианты…",
                  "Connecting the dots…",
                )
              : t("בואו נתכנן", "Подобрать поездку", "Let’s plan")}
            <Sparkles size={17} />
          </button>
        </div>
      </form>
      <div className="tool-prompt-examples">
        <span>
          {t("או מתחילים מכאן", "Или начните с примера", "Or start here")}
        </span>
        {examples.map((example, i) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setPrompt(example);
              void plan(example);
            }}
            disabled={busy}
          >
            {["01", "02", "03", "04"][i]} <span>{example}</span>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <p role="status" className="tool-status">
        {message}
      </p>
      {result && (
        <section
          className="tool-plan-results"
          data-testid="planner-results"
          aria-label={t("הכיוונים שלכם", "Ваши варианты", "Your directions")}
        >
          <div className="tool-section-heading">
            <h3>
              {t(
                "כמה כיוונים שמרגישים נכון.",
                "Есть несколько хороших направлений.",
                "A few directions that feel right.",
              )}
            </h3>
            <Example locale={locale} />
          </div>
          <p className="tool-note">{result.disclaimer}</p>
          <div className="tool-option-list">
            {result.options.map((option, i) => (
              <article className="tool-option" key={option.id}>
                <div className="tool-option-number">0{i + 1}</div>
                <div className="tool-option-main">
                  <span className="eyebrow">{option.tag}</span>
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                  <p className="tool-option-why">
                    <Check size={16} />
                    {option.why}
                  </p>
                  <details>
                    <summary>
                      {t(
                        "מה צריך לבדוק",
                        "Что нужно уточнить",
                        "What to check",
                      )}
                    </summary>
                    <ul>
                      {option.checks.map((check) => (
                        <li key={check}>{check}</li>
                      ))}
                    </ul>
                  </details>
                </div>
                <div className="tool-option-price">
                  <span className="example-note">
                    {t("טווח לדוגמה", "Примерный диапазон", "Example range")}
                  </span>
                  <strong>
                    {money(option.priceMin, locale)}–
                    {money(option.priceMax, locale)}
                  </strong>
                  <span>{option.priceUnit}</span>
                  <button
                    className="button button-outline"
                    onClick={() => save(option)}
                  >
                    {saved.includes(option.id) ? (
                      <Check size={16} />
                    ) : (
                      <Plus size={16} />
                    )}{" "}
                    {saved.includes(option.id)
                      ? t("נשמר במסלול", "В маршруте", "Saved to ribbon")
                      : t("למסלול שלי", "В мой маршрут", "Save to my ribbon")}
                  </button>
                  <button
                    className="tool-text-link"
                    onClick={() =>
                      handoff({
                        source: "planner",
                        travellerWords: prompt,
                        selections: {
                          refinements: answers,
                          ...(mood ? { mood } : {}),
                        },
                        options: [option],
                        notes: "",
                      })
                    }
                  >
                    {t(
                      "להעביר לנציג",
                      "Передать консультанту",
                      "Send to an agent",
                    )}
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            className="button button-outline"
            onClick={() => setRefine(!refine)}
            aria-expanded={refine}
          >
            <SlidersHorizontal size={16} />
            {t("נדייק קצת", "Уточнить пожелания", "Refine")}
          </button>
          {refine && (
            <form
              className="tool-refine"
              onSubmit={(e) => {
                e.preventDefault();
                void plan();
              }}
            >
              {result.followUps.slice(0, 2).map((q, i) => (
                <Field key={q} label={q}>
                  <input
                    value={answers[i]}
                    onChange={(e) =>
                      setAnswers(
                        answers.map((answer, j) =>
                          j === i ? e.target.value : answer,
                        ),
                      )
                    }
                  />
                </Field>
              ))}
              <button className="button button-dark" disabled={busy}>
                {t(
                  "לעדכן את הכיוונים",
                  "Обновить варианты",
                  "Update my options",
                )}
              </button>
            </form>
          )}
          <a className="tool-text-link" href={`/${locale}/planner#ribbon`}>
            {t("לפתוח את המסלול שלי", "Открыть мой маршрут", "Open my ribbon")}
            <ArrowUpRight size={16} />
          </a>
        </section>
      )}
      <div className="tool-human">
        <span>
          {t(
            "לפעמים הכי טוב לדבר.",
            "Иногда проще поговорить.",
            "Sometimes, a conversation is best.",
          )}
        </span>
        <a href="tel:+97237771039">03-7771039</a>
        <button
          className="tool-text-link"
          onClick={() =>
            handoff({
              source: "planner",
              travellerWords: prompt,
              selections: { ...(mood ? { mood } : {}) },
              notes: "",
            })
          }
        >
          {t("להכין הודעה לנציג", "Подготовить сообщение", "Prepare a message")}
        </button>
      </div>
    </div>
  );
}
