import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { languageAlternates, pageUrl } from "@/lib/site";
import { locales } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = ["", ...Object.keys(pages).filter((slug) => slug !== "admin")];
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: pageUrl(locale, slug),
      alternates: { languages: languageAlternates(slug) },
    })),
  );
}
