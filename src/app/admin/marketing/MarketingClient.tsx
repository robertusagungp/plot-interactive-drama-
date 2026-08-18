"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  viewCount: number;
  startCount: number;
}

interface UserAttributionItem {
  id: string;
  firstTouchSource: string | null;
  firstTouchCampaign: string | null;
  firstTouchContent: string | null;
  lastTouchSource: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
  };
}

interface MarketingClientProps {
  stories: StoryItem[];
  attributions: UserAttributionItem[];
  tiktokPixelId: string;
  hasAccessToken: boolean;
}

export const MarketingClient: React.FC<MarketingClientProps> = ({
  stories,
  attributions,
  tiktokPixelId,
  hasAccessToken,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem>(stories[0] || null);
  const [campaignAngle, setCampaignAngle] = useState<string>("contract_choice_01");
  const [trafficType, setTrafficType] = useState<"paid" | "organic">("paid");
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const getCampaignUrl = (storySlug: string, angle: string, type: "paid" | "organic") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://plot.id";
    return `${origin}/play/${storySlug}?utm_source=tiktok&utm_medium=${type}&utm_campaign=${storySlug.replace(/-/g, "_")}_${type}&utm_content=${angle}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleRunSimulation = async () => {
    setSimulationRunning(true);
    setSimulationResult(null);
    try {
      const res = await fetch("/api/admin/marketing/simulate", {
        method: "POST",
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch {
      setSimulationResult({ error: "Failed to run simulation" });
    } finally {
      setSimulationRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner: 1-Click Automated Funnel Simulator */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-zinc-950 to-purple-950/40 border border-rose-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 fill-current" />
              <span>Otomasi Pengujian E2E (End-to-End Test Engine)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Auto-Simulator Funnel Akuisisi TikTok
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Jalankan simulasi otomatis satu siklus penuh: Klik Iklan TikTok ➔ Buka /play/slug ➔ Mulai Episode 1 ➔ Buat Keputusan ➔ Selesaikan Ep 1 ➔ Registrasi Akun (Link UTM) ➔ Top Up Vault ➔ Verifikasi Pembayaran (TikTok CAPI Purchase).
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={simulationRunning}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 font-black text-white text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2.5 transition active:scale-95 disabled:opacity-50"
          >
            {simulationRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menjalankan Simulasi...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Auto-Simulasi (1-Click)</span>
              </>
            )}
          </button>
        </div>

        {/* Live Simulation Trace Results */}
        {simulationResult && (
          <div className="rounded-2xl bg-black/80 border border-white/10 p-5 font-mono text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{simulationResult.summary || "Simulasi Berhasil"}</span>
              </div>
              <span className="text-[10px] text-zinc-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {simulationResult.traceSteps?.map((step: any) => (
                <div
                  key={step.step}
                  className="p-3 rounded-xl bg-zinc-900/90 border border-white/5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] flex items-center justify-center font-black">
                        {step.step}
                      </span>
                      {step.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-tight">
                    {step.details}
                  </p>
                  <pre className="mt-1 p-2 rounded bg-black/60 text-[10px] text-zinc-300 overflow-x-auto">
                    {JSON.stringify(step.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Campaign Link Generator Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" />
              <span>Generator Link Iklan & UTM Otomatis (Instant 1-Click Copy)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Pilih judul drama dan format iklan. URL siap pakai langsung terbuat lengkap dengan UTM tag.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Story */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Pilih Drama</label>
            <select
              value={selectedStory?.slug || ""}
              onChange={(e) => {
                const s = stories.find((st) => st.slug === e.target.value);
                if (s) setSelectedStory(s);
              }}
              className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              {stories.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Select Format Angle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Format Hook Iklan</label>
            <select
              value={campaignAngle}
              onChange={(e) => setCampaignAngle(e.target.value)}
              className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              <option value="contract_choice_01">A/B Choice (Pilihan Kontrak / Menikah)</option>
              <option value="pov_shock_01">POV Shock (Terbangun / Menikah Mendadak)</option>
              <option value="revenge_dinner_01">Sassy Revenge (Pembalasan / Bos Dipecat)</option>
              <option value="tension_stage_01">Romantic Tension (Tatap Mata / Bisikan Hujan)</option>
              <option value="flex_maybach_01">Billionaire Flex (Sewa Pacar / Black Card)</option>
              <option value="chat_superstar_01">Voice Note / Chat 02:00 Subuh</option>
            </select>
          </div>

          {/* Select Traffic Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Tipe Trafik</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrafficType("paid")}
                className={`py-3 rounded-2xl text-xs font-bold transition ${
                  trafficType === "paid"
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-950/50"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                Paid Ads
              </button>
              <button
                type="button"
                onClick={() => setTrafficType("organic")}
                className={`py-3 rounded-2xl text-xs font-bold transition ${
                  trafficType === "organic"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                Organic Bio
              </button>
            </div>
          </div>
        </div>

        {/* Generated Ready-to-Copy URL Card */}
        {selectedStory && (
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                Destination URL untuk TikTok Ads Manager (Siap Pakai):
              </span>
              <p className="text-xs font-mono text-zinc-200 truncate select-all">
                {getCampaignUrl(selectedStory.slug, campaignAngle, trafficType)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    getCampaignUrl(selectedStory.slug, campaignAngle, trafficType),
                    "main_gen"
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow"
              >
                {copiedLink === "main_gen" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={getCampaignUrl(selectedStory.slug, campaignAngle, trafficType)}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                title="Buka Link Uji Coba"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Attribution Performance Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Attribution Log (Pemain yang Terdaftar dari Kampanye)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Data pendaftaran akun yang terhubung otomatis dengan kampanye iklan TikTok.
            </p>
          </div>
        </div>

        {attributions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            Belum ada data pendaftaran kampanye. Jalankan simulasi di atas untuk melihat data uji coba.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">First-Touch Source</th>
                  <th className="pb-3">Campaign</th>
                  <th className="pb-3">Content ID</th>
                  <th className="pb-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attributions.map((attr) => (
                  <tr key={attr.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3">
                      <div className="font-bold text-white">{attr.user.name || "Pemain"}</div>
                      <div className="text-[10px] text-zinc-400">{attr.user.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/30">
                        {attr.firstTouchSource || "direct"}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-zinc-300">
                      {attr.firstTouchCampaign || "none"}
                    </td>
                    <td className="py-3 font-mono text-amber-300">
                      {attr.firstTouchContent || "none"}
                    </td>
                    <td className="py-3 text-zinc-400 text-[10px]">
                      {new Date(attr.createdAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
