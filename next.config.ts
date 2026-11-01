import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/", destination: "/he", permanent: false },
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
    ];
  },
};
export default config;
