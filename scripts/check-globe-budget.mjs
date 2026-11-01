import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

// Measure the actual lazy module and every dependency listed by Next's build.
const manifest = JSON.parse(
  readFileSync(".next/react-loadable-manifest.json", "utf8"),
);
const globeEntry = Object.entries(manifest).find(([name]) =>
  name.includes("Globe.tsx -> ./GlobeCanvas"),
)?.[1];
if (!globeEntry?.files?.length)
  throw new Error(
    "The built globe module was not found. Run the production build first.",
  );
const files = [...new Set(globeEntry.files)].map((file) => ({
  file,
  gzipBytes: gzipSync(readFileSync(path.join(".next", file))).length,
}));
const total = files.reduce((sum, file) => sum + file.gzipBytes, 0);
console.log(
  `Globe + lazy dependencies: ${total.toLocaleString("en")} gzip bytes / 200,000-byte limit`,
);
if (total >= 200000)
  throw new Error("The globe exceeds its 200 KB gzip budget.");
