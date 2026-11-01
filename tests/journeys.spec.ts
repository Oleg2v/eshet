import { expect, test, type Page } from "@playwright/test";
import { scenarios } from "./scenarios";

async function noOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: window.innerWidth,
    body: document.body.scrollWidth,
    root: document.documentElement.scrollWidth,
  }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.width + 1);
  expect(dimensions.root).toBeLessThanOrEqual(dimensions.width + 1);
}

test("four dials are keyboard operable and the reduced-motion globe has a flat fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/he");
  for (const name of ["temperature", "energy", "landscape", "comfort"]) {
    const dial = page.getByTestId(`dial-${name}`);
    await dial.focus();
    await dial.press("Home");
    await expect(dial).toHaveValue("0");
    await dial.press("End");
    await expect(dial).toHaveValue("100");
  }
  await expect(page.getByTestId("globe")).toHaveAttribute("data-mode", "flat");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /width=device-width/,
  );
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /initial-scale=1(?:,|$)/,
  );
});

for (const locale of ["he", "ru", "en"] as const) {
  test(`planner renders designed options and saves the ribbon: ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/planner`);
    await page.getByTestId("planner-input").fill(scenarios[1][locale]);
    await page.getByTestId("planner-submit").click();
    const results = page.getByTestId("planner-results");
    await expect(results).toBeVisible();
    await expect(results.locator("article")).toHaveCount(2);
    await expect(results).toContainText(scenarios[1].destination);
    const save = {
      he: "למסלול שלי",
      ru: "В мой маршрут",
      en: "Save to my ribbon",
    }[locale];
    await results
      .getByRole("button", { name: save, exact: true })
      .first()
      .click();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("eshet-ribbon") || "[]"),
    );
    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0].destination).toMatch(scenarios[1].destination);
    const refine = { he: "נדייק קצת", ru: "Уточнить пожелания", en: "Refine" }[
      locale
    ];
    await results.getByRole("button", { name: refine, exact: true }).click();
    await expect(results.locator(".tool-refine input")).toHaveCount(2);
  });
}

test("package arithmetic includes every traveller and room and keeps USD fee separate", async ({
  page,
}) => {
  await page.goto("/en/packages");
  await page.getByTestId("composer-adults").fill("3");
  await page.getByTestId("composer-children").fill("1");
  await page.getByTestId("composer-nights").fill("5");
  await page.getByTestId("composer-flight").fill("1000");
  await page.getByTestId("composer-hotel").fill("600");
  await page.getByTestId("composer-extras").fill("300");
  // Four passengers, two rooms, five nights: 4*1000 + 2*5*600 + 300.
  await expect(page.getByTestId("composer-total")).toHaveAttribute(
    "data-value",
    "10300",
  );
  await expect(page.locator(".tool-fee-note")).toContainText("$100");
  await expect(page.locator(".tool-fee-note")).toContainText("USD, separate");
  await expect(page.locator(".tool-receipt")).toContainText(
    "Illustrative total",
  );
});

test("visa assistant keeps the official-source warning and gives an official link", async ({
  page,
}) => {
  await page.goto("/en/visa");
  const destination = page.getByTestId("visa-destination");
  if ((await destination.evaluate((el) => el.tagName)) === "SELECT") {
    const values = await destination
      .locator("option")
      .evaluateAll((items) =>
        items.map((el) => ({
          value: (el as HTMLOptionElement).value,
          text: el.textContent || "",
        })),
      );
    const usa = values.find((value) =>
      /United States|USA|US$|ארצות הברית/i.test(value.value + " " + value.text),
    );
    expect(usa).toBeTruthy();
    await destination.selectOption(usa!.value);
  } else await destination.fill("United States");
  await page.getByTestId("visa-submit").click();
  await expect(page.getByTestId("visa-result")).toBeVisible();
  await expect(page.getByTestId("visa-warning")).toContainText(/official/i);
  await expect(page.getByTestId("visa-warning")).toContainText(/chang/i);
  const link = page.getByTestId("visa-result").getByRole("link").first();
  expect(await link.getAttribute("href")).toMatch(
    /^https:\/\/(?:[\w.-]+\.)?(?:cbp\.dhs\.gov|travel\.state\.gov)\//,
  );
});

