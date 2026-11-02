# Cloudflare deployment

This project targets **Cloudflare Workers using OpenNext**, including all server APIs. The design-concept disclosure and example-data labels remain part of the original brief.

## Prepared and verified locally

- Next.js 16.4.3 with `@opennextjs/cloudflare` 1.20.15.
- `wrangler.jsonc`: worker `eshet-tours-concept`, static assets, a self-reference binding and `LEADS_DB`.
- `migrations/0001_leads.sql`: durable D1 storage for submitted enquiries. Ordinary Node development still uses the existing local demo store.
- No custom domain or existing production site is changed. A successful deployment prints the account's public `workers.dev` URL.

## Account access

Use the existing authorised Cloudflare account through Wrangler or a deployment-only `CLOUDFLARE_API_TOKEN`. The token needs access to the selected account with **Workers Scripts: Edit**, **D1: Edit** and **Account Settings: Read**. Keep the value in secure environment settings, never in Git or chat. A restricted environment also needs outbound HTTPS access to `api.cloudflare.com`.

Run `npx wrangler whoami` to verify the account. If more than one account is available, set the non-secret `CLOUDFLARE_ACCOUNT_ID` for the intended account.

## First deployment

From the repository root, after confirming account access:

```sh
npm ci
npx wrangler d1 create eshet-concept-leads --binding LEADS_DB --update-config
npm run cf:migrate:remote
npm run cf:build
npm run cf:deploy
```

Create the database only once. If it already exists, reuse its real ID in `wrangler.jsonc`; never replace an existing database. Apply the additive migration to that database before enabling submissions. The Worker will fail safely if its D1 binding is missing rather than pretend to save enquiries to temporary storage.

Enable the private inbox with a password of at least 12 characters:

```sh
npx wrangler secret put ADMIN_PASSWORD
```

Enter it in Wrangler's secure prompt. The key-free public demo needs no model-provider key. Optional provider, webhook and verified WhatsApp settings are described in `.env.example`; add them as Worker secrets when approved. Do not upload private developer/test files as static assets.

For subsequent releases, run `npm run cf:migrate:remote`, `npm run cf:build`, then `npm run cf:deploy`. If Workers Builds is connected to GitHub, configure the build command as `npm run cf:build` and deploy command as `npm run cf:deploy`; establish the real database binding and migration first.

## Local Cloudflare runtime

```sh
npm run cf:build
npm run cf:migrate:local
npm run cf:preview
```

Wrangler serves its local runtime on port 8787. Use a private ignored `.dev.vars` for local Worker secrets; it is separate from the Node development `.env.local`. Local D1 state is ignored under `.wrangler`. This is a local runtime check, not a public deployment.

The existing browser tests can target this runtime with `TEST_BASE_URL=http://127.0.0.1:8787 npm test`. For the private-inbox test, use the same test-only `ADMIN_PASSWORD` in the private local files; never print it.
