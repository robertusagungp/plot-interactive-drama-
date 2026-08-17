"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Lock, CheckCircle2, Coins, Sparkles } from "lucide-react";

interface EpisodeItem {
  id: string;
  number: number;
  title: string;
  synopsis?: string | null;
  unlockType: string;
  coinPrice: number;
  isUnlocked?: boolean;
  isCompleted?: boolean;
}

interface EpisodeListProps {
  storySlug: string;
  episodes: EpisodeItem[];
  userCoins?: number;
  onUnlockEpisode?: (episodeId: string) => Promise<boolean>;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  storySlug,
  episodes,
  userCoins = 100,
  onUnlockEpisode,
}) => {
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const handleUnlock = async (e: React.MouseEvent, ep: EpisodeItem) => {
    e.preventDefault();
    if (onUnlockEpisode) {
      setUnlockingId(ep.id);
      await onUnlockEpisode(ep.id);
      setUnlockingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {episodes.map((ep) => {
        const isFree = ep.unlockType === "FREE" || ep.coinPrice === 0;
        const isAccessible = isFree || ep.isUnlocked;

        return (
          <div
            key={ep.id}
            className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
              isAccessible
                ? "bg-zinc-900/80 hover:bg-zinc-850 border-white/10 hover:border-white/20"
                : "bg-zinc-950/60 border-white/5 opacity-80"
            }`}
          >
            {/* Left Episode Info */}
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  ep.isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : isAccessible
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-zinc-800 text-zinc-500 border border-white/5"
                }`}
              >
                {ep.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{ep.number}</span>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-zinc-500">
                    Episode {ep.number}
                  </span>
                  {isFree && (
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      Free
                    </span>
                  )}
                </div>

                <h4 className="text-sm md:text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                  {ep.title}
                </h4>

                {ep.synopsis && (
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {ep.synopsis}
                  </p>
                )}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              {isAccessible ? (
                <Link
                  href={`/story/${storySlug}/episode/${ep.number}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{ep.isCompleted ? "Replay" : "Play"}</span>
                </Link>
              ) : (
                <Link
                  href={`/story/${storySlug}/episode/${ep.number}`}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-amber-300 text-xs flex items-center gap-1.5 transition"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{ep.coinPrice} Coins</span>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
