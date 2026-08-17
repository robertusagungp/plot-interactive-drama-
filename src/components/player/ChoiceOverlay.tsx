"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Coins, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { StoryChoiceOption } from "@/lib/types/story";
import { evaluateAllConditions } from "@/lib/story-evaluator";
import { useI18n } from "@/lib/i18n/context";

interface ChoiceOverlayProps {
  prompt?: string;
  options: StoryChoiceOption[];
  userCoins: number;
  userDiamonds: number;
  stats: Record<string, number>;
  relationships: Record<string, { love: number; trust: number }>;
  choicesMade: Record<string, string>;
  choicePercentages?: Record<string, number>; // optionId -> percentage (0-100)
  onSelectOption: (option: StoryChoiceOption) => void;
  onOpenWallet?: () => void;
}

export const ChoiceOverlay: React.FC<ChoiceOverlayProps> = ({
  prompt,
  options,
  userCoins,
  userDiamonds,
  stats,
  relationships,
  choicesMade,
  choicePercentages,
  onSelectOption,
  onOpenWallet,
}) => {
  const { t } = useI18n();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showPercentages, setShowPercentages] = useState(false);

  const effectivePrompt = prompt || t("makeYourChoice");

  const handleSelect = (option: StoryChoiceOption) => {
    // Check condition lock
    const isUnlocked = evaluateAllConditions(option.conditions, {
      stats,
      relationships,
      choicesMade,
    });
    if (!isUnlocked) return;

    // Check currency
    if (option.coinCost > 0 && userCoins < option.coinCost) {
      if (onOpenWallet) onOpenWallet();
      return;
    }
    if (option.diamondCost > 0 && userDiamonds < option.diamondCost) {
      if (onOpenWallet) onOpenWallet();
      return;
    }

    setSelectedOptionId(option.id);
    setShowPercentages(true);

    // Give user brief moment (650ms) to see the telemetry percentage, then advance
    setTimeout(() => {
      onSelectOption(option);
    }, 700);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-6 pt-2 select-none z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-rose-500/20 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
      >
        {/* Prompt Header */}
        <div className="flex items-center justify-center gap-2 mb-4 text-center">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-300">
            {effectivePrompt}
          </h3>
          <Sparkles className="w-4 h-4 text-rose-400" />
        </div>

        {/* Option List */}
        <div className="flex flex-col gap-2.5">
          {options.map((option, index) => {
            const meetsConditions = evaluateAllConditions(option.conditions, {
              stats,
              relationships,
              choicesMade,
            });
            const hasEnoughCoins = option.coinCost === 0 || userCoins >= option.coinCost;
            const hasEnoughDiamonds =
              option.diamondCost === 0 || userDiamonds >= option.diamondCost;
            const isAffordable = hasEnoughCoins && hasEnoughDiamonds;
            const isSelected = selectedOptionId === option.id;
            const percent = choicePercentages?.[option.id] ?? (index === 0 ? 64 : 36);

            return (
              <motion.button
                key={option.id}
                whileHover={meetsConditions && isAffordable ? { scale: 1.01 } : {}}
                whileTap={meetsConditions && isAffordable ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                disabled={!meetsConditions || selectedOptionId !== null}
                className={`relative w-full text-left p-3.5 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "bg-rose-950/60 border-rose-500 text-white ring-2 ring-rose-500/40"
                    : option.isPremium || option.diamondCost > 0
                    ? "bg-gradient-to-r from-purple-950/50 via-zinc-900 to-purple-950/30 border-purple-500/40 text-purple-100 hover:border-purple-400"
                    : option.coinCost > 0
                    ? "bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/40 text-amber-100 hover:border-amber-400"
                    : "bg-zinc-900/80 border-white/10 text-zinc-100 hover:border-white/30 hover:bg-zinc-800/90"
                } ${!meetsConditions ? "opacity-40 cursor-not-allowed grayscale" : ""}`}
              >
                {/* Background percentage progress bar if revealed */}
                {showPercentages && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 opacity-20 pointer-events-none ${
                      isSelected ? "bg-rose-500" : "bg-zinc-500"
                    }`}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1">
                    {!meetsConditions ? (
                      <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    ) : isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    ) : null}

                    <span className="text-sm font-medium leading-snug">
                      {option.text}
                    </span>
                  </div>

                  {/* Cost Badges */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.diamondCost > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          hasEnoughDiamonds
                            ? "bg-purple-950/90 border-purple-400/50 text-purple-300"
                            : "bg-red-950/90 border-red-500/50 text-red-300"
                        }`}
                      >
                        <Gem className="w-3 h-3 text-purple-400" />
                        {option.diamondCost}
                      </span>
                    )}

                    {option.coinCost > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          hasEnoughCoins
                            ? "bg-amber-950/90 border-amber-400/50 text-amber-300"
                            : "bg-red-950/90 border-red-500/50 text-red-300"
                        }`}
                      >
                        <Coins className="w-3 h-3 text-amber-400" />
                        {option.coinCost}
                      </span>
                    )}

                    {/* Percentage Telemetry */}
                    {showPercentages && (
                      <span className="text-xs font-bold text-zinc-300 ml-1">
                        {percent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Condition Lock Reason */}
                {!meetsConditions && (
                  <p className="text-[11px] text-zinc-400 mt-1 pl-6">
                    {t("locked")}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