test("agent receives precisely the brief the visitor approved", async ({
  page,
}) => {
  await page.goto("/en/planner");
  const prompt = scenarios[0].en;
  await page.getByTestId("planner-input").fill(prompt);
  await page.getByTestId("planner-submit").click();
  await page
    .getByTestId("planner-results")
    .getByRole("button", { name: "Send to an agent", exact: true })
    .first()
    .click();
  await expect(page.getByTestId("brief-preview")).toBeVisible();
  await expect(page.getByTestId("brief-preview")).toContainText(prompt);
  await page.getByTestId("handoff-name").fill("Concept test traveller");
  await page.getByTestId("handoff-contact").fill("concept-test@example.com");
  await expect(page.getByTestId("brief-submit")).toBeDisabled();
  await page.getByTestId("handoff-consent").check();
  const preview = await page.getByTestId("brief-preview").textContent();
  const submitted = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/brief") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("brief-submit").click();
  const response = await submitted;
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = await response.json();
  expect(body.preview).toBe(preview);
  expect(body.delivery).toBe("demo");
  const whatsapp=new URL(body.whatsappUrl);
  expect(whatsapp.hostname).toBe('wa.me');
  expect(whatsapp.searchParams.get('text')).toBe(preview);
});

test("language switching preserves the current journey", async ({ page }) => {
  await page.goto("/he/packages");
  await page.getByTestId("language-ru").click();
  await expect(page).toHaveURL(/\/ru\/packages(?:[?#]|$)/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.getByTestId("language-en").click();
  await expect(page).toHaveURL(/\/en\/packages(?:[?#]|$)/);
});

test("cookie settings preserve an explicit preference", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("cookie-settings").click();
  await page.getByTestId("cookie-analytics").check();
  await page.getByTestId("cookie-save").click();
  await page.reload();
  await page.getByTestId("cookie-settings").click();
  await expect(page.getByTestId("cookie-analytics")).toBeChecked();
  await page.getByTestId("cookie-analytics").uncheck();
  await page.getByTestId("cookie-save").click();
  await page.reload();
  await page.getByTestId("cookie-settings").click();
  await expect(page.getByTestId("cookie-analytics")).not.toBeChecked();
});

for (const locale of ["he", "ru", "en"]) {
  test(`390px mobile journeys stay within the viewport: ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of [
      "",
      "/planner",
      "/packages",
      "/visa",
      "/tours",
      "/club",
      "/ribbon",
    ]) {
      await page.goto(`/${locale}${route}`);
      await expect(page.locator("main")).toBeVisible();
      await noOverflow(page);
    }
    await page.goto(`/${locale}`);
    await page.screenshot({
      path: `reports/mobile-${locale}.png`,
      fullPage: true,
    });
  });
}

test("ribbon adds stops, swaps the stay and reorders days with the keyboard", async ({
  page,
}) => {
  await page.goto("/en/ribbon");
  const stop = page.getByLabel("Add a stop", { exact: true });
  await stop.fill("Dead Sea");
  await page.getByRole("button", { name: "Add a day", exact: true }).click();
  await stop.fill("Jerusalem");
  await page.getByRole("button", { name: "Add a day", exact: true }).click();
  const days = page.getByTestId("ribbon-days").locator("article");
  await expect(days).toHaveCount(2);
  await days
    .first()
    .getByRole("combobox", { name: "Illustrative stay", exact: true })
    .selectOption("boutique");
  await page
    .getByRole("button", { name: "Move day 2 earlier", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(days.first()).toContainText("Jerusalem");
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("eshet-ribbon") || "[]"),
  );
  expect(stored.map((day: { destination: string }) => day.destination)).toEqual(
    ["Jerusalem", "Dead Sea"],
  );
  expect(stored[1].hotel).toBe("boutique");
  expect(
    stored.reduce((sum: number, day: { price: number }) => sum + day.price, 0),
  ).toBe(1090);
});
