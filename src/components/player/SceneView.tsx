"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerCharacterState, MotionPreset } from "@/lib/types/story";
import { SCENE_BACKGROUNDS } from "@/lib/art-assets";
import { CharacterSprite } from "./CharacterSprite";
import { characterMotionVariants, screenOverlayVariants, getMotionVariant } from "@/lib/motion";

interface SceneViewProps {
  backgroundSlug?: string;
  backgroundUrl?: string;
  backgroundEffect?: MotionPreset;
  activeCharacters: Record<string, PlayerCharacterState>;
  overlayEffect?: MotionPreset;
  activeSpeakerSlug?: string;
}

export const SceneView: React.FC<SceneViewProps> = ({
  backgroundSlug = "penthouse",
  backgroundUrl,
  backgroundEffect = "none",
  activeCharacters,
  overlayEffect = "none",
  activeSpeakerSlug,
}) => {
  const bgData = SCENE_BACKGROUNDS[backgroundSlug] || SCENE_BACKGROUNDS.penthouse;

  // Split characters by position
  const leftChars = Object.values(activeCharacters).filter(
    (c) => c.isVisible && c.position === "left"
  );
  const centerChars = Object.values(activeCharacters).filter(
    (c) => c.isVisible && c.position === "center"
  );
  const rightChars = Object.values(activeCharacters).filter(
    (c) => c.isVisible && c.position === "right"
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* Background Layer with Motion & Ambient Atmosphere */}
      <motion.div
        key={backgroundSlug + (backgroundUrl || "")}
        variants={screenOverlayVariants}
        animate={getMotionVariant(backgroundEffect)}
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        }}
      >
        {!backgroundUrl && (
          <div className={`w-full h-full bg-gradient-to-b ${bgData.gradient} relative overflow-hidden`}>
            {/* Ambient Cityline SVG */}
            {bgData.svgElements === "cityline" && (
              <div className="absolute inset-x-0 bottom-0 h-2/3 opacity-35 pointer-events-none">
                <svg viewBox="0 0 1000 500" className="w-full h-full object-cover fill-current text-sky-950">
                  <rect x="50" y="180" width="90" height="320" rx="4" fill="#0B132B" />
                  <rect x="160" y="80" width="120" height="420" rx="4" fill="#0D1B2A" />
                  <rect x="300" y="240" width="80" height="260" rx="4" fill="#1C2541" />
                  <rect x="400" y="120" width="140" height="380" rx="4" fill="#0B132B" />
                  <rect x="560" y="60" width="100" height="440" rx="4" fill="#0D1B2A" />
                  <rect x="680" y="190" width="110" height="310" rx="4" fill="#1C2541" />
                  <rect x="810" y="140" width="130" height="360" rx="4" fill="#0B132B" />
                  {/* Glowing office windows */}
                  {Array.from({ length: 45 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={100 + ((i * 22) % 780)}
                      cy={150 + ((i * 37) % 280)}
                      r="2"
                      fill={i % 3 === 0 ? "#38BDF8" : "#FBBF24"}
                      opacity={0.8}
                    />
                  ))}
                </svg>
              </div>
            )}

            {/* Ambient Rain Animation */}
            {bgData.svgElements === "rain" && (
              <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:20px_36px] animate-pulse" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                    style={{
                      height: `${40 + (i % 5) * 20}px`,
                      left: `${(i * 9) % 100}%`,
                      top: "-40px",
                    }}
                    animate={{
                      y: ["0vh", "110vh"],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (i % 4) * 0.2,
                      delay: (i * 0.1) % 0.8,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Ambient Chandelier & Sparkle Rays */}
            {bgData.svgElements === "chandelier" && (
              <div className="absolute top-0 inset-x-0 flex justify-center opacity-50 pointer-events-none">
                <div className="w-80 h-44 bg-amber-400/25 blur-3xl rounded-full" />
                <div className="absolute top-2 w-48 h-32 bg-rose-400/15 blur-2xl rounded-full" />
              </div>
            )}

            {/* Floating Sparkle Ambient Particles for all scenes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-rose-400/60 shadow-[0_0_10px_#f43f5e]"
                  style={{
                    left: `${15 + (i * 12) % 75}%`,
                    top: `${20 + (i * 15) % 65}%`,
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.2, 0.85, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (i % 3),
                    delay: (i * 0.4) % 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Depth Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: bgData.overlay }}
            />
          </div>
        )}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />
      </motion.div>

      {/* Screen Effects Overlay (Flash / Shake) */}
      <AnimatePresence>
        {overlayEffect === "flash" && (
          <motion.div
            key="flash-effect"
            variants={screenOverlayVariants}
            initial="flash"
            animate="flash"
            className="absolute inset-0 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Character Layering Stage */}
      <div className="relative w-full h-full z-10 flex items-end justify-between px-2 pb-24 md:pb-28 max-w-lg mx-auto pointer-events-none">
        {/* LEFT POSITION */}
        <div className="relative w-1/3 h-full flex items-end justify-center">
          <AnimatePresence mode="popLayout">
            {leftChars.map((char) => (
              <motion.div
                key={char.slug}
                variants={characterMotionVariants}
                initial="enter-left"
                animate={getMotionVariant(char.animation)}
                exit="exit-left"
                className="absolute bottom-0 w-full h-full flex items-end justify-center"
              >
                <CharacterSprite
                  slug={char.slug}
                  name={char.name}
                  expression={char.expression}
                  position="left"
                  customAvatarUrl={char.avatarUrl}
                  isSpeaking={char.slug === activeSpeakerSlug}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CENTER POSITION */}
        <div className="relative w-1/2 h-full flex items-end justify-center z-20">
          <AnimatePresence mode="popLayout">
            {centerChars.map((char) => (
              <motion.div
                key={char.slug}
                variants={characterMotionVariants}
                initial="initial"
                animate={getMotionVariant(char.animation)}
                exit="fade-out"
                className="absolute bottom-0 w-full h-full flex items-end justify-center"
              >
                <CharacterSprite
                  slug={char.slug}
                  name={char.name}
                  expression={char.expression}
                  position="center"
                  customAvatarUrl={char.avatarUrl}
                  isSpeaking={char.slug === activeSpeakerSlug}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT POSITION */}
        <div className="relative w-1/3 h-full flex items-end justify-center">
          <AnimatePresence mode="popLayout">
            {rightChars.map((char) => (
              <motion.div
                key={char.slug}
                variants={characterMotionVariants}
                initial="enter-right"
                animate={getMotionVariant(char.animation)}
                exit="exit-right"
                className="absolute bottom-0 w-full h-full flex items-end justify-center"
              >
                <CharacterSprite
                  slug={char.slug}
                  name={char.name}
                  expression={char.expression}
                  position="right"
                  customAvatarUrl={char.avatarUrl}
                  isSpeaking={char.slug === activeSpeakerSlug}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
