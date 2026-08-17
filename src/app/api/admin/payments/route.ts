import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { approvePaymentOrder, rejectPaymentOrder } from "@/lib/services/payments";
import { z } from "zod";

const ActionSchema = z.object({
  orderId: z.string(),
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().optional(),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const orders = await db.paymentOrder.findMany({
      where: statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {},
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        package: true,
        auditLogs: { orderBy: { createdAt: "desc" } },
      },
    });

    const statusCounts = await db.paymentOrder.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const countsMap: Record<string, number> = {};
    statusCounts.forEach((c) => {
      countsMap[c.status] = c._count.id;
    });

    return NextResponse.json({ success: true, orders, counts: countsMap });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unauthorized" }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = ActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action payload" }, { status: 400 });
    }

    const { orderId, action, reason, note } = parsed.data;

    if (action === "APPROVE") {
      const result = await approvePaymentOrder({
        orderId,
        adminUserId: admin.id,
        note,
      });

      return NextResponse.json({
        success: true,
        message: `Approved. Credited +${result.creditedAmount} ${result.currencyType} to user wallet.`,
        data: result,
      });
    } else {
      const result = await rejectPaymentOrder({
        orderId,
        adminUserId: admin.id,
        reason,
        note,
      });

      return NextResponse.json({
        success: true,
        message: "Payment order marked as rejected.",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update payment order" }, { status: 500 });
  }
}
