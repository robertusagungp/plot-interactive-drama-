import { requireAdmin } from "@/lib/auth";
import { getAdminAnalyticsSummary } from "@/lib/services/analytics";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BarChart3, TrendingUp, Users, Coins } from "lucide-react";

export default async function AdminAnalyticsPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const summary = await getAdminAnalyticsSummary();
  const { metrics, funnel } = summary;

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Analytics & Conversion Telemetry
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze reader drop-off, monetization checkpoints, and decision trees.
          </p>
        </div>

        {/* Funnel Graph */}
        <section className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl flex flex-col gap-6">
          <h3 className="text-base font-bold text-white">
            Episode Retention & Unlock Funnel
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {funnel.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Step {idx + 1}
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {item.step}
                  </h4>
                </div>

                <div className="flex items-baseline justify-between border-t border-white/5 pt-2">
                  <span className="text-xl font-black text-purple-400">
                    {item.count}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
