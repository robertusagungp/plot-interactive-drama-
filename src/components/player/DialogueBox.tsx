"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { getCharacterColor } from "@/lib/art-assets";
import { useI18n } from "@/lib/i18n/context";

interface DialogueBoxProps {
  speaker?: string;
  characterSlug?: string;
  text: string;
  isNarration?: boolean;
  narrationStyle?: "standard" | "internal_thought" | "cinematic_quote" | "headline";
  onAdvance: () => void;
  isChoiceActive: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  characterSlug,
  text,
  isNarration = false,
  narrationStyle = "standard",
  onAdvance,
  isChoiceActive,
}) => {
  const { t } = useI18n();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const safeText = text || "";

  // Typewriter effect with instant completion on second tap
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    const speed = 18; // ms per char

    const interval = setInterval(() => {
      index++;
      if (index <= safeText.length) {
        setDisplayedText(safeText.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [safeText]);

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChoiceActive) return;

    if (isTyping) {
      // Fast forward to complete sentence
      setDisplayedText(safeText);
      setIsTyping(false);
    } else {
      onAdvance();
    }
  };

  const palette = characterSlug ? getCharacterColor(characterSlug) : null;

  if (isNarration) {
    return (
      <div
        onClick={handleBoxClick}
        className="w-full max-w-lg mx-auto px-4 pb-6 pt-2 select-none cursor-pointer z-30"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative rounded-2xl backdrop-blur-xl border p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
            narrationStyle === "internal_thought"
              ? "bg-slate-950/80 border-cyan-500/30 text-cyan-100"
              : narrationStyle === "headline"
              ? "bg-amber-950/80 border-amber-500/40 text-amber-100 font-semibold text-center"
              : "bg-zinc-950/85 border-white/10 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {narrationStyle === "internal_thought"
                ? "Inner Monologue"
                : narrationStyle === "headline"
                ? "Breaking Bulletin"
                : "Narration"}
            </span>
          </div>

          <p
            className={`text-sm md:text-base leading-relaxed ${
              narrationStyle === "internal_thought" ? "italic" : ""
            }`}
          >
            {displayedText}
          </p>

          <div className="flex justify-end mt-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="text-white/40"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      onClick={handleBoxClick}
      className="w-full max-w-lg mx-auto px-4 pb-6 pt-2 select-none cursor-pointer z-30"
    >
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/15 p-4 md:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
      >
        {/* Speaker Badge */}
        {speaker && (
          <div className="absolute -top-3.5 left-4 flex items-center gap-2">
            <span
              className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md border"
              style={{
                backgroundColor: palette?.suit || "#18181B",
                borderColor: palette?.accent || "#3F3F46",
              }}
            >
              {speaker}
            </span>
          </div>
        )}

        {/* Dialogue Content */}
        <p className="text-zinc-100 text-sm md:text-[15px] leading-relaxed pt-1 min-h-[48px]">
          {displayedText}
        </p>

        {/* Tap indicator */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
            {isTyping ? "..." : t("tapToContinue")}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="text-zinc-400"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
