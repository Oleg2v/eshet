"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { DialValues, Locale } from "@/lib/types";
import { money, pick } from "@/lib/locale";

const GlobeCanvas = lazy(() => import("./GlobeCanvas"));

type Props = { locale: Locale; values: DialValues };

const destinations = [
  {
    id: "dead-sea",
    he: "ים המלח",
    ru: "Мёртвое море",
    en: "Dead Sea",
    min: 890,
    max: 1350,
    longitude: 35.5,
    latitude: 31.5,
    x: 58,
    y: 42,
  },
  {
    id: "eilat",
    he: "אילת",
    ru: "Эйлат",
    en: "Eilat",
    min: 950,
    max: 1800,
    longitude: 35,
    latitude: 29.5,
    x: 53,
    y: 58,
  },
  {
    id: "galilee",
    he: "הגליל",
    ru: "Галилея",
    en: "Galilee",
    min: 720,
    max: 1450,
    longitude: 35.4,
    latitude: 32.8,
    x: 62,
    y: 35,
  },
  {
    id: "jerusalem",
    he: "ירושלים",
    ru: "Иерусалим",
    en: "Jerusalem",
    min: 790,
    max: 1600,
    longitude: 35.2,
    latitude: 31.8,
    x: 45,
    y: 40,
  },
  {
    id: "tel-aviv",
    he: "תל אביב",
    ru: "Тель-Авив",
    en: "Tel Aviv",
    min: 850,
    max: 1750,
    longitude: 34.8,
    latitude: 32.1,
    x: 48,
    y: 49,
  },
  {
    id: "europe",
    he: "אירופה",
    ru: "Европа",
    en: "Europe",
    min: 1200,
    max: 2400,
    longitude: 15,
    latitude: 49,
    x: 36,
    y: 27,
  },
];

