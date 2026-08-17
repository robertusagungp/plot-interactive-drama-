"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Award, Sparkles } from "lucide-react";

export interface StatNotification {
  id: string;
  type: "relationship_love" | "relationship_trust" | "stat" | "achievement";
  title: string;
  amount?: number;
  icon?: string;
}

interface StatToastProps {
  notifications: StatNotification[];
}

export const StatToast: React.FC<StatToastProps> = ({ notifications }) => {
  return (
    <div className="absolute top-16 inset-x-0 flex flex-col items-center gap-2 pointer-events-none z-50 px-4">
      <AnimatePresence>
        {notifications.map((notif) => {
          const isPositive = (notif.amount ?? 0) >= 0;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/90 border border-white/20 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            >
              {notif.type === "relationship_love" ? (
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              ) : notif.type === "relationship_trust" ? (
                <Shield className="w-4 h-4 text-sky-400 fill-sky-400" />
              ) : notif.type === "achievement" ? (
                <Award className="w-4 h-4 text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-400" />
              )}

              <span className="text-xs md:text-sm font-bold text-zinc-100">
                {notif.title}
              </span>

              {notif.amount !== undefined && (
                <span
                  className={`text-xs md:text-sm font-extrabold ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? `+${notif.amount}` : notif.amount}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
