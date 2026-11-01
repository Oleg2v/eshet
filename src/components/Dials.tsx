"use client";

import { useId, useRef, type CSSProperties, type PointerEvent } from "react";
import type { DialValues, Locale } from "@/lib/types";
import { pick } from "@/lib/locale";

type Props = {
  locale: Locale;
  values: DialValues;
  onChange: (values: DialValues) => void;
};
type DialKey = keyof DialValues;

export default function Dials({ locale, values, onChange }: Props) {
  const groupId = useId();
  const dragging = useRef<DialKey | null>(null);
  const rtl = locale === "he";
  const labels: { key: DialKey; name: string; from: string; to: string }[] = [
    {
      key: "temperature",
      name: pick(locale, "מזג אוויר", "Погода", "Weather"),
      from: pick(locale, "חם", "Тепло", "Warm"),
      to: pick(locale, "קריר", "Прохладно", "Cool"),
    },
    {
      key: "energy",
      name: pick(locale, "קצב החופשה", "Ритм", "The pace"),
      from: pick(locale, "שקט", "Тишина", "Quiet"),
      to: pick(locale, "תוסס", "Движение", "Lively"),
    },
    {
      key: "landscape",
      name: pick(locale, "מה מסביב", "Впечатления", "Surroundings"),
      from: pick(locale, "תרבות", "Культура", "Culture"),
      to: pick(locale, "טבע", "Природа", "Nature"),
    },
    {
      key: "comfort",
      name: pick(locale, "סגנון האירוח", "Комфорт", "Your style"),
      from: pick(locale, "פשוט", "Просто", "Simple"),
      to: pick(locale, "מפנק", "С размахом", "Indulgent"),
    },
  ];

  function updateFromPointer(
    event: PointerEvent<HTMLInputElement>,
    key: DialKey,
  ) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    let angle = (Math.atan2(x, -y) * 180) / Math.PI;
    if (rtl) angle *= -1;
    const next = Math.round(
      Math.max(0, Math.min(100, ((angle + 135) / 270) * 100)),
    );
    onChange({ ...values, [key]: next });
  }

  return (
    <fieldset className="feeling-dials" data-testid="feeling-dials">
      <legend className="dial-sr-only">
        {pick(
          locale,
          "כוונו את החופשה שלכם",
          "Настройте свой отдых",
          "Tune your holiday",
        )}
      </legend>
      {labels.map(({ key, name, from, to }) => (
        <div className="feeling-dial" key={key}>
          <label className="dial-name" htmlFor={`${groupId}-${key}`}>
            {name}
          </label>
          <div
            className="dial-mechanism"
            style={
              {
                "--dial-angle": `${(rtl ? -1 : 1) * (-135 + values[key] * 2.7)}deg`,
                "--dial-progress": `${values[key] * 2.7}deg`,
              } as CSSProperties
            }
          >
            <span className="dial-scale" aria-hidden="true" />
            <span className="dial-knob" aria-hidden="true">
              <span className="dial-pointer" />
            </span>
            <input
              id={`${groupId}-${key}`}
              data-testid={`dial-${key}`}
              type="range"
              min="0"
              max="100"
              step="1"
              value={values[key]}
              aria-valuetext={`${from} ${100 - values[key]}% · ${to} ${values[key]}%`}
              onChange={(event) =>
                onChange({ ...values, [key]: Number(event.target.value) })
              }
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                dragging.current = key;
                updateFromPointer(event, key);
              }}
              onPointerMove={(event) => {
                if (
                  dragging.current === key &&
                  event.currentTarget.hasPointerCapture(event.pointerId)
                )
                  updateFromPointer(event, key);
              }}
              onPointerUp={(event) => {
                dragging.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => {
                dragging.current = null;
              }}
            />
          </div>
          <div className="dial-extremes" aria-hidden="true">
            <span>{from}</span>
            <span>{to}</span>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
