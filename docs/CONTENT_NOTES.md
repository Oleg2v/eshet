# Content and localisation notes

## Closed set of company facts

Editorial content uses the facts supplied in the project brief: Eshet Tours/אשת טורס, in business since 1987, the listed travel categories, IATA membership, the presence of a TrustYou widget on the current site, Eshet Club, Collection, FLEX, the two supplied phone lines and the current-site brand lines. The concept does not introduce company history, awards, partners, endorsements or review ratings.

US$25 for scheduled-flight phone booking is always a reported current-site figure requiring confirmation. Collection's advertised “up to 30%” is qualified as reported wording with terms to confirm. No additional actual prices or guarantees are asserted.

## Example versus fact

All budgets, costs, hotel styles, itinerary shapes, group sizes, walking durations, weather ranges, distances, match scores, member prices and availability-like presentation are demonstration data. Tour detail pages are explicitly illustrative. General travel explanations are labelled as such and prompt a check of the specific product. Visa guidance always points back to an official source and warns that rules change.

The site never claims that a submitted example itinerary is booked, a membership is active, a webhook was delivered without acknowledgement, or WhatsApp was sent merely because its link opened.

## Localisation

`src/lib/content.ts` exports `pages: Record<string, ContentPage>`. Every title, eyebrow, introductory paragraph and section contains `he`, `ru` and `en` strings. `tool` identifies the interactive component to render; content-only pages have no tool identifier. Dynamic controls and backend messages are translated in their corresponding modules.

Hebrew is direct and brief, using the supplied line “איזו חופשה בא לכם?” where appropriate. Russian is written as customer-facing travel copy rather than a literal mirror of Hebrew. English keeps the same fact boundaries. Numbers, phone links and foreign currencies retain an unambiguous direction and unit. Language switching preserves the route; locally saved itinerary content remains the traveller's input rather than being silently rewritten.

## Content pages

The catalog includes the main product journeys, a separate ribbon, magazine guidance, a Russian entry page, contact, about, accessibility, privacy, cookie settings and the admin introduction. Three additional illustrative detail pages — `tour-asia`, `tour-europe`, `tour-south-america` — demonstrate itinerary content without claiming live inventory.

## Honest legal and accessibility wording

The privacy and accessibility pages describe this concept. They are not represented as Eshet's approved official policies. WCAG 2.2 AA and applicable IS 5568 requirements are development targets; independent review and client approval are still required before a legal compliance statement. Actual local checks belong in `CHECKLIST.md`, not invented certification claims.

The concept disclosure must appear on every rendered page: “Design concept. Not the official Eshet Tours website.” All pages remain `noindex` until an authorised official launch.
