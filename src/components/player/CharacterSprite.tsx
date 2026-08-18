"use client";

import React from "react";
import { motion } from "framer-motion";
import { getCharacterColor } from "@/lib/art-assets";
import {
  FileText,
  Smartphone,
  Heart,
  Wine,
  Sparkles,
  Zap,
  Music,
  Camera,
  Coffee,
  Activity,
  Shield,
  Crown,
} from "lucide-react";

interface CharacterSpriteProps {
  slug: string;
  name: string;
  expression?: string;
  position?: "left" | "center" | "right";
  customAvatarUrl?: string;
  className?: string;
  isSpeaking?: boolean;
  activity?: string;
  activityText?: string;
  reactionFx?: "hearts" | "sparks" | "sweat" | "camera_flash" | "gleam" | "notes" | "none";
}

function getActivityIcon(activity?: string) {
  switch (activity) {
    case "signing_contract":
    case "examining_documents":
      return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    case "phone_call":
    case "texting":
      return <Smartphone className="w-3.5 h-3.5 text-sky-400" />;
    case "holding_hand":
    case "romantic_embrace":
    case "giving_ring":
      return <Heart className="w-3.5 h-3.5 text-rose-400 fill-current animate-pulse" />;
    case "drinking_wine":
    case "champagne_toast":
      return <Wine className="w-3.5 h-3.5 text-purple-400" />;
    case "operating":
    case "medical_check":
      return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
    case "stage_singing":
    case "recording":
      return <Music className="w-3.5 h-3.5 text-indigo-400" />;
    case "camera_flash":
    case "paparazzi_escape":
      return <Camera className="w-3.5 h-3.5 text-yellow-300" />;
    case "drinking_coffee":
      return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
    case "gun_aim":
    case "bodyguard_guard":
      return <Shield className="w-3.5 h-3.5 text-red-500" />;
    case "royal_decree":
      return <Crown className="w-3.5 h-3.5 text-amber-300" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-rose-400" />;
  }
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  slug,
  name,
  expression = "normal",
  position = "center",
  customAvatarUrl,
  className = "",
  isSpeaking = false,
  activity,
  activityText,
  reactionFx = "none",
}) => {
  const palette = getCharacterColor(slug);
  const isFemale =
    slug.toLowerCase().includes("sarah") ||
    slug.toLowerCase().includes("vanessa") ||
    slug.toLowerCase().includes("minah") ||
    slug.toLowerCase().includes("ara") ||
    slug.toLowerCase().includes("yuna") ||
    slug.toLowerCase().includes("eunji") ||
    slug.toLowerCase().includes("soyeon") ||
    slug.toLowerCase().includes("jieun") ||
    slug.toLowerCase().includes("hyejin") ||
    slug.toLowerCase().includes("sooah") ||
    slug.toLowerCase().includes("seulgi") ||
    slug.toLowerCase().includes("hana") ||
    slug.toLowerCase().includes("daeun") ||
    slug.toLowerCase().includes("jiwoo") ||
    slug.toLowerCase().includes("dami");

  return (
    <motion.div
      animate={{
        scale: isSpeaking ? 1.03 : 0.98,
        y: isSpeaking ? [0, -5, 0] : [0, -1.5, 0],
        filter: isSpeaking ? "brightness(1.08)" : "brightness(0.85)",
      }}
      transition={{
        duration: isSpeaking ? 0.45 : 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative flex flex-col items-center justify-end w-full h-full select-none pointer-events-none opacity-100 ${className}`}
      style={{ opacity: 1 }}
      data-character-slug={slug}
      data-expression={expression}
      data-speaking={isSpeaking}
    >
      {/* 1. Active Speaker / Activity Floating Badge */}
      <div className="absolute top-2 sm:top-4 z-30 flex flex-col items-center gap-1 pointer-events-none">
        {/* Active Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="px-3.5 py-1 rounded-full bg-black/95 backdrop-blur-md border border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.55)] flex items-center gap-2"
          >
            {/* Live Audio Equalizer Waves */}
            <div className="flex items-center gap-0.5 h-3">
              <motion.div
                animate={{ height: ["4px", "14px", "4px"] }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                className="w-1 bg-rose-400 rounded-full"
              />
              <motion.div
                animate={{ height: ["12px", "5px", "12px"] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                className="w-1 bg-rose-400 rounded-full"
              />
              <motion.div
                animate={{ height: ["6px", "16px", "6px"] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                className="w-1 bg-rose-400 rounded-full"
              />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-200">
              {name}
            </span>
          </motion.div>
        )}

        {/* Dynamic Activity / Action Indicator Badge */}
        {(activity || activityText) && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full bg-zinc-950/95 backdrop-blur-md border border-amber-500/40 shadow-lg flex items-center gap-1.5"
          >
            {getActivityIcon(activity)}
            <span className="text-[11px] font-bold text-amber-300">
              {activityText || activity?.replace(/_/g, " ")}
            </span>
          </motion.div>
        )}
      </div>

      {/* 2. Reaction Atmospheric Particles */}
      {(reactionFx === "hearts" || expression === "happy" || expression === "embarrassed") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400"
              style={{
                left: `${35 + i * 18}%`,
                top: `${25 + (i % 2) * 15}%`,
              }}
              animate={{
                y: [0, -25, -45],
                opacity: [0, 0.9, 0],
                scale: [0.6, 1.2, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                delay: i * 0.7,
                ease: "easeOut",
              }}
            >
              <Heart className="w-5 h-5 fill-current drop-shadow-[0_0_10px_#f43f5e]" />
            </motion.div>
          ))}
        </div>
      )}

      {(reactionFx === "sparks" || expression === "angry") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute text-amber-400"
              style={{
                left: `${30 + i * 35}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                rotate: [0, 15, -15, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.4,
              }}
            >
              <Zap className="w-6 h-6 fill-current drop-shadow-[0_0_12px_#f59e0b]" />
            </motion.div>
          ))}
        </div>
      )}

      {(reactionFx === "gleam" || expression === "smirk") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-amber-300"
              style={{
                left: `${25 + i * 26}%`,
                top: `${18 + (i % 2) * 14}%`,
              }}
              animate={{
                scale: [0.4, 1.3, 0],
                rotate: [0, 90, 180],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            >
              <Sparkles className="w-5 h-5 fill-current drop-shadow-[0_0_10px_#fde047]" />
            </motion.div>
          ))}
        </div>
      )}

      {reactionFx === "notes" && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-indigo-400"
              style={{
                left: `${40 + i * 15}%`,
                top: `${30 + (i % 2) * 10}%`,
              }}
              animate={{
                y: [0, -35, -70],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.9],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            >
              <Music className="w-5 h-5 drop-shadow-[0_0_8px_#818cf8]" />
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. Character SVG Vector Body with Dynamic Expressions & Mouth Animation */}
      <svg
        viewBox="0 0 400 650"
        className="w-full h-full max-h-[80vh] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-all duration-300 pointer-events-none"
        style={{ aspectRatio: "400/650", minHeight: "340px", width: "100%", height: "100%" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`suit-grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.suit} />
            <stop offset="100%" stopColor="#0B0F19" />
          </linearGradient>
          <linearGradient id={`hair-grad-${slug}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.hair} />
            <stop offset="100%" stopColor="#080C14" />
          </linearGradient>
          <linearGradient id="skin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDDEC2" />
            <stop offset="100%" stopColor="#E0B18B" />
          </linearGradient>
          <radialGradient id={`glow-${slug}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity={isSpeaking ? "0.65" : "0.25"} />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Aura / Silhouette Depth */}
        <circle cx="200" cy="220" r="170" fill={`url(#glow-${slug})`} />

        {/* Torso & Designer Suit */}
        <path
          d="M 110 650 L 130 380 Q 200 395 270 380 L 290 650 Z"
          fill={`url(#suit-grad-${slug})`}
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Inner Shirt / V-Neck / Tie */}
        {isFemale ? (
          <>
            <path d="M 160 380 Q 200 440 240 380 Z" fill="#F8FAFC" />
            <path
              d="M 175 390 Q 200 425 225 390"
              stroke={palette.accent}
              strokeWidth="2.5"
              fill="none"
            />
            <polygon
              points="200,425 204,432 200,439 196,432"
              fill={palette.accent}
            />
          </>
        ) : (
          <>
            <polygon points="170,380 200,460 230,380" fill="#F8FAFC" />
            <polygon
              points="194,395 206,395 208,520 200,535 192,520"
              fill={palette.accent}
            />
          </>
        )}

        {/* Neck */}
        <path d="M 175 340 L 175 390 Q 200 405 225 390 L 225 340 Z" fill="url(#skin-grad)" />

        {/* Head Base */}
        <path
          d="M 140 230 C 140 330 160 365 200 365 C 240 365 260 330 260 230 C 260 140 140 140 140 230 Z"
          fill="url(#skin-grad)"
          stroke="#5C3B24"
          strokeWidth="1.5"
        />

        {/* Hair - Back Layer for female */}
        {isFemale && (
          <>
            <path
              d="M 115 220 C 90 320 110 490 140 520 C 150 490 140 380 145 320 L 145 220 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            <path
              d="M 285 220 C 310 320 290 490 260 520 C 250 490 260 380 255 320 L 255 220 Z"
              fill={`url(#hair-grad-${slug})`}
            />
          </>
        )}

        {/* Ears */}
        <ellipse cx="140" cy="245" rx="8" ry="15" fill="url(#skin-grad)" />
        <ellipse cx="260" cy="245" rx="8" ry="15" fill="url(#skin-grad)" />

        {/* Blush (if happy, embarrassed, shocked) */}
        {(expression === "happy" || expression === "embarrassed" || expression === "shocked") && (
          <>
            <ellipse cx="160" cy="265" rx="14" ry="6" fill="#F43F5E" fillOpacity="0.45" />
            <ellipse cx="240" cy="265" rx="14" ry="6" fill="#F43F5E" fillOpacity="0.45" />
          </>
        )}

        {/* EYES with periodic natural blink animation */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ repeat: Infinity, duration: 4.2, times: [0, 0.94, 0.97, 1] }}
          style={{ originY: "235px", originX: "200px" }}
        >
          {/* Left Eye */}
          <g id="left-eye">
            {expression === "happy" ? (
              <path d="M 155 235 Q 170 220 185 235" stroke="#1E1B4B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ) : expression === "crying" || expression === "sad" ? (
              <>
                <path d="M 155 235 Q 170 230 185 240" stroke="#1E1B4B" strokeWidth="3" fill="none" />
                <circle cx="170" cy="236" r="6" fill={palette.eyes} />
                <circle cx="165" cy="255" r="3.5" fill="#38BDF8" fillOpacity="0.8" />
              </>
            ) : expression === "shocked" ? (
              <>
                <ellipse cx="170" cy="235" rx="12" ry="12" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
                <circle cx="170" cy="235" r="5" fill={palette.eyes} />
              </>
            ) : (
              <>
                <path d="M 152 232 Q 170 224 186 233 Q 170 244 152 232 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                <circle cx="170" cy="234" r="6.5" fill={palette.eyes} />
                <circle cx="172" cy="232" r="2.5" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g id="right-eye">
            {expression === "happy" ? (
              <path d="M 215 235 Q 230 220 245 235" stroke="#1E1B4B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ) : expression === "crying" || expression === "sad" ? (
              <>
                <path d="M 215 240 Q 230 230 245 235" stroke="#1E1B4B" strokeWidth="3" fill="none" />
                <circle cx="230" cy="236" r="6" fill={palette.eyes} />
                <circle cx="235" cy="258" r="3.5" fill="#38BDF8" fillOpacity="0.8" />
              </>
            ) : expression === "shocked" ? (
              <>
                <ellipse cx="230" cy="235" rx="12" ry="12" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
                <circle cx="230" cy="235" r="5" fill={palette.eyes} />
              </>
            ) : (
              <>
                <path d="M 214 233 Q 230 224 248 232 Q 230 244 214 233 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                <circle cx="230" cy="234" r="6.5" fill={palette.eyes} />
                <circle cx="232" cy="232" r="2.5" fill="#FFFFFF" />
              </>
            )}
          </g>
        </motion.g>

        {/* Eyebrows */}
        {expression === "angry" || expression === "determined" ? (
          <>
            <path d="M 150 224 L 185 229" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 215 229 L 250 224" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : expression === "smirk" ? (
          <>
            <path d="M 152 222 Q 170 216 186 223" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 214 216 Q 230 208 248 219" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : expression === "sad" || expression === "crying" ? (
          <>
            <path d="M 152 228 Q 170 220 186 224" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 214 224 Q 230 220 248 228" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M 152 222 Q 170 218 186 224" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 214 224 Q 230 218 248 222" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <path d="M 198 250 L 202 265 L 196 267" stroke="#A86B43" strokeWidth="2" strokeLinecap="round" />

        {/* MOUTH — Active Speaking lip movement vs static expressions */}
        {isSpeaking ? (
          <motion.g
            animate={{
              scaleY: [1, 1.8, 1, 1.5, 1],
              scaleX: [1, 0.95, 1.05, 0.95, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              ease: "easeInOut",
            }}
            style={{ originX: "200px", originY: "289px" }}
          >
            <ellipse cx="200" cy="289" rx="8" ry="6" fill="#881337" stroke="#4C0519" strokeWidth="1.5" />
            <path d="M 195 287 Q 200 285 205 287" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        ) : expression === "happy" ? (
          <path d="M 185 285 Q 200 305 215 285 Q 200 292 185 285" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
        ) : expression === "smirk" ? (
          <path d="M 188 286 Q 200 290 215 280" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : expression === "angry" || expression === "determined" ? (
          <path d="M 188 290 Q 200 284 212 290" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : expression === "sad" || expression === "crying" ? (
          <path d="M 190 292 Q 200 286 210 292" stroke="#881337" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : expression === "shocked" ? (
          <ellipse cx="200" cy="290" rx="6" ry="8" fill="#4C0519" stroke="#881337" strokeWidth="1.5" />
        ) : (
          <path d="M 190 287 Q 200 292 210 287" stroke="#881337" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Front Hair Style */}
        {isFemale ? (
          <>
            {/* Female Stylish Hair */}
            <path
              d="M 130 220 C 130 110 270 110 270 220 C 265 170 240 150 200 150 C 160 150 135 170 130 220 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            {/* Bangs & Framing Strands */}
            <path
              d="M 140 180 Q 165 240 155 270 C 160 220 180 180 200 175 C 220 180 240 220 245 270 Q 235 240 260 180 Z"
              fill={`url(#hair-grad-${slug})`}
            />
          </>
        ) : (
          <>
            {/* Male K-Drama Layered Hair */}
            <path
              d="M 130 210 C 130 120 270 120 270 210 C 260 160 240 145 200 145 C 160 145 140 160 130 210 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            {/* Bangs */}
            <path
              d="M 135 190 Q 160 225 180 200 Q 200 230 220 195 Q 245 225 265 190 C 250 160 220 150 200 150 C 180 150 150 160 135 190 Z"
              fill={`url(#hair-grad-${slug})`}
            />
          </>
        )}

        {/* Hair Highlight Sheen */}
        <ellipse cx="200" cy="165" rx="35" ry="8" fill="#FFFFFF" fillOpacity="0.25" />
      </svg>
    </motion.div>
  );
};
