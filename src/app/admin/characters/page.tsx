import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Users, Heart, Shield, Plus } from "lucide-react";

export default async function AdminCharactersPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const characters = await db.character.findMany({
    include: {
      story: { select: { title: true } },
      assets: true,
      _count: { select: { relationships: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Character & Cast Roster
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage character profiles, expression assets, and relationship stat tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {characters.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-black text-white">{c.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-950 border border-purple-500/40 text-purple-300">
                    {c.role.replace(/_/g, " ")}
                  </span>
                </div>

                <span className="text-xs text-purple-400 font-semibold block mb-2">
                  {c.story.title}
                </span>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {c.biography}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  {c.relationshipEnabled ? "Tracked" : "Static"}
                </span>
                <span>{c._count.relationships} active relationships</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
