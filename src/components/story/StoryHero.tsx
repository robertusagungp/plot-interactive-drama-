"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, Shield, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface StoryHeroProps {
  story: {
    id: string;
    title: string;
    titleId?: string | null;
    slug: string;
    shortDescription: string;
    shortDescriptionId?: string | null;
    author: string;
    coverImage?: string | null;
    bannerImage?: string | null;
    genres?: { genre: { name: string; nameId?: string | null; slug: string } }[];
    _count?: { episodes: number; endings: number };
  };
  currentProgress?: {
    currentEpisodeNumber: number;
    isCompleted: boolean;
  } | null;
}

export const StoryHero: React.FC<StoryHeroProps> = ({ story, currentProgress }) => {
  const { t, locale } = useI18n();
  const currentEp = currentProgress?.currentEpisodeNumber || 1;
  const isStarted = !!currentProgress;

  const displayTitle = (locale === "id" && story.titleId) ? story.titleId : story.title;
  const displayDesc = (locale === "id" && story.shortDescriptionId) ? story.shortDescriptionId : story.shortDescription;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-4">
      {/* Background Banner Artwork with Cinematic Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transform pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #090A0F 0%, rgba(9, 10, 15, 0.6) 60%, transparent 100%), linear-gradient(to top, #090A0F 0%, transparent 100%), linear-gradient(135deg, #881337 0%, #1E1B4B 100%)`,
        }}
      />

      <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-6xl mx-auto">
        <div className="max-w-xl">
          {/* Top Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-rose-600/90 text-white shadow-md">
              {t("featuredBadge")}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("appName")} Interactive</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
            {displayTitle}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 line-clamp-3">
            {displayDesc}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {story.genres?.map((g, i) => {
              const gLabel = (locale === "id" && g.genre.nameId) ? g.genre.nameId : g.genre.name;
              return (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300"
                >
                  {gLabel}
                </span>
              );
            })}
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-400">
              {story._count?.episodes || 16} {t("episodes")}
            </span>
          </div>

          {/* Primary Call to Action */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/story/${story.slug}/episode/${currentEp}`}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 font-extrabold text-white text-sm sm:text-base shadow-lg shadow-rose-950/50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>
                {isStarted
                  ? `${t("continueReading")} (Ep. ${currentEp})`
                  : t("playEpisode1Free")}
              </span>
            </Link>

            <Link
              href={`/story/${story.slug}`}
              className="px-5 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 font-bold text-zinc-200 text-sm flex items-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <span>{t("episodeGuide")}</span>
            </Link>
          </div>
        </div>

        {/* Character Vignette Teaser on Desktop */}
        <div className="hidden lg:flex flex-col items-center p-5 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl max-w-xs shadow-2xl">
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">
            Main Lead
          </span>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-950 to-slate-900 border border-sky-500/30 flex items-center justify-center mb-3">
            <Shield className="w-10 h-10 text-sky-400" />
          </div>
          <h4 className="text-base font-bold text-white">Adrian Hartono</h4>
          <span className="text-xs text-zinc-400 text-center mt-1">
            "Cold, calculated, and hiding secrets that could destroy your world."
          </span>
        </div>
      </div>
    </div>
  );
};
