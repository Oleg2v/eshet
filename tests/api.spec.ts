import { expect, test } from "@playwright/test";
import { scenarios } from "./scenarios";

for (const locale of ["he", "ru", "en"] as const) {
  for (const scenario of scenarios) {
    test(`planner: ${locale} / ${scenario.id}`, async ({ request }) => {
      const response = await request.post("/api/planner", {
        data: { locale, prompt: scenario[locale] },
      });
      expect(response.ok(), await response.text()).toBeTruthy();
      const result = await response.json();
      expect(result.mode).toBe("demo");
      expect(result.options.length).toBeGreaterThanOrEqual(2);
      expect(result.options.length).toBeLessThanOrEqual(3);
      expect(result.followUps.length).toBeLessThanOrEqual(2);
      expect(result.disclaimer).toMatch(
        /דוגמה|המחשה|пример|демонстрац|example|illustrat/i,
      );
      for (const option of result.options) {
        expect(option.title.length).toBeGreaterThan(3);
        expect(option.description.length).toBeGreaterThan(15);
        expect(option.why.length).toBeGreaterThan(10);
        expect(option.checks.length).toBeGreaterThan(0);
        expect(option.priceMin).toBeGreaterThanOrEqual(0);
        expect(option.priceMax).toBeGreaterThanOrEqual(option.priceMin);
        expect(option.priceUnit.length).toBeGreaterThan(2);
      }
      expect(JSON.stringify(result.options)).toMatch(scenario.destination);
    });
  }
}

test("brief refuses unconsented submission and admin inbox requires authentication", async ({
  request,
}) => {
  const response = await request.post("/api/brief", {
    data: {
      locale: "en",
      source: "planner",
      travellerWords: "A quiet weekend",
      selections: { adults: 2 },
      notes: "",
      consent: false,
    },
  });
  expect(response.status()).toBeGreaterThanOrEqual(400);
  expect(response.status()).toBeLessThan(500);
  const inbox = await request.get("/api/admin/leads");
  expect([401, 403, 503]).toContain(inbox.status());
  expect(await inbox.text()).not.toContain("travellerWords");
});

test("visa responses retain official-source caution in all languages", async ({
  request,
}) => {
  for (const locale of ["he", "ru", "en"]) {
    const response = await request.post("/api/visa", {
      data: { locale, destination: "United States" },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    const result = await response.json();
    expect(result.warning).toMatch(/רשמי|официаль|official/i);
    expect(result.warning).toMatch(/משתנ|меня|измен|chang/i);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(new URL(result.sourceUrl).protocol).toBe("https:");
    expect(new URL(result.sourceUrl).hostname).toMatch(
      /(^|\.)cbp\.dhs\.gov$|(^|\.)travel\.state\.gov$/,
    );
  }
});

test("private inbox accepts the configured password and closes the session on logout", async ({
  request,
}) => {
  const { config } = await import("dotenv");
  config({ path: ".env.local", quiet: true });
  const password = process.env.ADMIN_PASSWORD;
  expect(
    Boolean(password),
    "Configure ADMIN_PASSWORD in ignored .env.local for the private-inbox acceptance check.",
  ).toBeTruthy();
  const login = await request.post("/api/admin/login", { data: { password } });
  expect(login.ok(), await login.text()).toBeTruthy();
  const cookies = login.headers()["set-cookie"] || "";
  expect(cookies).toMatch(/HttpOnly/i);
  expect(cookies).toMatch(/SameSite=(?:Strict|Lax)/i);
  const inbox = await request.get("/api/admin/leads");
  expect(inbox.ok(), await inbox.text()).toBeTruthy();
  const result = await inbox.json();
  expect(Array.isArray(result.leads)).toBeTruthy();
  expect(result.stats).toBeTruthy();
  const logout = await request.post("/api/admin/logout");
  expect(logout.ok()).toBeTruthy();
  const closed = await request.get("/api/admin/leads");
  expect([401, 403]).toContain(closed.status());
});
