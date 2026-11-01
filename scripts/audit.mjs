import lighthouse from "lighthouse";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const auditPaths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/he/about", "/ru/about", "/en/about"];
const profile = await mkdtemp(path.join(tmpdir(), "eshet-lighthouse-"));
await mkdir("reports", { recursive: true });
const chrome = spawn(
  process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
let port;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = Number(
        (
          await readFile(path.join(profile, "DevToolsActivePort"), "utf8")
        ).split("\n")[0],
      );
      break;
    } catch {
      await pause(100);
    }
  }
  if (!port)
    throw new Error("System Chromium did not expose its local debugging port.");
  const results = [];
  let failed = false;
  for (const route of auditPaths) {
    const url = new URL(route, base).href;
    const run = await lighthouse(url, {
      port,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      locale: "en-US",
    });
    if (!run?.lhr) throw new Error(`No Lighthouse result for ${route}`);
    const { lhr } = run;
    if (lhr.runtimeError)
      throw new Error(`${route}: ${lhr.runtimeError.message}`);
    const stem = route.replace(/^\//, "").replaceAll("/", "-");
    await writeFile(`reports/lighthouse-${stem}.json`, run.report[0]);
    await writeFile(`reports/lighthouse-${stem}.html`, run.report[1]);
    const score = {
      route,
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      lcp: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
      cls: lhr.audits["cumulative-layout-shift"].numericValue,
    };
    score.passed =
      score.performance >= 95 &&
      score.accessibility >= 95 &&
      score.bestPractices >= 95 &&
      score.lcp < 2000 &&
      score.cls === 0;
    failed ||= !score.passed;
    results.push(score);
    console.log(JSON.stringify(score));
  }
  await writeFile(
    "reports/lighthouse-summary.json",
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        profile: "Lighthouse mobile simulated throttling",
        thresholds: {
          performance: 95,
          accessibility: 95,
          bestPractices: 95,
          lcpMs: 2000,
          cls: 0,
        },
        note: "SEO is reported, not gated, because this concept intentionally has noindex.",
        results,
      },
      null,
      2,
    ),
  );
  if (failed) process.exitCode = 1;
} finally {
  chrome.kill("SIGTERM");
  await new Promise((resolve) => {
    chrome.once("exit", resolve);
    setTimeout(resolve, 1000);
  });
  await rm(profile, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });
}
