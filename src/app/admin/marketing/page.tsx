import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MarketingClient } from "./MarketingClient";
import Link from "next/link";
import { Sparkles, Flame, ShieldCheck, Target, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  try {
    await requireAdmin();
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-rose-500/30 text-center flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
          <p className="text-xs text-zinc-400">
            You must be logged in as an administrator to access the TikTok Marketing Hub.
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

  // Fetch all stories for the Link Builder
  const stories = await db.story.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      viewCount: true,
      startCount: true,
    },
    orderBy: { viewCount: "desc" },
  });

  // Fetch real-time attribution summaries
  const attributions = await db.userAttribution.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  // Fetch total marketing stats
  const totalAttributedUsers = await db.userAttribution.count();
  const tiktokAttributedUsers = await db.userAttribution.count({
    where: {
      OR: [
        { firstTouchSource: { contains: "tiktok", mode: "insensitive" } },
        { lastTouchSource: { contains: "tiktok", mode: "insensitive" } },
      ],
    },
  });

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950 text-white">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 overflow-y-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                TikTok Growth & Paid Acquisition Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                🟢 Ready For Ads
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Otomasi pelacakan kampanye, generator link iklan deep-link, dan simulator funnel end-to-end.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-white/10 text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Attributed Users</span>
              <span className="text-base font-black text-rose-400">{tiktokAttributedUsers} / {totalAttributedUsers}</span>
            </div>
          </div>
        </div>

        {/* Client Interactive Section */}
        <MarketingClient
          stories={stories}
          attributions={attributions}
          tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "Belum Dikonfigurasi"}
          hasAccessToken={!!process.env.TIKTOK_ACCESS_TOKEN}
        />
      </main>
    </div>
  );
}
