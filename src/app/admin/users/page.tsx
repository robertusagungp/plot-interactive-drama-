import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";
import { UserCheck, Coins, Gem } from "lucide-react";

export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      wallet: true,
      _count: {
        select: { choices: true, episodeUnlocks: true, storyProgress: true },
      },
    },
  });

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            User Accounts & Roles
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage user permissions, review player wallets, and promote administrators safely.
          </p>
        </div>

        <div className="rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-sm text-zinc-200">
                    {u.name?.[0] || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {u.profile?.displayName || u.name || "Reader"}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        ({u.email})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Coins className="w-3 h-3" />
                        {u.wallet?.coins ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Gem className="w-3 h-3" />
                        {u.wallet?.diamonds ?? 0}
                      </span>
                      <span>•</span>
                      <span>{u._count.choices} choices made</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                  <UserRoleToggle userId={u.id} initialRole={u.role} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
