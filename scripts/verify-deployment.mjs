import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, request } from "@playwright/test";

// No deployment credentials are read. Local preflight never claims a live deploy.
const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const index = args.indexOf(flag);
  if (index < 0) return fallback;
  assert(
    args[index + 1] && !args[index + 1].startsWith("--"),
    `${flag} needs a value`,
  );
  return args[index + 1];
};
if (args.includes("--help")) {
  console.log(`Usage: node scripts/verify-deployment.mjs [options]
  --base URL             Origin to test (default http://127.0.0.1:8787)
  --site URL             Expected public metadata origin (default https://eshet.kikkey.com)
  --live                 Test the public site and require the workers.dev URL to return 404
  --report FILE          JSON report (default reports/deployment-local.json or deployment-live.json)
  --submit-test-brief     Save one explicitly synthetic brief; allowed only on localhost

The default checks the planner form and APIs without saving a lead. Live checks
do not log in to the inbox, alter Cloudflare settings, or create a customer enquiry.`);
  process.exit(0);
}
const live = args.includes("--live");
const site = new URL(value("--site", "https://eshet.kikkey.com")).origin;
const base = new URL(value("--base", live ? site : "http://127.0.0.1:8787"))
  .origin;
const local = ["localhost", "127.0.0.1", "[::1]"].includes(
  new URL(base).hostname,
);
assert(
  !live || base === site,
  "Live checks must test the configured public site origin",
);
assert(
  live || local,
  "Use --live for public checks; local preflight requires localhost",
);
const submitBrief = args.includes("--submit-test-brief");
assert(
  !submitBrief || local,
  "Synthetic lead writes are limited to local preflight",
);
const reportPath = value(
  "--report",
  `reports/deployment-${live ? "live" : "local"}.json`,
);
const forbidden =
  /velikotrav2307|workers\.dev|claude|anthropic|openai|chatgpt/i;
const securityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "x-frame-options": "SAMEORIGIN",
};
const report = {
  checkedAt: new Date().toISOString(),
  mode: live ? "live" : "local-preflight",
  base,
  expectedPublicOrigin: site,
  passed: false,
  pages: [],
  assets: [],
  browser: [],
  api: [],
  leadSubmission: { status: "not-run", reason: "No lead is saved by default." },
  workersDev: { status: "not-run", reason: "Requires --live." },
  failures: [],
};
const cleanText = (text, label) =>
  assert(
    !forbidden.test(text),
    `${label}: forbidden public attribution or hosting identifier`,
  );
const noProviderFields = (data, label) => {
  if (!data || typeof data !== "object") return;
  for (const [key, val] of Object.entries(data)) {
    assert(
      !/^(provider|model)(?:_?(?:id|name))?$/i.test(key),
      `${label}: exposed ${key} field`,
    );
    noProviderFields(val, label);
  }
};
const checkHeaders = (headers, label) => {
  for (const [key, expected] of Object.entries(securityHeaders)) {
    assert.equal(
      headers[key]?.replace(/\s+/g, ""),
      expected.replace(/\s+/g, ""),
      `${label}: ${key}`,
    );
  }
};
const decode = (text) =>
  text
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      (match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])],
    ),
  );
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) =>
    attributes(match[0]),
  );
const routeOf = (url) => {
  const parsed = new URL(url, site);
  assert.equal(
    parsed.origin,
    site,
    `Unexpected public origin: ${parsed.origin}`,
  );
  return `${parsed.pathname}${parsed.search}`;
};
const assetPaths = new Set();
const imagePaths = new Set();
const proxyServer =
  !local && (process.env.HTTPS_PROXY || process.env.HTTP_PROXY);
const proxy = proxyServer ? { server: proxyServer } : undefined;
const client = await request.newContext({
  baseURL: base,
  timeout: 30_000,
  proxy,
});
let browser;
const get = async (route, status = 200) => {
  const response = await client.get(route, { maxRedirects: 0 });
  assert.equal(response.status(), status, `${route}: HTTP status`);
  checkHeaders(response.headers(), route);
  return response;
};
const post = async (route, data, expected = 200) => {
  const response = await client.post(route, {
    data,
    headers: { Origin: base },
    maxRedirects: 0,
  });
  assert.equal(response.status(), expected, `${route}: HTTP status`);
  checkHeaders(response.headers(), route);
  const text = await response.text();
  cleanText(text, route);
  const body = JSON.parse(text);
  noProviderFields(body, route);
  report.api.push({ route, locale: data.locale, status: response.status() });
  return body;
};

