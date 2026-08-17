import { requireAdmin } from "@/lib/auth";
import { getAdminAnalyticsSummary } from "@/lib/services/analytics";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import {
  Users,
  Play,
  CheckCircle2,
  Sparkles,
  Coins,
  Gem,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  DollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-rose-500/30 text-center flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
          <p className="text-xs text-zinc-400">
            You must be logged in as an administrator to access the PLOT Studio CMS.
          </p>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl bg-purple-600 font-bold text-white text-xs"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  const summary = await getAdminAnalyticsSummary();
  const { metrics, funnel, popularStories, recentEvents } = summary;

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Studio Executive Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-950 border border-purple-500/40 text-purple-300">
                Live Overview
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Production telemetry, IDR revenue, manual GoPay/OVO payments, and reader retention funnel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/payments"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs transition shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Verify Payments ({metrics.pendingOrdersCount})</span>
            </Link>

            <Link
              href="/admin/stories"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs transition shadow-lg shadow-purple-950/50 flex items-center gap-1.5"
            >
              <span>Manage Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Revenue Banner in IDR */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-zinc-950 to-purple-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400">
              Verified Revenue (Indonesian Rupiah)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {metrics.formattedRevenue}
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                ({metrics.approvedOrdersCount} Approved Orders)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Today: <strong className="text-white">{metrics.formattedRevenueToday}</strong> • This Month:{" "}
              <strong className="text-white">{metrics.formattedRevenueThisMonth}</strong>
            </p>
          </div>

          {metrics.pendingOrdersCount > 0 && (
            <Link
              href="/admin/payments"
              className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center gap-3 text-left hover:bg-amber-500/30 transition"
            >
              <Clock className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-black text-amber-200 block">
                  {metrics.pendingOrdersCount} Payments Awaiting Verification
                </span>
                <span className="text-[10px] text-zinc-400">
                  Click to review receipts & credit customer wallets.
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Total Readers
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-white">{metrics.totalUsers}</span>
              <Users className="w-4 h-4 text-purple-400 ml-auto" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Published Stories
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-white">{metrics.publishedStories}</span>
              <ShieldCheck className="w-4 h-4 text-purple-400 ml-auto" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Choices Made
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-rose-400">{metrics.totalChoices}</span>
              <Sparkles className="w-4 h-4 text-rose-400 ml-auto" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Episode Unlocks
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-emerald-400">
                {metrics.totalEpisodeUnlocks}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Coins Spent
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-amber-300">
                {metrics.totalCoinsSpent}
              </span>
              <Coins className="w-4 h-4 text-amber-400 ml-auto" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-500">
              Diamonds Spent
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-purple-300">
                {metrics.totalDiamondsSpent}
              </span>
              <Gem className="w-4 h-4 text-purple-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Funnel & Conversion Rates */}
        <section className="p-6 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Reader Conversion Funnel</h3>
              <p className="text-xs text-zinc-400">
                Track reader progression from free discovery to paid chapter unlocking and story completion.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              {funnel[4]?.percent || 20}% Unlock Rate
            </span>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            {funnel.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-300">
                  <span>{step.step}</span>
                  <span>
                    {step.count} ({step.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Telemetry Events */}
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-white">Recent Telemetry Activity</h3>
          <div className="rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden">
            <div className="divide-y divide-white/5 text-xs">
              {recentEvents.map((evt) => (
                <div key={evt.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-purple-950/80 text-purple-300 border border-purple-500/30">
                      {evt.name}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {JSON.stringify(evt.properties)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(evt.time).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
