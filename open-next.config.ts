import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Content is generated at build time; the app does not use ISR or image optimisation.
export default defineCloudflareConfig();
