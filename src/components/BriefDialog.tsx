"use client";
import { useEffect, useRef, useState } from "react";
import { X, Check, Send, Copy, Phone } from "lucide-react";
import type { Brief, Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
import { buildBriefText } from "@/lib/brief";
type Receipt = {
  id: string;
  preview: string;
  whatsappUrl: string | null;
  delivery: "demo" | "delivered" | "failed";
  message: string;
};
export default function BriefDialog({ locale }: { locale: Locale }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setBrief({
        locale,
        source: detail?.source || "contact",
        travellerWords: detail?.travellerWords || "",
        selections: detail?.selections || {},
        options: detail?.options,
        notes: detail?.notes || "",
        consent: false,
        name: "",
        contact: "",
      });
      setReceipt(null);
      setError("");
      setCopied(false);
    };
    window.addEventListener("eshet:brief", open);
    return () => window.removeEventListener("eshet:brief", open);
  }, [locale]);
  useEffect(() => {
    if (brief && !dialog.current?.open) dialog.current?.showModal();
  }, [brief]);
  const close = () => {
    dialog.current?.close();
    setBrief(null);
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!brief?.consent) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      if (!response.ok) throw new Error("request");
      const result = await response.json();
      setReceipt(result);
    } catch {
      setError(
        pick(
          locale,
          "לא הצלחנו לשמור כרגע. אפשר להעתיק את הפרטים או להתקשר אלינו.",
          "Не удалось сохранить заявку. Скопируйте её или позвоните нам.",
          "We couldn’t save your request. You can copy the brief or call us.",
        ),
      );
    } finally {
      setSending(false);
    }
  }
  async function copy() {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(buildBriefText(brief));
      setCopied(true);
    } catch {
      setError(
        pick(
          locale,
          "אפשר לסמן ולהעתיק את הסיכום שלמטה.",
          "Выделите и скопируйте текст ниже.",
          "Select and copy the brief below.",
        ),
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className="brief-dialog"
      onCancel={close}
      aria-labelledby="brief-title"
    >
      <button
        className="icon-button dialog-close"
        onClick={close}
        aria-label={pick(locale, "סגירה", "Закрыть", "Close")}
      >
        <X size={22} />
      </button>
      {brief && (
        <>
          <p className="eyebrow">A GOOD CONVERSATION STARTS HERE</p>
          <h2 id="brief-title">
            {receipt
              ? pick(
                  locale,
                  "הכול מסודר, במקום אחד.",
                  "Всё собрано в одном месте.",
                  "Everything, in one place.",
                )
              : pick(
                  locale,
                  "אתם מספרים. אנחנו מקשיבים.",
                  "Вы рассказываете. Мы слушаем.",
                  "You tell us. We listen.",
                )}
          </h2>
          <p>
            {pick(
              locale,
              "זה בדיוק הסיכום שנעביר. אפשר לערוך לפני השליחה.",
              "Это точный текст заявки. Его можно изменить перед отправкой.",
              "This is exactly the brief we’ll share. Edit it before sending.",
            )}
          </p>
          {receipt ? (
            <div className="brief-receipt" role="status">
              <Check />
              <p>{receipt.message}</p>
              <small>
                {pick(
                  locale,
                  "מספר פנייה",
                  "Номер заявки",
                  "Enquiry reference",
                )}
                : {receipt.id}
              </small>
            </div>
          ) : null}
          <form onSubmit={submit}>
            <div className="brief-fields">
              <label className="field">
                {pick(locale, "איך קוראים לכם?", "Как вас зовут?", "Your name")}
                <input
                  data-testid="handoff-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={brief.name}
                  disabled={!!receipt}
                  onChange={(e) => setBrief({ ...brief, name: e.target.value })}
                />
              </label>
              <label className="field">
                {pick(
                  locale,
                  "אימייל או טלפון לחזרה",
                  "Телефон или email",
                  "Email or phone",
                )}
                <input
                  data-testid="handoff-contact"
                  name="contact"
                  autoComplete="email"
                  maxLength={200}
                  required
                  value={brief.contact}
                  disabled={!!receipt}
                  onChange={(e) =>
                    setBrief({ ...brief, contact: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="field">
              {pick(
                locale,
                "עוד משהו שכדאי שנדע?",
                "Что ещё нам стоит знать?",
                "Anything else we should know?",
              )}
              <textarea
                rows={2}
                maxLength={2000}
                value={brief.notes}
                disabled={!!receipt}
                onChange={(e) => setBrief({ ...brief, notes: e.target.value })}
              />
            </label>
            <div className="brief-preview" data-testid="brief-preview">
              <pre>{buildBriefText(brief)}</pre>
            </div>
            {!receipt && (
              <>
                <label className="consent-row">
                  <input
                    type="checkbox"
                    data-testid="handoff-consent"
                    required
                    checked={brief.consent}
                    onChange={(e) =>
                      setBrief({ ...brief, consent: e.target.checked })
                    }
                  />
                  <span>
                    {pick(
                      locale,
                      "אני מאשר/ת לשמור את הפרטים ולשתף אותם לצורך טיפול בפנייה. ללא הצטרפות לדיוור.",
                      "Согласен(-на) на сохранение и передачу данных для обработки заявки. Без подписки на рассылку.",
                      "I agree to save and share these details to handle my enquiry. No marketing subscription.",
                    )}
                  </span>
                </label>
                <p className="example-note">
                  {pick(
                    locale,
                    "במצב הדגמה הפנייה נשמרת במערכת ההדגמה. שליחה אמיתית פעילה רק לאחר חיבור המערכת.",
                    "В деморежиме заявка сохраняется в демосистеме. Реальная отправка работает после подключения системы.",
                    "In demo mode your request is saved in this demonstration system. Live delivery requires a configured connection.",
                  )}
                </p>
                <button
                  className="button button-dark"
                  data-testid="brief-submit"
                  disabled={sending || !brief.consent}
                  type="submit"
                >
                  <Send size={16} />
                  {sending
                    ? pick(locale, "שומרים…", "Сохраняем…", "Saving…")
                    : pick(
                        locale,
                        "אישור ושליחת הפנייה",
                        "Подтвердить заявку",
                        "Confirm & send enquiry",
                      )}
                </button>
              </>
            )}
          </form>
          <div className="brief-actions">
            <button className="text-link" onClick={copy}>
              <Copy size={15} />
              {copied
                ? pick(locale, "הועתק", "Скопировано", "Copied")
                : pick(
                    locale,
                    "העתקת הסיכום",
                    "Скопировать заявку",
                    "Copy brief",
                  )}
            </button>
            {receipt?.whatsappUrl ? (
              <a
                className="text-link"
                href={receipt.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pick(
                  locale,
                  "שיתוף הסיכום ב־WhatsApp",
                  "Поделиться заявкой в WhatsApp",
                  "Share brief in WhatsApp",
                )}{" "}
                ↗
              </a>
            ) : (
              <span className="muted small">
                {pick(
                  locale,
                  "מספר WhatsApp עסקי: לאישור מול אשת.",
                  "Номер WhatsApp компании требует подтверждения.",
                  "Business WhatsApp number: to confirm with Eshet.",
                )}
              </span>
            )}
            <a className="text-link" href="tel:037771039">
              <Phone size={15} />
              <span dir="ltr">03-7771039</span>
            </a>
            {receipt?.whatsappUrl && (
              <p className="example-note">
                {pick(
                  locale,
                  "בחלון WhatsApp בחרו או בדקו את הנמען לפני השליחה.",
                  "В WhatsApp выберите или проверьте получателя перед отправкой.",
                  "Choose or check the recipient in WhatsApp before sending.",
                )}
              </p>
            )}
          </div>
          {error && (
            <p className="form-feedback" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </dialog>
  );
}
