import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import {
  Layers,
  Edit,
  Play,
  Coins,
  Gem,
  Plus,
  ArrowLeft,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default async function AdminStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const { id } = await params;
  const story = await db.story.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      episodes: {
        orderBy: { number: "asc" },
        include: { _count: { select: { nodes: true } } },
      },
      characters: true,
      statDefinitions: true,
      endings: true,
    },
  });

  if (!story) notFound();

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <Link
          href="/admin/stories"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stories</span>
        </Link>

        {/* Story Info Banner */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">{story.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-950 border border-purple-500/40 text-purple-300">
                {story.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">{story.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
              <span>{story.episodes.length} Episodes</span>
              <span>•</span>
              <span>{story.characters.length} Cast Members</span>
              <span>•</span>
              <span>{story.endings.length} Endings Configured</span>
            </div>
          </div>

          <Link
            href={`/story/${story.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-center"
          >
            <Eye className="w-4 h-4" />
            <span>Public Preview</span>
          </Link>
        </div>

        {/* Episode List */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Episodes ({story.episodes.length})</span>
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {story.episodes.map((ep) => (
              <div
                key={ep.id}
                className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-sm text-zinc-200">
                    {ep.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{ep.title}</h4>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                          ep.unlockType === "FREE"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {ep.unlockType === "FREE" ? "Free" : `${ep.coinPrice} Coins`}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {ep._count.nodes} story node blocks configured
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/episodes/${ep.id}/editor`}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Visual Node Editor</span>
                  </Link>

                  <Link
                    href={`/story/${story.slug}/episode/${ep.number}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10 transition"
                    title="Play Draft"
                  >
                    <Play className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
