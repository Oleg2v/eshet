# Eshet Tours — a travel planning concept

A Hebrew-first travel concept for **אשת טורס / Eshet Tours**, with complete Russian and English journeys. Built with Next.js App Router, TypeScript, Three.js, GSAP and Lenis. Content pages are generated statically; planner, enquiry and inbox routes run on the server.

**Design concept. Not the official Eshet Tours website.** Prices, availability-like displays, itineraries, weather, distances and member benefits are explicitly illustrative. This project takes no payment and does not create bookings. All pages are `noindex`.

## Run locally

Use Node.js 22 or later. From the repository directory:

```sh
npm ci && npm run dev
```

The app starts on port 3000. `/` redirects to `/he`; use `/ru` or `/en` for the other languages. After dependencies are installed, the single startup command is `npm run dev`.

No API key is required: the planner uses scripted demo flows and every public tool works in demonstration mode. The tested dependency versions are captured in `package-lock.json`.

## Deploy to Cloudflare

Configured address: **https://eshet.kikkey.com**. Publication is pending; this address has not yet been verified live. The target is Worker `eshet` in the owner's account `be9447e281c6e9198712ade2d0241029`. Public `workers.dev` and version preview URLs are disabled. Other Workers and domains are outside this deployment's scope.

The Next.js application runs on Cloudflare Workers through OpenNext, with D1 for durable enquiries. `npm run cf:check` checks the deployment target. Build with `npm run cf:build`, then deploy with `npm run cf:deploy` after secure account access and the approved database are available. The deploy script pins the account/domain and refuses automatic database provisioning. Creating the database, applying its remote migration or adding Worker secrets requires separate owner approval.

Run `npm run cf:verify -- --live` after publication to check sitemap pages, metadata, headers, APIs, public assets and browser layouts. Local verification uses `npm run cf:migrate:local`, `npm run cf:preview`, then `npm run cf:verify -- --base http://127.0.0.1:8787`. Full steps, required permissions and the current blockers are in [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOleg2v%2Feshet)

The button imports this repository’s `main` branch. Use the repository root, the detected **Next.js** framework, `npm ci` for installation and `npm run build` for the build. The default Next.js output setting supports both generated content and server routes. Configure any optional server environment variables in the Vercel project settings and redeploy after changing them.

For a self-hosted Node deployment:

```sh
npm ci && npm run build && npm start
```

A pure static export would remove the AI, webhook and protected inbox routes, so this project intentionally uses a Next.js server deployment rather than `output: 'export'`. The one-click deployment above provides that runtime. Publication is not performed automatically by this repository or by the demo forms.

## Optional server settings

Copy `.env.example` to a private `.env.local` only when you need integrations. Never commit filled credentials.

| Variable                               | Purpose                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`, `OPENAI_MODEL`       | Server-only OpenAI integration. Without a key, the planner uses scripted demo results.                                                    |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Alternative server-only model provider. OpenAI is preferred if both providers are configured.                                             |
| `ADMIN_PASSWORD`                       | A private password of at least 12 characters to enable `/he/admin` (also `/ru/admin`, `/en/admin`). There is no shipped default password. |
| `ADMIN_SESSION_SECRET`                 | Optional separate session-signing secret. Otherwise signing derives from the admin password.                                              |
| `LEAD_WEBHOOK_URL`                     | An authorised HTTPS receiver for visitor-approved briefs. Omit it to retain explicit demo handling.                                       |
| `LEAD_WEBHOOK_TOKEN`                   | Optional bearer authentication for the webhook receiver.                                                                                  |
| `WHATSAPP_NUMBER`                      | A verified business number, in international digits. No WhatsApp destination is invented when this is absent.                             |
| `LEAD_STORE_DIR`                       | Optional local demonstration storage path. Default local storage is `.data`; Vercel uses temporary storage.                               |

An AI key does not provide real inventory, a real price, a visa decision or booking authority. The same factual guardrails and example labels remain active with a provider connected.

The protected inbox is a demonstration, not production CRM or staff authentication. Cloudflare uses the configured D1 database; the Node demo uses local files, and Vercel temporary files are not durable or shared storage. Read [CONNECT_REAL_SYSTEMS.md](CONNECT_REAL_SYSTEMS.md) before connecting real data or recipients.

## Main journeys

- **Home:** feeling dials, an adaptive globe with map fallback, party/budget selection and a departures-style deal board.
- **Planner and ribbon:** natural-language requests in three languages, designed options, refinement, editable days and a reviewed agent brief.
- **Israel:** regional and style filters, example match explanations, map/list and a per-couple-per-night price basis.
- **Packages, flights and hotels:** component costs and transparent arithmetic, with the reported phone fee shown separately in USD and marked for confirmation.
- **Tours and cruises:** comparison by pace and preferences, illustrative tour-detail pages and general cabin guidance.
- **Visa and FLEX:** official-source cautions and clear limits; no certainty about entry or cancellation rights.
- **Club and groups:** illustrative benefits, consented requests and a group brief.
- **Contact and inbox:** supplied click-to-call numbers, preview-before-send, optional webhook/WhatsApp and protected demo pipeline.

Content, navigation and controls are localised. Hebrew uses RTL; Russian and English use LTR. Language switching keeps the page. Reduced-motion preferences disable nonessential movement, and touch/keyboard alternatives support the interactive tools.

## Quality checks

```sh
npm run lint
npm run typecheck
npm run build
npm run budget
npm test
npm run audit
```

Start the production server with `npm start` in another terminal before `npm test` or `npm run audit`. Both use `http://127.0.0.1:3000` by default; set `TEST_BASE_URL` for a different local port. The browser defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` to another installed Chromium executable. Playwright configuration and the audit script define these settings. Install a compatible Chromium or set the configured browser path when running on a different machine. The build also enforces a 200 KB gzip budget for the globe and its lazy dependencies. Local fonts and their OFL licences live in `public/fonts`; no font CDN is needed. Quality results and exact verification evidence belong to [CHECKLIST.md](CHECKLIST.md); these commands are not a claim that every production integration has been tested.

Automated accessibility checks do not certify WCAG or IS 5568 compliance. The site contains a qualified accessibility statement; independent review, user testing and approved legal details are required before an official launch.

## Project structure

```text
src/app/[locale]/       Localised pages and layouts
src/app/api/            Planner, visa, tours, brief and admin endpoints
src/components/        Site shell, globe, deal board and interactive journeys
src/lib/content.ts     Hebrew, Russian and English editorial catalog
src/lib/server/        Model adapters, safeguards, delivery, auth and demo storage
src/lib/types.ts        Shared application contracts
tests/                 Playwright functional and accessibility checks
scripts/audit.mjs      Local Lighthouse audit runner
```

## Handover documents

- [DEMO_FEATURES.md](DEMO_FEATURES.md): seven business benefits in Hebrew and English, ready to adapt for an email.
- [CONNECT_REAL_SYSTEMS.md](CONNECT_REAL_SYSTEMS.md): demonstration boundaries and the integration plan for inventory, payments, club, CRM, WhatsApp, call centre, analytics and visa sources.
- [CONFIRM_WITH_CLIENT.md](CONFIRM_WITH_CLIENT.md): every category of factual, legal, pricing and operational information requiring confirmation.
- [docs/CONTENT_NOTES.md](docs/CONTENT_NOTES.md): source limits, localisation and example-data policy.
- [CHECKLIST.md](CHECKLIST.md): acceptance and validation evidence.

Development takes place in the existing checkout. A separate Git worktree is unnecessary unless explicitly requested. Keep secrets, generated reports, dependencies and demo lead data out of Git.
