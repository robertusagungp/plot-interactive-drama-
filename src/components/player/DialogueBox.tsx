"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  FileText,
  Smartphone,
  Heart,
  Wine,
  Activity,
  Music,
  Camera,
  Coffee,
  Shield,
  Crown,
  Zap,
} from "lucide-react";
import { getCharacterColor } from "@/lib/art-assets";
import { useI18n } from "@/lib/i18n/context";

interface DialogueBoxProps {
  speaker?: string;
  characterSlug?: string;
  expression?: string;
  activityText?: string;
  text: string;
  isNarration?: boolean;
  narrationStyle?: "standard" | "internal_thought" | "cinematic_quote" | "headline";
  onAdvance: () => void;
  isChoiceActive: boolean;
}

function getActivityIcon(activityText?: string) {
  const lower = (activityText || "").toLowerCase();
  if (lower.includes("kontrak") || lower.includes("berkas") || lower.includes("dokumen")) {
    return <FileText className="w-3.5 h-3.5 text-amber-400" />;
  }
  if (lower.includes("chat") || lower.includes("telepon") || lower.includes("pesan") || lower.includes("smartphone")) {
    return <Smartphone className="w-3.5 h-3.5 text-sky-400" />;
  }
  if (lower.includes("cinta") || lower.includes("sayang") || lower.includes("tangan") || lower.includes("peluk") || lower.includes("cincin")) {
    return <Heart className="w-3.5 h-3.5 text-rose-400 fill-current animate-pulse" />;
  }
  if (lower.includes("wine") || lower.includes("sampanye") || lower.includes("pesta")) {
    return <Wine className="w-3.5 h-3.5 text-purple-400" />;
  }
  if (lower.includes("jantung") || lower.includes("bedah") || lower.includes("medis") || lower.includes("pasien")) {
    return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (lower.includes("mikrofon") || lower.includes("lagu") || lower.includes("panggung") || lower.includes("nyanyi")) {
    return <Music className="w-3.5 h-3.5 text-indigo-400" />;
  }
  if (lower.includes("kamera") || lower.includes("paparazzi") || lower.includes("skandal")) {
    return <Camera className="w-3.5 h-3.5 text-yellow-300" />;
  }
  if (lower.includes("kopi") || lower.includes("kafe")) {
    return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
  }
  if (lower.includes("mafia") || lower.includes("senjata") || lower.includes("tembak") || lower.includes("waspada")) {
    return <Shield className="w-3.5 h-3.5 text-red-500" />;
  }
  if (lower.includes("istana") || lower.includes("kerajaan") || lower.includes("titah")) {
    return <Crown className="w-3.5 h-3.5 text-amber-300" />;
  }
  return <Zap className="w-3.5 h-3.5 text-amber-400" />;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  characterSlug,
  expression = "normal",
  activityText,
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

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    const speed = 18;

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
      setDisplayedText(safeText);
      setIsTyping(false);
    } else {
      onAdvance();
    }
  };

  const palette = characterSlug ? getCharacterColor(characterSlug) : null;
  const isFemale =
    characterSlug &&
    (characterSlug.includes("sarah") ||
      characterSlug.includes("vanessa") ||
      characterSlug.includes("minah") ||
      characterSlug.includes("yuna") ||
      characterSlug.includes("eunji") ||
      characterSlug.includes("soyeon") ||
      characterSlug.includes("seulgi") ||
      characterSlug.includes("dami"));

  if (isNarration) {
    return (
      <div
        onClick={handleBoxClick}
        className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pb-safe select-none cursor-pointer z-30"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative rounded-2xl backdrop-blur-xl border p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
            narrationStyle === "internal_thought"
              ? "bg-slate-950/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/30"
              : narrationStyle === "headline"
              ? "bg-amber-950/90 border-amber-500/50 text-amber-100 font-semibold text-center shadow-amber-950/30"
              : "bg-zinc-950/95 border-white/15 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5 opacity-75 text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              {narrationStyle === "internal_thought"
                ? "Inner Monologue"
                : narrationStyle === "headline"
                ? "Breaking News"
                : "Narration"}
            </span>
          </div>

          <p
            className={`text-sm md:text-base leading-relaxed ${
              narrationStyle === "internal_thought" ? "italic text-cyan-50" : ""
            }`}
          >
            {displayedText}
          </p>

          <div className="flex justify-end mt-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="text-white/50"
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
      className="w-full max-w-lg mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pb-safe select-none cursor-pointer z-30"
    >
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-white/20 p-4 md:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
        style={{
          boxShadow: `0 0 30px ${palette?.accent || "#e11d48"}20, 0 20px 45px rgba(0,0,0,0.95)`,
        }}
      >
        {/* Top Header: Mini Avatar Bust + Speaker Name + Live Action Pill */}
        <div className="absolute -top-5 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Speaker Badge with Mini Animated Avatar Portrait */}
          {speaker && (
            <div className="flex items-center gap-2">
              {/* Mini Avatar Portrait */}
              <div
                className="w-10 h-10 rounded-full border-2 shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center relative flex-shrink-0"
                style={{
                  borderColor: palette?.accent || "#F43F5E",
                  boxShadow: `0 0 12px ${palette?.accent || "#F43F5E"}60`,
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id={`mini-skin-${speaker}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2E8" />
                      <stop offset="100%" stopColor="#FDDEC2" />
                    </linearGradient>
                    <linearGradient id={`mini-hair-${speaker}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={palette?.hair || "#1E293B"} />
                      <stop offset="100%" stopColor="#09090B" />
                    </linearGradient>
                  </defs>
                  {/* Head skin */}
                  <circle cx="100" cy="102" r="55" fill={`url(#mini-skin-${speaker})`} stroke="#8C4E2D" strokeWidth="1" />
                  {/* Soft Blush */}
                  <ellipse cx="80" cy="115" rx="8" ry="4" fill="#F43F5E" fillOpacity="0.35" />
                  <ellipse cx="120" cy="115" rx="8" ry="4" fill="#F43F5E" fillOpacity="0.35" />
                  {/* Hair Base */}
                  <path
                    d={
                      isFemale
                        ? "M 48 95 C 48 30 152 30 152 95 C 145 60 120 48 100 48 C 80 48 55 60 48 95 Z"
                        : "M 52 95 C 52 35 148 35 148 95 C 140 55 125 45 100 45 C 75 45 60 55 52 95 Z"
                    }
                    fill={`url(#mini-hair-${speaker})`}
                  />
                  {/* Hair Highlight */}
                  <ellipse cx="100" cy="55" rx="22" ry="5" fill="#FFFFFF" fillOpacity="0.3" />
                  {/* Eyes blinking */}
                  <motion.g
                    animate={{ scaleY: [1, 1, 0.08, 1] }}
                    transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.92, 0.96, 1] }}
                    style={{ originY: "98px", originX: "100px" }}
                  >
                    <ellipse cx="80" cy="98" rx="7" ry="6" fill="#FFFFFF" />
                    <circle cx="80" cy="98" r="5.5" fill={palette?.eyes || "#0F172A"} />
                    <circle cx="80" cy="98" r="3" fill="#09090B" />
                    <circle cx="81.5" cy="96.5" r="1.8" fill="#FFFFFF" />

                    <ellipse cx="120" cy="98" rx="7" ry="6" fill="#FFFFFF" />
                    <circle cx="120" cy="98" r="5.5" fill={palette?.eyes || "#0F172A"} />
                    <circle cx="120" cy="98" r="3" fill="#09090B" />
                    <circle cx="121.5" cy="96.5" r="1.8" fill="#FFFFFF" />

                    {/* Eyelashes / Eye Line */}
                    <path d="M 72 95 Q 80 91 89 95" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M 111 95 Q 120 91 128 95" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </motion.g>
                  {/* Eyebrows */}
                  <path d="M 72 88 L 88 91" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 112 91 L 128 88" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  {/* Nose */}
                  <path d="M 99 105 L 101 111 L 98 112" stroke="#A86B43" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  {/* Animated mouth speaking */}
                  {isTyping ? (
                    <motion.ellipse
                      cx="100"
                      cy="126"
                      rx="6.5"
                      ry="4.5"
                      fill="#881337"
                      stroke="#4C0519"
                      strokeWidth="1"
                      animate={{ ry: [2, 5.5, 2, 4.5, 2] }}
                      transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                    />
                  ) : (
                    <path d="M 93 125 Q 100 128 107 125" stroke="#9F1239" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  )}
                </svg>
              </div>

              {/* Speaker Name Pill */}
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md border flex items-center gap-1.5"
                style={{
                  backgroundColor: palette?.suit || "#18181B",
                  borderColor: palette?.accent || "#3F3F46",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: palette?.accent || "#38BDF8" }}
                />
                {speaker}
              </span>
            </div>
          )}

          {/* Activity / Action Indicator Pill */}
          {activityText && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 bg-zinc-900/95 border border-amber-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 max-w-[210px] truncate"
            >
              {getActivityIcon(activityText)}
              <span className="truncate">{activityText}</span>
            </motion.div>
          )}
        </div>

        {/* Dialogue Text Content */}
        <p className="text-zinc-100 text-[15px] sm:text-base leading-relaxed pt-3 sm:pt-2 min-h-[52px] font-medium">
          {displayedText}
        </p>

        {/* Tap to continue indicator */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase flex items-center gap-1">
            {isTyping ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Membaca dialog...</span>
              </>
            ) : (
              t("tapToContinue")
            )}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="text-rose-400"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
