"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-rose-500/30 text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white">
          That plot twist wasn't supposed to happen.
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
          An unexpected narrative hiccup occurred. Don't worry, your wallet and unlocked progress are safe.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs flex items-center gap-1.5 transition shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 font-bold text-zinc-300 text-xs flex items-center gap-1.5 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
