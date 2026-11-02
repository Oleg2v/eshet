import { getCloudflareContext } from "@opennextjs/cloudflare";

// A small structural contract keeps Node development independent of generated
// Wrangler globals while accepting the real D1 binding in Workers.
export interface LeadDatabase {
  prepare(query: string): {
    bind(...values: (string | number | null)[]): {
      run(): Promise<{ success: boolean }>;
    };
    all<T>(): Promise<{ success: boolean; results: T[] }>;
  };
}

export function getLeadDatabase(): LeadDatabase | null {
  let env: { LEADS_DB?: LeadDatabase };
  try {
    // The synchronous accessor never starts Wrangler in ordinary Node servers.
    // OpenNext supplies this context before invoking a Worker request.
    env = getCloudflareContext().env as unknown as {
      LEADS_DB?: LeadDatabase;
    };
  } catch {
    if (
      typeof navigator !== "undefined" &&
      navigator.userAgent === "Cloudflare-Workers"
    ) {
      throw new Error("Cloudflare request context is unavailable");
    }
    return null;
  }

  // A missing binding must not silently send durable enquiries to an ephemeral
  // filesystem. The API converts this error to its existing helpful message.
  if (!env.LEADS_DB || typeof env.LEADS_DB.prepare !== "function") {
    throw new Error("The Cloudflare lead database is not configured");
  }
  return env.LEADS_DB;
}