// A self-contained vector study. It is intentionally a map, not an inventory or a geographic claim.
function FlatMap() {
  return (
    <svg
      className="globe-flat-map"
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="map-sea" cx="32%" cy="26%" r="80%">
          <stop stopColor="#d1e4d2" />
          <stop offset=".6" stopColor="#a8c9bd" />
          <stop offset="1" stopColor="#6c9f94" />
        </radialGradient>
        <radialGradient id="map-shade" cx="32%" cy="28%" r="75%">
          <stop offset=".5" stopColor="#153d38" stopOpacity="0" />
          <stop offset="1" stopColor="#153d38" stopOpacity=".23" />
        </radialGradient>
        <clipPath id="map-clip">
          <circle cx="300" cy="300" r="236" />
        </clipPath>
        <pattern
          id="map-grid"
          width="47.2"
          height="47.2"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M47.2 0H0V47.2"
            fill="none"
            stroke="#426f65"
            strokeWidth=".7"
            opacity=".2"
          />
        </pattern>
      </defs>
      <circle cx="300" cy="300" r="236" fill="url(#map-sea)" />
      <g clipPath="url(#map-clip)">
        <g
          fill="#e8e5c9"
          stroke="#d1d2b6"
          strokeWidth="1.1"
          strokeLinejoin="round"
        >
          <path d="M33 162 67 124 95 111 126 132 144 123 162 143 180 151 199 180 189 203 162 206 150 225 130 242 121 269 112 275 105 255 84 241 68 211 45 196Z" />
          <path d="m130 275 25-7 29 14 20 20 25 4 10 23-13 18-6 36-20 27-8 35-17 26-9-10 2-37-11-24-4-31-13-16-14-40Z" />
          <path d="m181 74 36-13 21 18-8 33-25 12-17-11-12-24Z" />
          <path d="m266 149 16-18 5-37 20-19 12 10-10 45-15 22 17 10 20-3 7-17 20 1 17 21 22 4 17-15 21 12 23-6 18 24 31 1 10 22 36 7 19 22 25 7 10 29-17 15-25-9-21 13-14-15-19 10-18-3-12 25-13 5-11 31-18-11-7-26-18-24-10-27-17 6-18-9-18 3-8-13-18 7-22-19-17 4-3-19-25-3-5-22Z" />
          <path d="m276 221 24-14 33 4 18 19 23 8 12 26 15 1 13 16-15 27-17 13-10 34-15 17-15 38-15 8-10-23-5-31-18-17-6-31-17-9-12-29 8-21Z" />
          <path d="m399 354 10-7 3 29-10 27-8-10Z" />
          <path d="m450 370 18-8 16 6 26-9 28 19 8 31-16 20-30-3-16 9-34-17-9-22Z" />
          <path d="m498 241 8-9 6 10-6 15-5 18-7-5Z" />
          <path d="m457 304 8-9 8 18 17 12 16 3-1 8-23-8-14-11Z" />
          <path d="m252 163 8-11 6 15-7 15-7-5Z" />
          <path d="m29 526 54-17 74 13 46-8 70 12 72-16 53 12 70-6 63 15 56-10 16 36H29Z" />
        </g>
        <rect x="64" y="64" width="472" height="472" fill="url(#map-grid)" />
        <circle cx="300" cy="300" r="236" fill="url(#map-shade)" />
      </g>
      <circle
        cx="300"
        cy="300"
        r="236"
        fill="none"
        stroke="#f4eee0"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Globe({ locale, values }: Props) {
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const current =
    values.temperature > 72
      ? destinations[5]
      : values.energy > 67
        ? destinations[4]
        : values.landscape > 62
          ? destinations[2]
          : values.landscape < 30
            ? destinations[3]
            : values.comfort > 58
              ? destinations[0]
              : destinations[1];
  const secondary =
    current.id === "galilee"
      ? destinations[0]
      : current.id === "eilat"
        ? destinations[0]
        : destinations[2];

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const lowPower =
      connection?.saveData ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2);
    const element = host.current;
    if (!element || reducedMotion.matches || lowPower) return;
    let alive = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && alive) {
          setEnhanced(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    const handlePreference = () => {
      if (reducedMotion.matches) {
        setEnhanced(false);
        setReady(false);
      }
    };
    reducedMotion.addEventListener("change", handlePreference);
    return () => {
      alive = false;
      observer.disconnect();
      reducedMotion.removeEventListener("change", handlePreference);
    };
  }, []);

  return (
    <div
      className="travel-globe"
      ref={host}
      data-testid="globe"
      data-mode={ready ? "3d" : "flat"}
    >
      <div className="globe-ambient" aria-hidden="true" />
      <div className="globe-orbit globe-orbit-one" aria-hidden="true" />
      <div className="globe-orbit globe-orbit-two" aria-hidden="true" />
      <span
        className="globe-coordinate globe-coordinate-top"
        aria-hidden="true"
      >
        32° 05′ N &nbsp; 34° 46′ E
      </span>
      <div className={`globe-visual${ready ? " globe-visual-ready" : ""}`}>
        <FlatMap />
        {enhanced && (
          <Suspense fallback={null}>
            <GlobeCanvas
              longitude={
                current.longitude +
                (values.landscape - 50) * 0.22 +
                (values.energy - 50) * 0.12
              }
              latitude={
                current.latitude +
                (values.temperature - 50) * 0.12 +
                (values.comfort - 50) * 0.08
              }
              onReady={() => setReady(true)}
              onFailure={() => {
                setEnhanced(false);
                setReady(false);
              }}
            />
          </Suspense>
        )}
      </div>
      <div
        className="globe-match globe-match-primary"
        style={{ left: `${current.x}%`, top: `${current.y}%` }}
      >
        <span className="globe-pin" aria-hidden="true" />
        <div className="globe-place-card">
          <span className="globe-match-kicker">
            {pick(
              locale,
              "בדיוק בקצב שלכם",
              "В вашем ритме",
              "Your kind of pace",
            )}
          </span>
          <strong data-testid="globe-destination">
            {pick(locale, current.he, current.ru, current.en)}
          </strong>
          <span className="globe-price">
            <bdi>
              {money(current.min, locale)}–{money(current.max, locale)}
            </bdi>
          </span>
          <small>
            {pick(
              locale,
              "דוגמה · לזוג ללילה",
              "Пример · за пару / ночь",
              "Example · couple / night",
            )}
          </small>
        </div>
      </div>
      <div
        className="globe-match globe-match-secondary"
        style={{ left: `${secondary.x - 24}%`, top: `${secondary.y + 22}%` }}
      >
        <span className="globe-pin" aria-hidden="true" />
        <div className="globe-mini-card">
          <span>{pick(locale, secondary.he, secondary.ru, secondary.en)}</span>
          <small>
            <bdi>
              {money(secondary.min, locale)}–{money(secondary.max, locale)}
            </bdi>
          </small>
          <small>
            {pick(
              locale,
              "דוגמה · לזוג ללילה",
              "Пример · за пару / ночь",
              "Example · couple / night",
            )}
          </small>
        </div>
      </div>
      <div className="globe-compass" aria-hidden="true">
        <span>N</span>
        <svg viewBox="0 0 40 40">
          <path
            d="m20 6 5 14-5 14-5-14Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d="m20 6 5 14h-10Z" fill="currentColor" />
        </svg>
      </div>
      <div className="globe-bottom-note">
        <span className="globe-live-dot" aria-hidden="true" />
        {pick(
          locale,
          "פחות לחפש. יותר להרגיש.",
          "Меньше поиска. Больше предвкушения.",
          "Less searching. More feeling.",
        )}
      </div>
      <p className="dial-sr-only" aria-live="polite">
        {pick(
          locale,
          "התאמה לפי הבחירות שלכם:",
          "По вашим предпочтениям:",
          "Matched to your preferences:",
        )}{" "}
        {pick(locale, current.he, current.ru, current.en)}.{" "}
        {pick(
          locale,
          "מחירים להמחשה בלבד; זמינות ומחיר יאומתו לפני הזמנה.",
          "Цены приведены для примера. Наличие и стоимость нужно уточнить перед бронированием.",
          "Illustrative prices only; availability and price must be confirmed before booking.",
        )}
      </p>
    </div>
  );
}
