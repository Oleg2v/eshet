import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

for (const locale of ["he", "ru", "en"]) {
  test(`WCAG 2.2 AA automated checks: ${locale} desktop and 390px`, async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const failures: unknown[] = [];
    const audits: unknown[] = [];
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      for (const route of ["", "/planner", "/packages", "/visa", "/about"]) {
        await page.goto(`/${locale}${route}`);
        await expect(page.locator("main")).toBeVisible();
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const result = {
          locale,
          route: route || "/",
          width: viewport.width,
          violations: results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          passes: results.passes.length,
        };
        audits.push(result);
        if (result.violations.length) failures.push(result);
      }
    }
    await mkdir("reports", { recursive: true });
    await writeFile(
      `reports/axe-${locale}.json`,
      JSON.stringify(
        { generatedAt: new Date().toISOString(), audits },
        null,
        2,
      ),
    );
    expect(
      failures,
      `Accessibility violations: ${JSON.stringify(failures)}`,
    ).toEqual([]);
  });
}

test("populated planner, brief and cookie dialogs remain accessible", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const failures: unknown[] = [];
  await page.goto("/en/planner");
  await page
    .getByTestId("planner-input")
    .fill("Ten days in Japan in April, first time, we hate rushing");
  await page.getByTestId("planner-submit").click();
  await expect(page.getByTestId("planner-results")).toBeVisible();
  for (const state of ["planner-results", "agent-brief", "cookie-settings"]) {
    if (state === "agent-brief")
      await page
        .getByTestId("planner-results")
        .getByRole("button", { name: "Send to an agent", exact: true })
        .first()
        .click();
    if (state === "cookie-settings") {
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Close", exact: true })
        .click();
      await page.getByTestId("cookie-settings").click();
    }
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    if (result.violations.length)
      failures.push({
        state,
        violations: result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
  }
  await mkdir("reports", { recursive: true });
  await writeFile(
    "reports/axe-interactive.json",
    JSON.stringify(
      { generatedAt: new Date().toISOString(), failures },
      null,
      2,
    ),
  );
  expect(failures, JSON.stringify(failures)).toEqual([]);
});
