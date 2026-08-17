import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminAnalyticsSummary } from "@/lib/services/analytics";

export async function GET() {
  try {
    await requireAdmin();
    const summary = await getAdminAnalyticsSummary();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
