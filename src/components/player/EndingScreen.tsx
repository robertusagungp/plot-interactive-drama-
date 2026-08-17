"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Heart, RotateCcw, Share2, Sparkles, Trophy, Home } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface EndingScreenProps {
  storyTitle: string;
  storySlug: string;
  endingTitle: string;
  endingType: string;
  badgeTitle: string;
  summary: string;
  stats: Record<string, number>;
  relationships: Record<string, { love: number; trust: number }>;
  unlockedEndingsCount?: number;
  totalEndingsCount?: number;
  onReplay: () => void;
  onRestartStory: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  storyTitle,
  storySlug,
  endingTitle,
  endingType,
  badgeTitle,
  summary,
  stats,
  relationships,
  unlockedEndingsCount = 1,
  totalEndingsCount = 4,
  onReplay,
  onRestartStory,
}) => {
  useEffect(() => {
    // Launch festive confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F43F5E", "#E2B714", "#A855F7", "#38BDF8"],
      });
    } catch {}
  }, []);

  const handleShare = async () => {
    const shareText = `I unlocked the "${endingTitle}" ending in "${storyTitle}" on PLOT! What's your story?`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: shareText,
          url: window.location.origin + `/story/${storySlug}`,
        });
      } catch {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${shareText} ${window.location.origin}/story/${storySlug}`
      );
      alert("Link copied to clipboard!");
    }
  };

  const isTrueLove = endingType === "TRUE_LOVE";
  const isRevenge = endingType === "REVENGE";

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto z-50">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/40 via-zinc-950 to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-center my-auto"
      >
        {/* Badge / Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-400/40 flex items-center justify-center mb-4 shadow-lg">
          {isTrueLove ? (
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
          ) : isRevenge ? (
            <Crown className="w-8 h-8 text-amber-400" />
          ) : (
            <Trophy className="w-8 h-8 text-purple-400" />
          )}
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-300 inline-block mb-2">
          {badgeTitle}
        </span>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          {endingTitle}
        </h1>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-serif italic">
          "{summary}"
        </p>

        {/* Final Stats Summary Card */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Final Story Stats
            </span>
            <span className="text-xs text-zinc-400">
              {unlockedEndingsCount}/{totalEndingsCount} Endings Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-800/40 border border-white/5">
              <span className="text-zinc-400">Adrian Love</span>
              <span className="font-bold text-rose-400">
                {relationships.adrian?.love ?? 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-800/40 border border-white/5">
              <span className="text-zinc-400">Adrian Trust</span>
              <span className="font-bold text-sky-400">
                {relationships.adrian?.trust ?? 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-800/40 border border-white/5">
              <span className="text-zinc-400">Reputation</span>
              <span className="font-bold text-amber-400">
                {stats.REPUTATION ?? 50}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-zinc-800/40 border border-white/5">
              <span className="text-zinc-400">Revenge</span>
              <span className="font-bold text-purple-400">
                {stats.REVENGE ?? 50}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleShare}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-bold text-white shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share Your Ending
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-3 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-medium text-zinc-200 border border-white/10 flex items-center justify-center gap-1.5 text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Episode
            </button>

            <Link
              href={`/story/${storySlug}`}
              className="py-3 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-medium text-zinc-200 border border-white/10 flex items-center justify-center gap-1.5 text-xs transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              Story Menu
            </Link>
          </div>

          <button
            onClick={onRestartStory}
            className="text-[11px] text-zinc-500 hover:text-rose-400 underline underline-offset-2 mt-1 py-1"
          >
            Restart Story to unlock other endings
          </button>
        </div>
      </motion.div>
    </div>
  );
};
