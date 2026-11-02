import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Content is generated at build time; the app does not use ISR or image optimisation.
// Prerendered pages are served from the static-assets cache instead of being
// rendered on every request, which keeps Worker CPU time low (no R2 needed).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
