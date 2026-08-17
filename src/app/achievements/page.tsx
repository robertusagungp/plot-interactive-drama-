import { getCurrentUser } from "@/lib/auth";
import { getUserAchievements } from "@/lib/services/achievements";
import { db } from "@/lib/db";
import { Trophy, Award, Lock, Sparkles, CheckCircle2, Coins, Gem } from "lucide-react";
import Link from "next/link";

export default async function AchievementsPage() {
  const user = await getCurrentUser();

  let achievements: any[] = [];
  if (user) {
    achievements = await getUserAchievements(user.id);
  } else {
    const all = await db.achievement.findMany({ orderBy: { createdAt: "asc" } });
    achievements = all.map((a) => ({ ...a, isUnlocked: false }));
  }

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / (achievements.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>Story Achievements & Trophies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Achievements ({unlockedCount}/{achievements.length})
        </h1>
        <p className="text-xs text-zinc-400">
          Earn exclusive bonus coins and diamonds by making daring choices and unlocking alternative endings.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl flex flex-col gap-3">
        <div className="flex justify-between text-xs font-bold text-zinc-300">
          <span>Overall Completion</span>
          <span className="text-amber-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Achievements Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-5 rounded-3xl border flex items-start justify-between gap-4 transition ${
              ach.isUnlocked
                ? "bg-zinc-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20"
                : "bg-zinc-950/40 border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  ach.isUnlocked
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-zinc-800 text-zinc-600 border border-white/5"
                }`}
              >
                {ach.isUnlocked ? (
                  <Award className="w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">
                    {ach.title}
                  </h3>
                  {ach.isUnlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>

                {ach.unlockedAt && (
                  <span className="text-[10px] text-zinc-500 font-mono mt-2 block">
                    Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Rewards */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-black">
                <Coins className="w-3 h-3" />
                <span>+{ach.coinReward}</span>
              </div>
              {ach.diamondReward > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[11px] font-black">
                  <Gem className="w-3 h-3" />
                  <span>+{ach.diamondReward}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
