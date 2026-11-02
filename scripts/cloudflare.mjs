import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse } from "jsonc-parser";

const root = fileURLToPath(new URL("../", import.meta.url));
const account = "be9447e281c6e9198712ade2d0241029";
const domain = "eshet.kikkey.com";
const configErrors = [];
const config = parse(
  readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
  configErrors,
  { allowTrailingComma: true },
);
const command = process.argv[2];

function requireCondition(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

requireCondition(
  ["check", "deploy"].includes(command),
  "Usage: node scripts/cloudflare.mjs check|deploy",
);
requireCondition(
  configErrors.length === 0,
  "Invalid wrangler.jsonc configuration.",
);
requireCondition(
  process.argv.length === 3,
  "Deployment overrides are not accepted; edit and review the committed configuration.",
);
requireCondition(
  config.account_id === account && config.name === "eshet",
  "Deployment must target the approved account and Worker eshet.",
);
for (const key of ["CLOUDFLARE_ACCOUNT_ID", "CF_ACCOUNT_ID"]) {
  requireCondition(
    !process.env[key] || process.env[key] === account,
    `Remove the conflicting ${key} setting before deploying.`,
  );
}
requireCondition(
  config.workers_dev === false && config.preview_urls === false,
  "Public workers.dev and preview URLs must be disabled.",
);
requireCondition(
  config.keep_vars === true,
  "Existing Worker variables must be preserved.",
);
requireCondition(
  config.routes?.length === 1 &&
    config.routes[0].pattern === domain &&
    config.routes[0].custom_domain === true,
  "Only the approved Custom Domain may be configured.",
);
requireCondition(
  config.services?.length === 1 &&
    config.services[0].binding === "WORKER_SELF_REFERENCE" &&
    config.services[0].service === "eshet",
  "Only this Worker's self-reference may be configured.",
);
requireCondition(
  config.d1_databases?.length === 1 &&
    config.d1_databases[0].binding === "LEADS_DB" &&
    config.d1_databases[0].database_name === "eshet-concept-leads",
  "Use only the dedicated enquiry database.",
);
console.log(`Configuration checked: https://${domain}`);

if (command === "deploy") {
  requireCondition(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      config.d1_databases[0].database_id || "",
    ),
    "Deployment stopped: configure the real approved D1 database_id first. Creating a database or applying its remote migration requires the owner's approval; automatic provisioning is not permitted.",
  );
  requireCondition(
    Boolean(process.env.CLOUDFLARE_API_TOKEN),
    "Deployment stopped: connect CLOUDFLARE_API_TOKEN securely in the execution environment. Never place its value in the repository or command arguments.",
  );
  const result = spawnSync(
    "npx",
    ["opennextjs-cloudflare", "deploy", "--strict", "--no-autoconfig"],
    {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: account,
        WRANGLER_SEND_METRICS: "false",
      },
    },
  );
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
}
