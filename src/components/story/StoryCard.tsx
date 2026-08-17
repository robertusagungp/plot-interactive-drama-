"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, Eye, Flame, Heart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { getStoryCoverArt } from "@/lib/story-covers";

interface StoryCardProps {
  id: string;
  title: string;
  titleId?: string | null;
  slug: string;
  shortDescription: string;
  shortDescriptionId?: string | null;
  coverImage?: string | null;
  author?: string;
  genres?: { genre: { name: string; nameId?: string | null; slug: string } }[];
  episodeCount?: number;
  viewCount?: number;
  featured?: boolean;
  badge?: "NEW" | "HOT" | "COMPLETED" | "ORIGINAL" | null;
  rank?: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  titleId,
  slug,
  shortDescription,
  shortDescriptionId,
  author = "PLOT Studio",
  genres = [],
  episodeCount = 16,
  viewCount = 1200,
  featured = false,
  badge,
  rank,
}) => {
  const { t, locale } = useI18n();
  const coverArt = getStoryCoverArt(slug);

  const displayTitle = locale === "id" && titleId ? titleId : title;
  const displayDesc = locale === "id" && shortDescriptionId ? shortDescriptionId : shortDescription;
  const displayTagline = locale === "id" ? coverArt.taglineId : coverArt.tagline;

  return (
    <Link
      href={`/story/${slug}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-zinc-900/90 border border-white/10 hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.7)]"
    >
      {/* Cover Artwork Poster */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-950 flex flex-col justify-between p-3.5 select-none">
        {/* Dynamic Background with Cinematic Styling */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ background: coverArt.gradient }}
        />

        {/* Ambient Glow Aura */}
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none"
          style={{ backgroundColor: coverArt.accentColor }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
          style={{ backgroundColor: coverArt.themeColor }}
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/40 pointer-events-none" />

        {/* Top Header on Poster: Rank & Badges */}
        <div className="relative z-10 flex items-start justify-between gap-1 w-full">
          {rank !== undefined ? (
            <div className="w-8 h-8 rounded-2xl bg-black/85 backdrop-blur-md border border-rose-500/60 flex items-center justify-center font-black text-white text-xs shadow-xl">
              #{rank}
            </div>
          ) : (
            <span className="text-xl filter drop-shadow-md">
              {coverArt.motif.split(" ")[0]}
            </span>
          )}

          <div className="flex items-center gap-1">
            {badge === "NEW" && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white shadow-lg">
                {t("newBadge")}
              </span>
            )}
            {badge === "HOT" && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-600 text-white shadow-lg flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5" />
                {t("hotBadge")}
              </span>
            )}
            {badge === "COMPLETED" && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-sky-600 text-white shadow-lg">
                {t("completedBadge")}
              </span>
            )}
            {featured && !badge && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-600 text-white shadow-lg">
                {t("featuredBadge")}
              </span>
            )}
          </div>
        </div>

        {/* Center Poster Title & Visual Artwork */}
        <div className="relative z-10 my-auto text-center px-1">
          <div className="text-2xl mb-1 filter drop-shadow-lg scale-110 transform transition-transform group-hover:scale-125">
            {coverArt.motif}
          </div>
          <h4 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] line-clamp-2">
            {displayTitle}
          </h4>
          <p
            className="text-[11px] font-semibold italic mt-1 line-clamp-1 opacity-90 drop-shadow"
            style={{ color: coverArt.accentColor }}
          >
            "{displayTagline}"
          </p>
        </div>

        {/* Bottom Poster Footer: Episodes & Genre */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/80 text-zinc-200 border border-white/10 backdrop-blur-md">
            {episodeCount} {t("episodes")}
          </span>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-medium text-zinc-300 border border-white/10 backdrop-blur-md">
            <Eye className="w-3 h-3 text-zinc-400" />
            <span>{viewCount}</span>
          </div>
        </div>

        {/* Floating Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-rose-950/80 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {genres.slice(0, 2).map((g, i) => {
              const genreLabel = locale === "id" && g.genre.nameId ? g.genre.nameId : g.genre.name;
              return (
                <span
                  key={i}
                  className="text-[10px] uppercase font-extrabold text-rose-400 tracking-wider"
                >
                  {genreLabel}
                  {i < Math.min(genres.length, 2) - 1 ? " • " : ""}
                </span>
              );
            })}
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {displayTitle}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>By {author}</span>
          <span className="font-semibold text-rose-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            {t("playNow")} <Play className="w-2.5 h-2.5 fill-current" />
          </span>
        </div>
      </div>
    </Link>
  );
};
