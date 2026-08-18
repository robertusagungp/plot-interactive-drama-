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
  const s = slug.toLowerCase();

  const isFemale =
    s.includes("sarah") ||
    s.includes("vanessa") ||
    s.includes("minah") ||
    s.includes("ara") ||
    s.includes("yuna") ||
    s.includes("claire") ||
    s.includes("eunji") ||
    s.includes("soyeon") ||
    s.includes("jieun") ||
    s.includes("hyejin") ||
    s.includes("sooah") ||
    s.includes("seulgi") ||
    s.includes("hana") ||
    s.includes("daeun") ||
    s.includes("jiwoo") ||
    s.includes("dami") ||
    s.includes("elena") ||
    s.includes("victoria") ||
    s.includes("aurora") ||
    s.includes("seraphina") ||
    s.includes("valeria") ||
    s.includes("chaewon") ||
    s.includes("genevieve") ||
    s.includes("isla") ||
    s.includes("chloe") ||
    s.includes("cordelia") ||
    s.includes("yoon-seo");

  return (
    <motion.div
      animate={{
        scale: isSpeaking ? 1.03 : 0.98,
        y: isSpeaking ? [0, -6, 0] : [0, -2, 0],
        filter: isSpeaking
          ? "brightness(1.1) drop-shadow(0 0 25px rgba(244,63,94,0.3))"
          : "brightness(0.9) drop-shadow(0 0 10px rgba(0,0,0,0.6))",
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
            className="px-4 py-1.5 rounded-full bg-black/95 backdrop-blur-md border border-rose-500/70 shadow-[0_0_24px_rgba(244,63,94,0.65)] flex items-center gap-2"
          >
            {/* Live Audio Equalizer Waves */}
            <div className="flex items-center gap-1 h-3.5">
              <motion.div
                animate={{ height: ["4px", "14px", "4px"] }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                className="w-1 bg-gradient-to-t from-rose-600 to-rose-300 rounded-full"
              />
              <motion.div
                animate={{ height: ["14px", "6px", "14px"] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                className="w-1 bg-gradient-to-t from-rose-600 to-rose-300 rounded-full"
              />
              <motion.div
                animate={{ height: ["6px", "16px", "6px"] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                className="w-1 bg-gradient-to-t from-rose-600 to-rose-300 rounded-full"
              />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-rose-100 font-sans">
              {name}
            </span>
          </motion.div>
        )}

        {/* Dynamic Activity / Action Indicator Badge */}
        {(activity || activityText) && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3.5 py-1 rounded-full bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-xl flex items-center gap-1.5"
          >
            {getActivityIcon(activity)}
            <span className="text-xs font-bold text-amber-300 tracking-wide">
              {activityText || activity?.replace(/_/g, " ")}
            </span>
          </motion.div>
        )}
      </div>

      {/* 2. Reaction Atmospheric Particles */}
      {(reactionFx === "hearts" || expression === "happy" || expression === "embarrassed") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400"
              style={{
                left: `${30 + i * 15}%`,
                top: `${20 + (i % 2) * 15}%`,
              }}
              animate={{
                y: [0, -35, -60],
                opacity: [0, 1, 0],
                scale: [0.6, 1.3, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            >
              <Heart className="w-6 h-6 fill-current drop-shadow-[0_0_12px_#f43f5e]" />
            </motion.div>
          ))}
        </div>
      )}

      {(reactionFx === "sparks" || expression === "angry" || expression === "determined") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-amber-400"
              style={{
                left: `${25 + i * 28}%`,
                top: `${18 + i * 8}%`,
              }}
              animate={{
                scale: [0.8, 1.4, 0.8],
                rotate: [0, 25, -25, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                delay: i * 0.3,
              }}
            >
              <Zap className="w-7 h-7 fill-current drop-shadow-[0_0_15px_#f59e0b]" />
            </motion.div>
          ))}
        </div>
      )}

      {(reactionFx === "gleam" || expression === "smirk") && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute text-amber-300"
              style={{
                left: `${22 + i * 20}%`,
                top: `${15 + (i % 2) * 16}%`,
              }}
              animate={{
                scale: [0.3, 1.4, 0],
                rotate: [0, 90, 180],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                delay: i * 0.45,
                ease: "easeOut",
              }}
            >
              <Sparkles className="w-6 h-6 fill-current drop-shadow-[0_0_14px_#fde047]" />
            </motion.div>
          ))}
        </div>
      )}

      {reactionFx === "notes" && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute text-indigo-400"
              style={{
                left: `${35 + i * 14}%`,
                top: `${25 + (i % 2) * 12}%`,
              }}
              animate={{
                y: [0, -40, -80],
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                opacity: [0, 1, 0],
                scale: [0.8, 1.3, 0.9],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.3,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            >
              <Music className="w-6 h-6 drop-shadow-[0_0_10px_#818cf8]" />
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. PREMIUM WEBTOON/MANHWA VECTOR CHARACTER (HANDSOME MALE / GORGEOUS FEMALE) */}
      <svg
        viewBox="0 0 450 720"
        className="w-full h-full max-h-[82vh] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] transition-all duration-300 pointer-events-none"
        style={{ aspectRatio: "450/720", minHeight: "360px", width: "100%", height: "100%" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shading Gradients */}
          <linearGradient id={`suit-grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.suit} />
            <stop offset="60%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
          <linearGradient id={`hair-grad-${slug}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.hair} />
            <stop offset="50%" stopColor={palette.hair} />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
          <linearGradient id="skin-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2E8" />
            <stop offset="50%" stopColor="#FDDEC2" />
            <stop offset="100%" stopColor="#EAB390" />
          </linearGradient>
          <linearGradient id="skin-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8A57E" />
            <stop offset="100%" stopColor="#C47D52" />
          </linearGradient>
          <linearGradient id="lip-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
          <radialGradient id={`aura-${slug}`} cx="50%" cy="35%" r="48%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity={isSpeaking ? "0.75" : "0.35"} />
            <stop offset="70%" stopColor={palette.accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Back Glow Aura */}
        <circle cx="225" cy="240" r="190" fill={`url(#aura-${slug})`} />

        {/* ========================================================================= */}
        {/* FEMALE CHARACTER RENDERING (GORGEOUS MANHWA GODDESS) */}
        {/* ========================================================================= */}
        {isFemale ? (
          <g id="female-model">
            {/* Back Hair Cascades */}
            <path
              d="M 125 240 C 90 350 110 570 150 620 C 165 570 150 420 155 340 L 155 240 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            <path
              d="M 325 240 C 360 350 340 570 300 620 C 285 570 300 420 295 340 L 295 240 Z"
              fill={`url(#hair-grad-${slug})`}
            />

            {/* Torso & Elegant Haute Couture Dress */}
            <path
              d="M 140 720 L 165 430 Q 225 445 285 430 L 310 720 Z"
              fill={`url(#suit-grad-${slug})`}
              stroke="#09090B"
              strokeWidth="2.5"
            />
            {/* Off-shoulder / Chic Sweetheart Neckline */}
            <path
              d="M 175 430 Q 225 480 275 430 L 285 460 Q 225 510 165 460 Z"
              fill="#FFFFFF"
              fillOpacity="0.12"
            />
            {/* Luxury Diamond Pendant Necklace */}
            <path
              d="M 195 405 Q 225 440 255 405"
              stroke={palette.accent}
              strokeWidth="2"
              fill="none"
            />
            <polygon
              points="225,438 230,446 225,454 220,446"
              fill={palette.accent}
              filter="drop-shadow(0 0 6px #F43F5E)"
            />

            {/* Slender Graceful Neck */}
            <path d="M 200 355 L 200 415 Q 225 425 250 415 L 250 355 Z" fill="url(#skin-base)" />
            {/* Neck Shadow */}
            <path d="M 200 355 Q 225 385 250 355 L 250 375 Q 225 400 200 375 Z" fill="url(#skin-shadow)" opacity="0.4" />

            {/* Face / Jawline (V-Line Soft Manhwa Chin) */}
            <path
              d="M 165 245 C 165 340 185 375 225 375 C 265 375 285 340 285 245 C 285 155 165 155 165 245 Z"
              fill="url(#skin-base)"
              stroke="#8C4E2D"
              strokeWidth="1.2"
            />

            {/* Delicate Ears with Diamond Drop Earrings */}
            <ellipse cx="165" cy="265" rx="7" ry="14" fill="url(#skin-base)" />
            <ellipse cx="285" cy="265" rx="7" ry="14" fill="url(#skin-base)" />
            <circle cx="165" cy="282" r="3" fill={palette.accent} />
            <circle cx="285" cy="282" r="3" fill={palette.accent} />

            {/* Soft Rosy Cheek Blush */}
            <ellipse cx="185" cy="285" rx="16" ry="8" fill="#F43F5E" fillOpacity="0.4" />
            <ellipse cx="265" cy="285" rx="16" ry="8" fill="#F43F5E" fillOpacity="0.4" />

            {/* EYES with periodic natural blink animation */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.08, 1] }}
              transition={{ repeat: Infinity, duration: 4.2, times: [0, 0.94, 0.97, 1] }}
              style={{ originY: "250px", originX: "225px" }}
            >
              {/* Left Eye (Goddess Almond Eyelashes) */}
              <g id="female-left-eye">
                <path d="M 175 248 Q 195 236 215 248" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 215 248 L 220 244" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                {/* Sclera & Iris */}
                <ellipse cx="195" cy="252" rx="11" ry="8" fill="#FFFFFF" />
                <circle cx="195" cy="252" r="7.5" fill={palette.eyes} />
                <circle cx="195" cy="252" r="4.5" fill="#09090B" />
                <circle cx="197" cy="250" r="2.8" fill="#FFFFFF" />
                <circle cx="193" cy="254" r="1.2" fill="#FFFFFF" />
              </g>

              {/* Right Eye */}
              <g id="female-right-eye">
                <path d="M 235 248 Q 255 236 275 248" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 275 248 L 280 244" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                {/* Sclera & Iris */}
                <ellipse cx="255" cy="252" rx="11" ry="8" fill="#FFFFFF" />
                <circle cx="255" cy="252" r="7.5" fill={palette.eyes} />
                <circle cx="255" cy="252" r="4.5" fill="#09090B" />
                <circle cx="257" cy="250" r="2.8" fill="#FFFFFF" />
                <circle cx="253" cy="254" r="1.2" fill="#FFFFFF" />
              </g>
            </motion.g>

            {/* Delicate Eyebrows */}
            <path d="M 178 236 Q 195 228 214 235" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 236 235 Q 255 228 272 236" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Dainty Nose */}
            <path d="M 223 268 L 226 280 L 221 282" stroke="#A86B43" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Glossy Gradient Lips (Animated when speaking) */}
            {isSpeaking ? (
              <motion.g
                animate={{ scaleY: [1, 1.9, 1, 1.6, 1], scaleX: [1, 0.94, 1.06, 0.96, 1] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                style={{ originX: "225px", originY: "308px" }}
              >
                <ellipse cx="225" cy="308" rx="10" ry="7" fill="url(#lip-gloss)" stroke="#881337" strokeWidth="1.5" />
                <path d="M 218 306 Q 225 304 232 306" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </motion.g>
            ) : expression === "happy" ? (
              <path d="M 214 306 Q 225 320 236 306 Q 225 312 214 306" fill="url(#lip-gloss)" stroke="#9F1239" strokeWidth="1.5" />
            ) : expression === "smirk" ? (
              <path d="M 215 308 Q 225 311 237 302" stroke="#9F1239" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M 216 307 Q 225 312 234 307" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}

            {/* Front Flowing Hair (Lustrous Waves & Side Bangs) */}
            <path
              d="M 155 240 C 155 125 295 125 295 240 C 285 175 260 160 225 160 C 190 160 165 175 155 240 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            {/* Gloss Highlight Halo */}
            <ellipse cx="225" cy="180" rx="45" ry="10" fill="#FFFFFF" fillOpacity="0.32" />
            {/* Side Framing Strands */}
            <path
              d="M 165 200 Q 185 270 178 330 C 182 270 200 220 225 210 C 250 220 268 270 272 330 Q 265 270 285 200 Z"
              fill={`url(#hair-grad-${slug})`}
            />
          </g>
        ) : (
          /* ========================================================================= */
          /* MALE CHARACTER RENDERING (HANDSOME K-DRAMA CHAEBOL / IDOL / CEO) */
          /* ========================================================================= */
          <g id="male-model">
            {/* Torso & Bespoke Tailored Suit Jacket */}
            <path
              d="M 125 720 L 150 420 Q 225 440 300 420 L 325 720 Z"
              fill={`url(#suit-grad-${slug})`}
              stroke="#09090B"
              strokeWidth="3"
            />
            {/* Crisp White Shirt & Silk Necktie */}
            <polygon points="190,420 225,510 260,420" fill="#F8FAFC" />
            {/* Royal Gold/Accent Silk Tie */}
            <polygon
              points="218,440 232,440 234,580 225,600 216,580"
              fill={palette.accent}
              stroke="#09090B"
              strokeWidth="1.5"
            />
            {/* Golden Tie Bar Clip */}
            <rect x="216" y="480" width="18" height="4" rx="2" fill="#FBBF24" />

            {/* Suit Lapels */}
            <polygon points="150,420 195,540 205,440 180,420" fill={`url(#suit-grad-${slug})`} stroke="#000" strokeWidth="2" />
            <polygon points="300,420 255,540 245,440 270,420" fill={`url(#suit-grad-${slug})`} stroke="#000" strokeWidth="2" />

            {/* Masculine Chiseled Neck */}
            <path d="M 195 345 L 195 425 Q 225 438 255 425 L 255 345 Z" fill="url(#skin-base)" />
            {/* Adam's Apple & Jaw Shadow */}
            <path d="M 195 345 Q 225 380 255 345 L 255 365 Q 225 395 195 365 Z" fill="url(#skin-shadow)" opacity="0.45" />
            <path d="M 220 380 L 225 386 L 230 380" stroke="#C47D52" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Sharp Sculpted V-Line Jawline */}
            <path
              d="M 160 240 C 160 335 180 370 225 370 C 270 370 290 335 290 240 C 290 150 160 150 160 240 Z"
              fill="url(#skin-base)"
              stroke="#8C4E2D"
              strokeWidth="1.5"
            />

            {/* Ears with Silver Stud */}
            <ellipse cx="160" cy="255" rx="8" ry="16" fill="url(#skin-base)" />
            <ellipse cx="290" cy="255" rx="8" ry="16" fill="url(#skin-base)" />
            <circle cx="160" cy="268" r="2.5" fill="#E2E8F0" />

            {/* Piercing Anime Eyes with Blinking Animation */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.08, 1] }}
              transition={{ repeat: Infinity, duration: 4.2, times: [0, 0.94, 0.97, 1] }}
              style={{ originY: "246px", originX: "225px" }}
            >
              {/* Left Eye */}
              <g id="male-left-eye">
                <path d="M 172 245 Q 192 235 212 245 Q 192 258 172 245 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="192" cy="247" r="7" fill={palette.eyes} />
                <circle cx="192" cy="247" r="4.2" fill="#09090B" />
                <circle cx="194" cy="245" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Right Eye */}
              <g id="male-right-eye">
                <path d="M 238 245 Q 258 235 278 245 Q 258 258 238 245 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="258" cy="247" r="7" fill={palette.eyes} />
                <circle cx="258" cy="247" r="4.2" fill="#09090B" />
                <circle cx="260" cy="245" r="2.5" fill="#FFFFFF" />
              </g>
            </motion.g>

            {/* Intense Charismatic Eyebrows */}
            {expression === "angry" || expression === "determined" ? (
              <>
                <path d="M 168 236 L 212 242" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
                <path d="M 238 242 L 282 236" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : expression === "smirk" ? (
              <>
                <path d="M 170 234 Q 192 226 212 234" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 238 230 Q 258 220 280 230" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d="M 170 234 Q 192 228 212 235" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 238 235 Q 258 228 280 234" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* Straight Sculpted Nose */}
            <path d="M 223 255 L 227 275 L 219 278" stroke="#8C4E2D" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Handsome Masculine Lips */}
            {isSpeaking ? (
              <motion.g
                animate={{ scaleY: [1, 1.9, 1, 1.6, 1], scaleX: [1, 0.94, 1.06, 0.96, 1] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                style={{ originX: "225px", originY: "305px" }}
              >
                <ellipse cx="225" cy="305" rx="9" ry="6.5" fill="#881337" stroke="#4C0519" strokeWidth="1.5" />
                <path d="M 218 303 Q 225 301 232 303" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </motion.g>
            ) : expression === "happy" ? (
              <path d="M 215 304 Q 225 316 235 304 Q 225 310 215 304" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
            ) : expression === "smirk" ? (
              <path d="M 214 306 Q 225 310 238 298" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M 215 304 Q 225 308 235 304" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}

            {/* K-Drama Layered Curtain Bangs Hair */}
            <path
              d="M 150 230 C 150 120 300 120 300 230 C 290 170 265 150 225 150 C 185 150 160 170 150 230 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            {/* Front Bangs Strands with Center Parting */}
            <path
              d="M 155 200 Q 185 240 205 215 Q 225 245 245 210 Q 275 240 295 200 C 280 160 250 150 225 150 C 200 150 170 160 155 200 Z"
              fill={`url(#hair-grad-${slug})`}
            />
            {/* Hair Highlight Gloss Sheen */}
            <ellipse cx="225" cy="170" rx="40" ry="9" fill="#FFFFFF" fillOpacity="0.25" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
