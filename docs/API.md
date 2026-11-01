# API and local demo contract

All public tools work without provider keys. No endpoint confirms a booking, availability, a live price, a hotel fact or visa eligibility. Input is bounded, same-origin browser requests are enforced, requests are rate-limited in memory, and responses use `Cache-Control: no-store`. Production needs a shared rate limiter and durable storage.

## Planner

`POST /api/planner` with JSON `{locale: "he" | "ru" | "en", prompt: string, preferences?: object}` returns `PlannerResult`: two authored options with reasons, example price bands in shekels, checks, duration examples, at most two follow-up questions, a localized disclaimer and `mode` (`demo` or `live`).

Twelve demo scenarios, each available in all three languages:

- `family-eilat`: Hanukkah with a toddler, Eilat or the Dead Sea.
- `japan-slow`: ten days in Japan, first visit and no rushing.
- `friends-europe`: a birthday weekend for eight friends in Europe.
- `parents-cruise`: a cruise for parents who prefer less crowding.
- `kosher-tiberias`: a family asking for kosher accommodation in Tiberias.
- `hiking-asia`: an organised walking trip in Asia.
- `usa-entry`: a United States entry question, with no price estimate (0–0 means no priced itinerary).
- `south-america`: an organised tour in South America.
- `dead-sea-spa`: a quiet spa-style stay near the Dead Sea.
- `tel-aviv-boutique`: a boutique-style Tel Aviv weekend.
- `jerusalem-culture`: time for culture in Jerusalem.
- `galilee-glamping`: nature and a glamping-style Galilee stay.

With `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, the server asks the chosen provider to select an authored direction, identify verbatim traveller preferences that explain each option, and choose up to two useful follow-up questions using JSON. `OPENAI_MODEL` and `ANTHROPIC_MODEL` select the model. The model matches preferences to the supplied catalogue; every rationale quote must occur literally in the input, option IDs must belong to the chosen scenario, and follow-up question keys must be from a reviewed list. Server-authored copy turns these validated facts into personalised cards. This provides individual explanations without allowing freeform destination claims. The LLM never authors prices, rules or availability. If the provider is unavailable or returns invalid JSON, the scripted result is returned and marked `demo`; the visitor never sees a raw exception. Add approved inventory and destination records before expanding the catalogue. These are reviewed planning examples, not live travel advice. Mood settings and refinement answers also enrich scripted reasons and checklists; explicit destinations take priority. The keyed integration is implemented but not exercised during onboarding because no provider key is configured.

## Entry guidance

`POST /api/visa` with `{locale,destination}` returns `VisaResult`. Supported ids are `united-states`, `europe`, `thailand`, `united-kingdom`, `japan`, `other`; natural names in the three languages are also recognized. Every result includes a change-of-rules warning and an official government source. The source links are pointers, not evidence of a live rules check. The visa endpoint may call the configured LLM for internal intent classification, but it always renders curated general guidance. TDAC is described as an arrival form, never a visa. ETIAS operational status is explicitly left for official checking.

## Tour matching

`POST /api/tours` with `{locale,pace,fitness,interests,groupSize,month,budget}` returns up to three `TripOption` records plus mode and disclaimer. All numeric comparison data in the concept are examples; departure guarantees must be confirmed by real inventory.

## Brief and consent

`POST /api/brief` accepts the shared `Brief` type with `consent: true`. Missing consent is rejected with 422. The brief is intentionally deterministic rather than rewritten by an LLM: a reviewer must see the exact payload that will be sent. Optional model-based intent classification is separate metadata. The exact `buildBriefText(brief)` output is the preview on the review screen, the `preview` string sent to the webhook, and the decoded WhatsApp message. This shared pure serializer prevents a mismatch between approved and delivered content. The webhook also receives the structured brief, a unique id, created time, `example: true` and optional intent classification. There is no automatic transmission while typing or merely viewing the preview.

Response: `{id,preview,whatsappUrl,delivery,message}`. `delivery` is `demo` when no webhook is configured, `delivered` after a successful HTTPS webhook response, or `failed` when a saved lead could not be delivered. The localized message makes this distinction explicit. The server stores the lead before delivery. Webhook redirects are rejected, calls time out, and a configured token stays server-side. Retry automation requires production idempotency and queue integration.

`WHATSAPP_NUMBER`, when supplied, must be a confirmed international business number. Without a valid configured number, `whatsappUrl` is the generic `https://wa.me/?text=...` recipient chooser carrying the exact approved brief. No number is invented and no landline is assumed to support WhatsApp. The UI describes this as sharing the brief, asks the visitor to select or check the recipient, and never claims that the chooser sends directly to Eshet. Opening the offered link and sending in WhatsApp are separate visitor actions.

`POST /api/events` accepts `{locale,event:"abandoned-search",preferences:{...},consent:true}`; the root UI can equivalently send `dialSettings` and `selections`, which are both preserved. The client only invokes it after analytics consent; it stores an anonymous search example and follows the same webhook behavior. It rejects missing consent and other event names. Club signups use `/api/brief` with an explicit signup source and consent; a production double-opt-in system and separate marketing consent are still required.

## Password protected inbox

Set `ADMIN_PASSWORD` to a private value of at least 12 characters in `.env.local` or the deployment secret store. No default or baked-in password exists. `POST /api/admin/login` with `{password,locale?}` creates a one-hour HMAC-signed HttpOnly, SameSite=Strict cookie, Secure over HTTPS. Password checks use fixed-size timing-safe hashes. Five login attempts are permitted per 15-minute in-memory window. `POST /api/admin/logout` expires the cookie. `GET /api/admin/leads` is protected and returns `{leads,stats,demoCount,storage}`. Seven clearly identified seeded demo leads illustrate the pipeline alongside actual demo submissions.

The demo stores up to 1,000 records in ignored `.data/leads.json`, or under ephemeral `/tmp/eshet-concept` on Vercel. Writes are serialized and atomically renamed within an instance. This is a development demonstration, not a durable production CRM. Use a database, tenant/role-based authentication, audit logs, retention/deletion controls, a shared queue and distributed rate limiting before handling real customer data. Serverless storage does not survive instance replacement and is not shared across instances.

Provider keys, webhook credentials, the inbox password and session secret are server-only. `.env.local` is ignored by Git. Do not expose any credential through a `NEXT_PUBLIC_` variable.
