import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import "./[locale]/fonts.css";
import "./[locale]/globals.css";
import NotFound from "./[locale]/not-found";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Page not found · Eshet Tours",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export default function GlobalNotFound() {
  return (
    <html lang="he" dir="rtl">
      <body>
        <NotFound />
      </body>
    </html>
  );
}
