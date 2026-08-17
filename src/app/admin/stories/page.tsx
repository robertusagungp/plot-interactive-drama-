import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { BookOpen, Plus, Eye, Play, Sparkles, Layers } from "lucide-react";
import { CreateStoryDialog } from "@/components/admin/CreateStoryDialog";

export default async function AdminStoriesPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const stories = await db.story.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { episodes: true, userProgress: true } },
    },
  });

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Story Management
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Create, edit, publish, and manage interactive visual drama storylines.
            </p>
          </div>

          <CreateStoryDialog />
        </div>

        {/* Stories Table / Cards */}
        <div className="flex flex-col gap-3">
          {stories.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:border-purple-500/40 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-xs text-purple-300">
                  {s.title.substring(0, 3).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{s.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        s.status === "PUBLISHED"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                          : "bg-amber-950/80 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {s.status}
                    </span>
                    {s.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-950/80 text-rose-300 border border-rose-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1 max-w-lg">
                    {s.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                    <span>{s._count.episodes} Episodes</span>
                    <span>•</span>
                    <span>{s.viewCount} Views</span>
                    <span>•</span>
                    <span>Slug: /{s.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/story/${s.slug}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>

                <Link
                  href={`/admin/stories/${s.id}`}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-950/40 flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Episodes ({s._count.episodes})</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
