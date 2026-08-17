import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Image, Music, Film, UploadCloud, Info } from "lucide-react";

export default async function AdminAssetsPage() {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

  const assets = await db.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  const blobConfigured =
    !!process.env.BLOB_READ_WRITE_TOKEN &&
    process.env.BLOB_READ_WRITE_TOKEN.startsWith("vercel_blob_");

  return (
    <div className="min-h-[90vh] flex flex-col md:flex-row bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Asset & Media Storage
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Vercel Blob cloud storage integration with local development fallback.
          </p>
        </div>

        {/* Status Alert */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {blobConfigured
                  ? "Vercel Blob Cloud Connected"
                  : "Local Vector & Web Audio Mode Active"}
              </h4>
              <p className="text-xs text-zinc-400">
                {blobConfigured
                  ? "Production assets are stored on Vercel Blob CDN."
                  : "All artwork and audio synthesize locally without external network dependencies."}
              </p>
            </div>
          </div>
        </div>

        {/* Asset Table / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Character: Adrian Hartono (Vector)", type: "CHARACTER", size: "12 KB" },
            { name: "Character: Sarah Wijaya (Vector)", type: "CHARACTER", size: "14 KB" },
            { name: "Character: Luca (Vector)", type: "CHARACTER", size: "11 KB" },
            { name: "Character: Vanessa (Vector)", type: "CHARACTER", size: "13 KB" },
            { name: "Scene: Penthouse Night (CSS/SVG)", type: "BACKGROUND", size: "8 KB" },
            { name: "Scene: Boardroom (CSS/SVG)", type: "BACKGROUND", size: "7 KB" },
            { name: "Audio: Romantic Ambient Pad (Web Audio)", type: "AUDIO_MUSIC", size: "Realtime" },
            { name: "Audio: Dramatic Tension (Web Audio)", type: "AUDIO_MUSIC", size: "Realtime" },
          ].map((asset, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-purple-400 flex items-center justify-center flex-shrink-0">
                  {asset.type.includes("AUDIO") ? (
                    <Music className="w-4 h-4" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">
                    {asset.name}
                  </h5>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {asset.type}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {asset.size}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
