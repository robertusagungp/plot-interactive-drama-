"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Lock, CheckCircle2, Coins, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface EpisodeItem {
  id: string;
  number: number;
  title: string;
  titleId?: string | null;
  synopsis?: string | null;
  synopsisId?: string | null;
  unlockType: string;
  coinPrice: number;
  coverImage?: string | null;
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
  const { t, locale } = useI18n();
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
        const displayTitle = locale === "id" && ep.titleId ? ep.titleId : ep.title;
        const displaySynopsis = locale === "id" && ep.synopsisId ? ep.synopsisId : ep.synopsis;

        return (
          <div
            key={ep.id}
            className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all overflow-hidden ${
              isAccessible
                ? "bg-zinc-900/85 hover:bg-zinc-850 border-white/10 hover:border-rose-500/30 shadow-md"
                : "bg-zinc-950/60 border-white/5 opacity-80"
            }`}
          >
            {/* Left Episode Info with Illustration Thumbnail */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {/* Illustration Thumbnail */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10 group-hover:border-rose-500/40 transition">
                {ep.coverImage ? (
                  <img
                    src={ep.coverImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-950/60 to-zinc-900 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-zinc-600" />
                  </div>
                )}

                {/* Badge Number Overlay */}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-black text-white border border-white/10">
                  {ep.number}
                </div>

                {ep.isCompleted && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase font-bold text-zinc-400">
                    {t("episodeNumber", { num: ep.number })}
                  </span>
                  {isFree && (
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      {t("free")}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                  {displayTitle}
                </h4>

                {displaySynopsis && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {displaySynopsis}
                  </p>
                )}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {isAccessible ? (
                <Link
                  href={`/story/${storySlug}/episode/${ep.number}`}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition hover:scale-105 active:scale-95"
                >
                  {ep.isCompleted ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t("replayStory")}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t("playNow")}</span>
                    </>
                  )}
                </Link>
              ) : (
                <Link
                  href={`/story/${storySlug}/episode/${ep.number}`}
                  className="px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-amber-300 text-xs flex items-center gap-1.5 transition hover:scale-105"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>
                    {ep.coinPrice} {t("coins")}
                  </span>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
