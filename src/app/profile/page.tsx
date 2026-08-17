import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateUserWallet } from "@/lib/services/wallet";
import { getUserAchievements } from "@/lib/services/achievements";
import Link from "next/link";
import {
  User,
  Flame,
  Award,
  Coins,
  Gem,
  BookOpen,
  Sparkles,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center">
          <User className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Guest Reader</h1>
        <p className="text-xs text-zinc-400">
          Sign in or create an account to track your decisions, earn achievement rewards, and build daily check-in streaks!
        </p>
        <Link
          href="/login"
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs transition shadow-lg"
        >
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  const [wallet, profile, achievements, storyStats, choiceCount, episodeUnlockCount] =
    await Promise.all([
      getOrCreateUserWallet(user.id),
      db.profile.findUnique({ where: { userId: user.id } }),
      getUserAchievements(user.id),
      db.userStoryProgress.findMany({ where: { userId: user.id } }),
      db.userChoice.count({ where: { userId: user.id } }),
      db.episodeUnlock.count({ where: { userId: user.id } }),
    ]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const completedStoriesCount = storyStats.filter((s) => s.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-rose-950/50">
            {user.name?.[0] || "U"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">
                {profile?.displayName || user.name || "Reader"}
              </h1>
              {user.role === "ADMIN" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-950/90 text-purple-300 border border-purple-500/40">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>

            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Level {profile?.level || 1}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-rose-300">
                {profile?.streak || 0} Day Streak
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Studio</span>
            </Link>
          )}

          <LogoutButton />
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase text-zinc-500">Coins</span>
          <div className="flex items-center gap-1.5 text-xl font-black text-amber-400">
            <Coins className="w-5 h-5" />
            <span>{wallet.coins}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase text-zinc-500">Diamonds</span>
          <div className="flex items-center gap-1.5 text-xl font-black text-purple-400">
            <Gem className="w-5 h-5" />
            <span>{wallet.diamonds}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase text-zinc-500">Choices Made</span>
          <div className="flex items-center gap-1.5 text-xl font-black text-rose-400">
            <Sparkles className="w-5 h-5" />
            <span>{choiceCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase text-zinc-500">Achievements</span>
          <div className="flex items-center gap-1.5 text-xl font-black text-emerald-400">
            <Award className="w-5 h-5" />
            <span>{unlockedCount}/{achievements.length}</span>
          </div>
        </div>
      </div>

      {/* Achievements Catalog Preview */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Recent Achievements</span>
          </h2>
          <Link
            href="/achievements"
            className="text-xs font-bold text-rose-400 hover:text-rose-300"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.slice(0, 4).map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                ach.isUnlocked
                  ? "bg-zinc-900/90 border-amber-500/30"
                  : "bg-zinc-950/40 border-white/5 opacity-50"
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{ach.description}</p>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <span
                  className={`text-xs font-bold ${
                    ach.isUnlocked ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  +{ach.coinReward} Coins
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
