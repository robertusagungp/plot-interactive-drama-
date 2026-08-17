import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-white/10 text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white">
          No Plot Twist Found
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
          The chapter or story you're looking for doesn't exist or may have been archived by the studio.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs flex items-center gap-2 transition shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Return to Discover</span>
        </Link>
      </div>
    </div>
  );
}
