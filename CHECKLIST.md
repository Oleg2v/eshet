# Eshet concept — acceptance record

Validated on **2 November 2026 (Asia/Jerusalem)** in the cloud workspace. The selected workflow is the complete key-free demonstration, with optional server-side provider and delivery adapters. Machine-readable evidence: [docs/VALIDATION.json](docs/VALIDATION.json).

## Acceptance checklist

- [x] **Four physical dials update the globe.** Pointer/touch inspection, native range keyboard tests and changing destination output verified. Party and budget survive the move to the planner. Lazy 3D pauses offscreen and uses a capped DPR; reduced motion and low-power settings use the vector fallback.
- [x] **The 3D module is under 200 KB gzip.** The actual lazy module and its dependencies total **132,577 bytes**. `npm run budget` measures the emitted files and is also enforced by `npm run build`.
- [x] **All twelve demo scenarios work in all three languages.** **36 API tests** cover Hebrew, Russian and English. Browser tests exercise designed result cards, refinement and saving to the ribbon in each language. Returned follow-ups are limited to two.
- [x] **The planner keeps intent useful.** Hero preferences, traveller words, selected results and notes are retained in the reviewed agent brief. Voice input uses Web Speech when available, with a text fallback.
- [x] **Package arithmetic is correct.** Browser tests change adults, children, nights, flight, room and extra costs, then assert the complete result. The reported USD 25 phone fee is separately labelled, never silently added to shekels.
- [x] **Visa guidance always includes an official-source caution.** API checks in three languages and a browser journey verify source links and warnings. Curated guidance does not guarantee eligibility or entry requirements.
- [x] **The visitor sees exactly what is shared.** The same `buildBriefText` function creates the visible preview and server payload. The hand-off test checks the exact persisted preview and decoded WhatsApp text; unconsented submissions are rejected.
- [x] **Demo hand-off works without a key or invented phone number.** Submissions are saved locally with explicit demo feedback. WhatsApp opens the recipient chooser when no verified business number is configured; the visitor chooses/checks the recipient. A configured webhook has delivery status and safe error handling.
- [x] **The viewport is correct and 390 px layouts fit.** The viewport uses width=device-width and initial-scale=1. Final mobile tests cover **21 route/language combinations** with no horizontal overflow. Desktop and phone screenshots were reviewed.
- [x] **Hebrew is the default and mirrored.** RTL layout, controls, ribbon ordering and directional actions are implemented. Russian and English use LTR; language switching preserves the current page. Localised copy was reviewed in source and browser.
- [x] **Example information is identified.** Prices, itineraries, weather, distances, hotel examples, fit scores, discount calculations, departure flags and hypothetical cancellation cases are labelled. Real prices, inventory, flight times, hotel facts and legal guarantees are not asserted.
- [x] **The concept disclosure and noindex are present.** Automated checks verify all **78 implemented locale pages** (three home pages plus 25 content routes per language). Each has the exact footer disclosure and noindex metadata.
- [x] **The deal board works.** Four filters, expandable details, example public/member amounts, split-flap motion and reduced-motion styling are implemented. Selecting a row creates a reviewed enquiry.
- [x] **The trip ribbon works.** Adding stops, changing the stay, calculating totals and reordering with keyboard controls are tested. Pointer dragging and touch alternatives are implemented. Data survives in the browser.
- [x] **The remaining product journeys are implemented.** Israel region/style finder and map; package/flight/hotel composer; tour matcher with three-column comparison and tour detail pages; cruise questions and cabin guidance; FLEX calculator; club value calculator and signup; group and contact briefs; magazine, Collection, privacy, cookie settings and qualified accessibility statement.
- [x] **Club consent is explicit.** Required request-processing consent and optional marketing consent are separate. Cookie choices persist and can be changed; optional analytics are off by default.
- [x] **The inbox is protected.** Configured-password login, signed HttpOnly session, authentication rejection and logout are tested. Submitted enquiries are distinguished from seeded demonstration records; seven-day destination statistics and source filtering are available.
- [x] **Build, lint and type checking pass.** `npm run build`, `npm run lint`, and `npm run typecheck` completed successfully. The production build statically generated all content routes while retaining the API routes.
- [x] **Functional tests pass.** Full Playwright suite: **59 passed, 0 failed, 0 skipped, 0 flaky**. After font delivery changes, **7 targeted checks passed**; after fixing the logotype's dimensions, **3 final mobile checks passed**. Unchanged backend scenarios were not needlessly repeated.
- [x] **Local axe checks pass.** **Zero violations** across 30 page/viewport audits (five representative pages × three languages × two widths), plus populated planner, brief and cookie-dialog states. Keyboard and focus checks supplement the automated scan.
- [x] **Lighthouse mobile passes.** All three About pages score **99 performance, 100 accessibility, 100 best practices**; exact **CLS 0** and LCP below one second. The runner enforces performance ≥95, accessibility ≥95, best practices ≥95, LCP <2,000 ms and CLS === 0.
- [x] **Setup is reproducible.** A fresh `npm ci --no-audit --no-fund` and production build passed. `npm run dev -- --port 3001` served the page with HTTP 200 and returned two demo planner options; the temporary development process was stopped after validation.
- [x] **Required delivery files are complete.** README with local startup and Vercel import; DEMO_FEATURES in Hebrew and English; integration mapping; client confirmations; this checklist; full source, lockfile, tests and local font licences.

