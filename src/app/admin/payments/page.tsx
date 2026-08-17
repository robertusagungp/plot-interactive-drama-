import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminPaymentOrders } from "@/components/admin/AdminPaymentOrders";
import { CreditCard, ShieldCheck } from "lucide-react";

export default async function AdminPaymentsPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const [orders, statusCounts] = await Promise.all([
    db.paymentOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: true,
        auditLogs: { orderBy: { createdAt: "desc" } },
      },
    }),
    db.paymentOrder.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const countsMap: Record<string, number> = {};
  statusCounts.forEach((c) => {
    countsMap[c.status] = c._count.id;
  });

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                E-Wallet Manual Transfer Verification
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-950 border border-purple-500/40 text-purple-300">
                GoPay & OVO
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Verify customer transfer receipts, approve orders with atomic wallet crediting, and manage payment audits.
            </p>
          </div>
        </div>

        <AdminPaymentOrders initialOrders={orders as any} counts={countsMap} />
      </main>
    </div>
  );
}
