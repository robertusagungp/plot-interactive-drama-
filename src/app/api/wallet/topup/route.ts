import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PaymentService, COIN_PACKAGES, DIAMOND_PACKAGES } from "@/lib/services/payments";
import { z } from "zod";

const TopupSchema = z.object({
  packageId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = TopupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid package selection" }, { status: 400 });
    }

    const pkg =
      COIN_PACKAGES.find((p) => p.id === parsed.data.packageId) ||
      DIAMOND_PACKAGES.find((p) => p.id === parsed.data.packageId);

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const result = await PaymentService.executeDevMockPurchase(user.id, pkg);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, newBalance: result.newBalance, package: pkg });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Purchase failed" }, { status: 500 });
  }
}
