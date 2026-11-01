import { expect, test } from "@playwright/test";

const routes = [
  "",
  "israel",
  "tours",
  "packages",
  "flights",
  "hotels",
  "cruises",
  "last-minute",
  "planner",
  "visa",
  "club",
  "flex",
  "collection",
  "groups",
  "magazine",
  "russian",
  "about",
  "contact",
  "accessibility",
  "privacy",
  "cookies",
  "admin",
  "ribbon",
  "tour-asia",
  "tour-europe",
  "tour-south-america",
];
for (const locale of ["he", "ru", "en"]) {
  test(`every ${locale} page is reachable, marked concept, and noindex`, async ({
    request,
  }) => {
    for (const route of routes) {
      const response = await request.get(
        `/${locale}${route ? `/${route}` : ""}`,
      );
      expect(response.status(), `${locale}/${route}`).toBe(200);
      const html = await response.text();
      expect(html, `${locale}/${route}`).toContain(
        "Design concept. Not the official Eshet Tours website.",
      );
      expect(html, `${locale}/${route}`).toMatch(
        /<meta\s+name="robots"\s+content="[^"]*noindex/,
      );
      expect(html, `${locale}/${route}`).toMatch(
        new RegExp(`<html[^>]*lang="${locale}"`),
      );
      expect(html, `${locale}/${route}`).not.toMatch(
        /TODO|lorem ipsum|add content here/i,
      );
    }
  });
}
