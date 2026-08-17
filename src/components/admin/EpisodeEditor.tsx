"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  MessageSquare,
  FileText,
  GitBranch,
  TrendingUp,
  Heart,
  Image,
  Award,
} from "lucide-react";
import { StoryNodeData, StoryNodeType } from "@/lib/types/story";
import { validateEpisodeGraph } from "@/lib/services/story";
import { StoryPlayer } from "@/components/player/StoryPlayer";

interface EpisodeEditorProps {
  episodeId: string;
  storyId: string;
  storySlug: string;
  storyTitle: string;
  initialEpisode: {
    id: string;
    number: number;
    title: string;
    synopsis?: string | null;
    status: string;
    unlockType: string;
    coinPrice: number;
  };
  initialNodes: StoryNodeData[];
}

export const EpisodeEditor: React.FC<EpisodeEditorProps> = ({
  episodeId,
  storyId,
  storySlug,
  storyTitle,
  initialEpisode,
  initialNodes,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialEpisode.title);
  const [synopsis, setSynopsis] = useState(initialEpisode.synopsis || "");
  const [unlockType, setUnlockType] = useState(initialEpisode.unlockType);
  const [coinPrice, setCoinPrice] = useState(initialEpisode.coinPrice);
  const [nodes, setNodes] = useState<StoryNodeData[]>(initialNodes);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Validation
  const validation = validateEpisodeGraph(nodes);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/admin/episodes/${episodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          synopsis,
          unlockType,
          coinPrice,
          nodes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("Episode successfully saved & validated!");
        router.refresh();
      } else {
        setSaveStatus(data.error || "Save failed");
      }
    } catch {
      setSaveStatus("Failed to save episode");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNode = (type: StoryNodeType, insertIdx?: number) => {
    const newId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let defaultConfig: any = {};

    switch (type) {
      case "DIALOGUE":
        defaultConfig = {
          speaker: "Sarah Wijaya",
          characterSlug: "sarah",
          text: "What will we do next?",
          expression: "normal",
          position: "center",
        };
        break;
      case "NARRATION":
        defaultConfig = {
          text: "The tension in the room is palpable.",
          style: "standard",
        };
        break;
      case "CHOICE":
        defaultConfig = {
          prompt: "What will you choose?",
          options: [
            { id: `opt_${Date.now()}_1`, text: "Option A", nextNodeId: "" },
            { id: `opt_${Date.now()}_2`, text: "Option B", nextNodeId: "" },
          ],
        };
        break;
      case "STAT_CHANGE":
        defaultConfig = { statKey: "REVENGE", amount: 10 };
        break;
      case "RELATIONSHIP_CHANGE":
        defaultConfig = {
          characterSlug: "adrian",
          characterName: "Adrian Hartono",
          type: "love",
          amount: 10,
        };
        break;
      case "SCENE_CHANGE":
        defaultConfig = {
          backgroundSlug: "penthouse",
          musicTrack: "romantic",
          transition: "fade",
        };
        break;
      case "END_EPISODE":
        defaultConfig = {
          episodeNumber: initialEpisode.number,
          teaserText: "Next chapter: The plot thickens.",
          rewardCoins: 10,
          rewardDiamonds: 2,
        };
        break;
      case "ENDING":
        defaultConfig = {
          endingSlug: "true-love",
          endingTitle: "Heart's Surrender",
          endingType: "TRUE_LOVE",
          badgeTitle: "TRUE LOVE ENDING",
          summary: "You forged a bond that survived all deceit.",
        };
        break;
    }

    const newNode: StoryNodeData = {
      id: newId,
      nodeId: newId,
      nodeIndex: nodes.length,
      type,
      config: defaultConfig,
      nextNodeId: null,
    };

    if (insertIdx !== undefined) {
      const copy = [...nodes];
      copy.splice(insertIdx, 0, newNode);
      // Re-index
      copy.forEach((n, i) => (n.nodeIndex = i));
      setNodes(copy);
    } else {
      setNodes([...nodes, newNode]);
    }
  };

  const handleUpdateNode = (index: number, updated: Partial<StoryNodeData>) => {
    const copy = [...nodes];
    copy[index] = { ...copy[index], ...updated };
    setNodes(copy);
  };

  const handleUpdateConfig = (index: number, configUpdates: any) => {
    const copy = [...nodes];
    copy[index].config = { ...copy[index].config, ...configUpdates };
    setNodes(copy);
  };

  const handleDeleteNode = (index: number) => {
    const copy = nodes.filter((_, i) => i !== index);
    copy.forEach((n, i) => (n.nodeIndex = i));
    setNodes(copy);
  };

  const handleMoveNode = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nodes.length) return;

    const copy = [...nodes];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    copy.forEach((n, i) => (n.nodeIndex = i));
    setNodes(copy);
  };

  const handleDuplicateNode = (index: number) => {
    const source = nodes[index];
    const copyNode: StoryNodeData = {
      id: `node_${Date.now()}_copy`,
      nodeId: `node_${Date.now()}_copy`,
      nodeIndex: index + 1,
      type: source.type,
      config: JSON.parse(JSON.stringify(source.config)),
      nextNodeId: source.nextNodeId,
    };

    const nextNodes = [...nodes];
    nextNodes.splice(index + 1, 0, copyNode);
    nextNodes.forEach((n, i) => (n.nodeIndex = i));
    setNodes(nextNodes);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100 flex flex-col">
      {/* Top Action Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 border-b border-white/10 p-4 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/stories/${storyId}`}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-purple-400">
                Episode {initialEpisode.number} Editor
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">{storyTitle}</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-black text-white bg-transparent border-b border-transparent focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Validation Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              validation.isValid
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                : "bg-rose-950/80 text-rose-300 border-rose-500/40"
            }`}
          >
            {validation.isValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Graph Valid</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validation.errors.length} Graph Warnings</span>
              </>
            )}
          </div>

          {/* Preview Draft */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Preview Draft</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/50 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Episode"}</span>
          </button>
        </div>
      </header>

      {saveStatus && (
        <div className="p-3 bg-purple-950/90 border-b border-purple-500/40 text-purple-200 text-xs font-bold text-center">
          {saveStatus}
        </div>
      )}

      {/* Validation Alert Box if invalid */}
      {!validation.isValid && (
        <div className="mx-6 my-4 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex flex-col gap-1">
          <span className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Story Graph Connectivity Issues:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
            {validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Block Builder */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
        {/* Node Blocks List */}
        <div className="flex flex-col gap-3">
          {nodes.map((node, index) => {
            return (
              <div
                key={node.id || node.nodeId}
                className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-xl flex flex-col gap-3 hover:border-white/20 transition"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 border border-purple-500/40 text-purple-300">
                      {node.type}
                    </span>
                    <input
                      type="text"
                      value={node.nodeId}
                      onChange={(e) => handleUpdateNode(index, { nodeId: e.target.value })}
                      className="font-mono text-xs text-zinc-400 bg-transparent border-b border-transparent focus:border-zinc-500 outline-none w-32"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveNode(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveNode(index, "down")}
                      disabled={index === nodes.length - 1}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateNode(index)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNode(index)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form based on Node Type */}
                {node.type === "DIALOGUE" && (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          Speaker Name
                        </label>
                        <input
                          type="text"
                          value={node.config.speaker || ""}
                          onChange={(e) => handleUpdateConfig(index, { speaker: e.target.value })}
                          className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          Character Slug
                        </label>
                        <select
                          value={node.config.characterSlug || "sarah"}
                          onChange={(e) => handleUpdateConfig(index, { characterSlug: e.target.value })}
                          className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                        >
                          <option value="sarah">Sarah Wijaya</option>
                          <option value="adrian">Adrian Hartono</option>
                          <option value="luca">Luca</option>
                          <option value="vanessa">Vanessa</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          Expression
                        </label>
                        <select
                          value={node.config.expression || "normal"}
                          onChange={(e) => handleUpdateConfig(index, { expression: e.target.value })}
                          className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                        >
                          <option value="normal">Normal / Composed</option>
                          <option value="happy">Happy / Smiling</option>
                          <option value="sad">Sad / Pained</option>
                          <option value="angry">Angry / Furious</option>
                          <option value="shocked">Shocked</option>
                          <option value="smirk">Smirk / Arrogant</option>
                          <option value="embarrassed">Embarrassed / Blushing</option>
                          <option value="determined">Determined</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                        Dialogue Text
                      </label>
                      <textarea
                        rows={2}
                        value={node.config.text || ""}
                        onChange={(e) => handleUpdateConfig(index, { text: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {node.type === "NARRATION" && (
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                      Narration Description
                    </label>
                    <textarea
                      rows={2}
                      value={node.config.text || ""}
                      onChange={(e) => handleUpdateConfig(index, { text: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                    />
                  </div>
                )}

                {node.type === "CHOICE" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                        Choice Prompt
                      </label>
                      <input
                        type="text"
                        value={node.config.prompt || ""}
                        onChange={(e) => handleUpdateConfig(index, { prompt: e.target.value })}
                        className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-zinc-400">
                        Options ({node.config.options?.length || 0})
                      </span>
                      {node.config.options?.map((opt: any, optIdx: number) => (
                        <div
                          key={optIdx}
                          className="p-3 rounded-2xl bg-zinc-800/60 border border-white/5 flex flex-col sm:flex-row items-center gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Option text..."
                            value={opt.text || ""}
                            onChange={(e) => {
                              const opts = [...node.config.options];
                              opts[optIdx].text = e.target.value;
                              handleUpdateConfig(index, { options: opts });
                            }}
                            className="w-full sm:flex-1 p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Next Node ID"
                            value={opt.nextNodeId || ""}
                            onChange={(e) => {
                              const opts = [...node.config.options];
                              opts[optIdx].nextNodeId = e.target.value;
                              handleUpdateConfig(index, { options: opts });
                            }}
                            className="w-full sm:w-36 p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono outline-none"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              title="Coin Cost"
                              placeholder="🪙"
                              value={opt.coinCost || 0}
                              onChange={(e) => {
                                const opts = [...node.config.options];
                                opts[optIdx].coinCost = parseInt(e.target.value) || 0;
                                handleUpdateConfig(index, { options: opts });
                              }}
                              className="w-14 p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-amber-300 font-bold"
                            />
                            <input
                              type="number"
                              title="Diamond Cost"
                              placeholder="💎"
                              value={opt.diamondCost || 0}
                              onChange={(e) => {
                                const opts = [...node.config.options];
                                opts[optIdx].diamondCost = parseInt(e.target.value) || 0;
                                handleUpdateConfig(index, { options: opts });
                              }}
                              className="w-14 p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-purple-300 font-bold"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {node.type === "SCENE_CHANGE" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                        Scene Location
                      </label>
                      <select
                        value={node.config.backgroundSlug || "penthouse"}
                        onChange={(e) => handleUpdateConfig(index, { backgroundSlug: e.target.value })}
                        className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white"
                      >
                        <option value="penthouse">Adrian's Penthouse</option>
                        <option value="boardroom">Hartono Boardroom</option>
                        <option value="rain_street">Neon Rainlit Avenue</option>
                        <option value="ballroom">Grand Charity Gala</option>
                        <option value="bedroom">Master Bedroom Suite</option>
                        <option value="office">Sarah's Wijaya Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                        BGM Mood
                      </label>
                      <select
                        value={node.config.musicTrack || "romantic"}
                        onChange={(e) => handleUpdateConfig(index, { musicTrack: e.target.value })}
                        className="w-full p-2 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white"
                      >
                        <option value="romantic">Romantic (Warm ambient)</option>
                        <option value="dramatic">Dramatic (Heavy tension)</option>
                        <option value="tense">Tense (Suspenseful)</option>
                        <option value="mystery">Mystery</option>
                        <option value="triumphant">Triumphant</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Destination Next Node Pointer */}
                {node.type !== "CHOICE" && node.type !== "END_EPISODE" && node.type !== "ENDING" && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-zinc-500">Next Destination:</span>
                    <input
                      type="text"
                      placeholder="Auto (next node) or target nodeId"
                      value={node.nextNodeId || ""}
                      onChange={(e) => handleUpdateNode(index, { nextNodeId: e.target.value || null })}
                      className="p-1.5 rounded-lg bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-200 outline-none w-48"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Node Controls Toolbar */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl flex flex-col items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            Insert Story Node Block
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleAddNode("DIALOGUE")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              <span>+ Dialogue</span>
            </button>
            <button
              onClick={() => handleAddNode("NARRATION")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>+ Narration</span>
            </button>
            <button
              onClick={() => handleAddNode("CHOICE")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Choice Branch</span>
            </button>
            <button
              onClick={() => handleAddNode("SCENE_CHANGE")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <Image className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Scene & Music</span>
            </button>
            <button
              onClick={() => handleAddNode("RELATIONSHIP_CHANGE")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>+ Relationship Change</span>
            </button>
            <button
              onClick={() => handleAddNode("END_EPISODE")}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ End Episode</span>
            </button>
          </div>
        </div>
      </main>

      {/* Live Draft Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-white z-50 hover:bg-zinc-700"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full max-w-md max-h-[92vh] rounded-[36px] overflow-hidden shadow-2xl border border-white/20">
            <StoryPlayer
              storyId={storyId}
              storySlug={storySlug}
              storyTitle={storyTitle}
              episodeId={episodeId}
              episodeNumber={initialEpisode.number}
              episodeTitle={title}
              nodes={nodes}
              isUnlocked={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