## Final Lighthouse evidence

Local Chromium, Lighthouse mobile simulated throttling; production server, separate sequential measurements.

| Page          | Performance | Accessibility | Best practices |    LCP | CLS |
| ------------- | ----------: | ------------: | -------------: | -----: | --: |
| Hebrew About  |          99 |           100 |            100 | 910 ms |   0 |
| Russian About |          99 |           100 |            100 | 908 ms |   0 |
| English About |          99 |           100 |            100 | 911 ms |   0 |

SEO is 60 because the required `noindex` is intentional; it is reported rather than used as a publication gate. These are reproducible local lab measurements, not physical-phone or production field measurements. Raw local evidence is in ignored `reports/`: Lighthouse HTML/JSON, full Playwright results, later targeted results and axe summaries.

## Internal design self-review

These are editorial review scores, not an award, external evaluation or legal certification.

| Area               | Score / 10 | Review basis                                                                                                                     |
| ------------------ | ---------: | -------------------------------------------------------------------------------------------------------------------------------- |
| Design             |          9 | Editorial hierarchy, warm palette, local typography, deliberate desktop and 390 px compositions.                                 |
| Motion craft       |          9 | Dial feedback, settling globe, departure flips, card light/tilt, horizon transition and motion preferences.                      |
| Storytelling       |          9 | A feeling becomes a destination, a considered plan and an understandable enquiry.                                                |
| Planner usefulness |          9 | Three-language inputs, 12 grounded scenarios, refinement, saved days and complete hand-off.                                      |
| Dials hero         |          9 | Four real controls with keyboard/touch support, progressive 3D and readable fallback.                                            |
| Deal board         |          9 | Filtered rows, visible price basis, member comparison and an actionable detail sheet.                                            |
| Visa assistant     |          9 | Plain steps, official sources, uncertainty preserved and a human route.                                                          |
| Agent brief        |          9 | Exact preview, consent, editable notes, local receipt, webhook status and WhatsApp sharing.                                      |
| Russian quality    |          9 | Native phrasing throughout the main journeys and complete LTR layouts.                                                           |
| Mobile             |          9 | Phone-specific compositions and 21 final overflow checks.                                                                        |
| Accessibility      |          9 | Zero automated violations in audited states, native controls and visible focus; independent compliance review remains necessary. |
| Performance        |          9 | 99 mobile content-page performance, zero measured CLS and a 132.6 KB globe budget.                                               |

## Implemented but not externally exercised

No OpenAI/Anthropic key, real inventory connection, production webhook recipient, payment system or public deployment was supplied. Provider adapters and validated JSON handling are implemented; actual paid provider responses and real delivery were **not** tested. Demo behavior was tested without those credentials. Content still requires the commercial/legal confirmations listed in CONFIRM_WITH_CLIENT.md before an official launch. The local inbox is demonstration storage, not durable production CRM. Automated tests do not certify WCAG 2.2 AA or IS 5568 compliance.
