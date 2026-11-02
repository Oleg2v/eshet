# Cloudflare deployment

The application uses **Next.js with the Cloudflare OpenNext adapter**, including server APIs and durable D1 enquiry storage. The configured public address is **https://eshet.kikkey.com**. Publication is pending: the current execution environment has no Cloudflare credential binding, and its network proxy denies the Cloudflare API. No live verification or publication is claimed.

## Fixed deployment scope

- Account: `Velikotrav2307`, ID `be9447e281c6e9198712ade2d0241029`.
- Worker: `eshet`; Custom Domain: `eshet.kikkey.com`.
- `workers_dev: false`, `preview_urls: false`, `keep_vars: true`; observability enabled.
- Existing Workers/subdomains and the other account visible to the token must not be changed.
- `scripts/cloudflare.mjs` validates this scope, rejects account overrides and requires a real D1 database ID before any upload. Use `npm run cf:deploy`; do not bypass its guard with a raw deployment command.

`src/lib/site.ts` is the shared public origin for canonical links, language alternates, Open Graph images and sitemap. All HTML is noindex/nofollow, and robots.txt disallows crawling. `_headers` protects static assets; matching Next.js headers protect generated pages and APIs.

## Secure account access

Connect `CLOUDFLARE_API_TOKEN` through the execution environment's secret settings. Never print it, paste it into chat, write it to a file, place it in command arguments or upload it as a Worker secret. Wrangler uses it only for authenticated Cloudflare API requests. The environment must permit HTTPS to `api.cloudflare.com`; live validation also needs `eshet.kikkey.com` and `eshet.velikotrav2307.workers.dev`.

Use a token scoped to the approved account with Workers Scripts Edit, Account Settings Read, and the zone permissions needed for Workers Custom Domains (Zone Read and Workers Routes Edit on `kikkey.com`). D1 Read is needed to inspect an existing database; D1 Edit is only needed for separately approved database changes. Verify its effective permissions with read-only account/API checks before deploying.

## Database prerequisite and approval boundary

`LEADS_DB` uses the dedicated database name `eshet-concept-leads`. Its real `database_id` is deliberately absent until the approved account can be inspected. Never invent an ID or reuse an unrelated client's database. The public enquiry API fails safely if persistent storage is unavailable.

Before publishing:

1. Inspect only the approved account for an existing Worker, Custom Domain and dedicated database. Stop if the target domain belongs to an unrelated Worker.
2. If a dedicated database exists, verify its schema read-only and set its real ID in `wrangler.jsonc`.
3. If database creation or schema migration is necessary, ask the owner first. The existing permission covers publishing this Worker and binding its Custom Domain; it does not cover creating other account resources. `migrations/0001_leads.sql` is the prepared additive schema. Do not run `npm run cf:migrate:remote` without that approval.
4. Adding `ADMIN_PASSWORD` or other Worker secrets also requires separate approval. Without a password the private inbox is disabled. No provider, webhook or business destination is connected by default.

## Build and deploy

After access and the approved storage prerequisite are in place:

```sh
npm ci
npm run cf:check
npm run cf:build
WRANGLER_SEND_METRICS=false npm run cf:deploy
npm run cf:verify -- --live
```

The deployment script uses the adapter's official deploy command, which invokes Wrangler with metrics disabled and strict remote-change checks. It preserves existing variables and secrets and configures only the named Custom Domain. Cloudflare creates its DNS record and certificate as part of the approved binding. It does not run database migrations or upload secrets.

The expected disabled alternate address is `https://eshet.velikotrav2307.workers.dev`; live verification must confirm HTTP 404 there. A successful local build or dry run does not demonstrate that a public route is deployed.

## Local verification

```sh
npm run cf:build
npm run cf:migrate:local
npm run cf:preview
```

In another terminal:

```sh
npm run cf:verify -- --base http://127.0.0.1:8787 --submit-test-brief
TEST_BASE_URL=http://127.0.0.1:8787 npm test
```

Local Wrangler serves port 8787. Its ignored `.wrangler` directory holds local D1 state. A private ignored `.dev.vars` may hold application-only test credentials; it must never contain the deployment token. Node development continues to use its existing filesystem demo store. The verification script checks public routes from sitemap, unknown-route 404s, robots, metadata, security headers, APIs and public HTML/JS/CSS. Browser checks cover 390px and 1440px. Lead submission tests create only clearly synthetic local records with the explicit local-only flag.

The design-concept disclosure and illustrative-data labels remain required by the original brief. Public assets contain no creator attribution or provider/model identifiers. Optional provider adapters stay server-only; public API responses do not expose their names or models.
