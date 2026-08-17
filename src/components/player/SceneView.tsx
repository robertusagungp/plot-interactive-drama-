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
}

export const SceneView: React.FC<SceneViewProps> = ({
  backgroundSlug = "penthouse",
  backgroundUrl,
  backgroundEffect = "none",
  activeCharacters,
  overlayEffect = "none",
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
          backgroundImage: backgroundUrl
            ? `url(${backgroundUrl})`
            : undefined,
        }}
      >
        {!backgroundUrl && (
          <div className={`w-full h-full bg-gradient-to-b ${bgData.gradient} relative overflow-hidden`}>
            {/* Ambient visual elements based on scene type */}
            {bgData.svgElements === "cityline" && (
              <div className="absolute inset-x-0 bottom-0 h-2/3 opacity-30 pointer-events-none">
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
                      cx={100 + (i * 22) % 780}
                      cy={150 + ((i * 37) % 280)}
                      r="2"
                      fill={i % 3 === 0 ? "#38BDF8" : "#FBBF24"}
                      opacity={0.7}
                    />
                  ))}
                </svg>
              </div>
            )}

            {bgData.svgElements === "rain" && (
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_32px] animate-pulse" />
              </div>
            )}

            {bgData.svgElements === "chandelier" && (
              <div className="absolute top-0 inset-x-0 flex justify-center opacity-40">
                <div className="w-72 h-36 bg-amber-400/20 blur-3xl rounded-full" />
              </div>
            )}

            {/* Depth Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: bgData.overlay }}
            />
          </div>
        )}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
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
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
