import type { Metadata } from "next";
import { locales, type Locale } from "./types";

export const siteOrigin = "https://eshet.kikkey.com";

export function pageUrl(locale: Locale, slug = "") {
  return `${siteOrigin}/${locale}${slug ? `/${slug}` : ""}`;
}

export function languageAlternates(slug = "") {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, pageUrl(locale, slug)]),
    ),
    "x-default": pageUrl("he", slug),
  };
}

export function pageMetadata(
  locale: Locale,
  title: string,
  description: string,
  slug = "",
): Metadata {
  const url = pageUrl(locale, slug);
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: url, languages: languageAlternates(slug) },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "Eshet Tours — Design concept",
      url,
      locale: { he: "he_IL", ru: "ru_RU", en: "en_US" }[locale],
      images: [
        {
          url: `${siteOrigin}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Eshet Tours — Your next chapter starts here",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteOrigin}/og-image.png`],
    },
  };
}