try {
  const sitemap = await get("/sitemap.xml");
  const xml = await sitemap.text();
  cleanText(xml, "sitemap.xml");
  assert(/<urlset\b/i.test(xml), "Expected a nonempty URL sitemap");
  const urls = [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
        decode(match[1]),
      ),
    ),
  ];
  assert(urls.length > 0, "Sitemap has no pages");
  assert(urls.length <= 500, "Refusing an unexpectedly large sitemap");
  for (const alternate of tags(xml, "xhtml:link")) {
    if (alternate.href) routeOf(alternate.href);
  }
  const routes = urls.map(routeOf);
  const robots = await get("/robots.txt");
  assert.match(
    await robots.text(),
    /^Disallow:\s*\/\s*$/m,
    "robots.txt must disallow all crawling",
  );
  report.robots = { status: 200, disallowAll: true };

  for (const route of routes) {
    const response = await get(route);
    const html = await response.text();
    cleanText(html, route);
    const meta = tags(html, "meta");
    const links = tags(html, "link");
    const robotMeta = meta
      .filter((tag) => tag.name?.toLowerCase() === "robots")
      .map((tag) => tag.content ?? "")
      .join(",");
    assert(
      /\bnoindex\b/i.test(robotMeta) && /\bnofollow\b/i.test(robotMeta),
      `${route}: noindex,nofollow metadata`,
    );
    const canonical = links.filter((tag) => tag.rel === "canonical");
    assert.equal(canonical.length, 1, `${route}: one canonical is required`);
    assert.equal(
      canonical[0].href,
      new URL(route, site).href,
      `${route}: canonical address`,
    );
    const alternates = links.filter(
      (tag) => tag.rel === "alternate" && tag.hreflang,
    );
    assert(
      alternates.length >= 3,
      `${route}: three locale alternates are required`,
    );
    for (const alternate of alternates) routeOf(alternate.href);
    const images = meta.filter((tag) => tag.property === "og:image");
    assert(images.length > 0, `${route}: og:image is required`);
    for (const image of images) imagePaths.add(routeOf(image.content));
    for (const tag of [...tags(html, "script"), ...links]) {
      const target =
        tag.src || (tag.rel === "stylesheet" ? tag.href : undefined);
      if (!target) continue;
      const url = new URL(target, base);
      assert(
        [base, site].includes(url.origin),
        `${route}: unexpected external script or stylesheet`,
      );
      assetPaths.add(`${url.pathname}${url.search}`);
    }
    report.pages.push({
      route,
      status: 200,
      metadata: "passed",
      headers: "passed",
    });
  }
  for (const route of [
    "/deployment-verification-missing-page",
    "/he/deployment-verification-missing-page",
    "/ru/deployment-verification-missing-page",
    "/en/deployment-verification-missing-page",
  ]) {
    const response = await get(route, 404);
    const html = await response.text();
    cleanText(html, route);
    const robotsMeta = tags(html, "meta")
      .filter((tag) => tag.name?.toLowerCase() === "robots")
      .map((tag) => tag.content ?? "")
      .join(",");
    assert(
      /\bnoindex\b/i.test(robotsMeta) && /\bnofollow\b/i.test(robotsMeta),
      `${route}: error pages must be noindex,nofollow`,
    );
  }
  report.notFound = { status: "passed", paths: 4 };
  for (const image of imagePaths) {
    const response = await get(image);
    assert.match(
      response.headers()["content-type"] ?? "",
      /^image\//,
      `${image}: image MIME type`,
    );
  }
  console.log(`HTTP and metadata: ${routes.length} sitemap pages passed.`);

  const prompts = {
    he: "עשרה ימים ביפן באפריל, פעם ראשונה, לא אוהבים לרוץ",
    ru: "Десять дней в Японии в апреле, первый раз, без спешки",
    en: "Ten days in Japan in April, first time, we hate rushing",
  };
  for (const [locale, prompt] of Object.entries(prompts)) {
    const plan = await post("/api/planner", { locale, prompt });
    assert(
      Array.isArray(plan.options) && plan.options.length >= 2,
      `${locale}: planner must return options`,
    );
    assert(
      plan.options.every(
        (option) => option.title && option.description && option.why,
      ),
      `${locale}: complete planner options`,
    );
    assert.match(
      JSON.stringify(plan.options),
      /Japan|יפן|Япони/i,
      `${locale}: relevant destination`,
    );
    assert.match(
      plan.disclaimer ?? "",
      /דוגמה|המחשה|пример|демонстрац|example|illustrat/i,
      `${locale}: sample disclaimer`,
    );
    const visa = await post("/api/visa", {
      locale,
      destination: "United States",
    });
    assert(
      visa.steps?.length > 0 && visa.sourceUrl?.startsWith("https://"),
      `${locale}: visa guidance and official source`,
    );
  }
  await post("/api/planner", { locale: "en", prompt: "" }, 422);
  await post(
    "/api/brief",
    {
      locale: "en",
      source: "deployment-check",
      travellerWords: "Synthetic verification; no enquiry intended",
      selections: {},
      notes: "",
      consent: false,
    },
    422,
  );
  const inbox = await client.get("/api/admin/leads", { maxRedirects: 0 });
  assert(
    [401, 403, 503].includes(inbox.status()),
    "Private inbox must refuse an unauthenticated request",
  );
  cleanText(await inbox.text(), "private inbox error");
  checkHeaders(inbox.headers(), "private inbox error");
  report.api.push({
    route: "/api/admin/leads",
    status: inbox.status(),
    unauthenticated: true,
  });
  if (submitBrief) {
    const result = await post(
      "/api/brief",
      {
        locale: "en",
        source: "deployment-check",
        name: "Synthetic local verification",
        travellerWords:
          "Synthetic local deployment check. No travel enquiry intended.",
        selections: { test: true },
        notes: "Acceptance check created on localhost only.",
        consent: true,
      },
      201,
    );
    assert(
      result.id && result.preview && result.whatsappUrl,
      "Saved brief must return a receipt and exact preview",
    );
    assert.equal(
      result.delivery,
      "demo",
      "Local acceptance must not send a business enquiry",
    );
    report.leadSubmission = {
      status: "passed",
      id: result.id,
      delivery: result.delivery,
      synthetic: true,
    };
  }

  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
      proxy,
    });
    const page = await context.newPage();
    const errors = [];
    let currentRoute = "";
    page.on("pageerror", (error) =>
      errors.push({
        route: currentRoute,
        type: "pageerror",
        message: error.message,
      }),
    );
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push({
          route: currentRoute,
          type: "console",
          message: message.text(),
        });
    });
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (
        url.origin === base &&
        ["script", "stylesheet"].includes(response.request().resourceType())
      )
        assetPaths.add(`${url.pathname}${url.search}`);
    });
    for (const route of routes) {
      currentRoute = route;
      const response = await page.goto(new URL(route, base).href, {
        waitUntil: "load",
      });
      assert.equal(response?.status(), 200, `${width}px ${route}: navigation`);
      await page.locator("main").waitFor({ state: "visible" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        body: document.body.scrollWidth,
        root: document.documentElement.scrollWidth,
      }));
      assert(
        dimensions.body <= width + 1 && dimensions.root <= width + 1,
        `${width}px ${route}: horizontal overflow ${JSON.stringify(dimensions)}`,
      );
      cleanText(
        await page.locator("body").innerText(),
        `${width}px ${route}: visible text`,
      );
      report.browser.push({ route, width, status: "passed", overflow: false });
    }
    // Exercise a real planner form and its handoff preview without sending a lead.
    currentRoute = "/en/planner";
    await page.goto(new URL(currentRoute, base).href);
    await page.getByTestId("planner-input").fill(prompts.en);
    await page.getByTestId("planner-submit").click();
    const results = page.getByTestId("planner-results");
    await results.waitFor({ state: "visible" });
    assert(
      (await results.locator("article").count()) >= 2,
      "Planner form must render trip options",
    );
    await results
      .getByRole("button", { name: "Send to an agent", exact: true })
      .first()
      .click();
    await page.getByTestId("brief-preview").waitFor({ state: "visible" });
    assert(
      await page.getByTestId("brief-submit").isDisabled(),
      "Handoff requires consent",
    );
    await page.getByTestId("handoff-consent").check();
    assert(
      await page.getByTestId("brief-submit").isEnabled(),
      "Handoff enables submission after consent",
    );
    cleanText(
      await page.locator("body").innerText(),
      `${width}px planner form`,
    );
    assert.equal(
      errors.length,
      0,
      `${width}px browser errors: ${JSON.stringify(errors)}`,
    );
    await context.close();
    console.log(
      `Browser ${width}px: ${routes.length} pages and planner form passed, no console errors or horizontal overflow.`,
    );
  }
  for (const asset of assetPaths) {
    const response = await get(asset);
    cleanText(await response.text(), asset);
    report.assets.push({ path: asset, status: 200, sourceScan: "passed" });
  }
  if (live) {
    const response = await client.get(
      "https://eshet.velikotrav2307.workers.dev/",
      { maxRedirects: 0 },
    );
    assert.equal(response.status(), 404, "workers.dev must be disabled");
    report.workersDev = { status: "passed", httpStatus: 404 };
  }
  report.passed = true;
} catch (error) {
  report.failures.push(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await client.dispose();
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify({
      mode: report.mode,
      passed: report.passed,
      pages: report.pages.length,
      browserChecks: report.browser.length,
      assets: report.assets.length,
      apiChecks: report.api.length,
      report: reportPath,
      failures: report.failures,
    }),
  );
}
