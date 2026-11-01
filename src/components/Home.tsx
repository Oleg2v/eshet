"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Sparkles,
  Plus,
  Asterisk,
} from "lucide-react";
import type { DialValues, Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
import Globe from "./Globe";
import Dials from "./Dials";
import Landscape from "./Landscape";
import DealBoard from "./DealBoard";
const initial: DialValues = {
  temperature: 72,
  energy: 28,
  landscape: 70,
  comfort: 65,
};
export default function Home({ locale }: { locale: Locale }) {
  const [values, setValues] = useState<DialValues>(initial);
  const [party, setParty] = useState("couple");
  const [budget, setBudget] = useState("1200-1800");
  const [changed, setChanged] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const latest = useRef({ values, party, budget, changed });
  useEffect(() => {
    latest.current = { values, party, budget, changed };
  }, [values, party, budget, changed]);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    let cleanup = () => {};
    const idle = window.setTimeout(async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.12 });
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            y: 25,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          });
        });
      });
      cleanup = () => {
        lenis.destroy();
        context.revert();
      };
    }, 1400);
    return () => {
      window.clearTimeout(idle);
      cleanup();
    };
  }, []);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>(".magnetic"),
    );
    const move = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      const box = el.getBoundingClientRect();
      el.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * 0.035}px,${(event.clientY - box.top - box.height / 2) * 0.08}px)`;
    };
    const leave = (event: PointerEvent) => {
      (event.currentTarget as HTMLElement).style.transform = "";
    };
    buttons.forEach((el) => {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    });
    return () =>
      buttons.forEach((el) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
  }, []);
  useEffect(() => {
    const record = () => {
      try {
        const consent = JSON.parse(
          localStorage.getItem("eshet-consent") || "{}",
        );
        const state = latest.current;
        if (!state.changed || !consent.analytics) return;
        navigator.sendBeacon(
          "/api/events",
          new Blob(
            [
              JSON.stringify({
                locale,
                type: "abandoned-search",
                consent: true,
                source: "hero",
                dialSettings: state.values,
                selections: { party: state.party, budgetBand: state.budget },
                travellerWords: "",
              }),
            ],
            { type: "application/json" },
          ),
        );
      } catch {
        /* Optional analytics must never interrupt travel planning. */
      }
    };
    window.addEventListener("pagehide", record);
    return () => window.removeEventListener("pagehide", record);
  }, [locale]);
  function tilt(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5,
      y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    event.currentTarget.style.setProperty("--shine", `${(x + 0.5) * 100}%`);
  }
  const partyText = pick(
    locale,
    party === "couple" ? "זוג" : party === "family" ? "משפחה" : "חברים",
    party === "couple" ? "Пара" : party === "family" ? "Семья" : "Друзья",
    party === "couple" ? "A couple" : party === "family" ? "Family" : "Friends",
  );
  function saveMood() {
    try {
      sessionStorage.setItem(
        "eshet-mood",
        JSON.stringify({ values, party, budget }),
      );
    } catch {
      /* Planning still works when browser storage is unavailable. */
    }
  }
  return (
    <main id="main-content">
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="little-line" />
            {pick(
              locale,
              "מאז 1987 · מכאן, לכל מקום",
              "С 1987 года · отсюда — дальше",
              "SINCE 1987 · FROM HERE, TO SOMEWHERE",
            )}
          </div>
          <h1 id="hero-heading">
            <span className="headline-first">
              {pick(locale, "איזו חופשה", "Какая поездка", "What kind of")}
            </span>
            <br />
            <span>
              {pick(locale, "בא לכם?", "вам по душе?", "away are you?")}
            </span>
            <span className="headline-spark" aria-hidden>
              <Asterisk />
            </span>
          </h1>
          <p className="hero-description">
            {pick(
              locale,
              "לא צריך לדעת לאן. מספיק לדעת איך בא לכם להרגיש.",
              "Необязательно знать куда. Начните с того, как хотите себя чувствовать.",
              "You don’t have to know where. Start with how you want to feel.",
            )}
          </p>
          <div className="mood-panel">
            <div className="mood-intro">
              <span>
                {pick(
                  locale,
                  "תנו לתחושה לכוון.",
                  "Пусть настроение задаст курс.",
                  "Let the feeling lead.",
                )}
              </span>
              <span className="micro-label">01 — 04</span>
            </div>
            <Dials
              locale={locale}
              values={values}
              onChange={(v) => {
                setValues(v);
                setChanged(true);
              }}
            />
            <div className="hero-fields">
              <label>
                {pick(locale, "מי מצטרף?", "С кем едем?", "Who’s coming?")}
                <select
                  value={party}
                  onChange={(e) => {
                    setParty(e.target.value);
                    setChanged(true);
                  }}
                >
                  <option value="couple">
                    {pick(locale, "זוג", "Вдвоём", "Two of us")}
                  </option>
                  <option value="family">
                    {pick(locale, "משפחה", "С семьёй", "The family")}
                  </option>
                  <option value="friends">
                    {pick(locale, "חברים", "С друзьями", "With friends")}
                  </option>
                </select>
              </label>
              <label>
                {pick(
                  locale,
                  "תקציב ללילה, לדוגמה",
                  "Бюджет за ночь, пример",
                  "Nightly budget, example",
                )}
                <select
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setChanged(true);
                  }}
                >
                  <option value="600-1200">₪600 – ₪1,200</option>
                  <option value="1200-1800">₪1,200 – ₪1,800</option>
                  <option value="1800-2800">₪1,800 – ₪2,800</option>
                </select>
              </label>
            </div>
          </div>
          <div className="hero-cta">
            <Link
              className="button button-dark magnetic"
              href={`/${locale}/planner`}
              onClick={saveMood}
            >
              {pick(
                locale,
                "בואו נמצא את החופשה שלי",
                "Найдём мою поездку",
                "Find my kind of away",
              )}
              <ArrowUpRight size={19} />
            </Link>
            <span className="hero-ai-note">
              <Sparkles size={15} />
              {pick(
                locale,
                "קצת השראה. הרבה הקשבה.",
                "Немного вдохновения. Много внимания.",
                "A little inspiration. A lot of listening.",
              )}
            </span>
          </div>
        </div>
        <div className="hero-world">
          <div className="world-heading">
            <span className="micro-label">A WORLD OF POSSIBILITIES</span>
            <span className="world-coordinates" dir="ltr">
              31° N · 35° E
            </span>
          </div>
          <Globe locale={locale} values={values} />
          <div className="world-caption">
            <span className="world-compass" aria-hidden>
              N<br />↟
            </span>
            <p>
              {pick(
                locale,
                "יש מקום שמתאים בדיוק\nלתחושה הזאת.",
                "Где-то есть место\nименно для этого настроения.",
                "Somewhere feels\njust like you.",
              )}
            </p>
            <span className="world-stamp" aria-hidden>
              GO
              <br />
              <i>feel.</i>
            </span>
          </div>
        </div>
      </section>
      <div className="hero-bottom container">
        <a href="#ways" className="scroll-note">
          <ArrowDown size={16} />
          {pick(
            locale,
            "יש עוד דרכים לצאת",
            "Есть и другие пути",
            "There’s more than one way to go",
          )}
        </a>
        <span>
          {pick(
            locale,
            "אנשים. מקומות. ומה שביניהם.",
            "Люди. Места. И всё, что между ними.",
            "People. Places. Everything in between.",
          )}
        </span>
      </div>
      <section id="ways" className="ways-section container reveal">
        <div className="section-intro">
          <p className="eyebrow">FIND YOUR WAY</p>
          <h2>
            {pick(
              locale,
              "כל אחד והדרך שלו.",
              "Каждому — свой путь.",
              "Everyone has a way.",
            )}
          </h2>
          <p>
            {pick(
              locale,
              "קרוב לבית, רחוק מהרגיל. או פשוט רחוק.",
              "Рядом с домом, вдали от привычного. Или просто далеко.",
              "Close to home, far from ordinary. Or just far away.",
            )}
          </p>
        </div>
        <div className="ways-grid">
          {[
            [
              "israel",
              "01",
              "חופשה בארץ",
              "Отдых в Израиле",
              "Stay a little closer",
              "במרחק נשימה",
              "Вдохнуть и выдохнуть",
              "Room to breathe",
            ],
            [
              "tours",
              "02",
              "טיולים מאורגנים",
              "Туры с гидом",
              "Go a little deeper",
              "לגלות עם מי שמכיר",
              "Открывать с теми, кто знает",
              "With people who know",
            ],
            [
              "packages",
              "03",
              "חבילות וטיסות",
              "Пакеты и перелёты",
              "Find a new rhythm",
              "משנים אווירה",
              "Сменить обстановку",
              "A change of scene",
            ],
            [
              "cruises",
              "04",
              "קרוזים",
              "Круизы",
              "Follow the horizon",
              "כל בוקר, אופק אחר",
              "Каждое утро — новый горизонт",
              "A new view each morning",
            ],
          ].map(([slug, num, he, ru, en, subhe, subru, suben]) => (
            <Link className="way-link" href={`/${locale}/${slug}`} key={slug}>
              <span className="way-number">{num}</span>
              <div>
                <h3>{pick(locale, he, ru, en)}</h3>
                <p>{pick(locale, subhe, subru, suben)}</p>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
      </section>
      <section className="destinations-section container reveal">
        <div className="section-head">
          <div>
            <p className="eyebrow">CLOSER THAN YOU THINK</p>
            <h2>
              {pick(
                locale,
                "לפעמים, פחות מרחק.\nיותר חופשה.",
                "Иногда ближе —\nзначит свободнее.",
                "Sometimes, less distance.\nMore away.",
              )}
            </h2>
          </div>
          <Link href={`/${locale}/israel`} className="text-link">
            {pick(
              locale,
              "לגלות את הארץ מחדש",
              "Открыть Израиль заново",
              "Find your Israel",
            )}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="destination-spread">
          <Link href={`/${locale}/israel`} className="destination-feature">
            <div className="art-frame">
              <Landscape kind="sea" />
              <span className="frame-overline">31° 32′ N / 35° 29′ E</span>
              <div className="frame-title">
                <span>
                  {pick(locale, "להוריד הילוך.", "Замедлиться.", "Slow down.")}
                </span>
                <h3>{pick(locale, "ים המלח", "Мёртвое море", "Dead Sea")}</h3>
              </div>
              <span className="frame-circle">
                <ArrowUpRight size={24} />
              </span>
            </div>
            <div className="frame-caption">
              <span>
                {pick(
                  locale,
                  "מסגרת צילום: אור ראשון, מלח בחזית, ללא אנשים",
                  "Кадр: первый свет, соль на переднем плане, без людей",
                  "Photo direction: first light, salt foreground, no people",
                )}
              </span>
              <span>01 / 02</span>
            </div>
          </Link>
          <Link href={`/${locale}/israel`} className="destination-secondary">
            <div className="art-frame">
              <Landscape kind="desert" />
              <span className="frame-overline">29° 33′ N / 34° 57′ E</span>
              <div className="frame-title">
                <span>
                  {pick(
                    locale,
                    "לתת לשמש זמן.",
                    "Побыть на солнце.",
                    "Let the sun linger.",
                  )}
                </span>
                <h3>{pick(locale, "אילת", "Эйлат", "Eilat")}</h3>
              </div>
              <span className="frame-circle">
                <ArrowUpRight size={24} />
              </span>
            </div>
            <div className="frame-caption">
              <span>
                {pick(
                  locale,
                  "מסגרת צילום: מדבר חם, קו מים, מרחב פתוח",
                  "Кадр: тёплая пустыня, вода, открытый простор",
                  "Photo direction: warm desert, waterline, open space",
                )}
              </span>
              <span>02 / 02</span>
            </div>
            <p className="destination-aside">
              {pick(
                locale,
                "אותה ארץ.\nכל כך הרבה דרכים לנשום.",
                "Одна страна.\nСтолько способов выдохнуть.",
                "One small country.\nSo many ways to exhale.",
              )}
            </p>
          </Link>
        </div>
      </section>
      <div className="container board-section reveal">
        <DealBoard locale={locale} />
      </div>
      <section className="planner-story container reveal">
        <div className="planner-story-heading">
          <p className="eyebrow">MEET YOUR ESHET PLANNER</p>
          <h2>
            {pick(
              locale,
              "חופשה שמתחילה\nב״אנחנו אוהבים…״",
              "Поездка начинается\nс «нам нравится…»",
              "A trip that starts\nwith “we love…”",
            )}
          </h2>
          <p>
            {pick(
              locale,
              "ספרו לנו מי אתם, מה חשוב לכם ואיפה בא לכם להתעורר. נעשה מזה התחלה טובה — וסיכום מסודר לסוכן.",
              "Расскажите, с кем едете, что важно и где хотелось бы проснуться. Мы предложим варианты и соберём понятную заявку агенту.",
              "Tell us who’s coming, what matters and where you’d like to wake up. We’ll turn it into a thoughtful start — and a clear brief for your agent.",
            )}
          </p>
          <Link
            className="text-link"
            href={`/${locale}/planner`}
            onClick={saveMood}
          >
            {pick(
              locale,
              "נעים להכיר. בואו נתחיל.",
              "Давайте знакомиться.",
              "Nice to meet you. Let’s begin.",
            )}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="planner-note">
          <div className="note-top">
            <span>YOUR NEXT CHAPTER</span>
            <span aria-hidden>
              <Asterisk />
            </span>
          </div>
          <p>
            {pick(
              locale,
              "״שבוע בחנוכה. אנחנו,\nהקטנה, וקצת שקט.\nאילת או ים המלח?״",
              "«На Хануку — мы,\nмалышка и немного тишины.\nЭйлат или Мёртвое море?»",
              "“A week at Hanukkah.\nThe two of us, our little one,\nand a little quiet.”",
            )}
          </p>
          <div className="note-underline" />
          <div className="note-bottom">
            <span>
              {pick(
                locale,
                "ממילים לתכנית. בלי להתחיל מאפס.",
                "От слов — к плану.",
                "From your words to a way forward.",
              )}
            </span>
            <Link
              href={`/${locale}/planner`}
              aria-label={pick(
                locale,
                "פתיחת המתכנן",
                "Открыть планировщик",
                "Open planner",
              )}
            >
              <Plus />
            </Link>
          </div>
        </div>
      </section>
      <section className="club-section">
        <div className="container club-inner">
          <div className="club-card-wrap">
            <div
              ref={card}
              className="club-card"
              onPointerMove={tilt}
              onPointerLeave={() => {
                if (card.current) card.current.style.transform = "";
              }}
            >
              <div className="club-card-top">
                <span>
                  ESHET
                  <br />
                  <b>CLUB</b>
                </span>
                <span className="card-flower" aria-hidden>
                  <Asterisk />
                </span>
              </div>
              <p>
                {pick(
                  locale,
                  "תמיד יש למה לצפות.",
                  "Всегда есть чего ждать.",
                  "Always something to look forward to.",
                )}
              </p>
              <div className="club-card-bottom">
                <span>
                  GOOD PLACES.
                  <br />
                  BETTER COMPANY.
                </span>
                <span className="card-chip" aria-hidden />
              </div>
            </div>
          </div>
          <div className="club-copy">
            <p className="eyebrow">A LITTLE CLOSER. A LITTLE MORE.</p>
            <h2>
              {pick(
                locale,
                "יש יתרון\nבלהיות משלנו.",
                "Приятно быть\nсреди своих.",
                "It’s good\nto belong.",
              )}
            </h2>
            <p>
              {pick(
                locale,
                "הצטרפו למועדון ותהנו ממבצעים שווים לפני כולם. הטבות לחברים וגישה מוקדמת — בדיוק כשהחופשה הבאה מתחילה לקבל צורה.",
                "Вступайте в клуб и узнавайте о предложениях раньше остальных. Скидки для участников и ранний доступ — когда следующая поездка только начинает складываться.",
                "Join the club and enjoy great deals before everyone. Member benefits and early access, right when your next trip starts taking shape.",
              )}
            </p>
            <Link className="button button-coral" href={`/${locale}/club`}>
              {pick(
                locale,
                "נעים להיות בקלאב",
                "Вступить в клуб",
                "Make yourself at home",
              )}
              <ArrowUpRight size={18} />
            </Link>
            <span className="club-fineprint">
              {pick(
                locale,
                "ההטבות ותנאי החברות כפופים לאישור אשת.",
                "Условия и преимущества нужно подтвердить в Eshet.",
                "Membership terms and benefits require Eshet confirmation.",
              )}
            </span>
          </div>
        </div>
      </section>
      <section className="travel-confidence container reveal">
        <p className="eyebrow">MORE ROOM TO ENJOY</p>
        <div className="confidence-grid">
          {[
            [
              "flex",
              "קצת יותר גמישות.",
              "Немного больше гибкости.",
              "A little more flexibility.",
              "מכירים את FLEX לפני שמחליטים.",
              "Познакомьтесь с FLEX до бронирования.",
              "Get to know FLEX before you decide.",
            ],
            [
              "visa",
              "פחות סימני שאלה.",
              "Меньше вопросов.",
              "Fewer question marks.",
              "אשרות וכניסה, עם המקור הרשמי ליד.",
              "Визы и въезд — со ссылкой на официальный источник.",
              "Visa & entry, with official sources close by.",
            ],
            [
              "contact",
              "מישהו בצד השני.",
              "Кто-то на другом конце.",
              "Someone at the other end.",
              "להזמנה קלה ופריסה נוחה לתשלומים.",
              "Помощь с бронированием и оплатой частями.",
              "Easy booking and convenient instalments.",
            ],
          ].map(([slug, he, ru, en, a, b, c]) => (
            <Link href={`/${locale}/${slug}`} key={slug}>
              <h3>{pick(locale, he, ru, en)}</h3>
              <p>{pick(locale, a, b, c)}</p>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <span className="sr-only">{partyText}</span>
    </main>
  );
}
