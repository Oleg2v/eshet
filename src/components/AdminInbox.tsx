"use client";
import { useState } from "react";
import type { Lead, Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
import { buildBriefText } from "@/lib/brief";

type Inbox = {
  leads: Lead[];
  stats: {
    total: number;
    new: number;
    sources: Record<string, number>;
    topDestinations: { name: string; count: number }[];
  };
  demoCount: number;
  storage: "local-demo" | "ephemeral";
};
export default function AdminInbox({ locale }: { locale: Locale }) {
  const t = (he: string, ru: string, en: string) => pick(locale, he, ru, en);
  const [password, setPassword] = useState("");
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const sourceName = (source: string) =>
    ({
      planner: t("תכנון נסיעה", "Планирование", "Trip planning"),
      package: t("חבילת נופש", "Турпакет", "Holiday package"),
      packages: t("חבילת נופש", "Турпакет", "Holiday package"),
      tours: t("השוואת טיולים", "Сравнение туров", "Tour comparison"),
      "tour-comparison": t(
        "השוואת טיולים",
        "Сравнение туров",
        "Tour comparison",
      ),
      cruise: t("שייט", "Круиз", "Cruise"),
      cruises: t("שייט", "Круиз", "Cruise"),
      group: t("בקשת קבוצה", "Групповая заявка", "Group enquiry"),
      groups: t("בקשת קבוצה", "Групповая заявка", "Group enquiry"),
      "club-signup": t("הצטרפות למועדון", "Вступление в клуб", "Club signup"),
      "abandoned-search": t(
        "חיפוש שלא הושלם",
        "Незавершённый поиск",
        "Unfinished search",
      ),
      contact: t("יצירת קשר", "Обращение", "Contact"),
      ribbon: t("מסלול אישי", "Личный маршрут", "Personal itinerary"),
      israel: t("חופשה בארץ", "Отдых в Израиле", "Holiday in Israel"),
      flights: t("טיסות", "Авиабилеты", "Flights"),
      hotels: t("מלונות", "Отели", "Hotels"),
      visa: t("מסמכי כניסה", "Документы для въезда", "Entry documents"),
      flex: t("גמישות בביטול", "Гибкая отмена", "Cancellation flexibility"),
    })[source] || source.replace(/-/g, " ");
  async function load() {
    const response = await fetch("/api/admin/leads", { cache: "no-store" });
    if (!response.ok) throw new Error("load");
    const data: Inbox = await response.json();
    setInbox(data);
  }
  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, locale }),
      });
      if (!response.ok) {
        const result = await response.json();
        setError(
          result.code === "disabled"
            ? t(
                "כדי לפתוח את תיבת הפניות, הגדירו בסביבה סיסמה פרטית באורך 12 תווים לפחות.",
                "Для входа задайте в настройках среды личный пароль длиной не менее 12 символов.",
                "To enable the inbox, configure a private password of at least 12 characters in the environment.",
              )
            : result.code === "busy"
              ? t(
                  "יותר מדי ניסיונות. אפשר לנסות שוב בעוד כמה דקות.",
                  "Слишком много попыток. Попробуйте ещё раз через несколько минут.",
                  "Too many attempts. Please try again in a few minutes.",
                )
              : t(
                  "הסיסמה לא התאימה. אפשר לנסות שוב.",
                  "Пароль не подошёл. Попробуйте ещё раз.",
                  "That password did not match. Please try again.",
                ),
        );
        return;
      }
      setPassword("");
      await load();
    } catch {
      setError(
        t(
          "לא הצלחנו לפתוח את התיבה כרגע. נסו שוב.",
          "Сейчас открыть список заявок не удалось. Попробуйте снова.",
          "We could not open the inbox just now. Please try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("logout");
      setInbox(null);
      setFilter("all");
    } catch {
      setError(
        t(
          "לא הצלחנו לסיים את ההתחברות. נסו שוב.",
          "Не удалось завершить сеанс. Попробуйте снова.",
          "We could not sign out. Please try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      await load();
    } catch {
      setError(
        t(
          "לא ניתן לרענן כרגע. ייתכן שצריך להיכנס מחדש.",
          "Не удалось обновить список. Возможно, нужно войти снова.",
          "Refresh is unavailable. You may need to sign in again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  if (!inbox)
    return (
      <form className="admin-login" onSubmit={login} aria-busy={busy}>
        <p className="eyebrow">
          {t(
            "לצוות בלבד · תיבת פניות להדגמה",
            "ТОЛЬКО ДЛЯ КОМАНДЫ · ДЕМОЗАЯВКИ",
            "FOR THE TEAM · DEMO INBOX",
          )}
        </p>
        <h2>
          {t(
            "מה אנשים באמת מחפשים.",
            "Что на самом деле ищут путешественники.",
            "What travellers are really looking for.",
          )}
        </h2>
        <p>
          {t(
            "גישה לצוות בלבד. הסיסמה מוגדרת במשתני הסביבה; אין סיסמת ברירת מחדל.",
            "Доступ для команды. Пароль задаётся в переменных среды; пароля по умолчанию нет.",
            "For the team. The password is set in the environment; there is no default password.",
          )}
        </p>
        <label className="field">
          {t("סיסמה", "Пароль", "Password")}
          <input
            type="password"
            autoComplete="current-password"
            required
            maxLength={300}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="button button-dark" disabled={busy}>
          {busy
            ? t("פותחים את התיבה…", "Открываем список…", "Opening the inbox…")
            : t("כניסה", "Войти", "Sign in")}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    );
  const sources = Object.keys(inbox.stats.sources);
  const filtered =
    filter === "all"
      ? inbox.leads
      : inbox.leads.filter((lead) => lead.source === filter);
  return (
    <section
      className="admin-inbox"
      aria-busy={busy}
      aria-label={t("תיבת פניות", "Список заявок", "Enquiry inbox")}
    >
      <div className="admin-heading">
        <div>
          <p className="eyebrow">
            {t(
              "תיבת פניות · סביבת הדגמה",
              "СПИСОК ЗАЯВОК · ДЕМОСРЕДА",
              "ENQUIRY INBOX · DEMO ENVIRONMENT",
            )}
          </p>
          <h2>
            {inbox.stats.total}{" "}
            {t(
              "פניות, עם כל ההקשר.",
              "заявок — со всеми деталями.",
              "enquiries, with the whole story.",
            )}
          </h2>
        </div>
        <button
          className="button button-outline"
          disabled={busy}
          onClick={() => void logout()}
        >
          {t("יציאה", "Выйти", "Sign out")}
        </button>
      </div>
      <p className="example-note">
        {t("כולל", "В том числе", "Includes")} {inbox.demoCount}{" "}
        {t(
          "פניות מומצאות שמדגימות את התהליך. פניות שנשמרו מהטפסים מסומנות בנפרד.",
          "учебных заявок для демонстрации процесса. Заявки из форм отмечены отдельно.",
          "authored examples illustrating the pipeline. Submissions saved from forms are marked separately.",
        )}
      </p>
      <p className="small muted">
        {inbox.storage === "ephemeral"
          ? t(
              "האחסון זמני למופע ההדגמה הזה. לחיבור אמיתי יש להשתמש ב־CRM או במסד נתונים.",
              "Данные хранятся временно в этом экземпляре демоверсии. Для рабочего запуска нужен CRM или база данных.",
              "Storage is temporary to this demo instance. Production needs a CRM or database.",
            )
          : t(
              "הפניות נשמרות מקומית בסביבת ההדגמה. אין כאן אישורי הזמנה.",
              "Заявки сохраняются локально в демосреде. Это не подтверждения бронирования.",
              "Enquiries are saved locally in the demo environment. These are not booking confirmations.",
            )}
      </p>
      <div className="popular-destinations">
        <h3>
          {t(
            "היעדים המבוקשים בשבעת הימים האחרונים",
            "Популярные направления за последние семь дней",
            "Most requested in the last seven days",
          )}
        </h3>
        <p className="small">
          {t(
            "הספירה כוללת גם את פניות ההדגמה המסומנות.",
            "Подсчёт включает отмеченные учебные заявки.",
            "Counts include the labelled demonstration enquiries.",
          )}
        </p>
        {inbox.stats.topDestinations.length ? (
          inbox.stats.topDestinations.map(({ name, count }) => (
            <span key={name}>
              {name} <b>{count}</b>
            </span>
          ))
        ) : (
          <p>
            {t(
              "יעדים יופיעו כאן לאחר שמירת פניות.",
              "Направления появятся после сохранения заявок.",
              "Destinations will appear after enquiries are saved.",
            )}
          </p>
        )}
      </div>
      <label className="field">
        {t("סוג פנייה", "Тип заявки", "Enquiry type")}
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">{t("הכול", "Все", "All")}</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {sourceName(source)} ({inbox.stats.sources[source]})
            </option>
          ))}
        </select>
      </label>
      <button
        className="text-link"
        disabled={busy}
        onClick={() => void refresh()}
      >
        {busy
          ? t("מרעננים…", "Обновляем…", "Refreshing…")
          : t("רענון הפניות", "Обновить заявки", "Refresh enquiries")}
      </button>
      {error && <p role="alert">{error}</p>}
      <p className="small" role="status">
        {filtered.length}{" "}
        {t("פניות מוצגות", "заявок показано", "enquiries shown")}
      </p>
      <div className="inbox-list">
        {filtered.length === 0 ? (
          <p>
            {t(
              "אין פניות מהסוג הזה עדיין.",
              "Заявок такого типа пока нет.",
              "No enquiries of this type yet.",
            )}
          </p>
        ) : (
          filtered.map((lead) => {
            const seeded = lead.id.startsWith("demo-");
            return (
              <details key={lead.id}>
                <summary>
                  <span>
                    {lead.brief.name ||
                      t("פנייה ללא שם", "Без имени", "Unnamed enquiry")}
                  </span>
                  <span>{sourceName(lead.source)}</span>
                  <span className="example-note">
                    {seeded
                      ? t(
                          "דוגמה מוכנה מראש",
                          "Учебный пример",
                          "Seeded example",
                        )
                      : t(
                          "פנייה שנשמרה מטופס",
                          "Заявка из формы",
                          "Saved form enquiry",
                        )}
                  </span>
                  <time dateTime={lead.createdAt}>
                    {new Date(lead.createdAt).toLocaleString(
                      locale === "he"
                        ? "he-IL"
                        : locale === "ru"
                          ? "ru-RU"
                          : "en-GB",
                      { dateStyle: "short", timeStyle: "short" },
                    )}
                  </time>
                  <span>
                    {lead.status === "new"
                      ? t("חדש", "Новая", "New")
                      : t("נבדק", "Просмотрена", "Reviewed")}
                  </span>
                </summary>
                <pre>{buildBriefText(lead.brief)}</pre>
                <small>
                  {lead.webhook === "delivered"
                    ? t(
                        "נמסר לערוץ הפניות שהוגדר",
                        "Передана в настроенный канал",
                        "Delivered to the configured enquiry channel",
                      )
                    : lead.webhook === "failed"
                      ? t(
                          "נשמר, אך המסירה לא הצליחה",
                          "Сохранена, но передать не удалось",
                          "Saved, but delivery failed",
                        )
                      : t(
                          "הדגמה בלבד — לא נשלח לאשת טורס",
                          "Только демоверсия — в Eshet Tours не отправлено",
                          "Demo only — not sent to Eshet Tours",
                        )}
                </small>
              </details>
            );
          })
        )}
      </div>
    </section>
  );
}
