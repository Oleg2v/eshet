import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 12_000 },
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "json",
      {
        outputFile:
          process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || "reports/playwright.json",
      },
    ],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3000",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
