import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createPaymentOrder, getActiveCurrencyPackages } from "@/lib/services/payments";
import { z } from "zod";

const CreateOrderSchema = z.object({
  packageCodeOrId: z.string(),
  paymentMethod: z.enum(["GOPAY", "OVO"]),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.paymentOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { package: true },
    });

    const packages = await getActiveCurrencyPackages();

    return NextResponse.json({ success: true, orders, packages });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch payment orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment request payload" }, { status: 400 });
    }

    const order = await createPaymentOrder({
      userId: user.id,
      packageCodeOrId: parsed.data.packageCodeOrId,
      paymentMethod: parsed.data.paymentMethod,
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create payment order" }, { status: 500 });
  }
}
