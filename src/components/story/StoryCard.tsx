"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, BookOpen, Eye } from "lucide-react";

interface StoryCardProps {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage?: string | null;
  author?: string;
  genres?: { genre: { name: string; slug: string } }[];
  episodeCount?: number;
  viewCount?: number;
  featured?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  slug,
  shortDescription,
  coverImage,
  author = "PLOT Studio",
  genres = [],
  episodeCount = 10,
  viewCount = 1200,
  featured = false,
}) => {
  return (
    <Link
      href={`/story/${slug}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-zinc-900/90 border border-white/10 hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Cover Artwork Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-950">
        {coverImage ? (
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${coverImage}), linear-gradient(135deg, #451A03 0%, #1E1B4B 100%)`,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
            <Sparkles className="w-12 h-12 text-rose-400 opacity-40" />
          </div>
        )}

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          {featured ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-600/90 text-white shadow-md backdrop-blur-md">
              Featured
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md">
              {episodeCount} Episodes
            </span>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-medium text-zinc-300 border border-white/10 backdrop-blur-md">
            <Eye className="w-3 h-3 text-zinc-400" />
            <span>{viewCount}</span>
          </div>
        </div>

        {/* Floating Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-950/60 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {genres.slice(0, 2).map((g, i) => (
              <span
                key={i}
                className="text-[10px] uppercase font-bold text-rose-400 tracking-wider"
              >
                {g.genre.name}
                {i < Math.min(genres.length, 2) - 1 ? " • " : ""}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>By {author}</span>
          <span className="font-semibold text-rose-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Read <Play className="w-2.5 h-2.5 fill-current" />
          </span>
        </div>
      </div>
    </Link>
  );
};
