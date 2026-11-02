import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "./fonts.css";
import "./globals.css";
import "@/components/globe.css";
import "@/components/tools.css";
import Shell from "@/components/Shell";
import { locales, type Locale } from "@/lib/types";
import { siteOrigin } from "@/lib/site";
export const dynamicParams = false;
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "אשת טורס — איזו חופשה בא לכם?",
    template: "%s · Eshet Tours — Design concept",
  },
  description:
    "A considered way to find your next holiday. Eshet Tours design concept. Illustrative travel information.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F2EA",
};
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <head>
        {locale !== "ru" &&
          (locale === "he"
            ? [
                "heebo-hebrew-400-normal.woff2",
                "frank-ruhl-libre-hebrew-400-normal.woff2",
              ]
            : [
                "heebo-latin-400-normal.woff2",
                "fraunces-latin-400-normal.woff2",
              ]
          ).map((font) => (
            <link
              key={font}
              rel="preload"
              href={`/fonts/${font}`}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          ))}
      </head>
      <body>
        <Shell locale={locale as Locale}>{children}</Shell>
      </body>
    </html>
  );
}
