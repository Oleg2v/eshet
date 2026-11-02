import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Brief, Lead } from "@/lib/types";
import { getLeadDatabase } from "./cloudflare-store";

const directory =
  process.env.LEAD_STORE_DIR ||
  (process.env.VERCEL
    ? "/tmp/eshet-concept"
    : path.join(process.cwd(), ".data"));
const file = path.join(directory, "leads.json");
let queue: Promise<unknown> = Promise.resolve();

type StoredLead = {
  id: string;
  created_at: string;
  source: string;
  status: Lead["status"];
  brief_json: string;
  webhook: Lead["webhook"];
};

export function leadStorageKind() {
  if (getLeadDatabase()) return "cloudflare-d1";
  return process.env.VERCEL ? "ephemeral" : "local-demo";
}

export async function readLeads(): Promise<Lead[]> {
  const database = getLeadDatabase();
  if (database) {
    const result = await database
      .prepare(
        "SELECT id, created_at, source, status, brief_json, webhook FROM leads ORDER BY created_at DESC, id DESC LIMIT 1000",
      )
      .all<StoredLead>();
    if (!result.success || !Array.isArray(result.results)) {
      throw new Error("Lead store unavailable");
    }
    return result.results.map((row) => {
      const brief: unknown = JSON.parse(row.brief_json);
      if (!brief || typeof brief !== "object" || Array.isArray(brief)) {
        throw new Error("Stored enquiry could not be read");
      }
      return {
        id: row.id,
        createdAt: row.created_at,
        source: row.source,
        status: row.status,
        brief: brief as Brief,
        webhook: row.webhook,
      };
    });
  }
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    return Array.isArray(parsed)
      ? parsed
          .filter(
            (lead): lead is Lead =>
              !!lead &&
              typeof lead === "object" &&
              typeof lead.id === "string" &&
              !!lead.brief,
          )
          .slice(-1000)
      : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw new Error("Lead store unavailable");
  }
}
export async function saveLead(
  brief: Brief,
  webhook: Lead["webhook"],
): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    source: brief.source,
    status: "new",
    brief,
    webhook,
  };
  const database = getLeadDatabase();
  if (database) {
    const result = await database
      .prepare(
        "INSERT INTO leads (id, created_at, source, status, brief_json, webhook) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        lead.id,
        lead.createdAt,
        lead.source,
        lead.status,
        JSON.stringify(lead.brief),
        lead.webhook,
      )
      .run();
    if (!result.success) throw new Error("Lead store unavailable");
    return lead;
  }
  const action = queue
    .catch(() => undefined)
    .then(async () => {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const leads = await readLeads();
      leads.push(lead);
      const temporary = path.join(directory, `${lead.id}.tmp`);
      await writeFile(temporary, JSON.stringify(leads.slice(-1000)), {
        encoding: "utf8",
        mode: 0o600,
      });
      await rename(temporary, file);
    });
  queue = action;
  await action;
  return lead;
}
export async function setDelivery(id: string, webhook: Lead["webhook"]) {
  const database = getLeadDatabase();
  if (database) {
    const result = await database
      .prepare("UPDATE leads SET webhook = ? WHERE id = ?")
      .bind(webhook, id)
      .run();
    if (!result.success)
      throw new Error("Lead delivery status could not be saved");
    return;
  }
  const action = queue
    .catch(() => undefined)
    .then(async () => {
      const leads = await readLeads();
      const lead = leads.find((item) => item.id === id);
      if (!lead) return;
      lead.webhook = webhook;
      const temporary = path.join(directory, `${randomUUID()}.tmp`);
      await writeFile(temporary, JSON.stringify(leads), {
        encoding: "utf8",
        mode: 0o600,
      });
      await rename(temporary, file);
    });
  queue = action;
  await action;
}
export function demoLeads(): Lead[] {
  const words = [
    ["planner", "חנוכה עם פעוט, אילת או ים המלח, עד 1,800 ₪ ללילה"],
    ["package", "סוף שבוע באירופה לשני מבוגרים"],
    ["tour-comparison", "A relaxed organised tour in South America"],
    ["cruise", "Круиз для родителей: спокойный ритм и меньше толпы"],
    ["group", "כנס קטן — בקשת קבוצה לדוגמה"],
    ["club-signup", "בקשת הצטרפות לדוגמה, ללא פרטי אדם אמיתי"],
    ["abandoned-search", "בחירה לדוגמה: טבע, שקט, תקציב בינוני"],
  ];
  return words.map(([source, travellerWords], index) => ({
    id: `demo-${index + 1}`,
    createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    source,
    status: "new",
    webhook: "not-configured",
    brief: {
      locale: index === 3 ? "ru" : index === 2 ? "en" : "he",
      source,
      travellerWords,
      selections: {
        demo: true,
        destination: index % 2 ? "אירופה" : "אילת",
        ...(source === "abandoned-search"
          ? { temperature: 70, energy: 20, landscape: 85, comfort: 55 }
          : {}),
      },
      notes: "Demonstration lead — not a real customer",
      consent: true,
    },
  }));
}
export function leadStats(leads: Lead[]) {
  const since = Date.now() - 7 * 24 * 3600000;
  const destinations = new Map<string, number>();
  const sources: Record<string, number> = {};
  for (const lead of leads) {
    sources[lead.source] = (sources[lead.source] || 0) + 1;
    if (Date.parse(lead.createdAt) < since) continue;
    const names = lead.brief.options?.map((option) => option.destination) ?? [
      String(lead.brief.selections.destination || ""),
    ];
    for (const name of new Set(names))
      if (name) destinations.set(name, (destinations.get(name) || 0) + 1);
  }
  return {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "new").length,
    sources,
    topDestinations: [...destinations]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count })),
  };
}
