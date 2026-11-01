import type { Brief } from "@/lib/types";
import { buildBriefText } from "@/lib/brief";
import { pick } from "@/lib/locale";
import { saveLead, setDelivery } from "./leads";
import { classifyIntent } from "./llm";

export async function deliverBrief(brief: Brief) {
  const preview = buildBriefText(brief);
  const lead = await saveLead(brief, "not-configured");
  const webhook = process.env.LEAD_WEBHOOK_URL;
  let delivery: "demo" | "delivered" | "failed" = "demo";
  // Optional AI routing never modifies the exact visitor-approved payload.
  const scenarioId = await classifyIntent(brief.travellerWords, brief.locale);
  if (webhook) {
    delivery = "failed";
    try {
      const url = new URL(webhook);
      if (url.protocol !== "https:") throw new Error("Webhook requires HTTPS");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": lead.id,
          ...(process.env.LEAD_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          id: lead.id,
          createdAt: lead.createdAt,
          brief,
          preview,
          example: true,
          scenarioId,
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "error",
        cache: "no-store",
      });
      delivery = response.ok ? "delivered" : "failed";
    } catch {
      /* A saved lead remains available even when delivery fails. */
    }
    await setDelivery(
      lead.id,
      delivery === "delivered" ? "delivered" : "failed",
    );
  }
  const phone = process.env.WHATSAPP_NUMBER?.replace(/^\+/, "");
  const recipient = phone && /^[1-9]\d{8,14}$/.test(phone) ? phone : "";
  const whatsappUrl = `https://wa.me/${recipient}?text=${encodeURIComponent(preview)}`;
  const message =
    delivery === "delivered"
      ? pick(
          brief.locale,
          "הבריף נמסר לערוץ הפניות שהוגדר. אין כאן אישור הזמנה.",
          "Заявка передана в настроенный канал. Это не подтверждение бронирования.",
          "Your brief was delivered to the configured enquiry channel. This is not a booking confirmation.",
        )
      : delivery === "failed"
        ? pick(
            brief.locale,
            "הבריף נשמר, אך לא נמסר לערוץ הפניות. אפשר להעתיק אותו או לדבר עם נציג.",
            "Заявка сохранена, но передать её не удалось. Можно скопировать текст или позвонить агенту.",
            "Your brief was saved, but delivery did not complete. Copy it or call an agent.",
          )
        : pick(
            brief.locale,
            "הבריף נשמר בהדגמה בלבד. הוא לא נשלח לאשת טורס. אפשר להעתיק אותו או להתקשר.",
            "Заявка сохранена только в демоверсии. В Eshet Tours она не отправлена. Можно скопировать её или позвонить.",
            "Your brief is saved in this demo only. It has not been sent to Eshet Tours. You can copy it or call.",
          );
  return { id: lead.id, preview, whatsappUrl, delivery, message };
}
