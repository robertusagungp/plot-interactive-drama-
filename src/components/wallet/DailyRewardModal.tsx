"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Coins, Gem, CheckCircle2, Flame } from "lucide-react";
import confetti from "canvas-confetti";

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess?: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  const [rewardData, setRewardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user?.dailyReward) {
        setRewardData(data.user.dailyReward);
      }
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setClaimMessage(null);
    }
  }, [isOpen]);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/claim-daily", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRewardData(data.status);
        setClaimMessage(
          `Claimed +${data.claimedReward.coins} Coins ${
            data.claimedReward.diamonds ? `and +${data.claimedReward.diamonds} Diamonds!` : "!"
          }`
        );
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
        if (onClaimSuccess) onClaimSuccess();
      } else {
        setClaimMessage(data.error || "Failed to claim reward");
      }
    } catch {
      setClaimMessage("Failed to claim daily reward");
    } finally {
      setLoading(false);
    }
  };

  const schedule = rewardData?.schedule || [
    { day: 1, coins: 10, diamonds: 0 },
    { day: 2, coins: 10, diamonds: 0 },
    { day: 3, coins: 15, diamonds: 1 },
    { day: 4, coins: 15, diamonds: 0 },
    { day: 5, coins: 20, diamonds: 2 },
    { day: 6, coins: 20, diamonds: 0 },
    { day: 7, coins: 50, diamonds: 5 },
  ];

  const currentDay = rewardData?.currentDay || 1;
  const isClaimable = rewardData?.isClaimable ?? true;
  const streak = rewardData?.streak || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Daily Reward</h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{streak} Day Streak</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-5">
              Check in daily to build your streak and earn free coins & diamonds!
            </p>

            {/* 7-Day Calendar Grid */}
            <div className="grid grid-cols-4 gap-2.5 mb-6">
              {schedule.slice(0, 4).map((item: any) => {
                const isPassed = item.day < currentDay || (!isClaimable && item.day === currentDay);
                const isCurrent = item.day === currentDay && isClaimable;

                return (
                  <div
                    key={item.day}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                      isCurrent
                        ? "bg-amber-950/40 border-amber-500 text-amber-200 ring-2 ring-amber-500/30"
                        : isPassed
                        ? "bg-zinc-800/40 border-white/5 opacity-60 text-zinc-400"
                        : "bg-zinc-800/80 border-white/10 text-zinc-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Day {item.day}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                      <Coins className="w-3 h-3" />
                      <span>+{item.coins}</span>
                    </div>
                    {item.diamonds > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-black text-purple-400 mt-0.5">
                        <Gem className="w-2.5 h-2.5" />
                        <span>+{item.diamonds}</span>
                      </div>
                    )}
                    {isPassed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Days 5, 6, 7 (Day 7 Highlighted) */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {schedule.slice(4, 7).map((item: any) => {
                const isPassed = item.day < currentDay || (!isClaimable && item.day === currentDay);
                const isCurrent = item.day === currentDay && isClaimable;
                const isGrandPrize = item.day === 7;

                return (
                  <div
                    key={item.day}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                      isGrandPrize
                        ? "bg-gradient-to-tr from-amber-950/60 via-purple-950/40 to-rose-950/60 border-amber-400 text-amber-100 shadow-lg"
                        : isCurrent
                        ? "bg-amber-950/40 border-amber-500 text-amber-200 ring-2 ring-amber-500/30"
                        : isPassed
                        ? "bg-zinc-800/40 border-white/5 opacity-60 text-zinc-400"
                        : "bg-zinc-800/80 border-white/10 text-zinc-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      {isGrandPrize ? "🌟 Day 7 Mega" : `Day ${item.day}`}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                      <Coins className="w-3 h-3" />
                      <span>+{item.coins}</span>
                    </div>
                    {item.diamonds > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-black text-purple-400 mt-0.5">
                        <Gem className="w-2.5 h-2.5" />
                        <span>+{item.diamonds}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {claimMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
                {claimMessage}
              </div>
            )}

            {/* Claim Action */}
            <button
              onClick={handleClaim}
              disabled={!isClaimable || loading}
              className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition shadow-lg ${
                isClaimable
                  ? "bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-950/40"
                  : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              {loading
                ? "Claiming..."
                : isClaimable
                ? `Claim Day ${currentDay} Reward`
                : "Already Claimed Today (Next reward tomorrow)"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
