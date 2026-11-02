import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages } from "@/lib/content";
import { locales, type Locale } from "@/lib/types";
import { pick } from "@/lib/locale";
import TravelTools from "@/components/tools/TravelTools";
import DealBoard from "@/components/DealBoard";
import AdminInbox from "@/components/AdminInbox";
import CookieControls from "@/components/CookieControls";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.keys(pages).map((slug) => ({ locale, slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return pageMetadata(locale, page.title[locale], page.intro[locale], slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return (
    <main id="main-content" className="content-page">
      <div className="page-heading container">
        <Link className="back-link" href={`/${locale}`}>
          {pick(locale, "אשת טורס /", "Ашет Турс /", "Eshet Tours /")}
        </Link>
        <p className="eyebrow">{page.eyebrow[locale]}</p>
        <h1>{page.title[locale]}</h1>
        <p className="page-intro">{page.intro[locale]}</p>
      </div>
      <div className="container page-body">
        {slug === "admin" ? (
          <AdminInbox locale={locale} />
        ) : slug === "cookies" ? (
          <CookieControls locale={locale} />
        ) : slug === "last-minute" ? (
          <DealBoard locale={locale} />
        ) : page.tool ? (
          <TravelTools locale={locale} kind={page.tool} />
        ) : null}
        {slug === "russian" && (
          <div className="russian-links">
            <Link href="/ru/planner" className="button button-dark">
              Спланировать поездку <span aria-hidden>↗</span>
            </Link>
            <Link href="/ru/tours" className="button button-outline">
              Подобрать организованный тур
            </Link>
            <Link href="/ru/last-minute" className="text-link">
              Посмотреть примеры предложений
            </Link>
          </div>
        )}
        <>
          {slug === "planner" && (
            <section id="ribbon" className="planner-ribbon">
              <TravelTools locale={locale} kind="ribbon" />
            </section>
          )}
        </>
        <div className="editorial-sections">
          {page.sections.map((section, index) => (
            <section className="editorial-section" key={index}>
              <span className="section-index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{section.title[locale]}</h2>
              <p>{section.body[locale]}</p>
            </section>
          ))}
        </div>
        {["about", "magazine", "collection"].includes(slug) && (
          <div className="content-end-cta">
            <h2>
              {pick(
                locale,
                "הסיפור הבא מתחיל אצלכם.",
                "Следующая история начинается с вас.",
                "Your next chapter starts here.",
              )}
            </h2>
            <Link href={`/${locale}/planner`} className="button button-dark">
              {pick(locale, "נתכנן יחד", "Спланируем вместе", "Let’s plan it")}{" "}
              <span aria-hidden>↗</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
