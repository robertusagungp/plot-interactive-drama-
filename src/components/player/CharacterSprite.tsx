"use client";

import React from "react";
import { getCharacterColor } from "@/lib/art-assets";

interface CharacterSpriteProps {
  slug: string;
  name: string;
  expression?: string;
  position?: "left" | "center" | "right";
  customAvatarUrl?: string;
  className?: string;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  slug,
  name,
  expression = "normal",
  position = "center",
  customAvatarUrl,
  className = "",
}) => {
  if (customAvatarUrl && customAvatarUrl.startsWith("http")) {
    return (
      <div className={`relative flex items-end justify-center h-full ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customAvatarUrl}
          alt={name}
          className="max-h-[85%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter brightness-95"
        />
      </div>
    );
  }

  const palette = getCharacterColor(slug);
  const isFemale = slug.toLowerCase().includes("sarah") || slug.toLowerCase().includes("vanessa");

  // Render SVG Vector Character with facial expression rendering
  return (
    <div
      className={`relative flex items-end justify-center w-full h-full select-none pointer-events-none ${className}`}
      data-character-slug={slug}
      data-expression={expression}
    >
      <svg
        viewBox="0 0 400 650"
        className="h-full max-h-[85vh] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
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
            <stop offset="0%" stopColor={palette.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Aura / Silhouette Depth */}
        <circle cx="200" cy="220" r="160" fill={`url(#glow-${slug})`} />

        {/* Torso & Designer Outfit */}
        <path
          d="M 110 650 L 130 380 Q 200 395 270 380 L 290 650 Z"
          fill={`url(#suit-grad-${slug})`}
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Collared Inner Shirt / V-Neck */}
        {isFemale ? (
          <>
            <path d="M 160 380 Q 200 440 240 380 Z" fill="#F8FAFC" />
            {/* Rose Gold Necklace */}
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
            {/* Designer Tie */}
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

        {/* Hair - Back Layer (for female / long hair) */}
        {isFemale && (
          <path
            d="M 115 220 C 90 320 110 490 140 520 C 150 490 140 380 145 320 L 145 220 Z"
            fill={`url(#hair-grad-${slug})`}
          />
        )}
        {isFemale && (
          <path
            d="M 285 220 C 310 320 290 490 260 520 C 250 490 260 380 255 320 L 255 220 Z"
            fill={`url(#hair-grad-${slug})`}
          />
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

        {/* EYES */}
        {/* Left Eye */}
        <g id="left-eye">
          {expression === "happy" ? (
            <path d="M 155 235 Q 170 220 185 235" stroke="#1E1B4B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : expression === "crying" || expression === "sad" ? (
            <>
              <path d="M 155 235 Q 170 230 185 240" stroke="#1E1B4B" strokeWidth="3" fill="none" />
              <circle cx="170" cy="236" r="6" fill={palette.eyes} />
              {/* Tear droplet */}
              <circle cx="165" cy="255" r="3.5" fill="#38BDF8" fillOpacity="0.8" />
            </>
          ) : expression === "shocked" ? (
            <>
              <ellipse cx="170" cy="235" rx="12" ry="12" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
              <circle cx="170" cy="235" r="5" fill={palette.eyes} />
            </>
          ) : (
            <>
              {/* Confident / Piercing Eye */}
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
              {/* Tear droplet */}
              <circle cx="235" cy="258" r="3.5" fill="#38BDF8" fillOpacity="0.8" />
            </>
          ) : expression === "shocked" ? (
            <>
              <ellipse cx="230" cy="235" rx="12" ry="12" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
              <circle cx="230" cy="235" r="5" fill={palette.eyes} />
            </>
          ) : (
            <>
              {/* Confident / Piercing Eye */}
              <path d="M 214 233 Q 230 224 248 232 Q 230 244 214 233 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx="230" cy="234" r="6.5" fill={palette.eyes} />
              <circle cx="232" cy="232" r="2.5" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* EYEBROWS */}
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

        {/* NOSE */}
        <path d="M 198 250 L 202 265 L 196 267" stroke="#A86B43" strokeWidth="2" strokeLinecap="round" />

        {/* MOUTH */}
        {expression === "happy" ? (
          <path d="M 185 285 Q 200 305 215 285 Q 200 292 185 285" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
        ) : expression === "smirk" ? (
          <path d="M 188 288 Q 200 286 218 280" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
        ) : expression === "shocked" ? (
          <ellipse cx="200" cy="292" rx="9" ry="12" fill="#881337" stroke="#4C0519" strokeWidth="2" />
        ) : expression === "angry" || expression === "determined" ? (
          <path d="M 186 290 L 214 290" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
        ) : expression === "sad" || expression === "crying" ? (
          <path d="M 188 293 Q 200 286 212 293" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          // Composed subtle smile/straight line
          <path d="M 190 288 Q 200 292 210 288" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* HAIR - Top / Front Styled Layer */}
        {isFemale ? (
          <path
            d="M 130 200 C 130 110 270 110 270 200 C 270 215 250 200 240 180 C 220 160 180 160 160 180 C 150 200 130 215 130 200 Z"
            fill={`url(#hair-grad-${slug})`}
          />
        ) : (
          <path
            d="M 130 210 C 130 120 270 110 270 210 C 265 190 250 160 220 155 C 190 150 160 170 130 210 Z"
            fill={`url(#hair-grad-${slug})`}
          />
        )}
      </svg>
    </div>
  );
};
