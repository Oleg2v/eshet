import type { NextRequest } from "next/server";
import { authenticated } from "@/lib/server/auth";
import {
  demoLeads,
  leadStorageKind,
  leadStats,
  readLeads,
} from "@/lib/server/leads";
import { errorResponse, json } from "@/lib/server/http";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  if (!authenticated(request)) return errorResponse(401, "he", "auth");
  try {
    const stored = await readLeads();
    const leads = [...stored, ...demoLeads()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return json({
      leads,
      stats: leadStats(leads),
      demoCount: 7,
      storage: leadStorageKind(),
    });
  } catch {
    return errorResponse(503, "he", "storage");
  }
}
