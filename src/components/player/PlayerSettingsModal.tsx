"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Zap, X, RotateCcw, HelpCircle } from "lucide-react";
import { soundManager } from "@/lib/services/audio";

interface PlayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartEpisode: () => void;
}

export const PlayerSettingsModal: React.FC<PlayerSettingsModalProps> = ({
  isOpen,
  onClose,
  onRestartEpisode,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [musicVol, setMusicVol] = useState(soundManager.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(soundManager.getSfxVolume());

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    soundManager.setMusicVolume(val);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundManager.setSfxVolume(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Story Settings
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Master Mute */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/60 border border-white/5">
                <div className="flex items-center gap-2.5">
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-sm font-medium text-zinc-200">
                    Master Sound
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    isMuted
                      ? "bg-rose-950/80 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {isMuted ? "Muted" : "Active"}
                </button>
              </div>

              {/* Music Volume Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    Background Music
                  </span>
                  <span className="font-mono">{Math.round(musicVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVol}
                  onChange={handleMusicChange}
                  className="w-full accent-rose-500 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* SFX Volume Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Sound Effects
                  </span>
                  <span className="font-mono">{Math.round(sfxVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVol}
                  onChange={handleSfxChange}
                  className="w-full accent-amber-500 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Restart Episode CTA */}
              <div className="pt-2 border-t border-white/10 mt-2">
                <button
                  onClick={() => {
                    onRestartEpisode();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart This Episode
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
