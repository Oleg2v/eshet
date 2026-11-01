"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Phone, Compass } from "lucide-react";
import type { Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
import BriefDialog from "./BriefDialog";
import CookieControls from "./CookieControls";
const navigation = [
  ["israel", "בארץ", "В Израиле", "In Israel"],
  ["tours", "טיולים מאורגנים", "Туры с гидом", "Guided tours"],
  ["packages", "בעולם", "За границей", "Around the world"],
  ["cruises", "קרוזים", "Круизы", "Cruises"],
  ["last-minute", "ברגע האחרון", "Скоро в путь", "Last minute"],
];
const footerLinks = [
  ["planner", "מתכננים חופשה", "Планировщик", "Trip planner"],
  ["flights", "טיסות", "Авиабилеты", "Flights"],
  ["hotels", "מלונות בחו״ל", "Отели за границей", "Hotels abroad"],
  ["visa", "אשרות וכניסה", "Визы и въезд", "Visa & entry"],
  ["flex", "FLEX וביטולים", "FLEX и отмена", "FLEX & cancellation"],
  ["club", "אשת קלאב", "Клуб Eshet", "Eshet Club"],
  ["collection", "Eshet Collection", "Eshet Collection", "Eshet Collection"],
  ["groups", "קבוצות וארגונים", "Группы и компании", "Groups & corporate"],
  ["magazine", "המגזין", "Журнал", "The magazine"],
  ["russian", "На русском", "На русском", "In Russian"],
  ["about", "הסיפור שלנו", "О компании", "Our story"],
  ["contact", "מדברים איתנו", "Связаться с нами", "Contact"],
  ["accessibility", "נגישות", "Доступность", "Accessibility"],
  ["privacy", "פרטיות", "Конфиденциальность", "Privacy"],
  ["admin", "תיבת הפניות — הדגמה", "Заявки — демо", "Enquiries — demo"],
];
export default function Shell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [transitionPath, setTransitionPath] = useState<string | null>(null);
  const previousPath = useRef(pathname);
  const menuRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => setTransitionPath(pathname));
    const timer = window.setTimeout(() => setTransitionPath(null), 700);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);
  useEffect(() => {
    if (menu) menuRef.current?.showModal();
    else menuRef.current?.close();
  }, [menu]);
  useEffect(() => {
    const handler = () => setCookies(true);
    window.addEventListener("eshet:cookies", handler);
    return () => window.removeEventListener("eshet:cookies", handler);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {pick(locale, "דילוג לתוכן", "К содержимому", "Skip to content")}
      </a>
      <header className="site-header">
        <div className="header-inner container">
          <Link className="brand" href={`/${locale}`}>
            <span className="brand-symbol" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <span className="brand-word">
              אשת<span>טורס</span>
            </span>
            <span className="brand-since">
              SINCE
              <br />
              1987
            </span>
            <span className="sr-only">
              {pick(locale, "דף הבית", "главная", "home")}
            </span>
          </Link>
          <nav
            className="desktop-nav"
            aria-label={pick(
              locale,
              "ניווט ראשי",
              "Главное меню",
              "Main navigation",
            )}
          >
            {navigation.map(([slug, he, ru, en]) => (
              <Link
                key={slug}
                href={`/${locale}/${slug}`}
                aria-current={
                  pathname === `/${locale}/${slug}` ? "page" : undefined
                }
              >
                {pick(locale, he, ru, en)}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <div
              className="language-switch"
              aria-label={pick(
                locale,
                "שפת האתר",
                "Язык сайта",
                "Website language",
              )}
            >
              {(["he", "ru", "en"] as Locale[]).map((lang) => (
                <Link
                  key={lang}
                  href={`/${lang}${pathname.replace(/^\/(he|ru|en)/, "")}`}
                  lang={lang}
                  hrefLang={lang}
                  data-testid={`language-${lang}`}
                  aria-current={lang === locale ? "true" : undefined}
                  aria-label={`${lang.toUpperCase()} — ${{ he: "עברית", ru: "Русский", en: "English" }[lang]}`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
            <Link className="header-planner" href={`/${locale}/planner`}>
              <Compass size={17} />
              <span>
                {pick(locale, "החופשה שלי", "Моя поездка", "My trip")}
              </span>
            </Link>
            <button
              type="button"
              className="icon-button menu-toggle"
              aria-label={pick(
                locale,
                "פתיחת תפריט",
                "Открыть меню",
                "Open menu",
              )}
              onClick={() => setMenu(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      {transitionPath && (
        <div className="horizon-wipe" key={transitionPath} aria-hidden />
      )}
      {children}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="eyebrow">ESHET TOURS · SINCE 1987</p>
              <h2>
                {pick(
                  locale,
                  "יש לאן לצאת.\nיש עם מי.",
                  "Есть куда поехать.\nЕсть с кем.",
                  "Somewhere to go.\nSomeone to count on.",
                )}
              </h2>
            </div>
            <div className="footer-contact">
              <p>
                {pick(
                  locale,
                  "לפעמים שיחה עושה את כל ההבדל.",
                  "Иногда всё решает один разговор.",
                  "Sometimes, a conversation makes the difference.",
                )}
              </p>
              <a href="tel:037771032">
                <span>
                  {pick(
                    locale,
                    "חופשות בארץ",
                    "Отдых в Израиле",
                    "Holidays in Israel",
                  )}
                </span>
                <b dir="ltr">03-7771032</b>
                <Phone size={15} />
              </a>
              <a href="tel:037771039">
                <span>
                  {pick(
                    locale,
                    "חופשות בחו״ל",
                    "Поездки за границу",
                    "Holidays abroad",
                  )}
                </span>
                <b dir="ltr">03-7771039</b>
                <Phone size={15} />
              </a>
            </div>
          </div>
          <nav
            className="footer-links"
            aria-label={pick(locale, "כל העמודים", "Все разделы", "All pages")}
          >
            {footerLinks.map(([slug, he, ru, en]) => (
              <Link key={slug} href={`/${locale}/${slug}`}>
                {pick(locale, he, ru, en)}
              </Link>
            ))}
            <button
              data-testid="cookie-settings"
              onClick={() => setCookies(true)}
            >
              {pick(
                locale,
                "העדפות עוגיות",
                "Настройки cookies",
                "Cookie settings",
              )}
            </button>
          </nav>
          <div className="footer-bottom">
            <p lang="en" dir="ltr">
              Design concept. Not the official Eshet Tours website.
            </p>
            <span>
              {pick(
                locale,
                "כל המחירים והמסלולים להמחשה בלבד.",
                "Все цены и маршруты приведены для примера.",
                "All prices and itineraries are illustrative.",
              )}
            </span>
            <a
              href="#main-content"
              aria-label={pick(locale, "חזרה למעלה", "Наверх", "Back to top")}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </footer>
      <dialog
        ref={menuRef}
        className="menu-dialog"
        onCancel={() => setMenu(false)}
      >
        <button
          className="icon-button"
          onClick={() => setMenu(false)}
          aria-label={pick(locale, "סגירה", "Закрыть", "Close")}
        >
          <X />
        </button>
        <nav
          aria-label={pick(
            locale,
            "תפריט מלא",
            "Все разделы",
            "Full navigation",
          )}
        >
          {navigation
            .concat(footerLinks.slice(0, 11))
            .map(([slug, he, ru, en]) => (
              <Link
                key={slug}
                href={`/${locale}/${slug}`}
                onClick={() => setMenu(false)}
              >
                {pick(locale, he, ru, en)}
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </nav>
      </dialog>
      <BriefDialog locale={locale} />
      {cookies && (
        <div className="cookie-modal-overlay">
          <section
            className="cookie-panel"
            role="dialog"
            aria-modal="true"
            aria-label={pick(
              locale,
              "העדפות עוגיות",
              "Настройки cookies",
              "Cookie settings",
            )}
          >
            <CookieControls locale={locale} onClose={() => setCookies(false)} />
          </section>
        </div>
      )}
    </>
  );
}
