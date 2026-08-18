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

  // Split characters by position or fallback
  const charList = Object.values(activeCharacters).filter((c) => c && c.isVisible !== false);
  const leftChars = charList.filter((c) => c.position === "left");
  const centerChars = charList.filter((c) => c.position === "center" || (!c.position && charList.length === 1));
  const rightChars = charList.filter((c) => c.position === "right");

  const effectiveBgImage = backgroundUrl || bgData.imageUrl;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 flex flex-col justify-end">
      {/* 1. Cinematic Background Layer with Ken Burns Motion */}
      <motion.div
        key={backgroundSlug + (backgroundUrl || "")}
        variants={screenOverlayVariants}
        initial="none"
        animate={getMotionVariant(backgroundEffect)}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {effectiveBgImage ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${effectiveBgImage})`,
              backgroundPosition: "center 30%",
            }}
          />
        ) : (
          <div
            className={`absolute inset-0 w-full h-full bg-gradient-to-b ${bgData.gradient}`}
          />
        )}

        {/* Ambient Scene Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Rain Streaks */}
          {bgData.svgElements === "rain" && (
            <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                  style={{
                    height: `${40 + (i % 5) * 20}px`,
                    left: `${(i * 7) % 100}%`,
                    top: "-40px",
                  }}
                  animate={{
                    y: ["0vh", "110vh"],
                    opacity: [0, 0.85, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7 + (i % 4) * 0.2,
                    delay: (i * 0.1) % 0.8,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}

          {/* Ambient Chandelier & Sparkle Rays */}
          {bgData.svgElements === "chandelier" && (
            <div className="absolute top-0 inset-x-0 flex justify-center opacity-60 pointer-events-none">
              <div className="w-80 h-44 bg-amber-400/25 blur-3xl rounded-full" />
              <div className="absolute top-2 w-48 h-32 bg-rose-400/15 blur-2xl rounded-full" />
            </div>
          )}

          {/* Ambient Stage Lights */}
          {bgData.svgElements === "stage_lights" && (
            <div className="absolute top-0 inset-x-0 flex justify-around opacity-60 pointer-events-none">
              <div className="w-40 h-96 bg-indigo-500/20 blur-3xl -rotate-12 transform origin-top" />
              <div className="w-40 h-96 bg-cyan-400/20 blur-3xl rotate-12 transform origin-top" />
            </div>
          )}
        </div>

        {/* Floating Sparkle Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-rose-400/70 shadow-[0_0_10px_#f43f5e]"
              style={{
                left: `${12 + (i * 13) % 78}%`,
                top: `${15 + (i * 14) % 65}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.2 + (i % 3),
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

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/50 pointer-events-none" />
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

      {/* 2. Character Layering Stage (Prominent & High Viewport) */}
      <div className="relative w-full h-[70vh] sm:h-[76vh] z-10 flex items-end justify-center px-2 pb-24 sm:pb-28 max-w-lg mx-auto pointer-events-none">
        {/* Single Character Mode (Centered & Dominant) */}
        {charList.length <= 1 ? (
          <div className="relative w-full max-w-[340px] h-full flex items-end justify-center z-20">
            <AnimatePresence mode="popLayout">
              {charList.map((char) => (
                <motion.div
                  key={char.slug}
                  variants={characterMotionVariants}
                  initial="idle"
                  animate={getMotionVariant(char.animation)}
                  exit="fade-out"
                  className="w-full h-full flex items-end justify-center"
                >
                  <CharacterSprite
                    slug={char.slug}
                    name={char.name}
                    expression={char.expression}
                    position={char.position || "center"}
                    customAvatarUrl={char.avatarUrl}
                    isSpeaking={char.slug === activeSpeakerSlug || true}
                    activity={char.activity}
                    activityText={char.activityTextId || char.activityTextEn}
                    reactionFx={char.reactionFx}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Multi-Character Dynamic Stage */
          <div className="relative w-full h-full flex items-end justify-between px-1">
            {/* LEFT POSITION */}
            <div className="relative w-1/2 h-full flex items-end justify-center">
              <AnimatePresence mode="popLayout">
                {leftChars.map((char) => (
                  <motion.div
                    key={char.slug}
                    variants={characterMotionVariants}
                    initial="idle"
                    animate={getMotionVariant(char.animation)}
                    exit="exit-left"
                    className={`w-full h-full flex items-end justify-center transition-all duration-300 ${
                      char.slug === activeSpeakerSlug ? "z-20 scale-105" : "z-10 brightness-85 scale-95"
                    }`}
                  >
                    <CharacterSprite
                      slug={char.slug}
                      name={char.name}
                      expression={char.expression}
                      position="left"
                      customAvatarUrl={char.avatarUrl}
                      isSpeaking={char.slug === activeSpeakerSlug}
                      activity={char.activity}
                      activityText={char.activityTextId || char.activityTextEn}
                      reactionFx={char.reactionFx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CENTER POSITION */}
            {centerChars.length > 0 && (
              <div className="relative w-1/2 h-full flex items-end justify-center z-20">
                <AnimatePresence mode="popLayout">
                  {centerChars.map((char) => (
                    <motion.div
                      key={char.slug}
                      variants={characterMotionVariants}
                      initial="idle"
                      animate={getMotionVariant(char.animation)}
                      exit="fade-out"
                      className="w-full h-full flex items-end justify-center"
                    >
                      <CharacterSprite
                        slug={char.slug}
                        name={char.name}
                        expression={char.expression}
                        position="center"
                        customAvatarUrl={char.avatarUrl}
                        isSpeaking={char.slug === activeSpeakerSlug}
                        activity={char.activity}
                        activityText={char.activityTextId || char.activityTextEn}
                        reactionFx={char.reactionFx}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* RIGHT POSITION */}
            <div className="relative w-1/2 h-full flex items-end justify-center">
              <AnimatePresence mode="popLayout">
                {rightChars.map((char) => (
                  <motion.div
                    key={char.slug}
                    variants={characterMotionVariants}
                    initial="idle"
                    animate={getMotionVariant(char.animation)}
                    exit="exit-right"
                    className={`w-full h-full flex items-end justify-center transition-all duration-300 ${
                      char.slug === activeSpeakerSlug ? "z-20 scale-105" : "z-10 brightness-85 scale-95"
                    }`}
                  >
                    <CharacterSprite
                      slug={char.slug}
                      name={char.name}
                      expression={char.expression}
                      position="right"
                      customAvatarUrl={char.avatarUrl}
                      isSpeaking={char.slug === activeSpeakerSlug}
                      activity={char.activity}
                      activityText={char.activityTextId || char.activityTextEn}
                      reactionFx={char.reactionFx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
