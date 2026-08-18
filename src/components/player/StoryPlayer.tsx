"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Coins,
  Gem,
  Lock,
  Sparkles,
  ChevronRight,
  Play,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import {
  StoryNodeData,
  PlayerCharacterState,
  MotionPreset,
  StoryChoiceOption,
} from "@/lib/types/story";
import { evaluateAllConditions } from "@/lib/story-evaluator";
import { soundManager } from "@/lib/services/audio";
import { SceneView } from "./SceneView";
import { DialogueBox } from "./DialogueBox";
import { ChoiceOverlay } from "./ChoiceOverlay";
import { EndingScreen } from "./EndingScreen";
import { PlayerSettingsModal } from "./PlayerSettingsModal";
import { StatToast, StatNotification } from "./StatToast";
import { useI18n } from "@/lib/i18n/context";

interface StoryPlayerProps {
  storyId: string;
  storySlug: string;
  storyTitle: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  nodes: StoryNodeData[];
  initialNodeId?: string;
  initialCoins?: number;
  initialDiamonds?: number;
  initialStats?: Record<string, number>;
  initialRelationships?: Record<string, { love: number; trust: number }>;
  initialChoicesMade?: Record<string, string>;
  isUnlocked?: boolean;
  coinPrice?: number;
  onUnlockEpisode?: () => Promise<boolean>;
  onSaveProgress?: (progress: {
    episodeNumber: number;
    isCompleted: boolean;
    lastNodeId?: string;
    endingSlug?: string;
    stats: Record<string, number>;
    relationships: Record<string, { love: number; trust: number }>;
    choicesMade: Record<string, string>;
  }) => void;
  onChoiceSelected?: (choice: {
    nodeId: string;
    optionId: string;
    optionText: string;
  }) => void;
  isLoggedIn?: boolean;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  storyId,
  storySlug,
  storyTitle,
  episodeId,
  episodeNumber,
  episodeTitle,
  nodes,
  initialNodeId,
  initialCoins = 100,
  initialDiamonds = 20,
  initialStats = { REPUTATION: 50, REVENGE: 50 },
  initialRelationships = {},
  initialChoicesMade = {},
  isUnlocked = true,
  coinPrice = 0,
  onUnlockEpisode,
  onSaveProgress,
  onChoiceSelected,
  isLoggedIn = false,
}) => {
  const router = useRouter();
  const { t, locale } = useI18n();

  // Story Engine State
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    initialNodeId || nodes[0]?.nodeId || ""
  );
  const [userCoins, setUserCoins] = useState<number>(initialCoins);
  const [userDiamonds, setUserDiamonds] = useState<number>(initialDiamonds);
  const [stats, setStats] = useState<Record<string, number>>(initialStats);
  const [relationships, setRelationships] = useState<
    Record<string, { love: number; trust: number }>
  >(initialRelationships);
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>(initialChoicesMade);

  // Visual Scene State
  const [backgroundSlug, setBackgroundSlug] = useState<string>("penthouse");
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>();
  const [backgroundEffect, setBackgroundEffect] = useState<MotionPreset>("none");
  const [overlayEffect, setOverlayEffect] = useState<MotionPreset>("none");
  const [activeCharacters, setActiveCharacters] = useState<
    Record<string, PlayerCharacterState>
  >({});

  // Node & Modal State
  const [notifications, setNotifications] = useState<StatNotification[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEpisodeFinished, setIsEpisodeFinished] = useState(false);
  const [isLockedPrompt, setIsLockedPrompt] = useState(!isUnlocked);
  const [activeEnding, setActiveEnding] = useState<any | null>(null);
  const [endEpisodeConfig, setEndEpisodeConfig] = useState<any | null>(null);

  // Debouncing / Advance Lock
  const isAdvancingRef = useRef(false);

  // Node Map
  const nodeMap = useRef<Map<string, StoryNodeData>>(new Map());
  useEffect(() => {
    nodeMap.current.clear();
    nodes.forEach((n) => nodeMap.current.set(n.nodeId, n));
  }, [nodes]);

  const currentNode = nodeMap.current.get(currentNodeId) || nodes[0];

  // Helper to push floating notification
  const pushNotification = useCallback(
    (notif: Omit<StatNotification, "id">) => {
      const id = `${Date.now()}_${Math.random()}`;
      setNotifications((prev) => [...prev, { ...notif, id }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 2500);
    },
    []
  );

  // Auto-execute and advance non-interactive nodes
  useEffect(() => {
    if (currentNode) {
      executeNode(currentNode);

      const autoAdvanceTypes = [
        "SCENE_CHANGE",
        "MUSIC_CHANGE",
        "SFX",
        "STAT_CHANGE",
        "RELATIONSHIP_CHANGE",
        "DELAY",
        "JUMP",
      ];
      if (autoAdvanceTypes.includes(currentNode.type) && currentNode.nextNodeId) {
        const delay = currentNode.type === "DELAY" ? (currentNode.config?.duration || 1000) : 50;
        const timer = setTimeout(() => {
          setCurrentNodeId(currentNode.nextNodeId!);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [currentNodeId, currentNode]);

  // Execute Node Side-Effects on node transition
  const executeNode = useCallback(
    (node: StoryNodeData) => {
      if (!node) return;
      const { type, config } = node;

      switch (type) {
        case "SCENE_CHANGE": {
          if (config.backgroundSlug) setBackgroundSlug(config.backgroundSlug);
          if (config.backgroundUrl) setBackgroundUrl(config.backgroundUrl);
          if (config.musicTrack) soundManager.playBgm(config.musicTrack);
          if (config.transition) {
            setOverlayEffect(config.transition as MotionPreset);
            setTimeout(() => setOverlayEffect("none"), 600);
          }
          if (config.charactersPresent && Array.isArray(config.charactersPresent)) {
            const nextActive: Record<string, PlayerCharacterState> = {};
            config.charactersPresent.forEach((cp: any) => {
              nextActive[cp.characterSlug] = {
                slug: cp.characterSlug,
                name: cp.name || cp.characterSlug,
                expression: cp.expression || "normal",
                position: cp.position || "center",
                isVisible: true,
                animation: "fade-in",
              };
            });
            setActiveCharacters(nextActive);
          }
          break;
        }

        case "DIALOGUE": {
          if (config.characterSlug) {
            setActiveCharacters((prev) => ({
              ...prev,
              [config.characterSlug]: {
                slug: config.characterSlug,
                name: config.speaker,
                expression: config.expression || "normal",
                position: config.position || "center",
                isVisible: true,
                animation: (config.characterAnimation as MotionPreset) || "pulse",
                activity: config.activity,
                activityTextId: config.activityTextId,
                activityTextEn: config.activityTextEn,
                reactionFx: config.reactionFx || "none",
              },
            }));
          }
          if (config.sfx) soundManager.playSfx(config.sfx);
          if (config.backgroundEffect) {
            setBackgroundEffect(config.backgroundEffect as MotionPreset);
          }
          break;
        }

        case "NARRATION": {
          if (config.sfx) soundManager.playSfx(config.sfx);
          if (config.backgroundEffect) {
            setBackgroundEffect(config.backgroundEffect as MotionPreset);
          }
          break;
        }

        case "MUSIC_CHANGE": {
          if (config.track) soundManager.playBgm(config.track);
          break;
        }

        case "SFX": {
          if (config.sfx) soundManager.playSfx(config.sfx);
          break;
        }

        case "STAT_CHANGE": {
          const currentVal = stats[config.statKey] ?? 50;
          const nextVal = Math.max(0, Math.min(100, currentVal + config.amount));
          setStats((prev) => ({ ...prev, [config.statKey]: nextVal }));
          soundManager.playSfx(config.amount >= 0 ? "stat_up" : "stat_down");
          pushNotification({
            type: "stat",
            title: config.notificationText || `${config.statKey}`,
            amount: config.amount,
          });
          break;
        }

        case "RELATIONSHIP_CHANGE": {
          const charSlug = config.characterSlug;
          const currentRel = relationships[charSlug] || { love: 0, trust: 0 };
          const changeType = config.type === "trust" ? "trust" : "love";
          const nextVal = Math.max(
            0,
            Math.min(100, currentRel[changeType] + config.amount)
          );

          const updated = {
            ...currentRel,
            [changeType]: nextVal,
          };
          setRelationships((prev) => ({ ...prev, [charSlug]: updated }));
          soundManager.playSfx(config.amount >= 0 ? "heartbeat_love" : "stat_down");
          pushNotification({
            type: changeType === "love" ? "relationship_love" : "relationship_trust",
            title: `${config.characterName || charSlug} ${changeType.toUpperCase()}`,
            amount: config.amount,
          });
          break;
        }

        case "END_EPISODE": {
          setIsEpisodeFinished(true);
          setEndEpisodeConfig(config);
          soundManager.playSfx("cheer");
          if (onSaveProgress) {
            onSaveProgress({
              episodeNumber,
              isCompleted: true,
              lastNodeId: node.nodeId,
              stats,
              relationships,
              choicesMade,
            });
          }
          break;
        }

        case "ENDING": {
          setActiveEnding(config);
          soundManager.playSfx("cheer");
          if (onSaveProgress) {
            onSaveProgress({
              episodeNumber,
              isCompleted: true,
              endingSlug: config.endingSlug,
              stats,
              relationships,
              choicesMade,
            });
          }
          break;
        }

        default:
          break;
      }
    },
    [stats, relationships, choicesMade, episodeNumber, onSaveProgress, pushNotification]
  );

  // Initialize first node
  useEffect(() => {
    if (currentNode) {
      executeNode(currentNode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId]);

  // Advance Story Node
  const advanceNode = useCallback(() => {
    if (isAdvancingRef.current || !currentNode) return;
    isAdvancingRef.current = true;
    setTimeout(() => {
      isAdvancingRef.current = false;
    }, 200);

    // If current node is non-interactive auto-pass node (like STAT_CHANGE or JUMP)
    if (currentNode.type === "JUMP") {
      const { targetNodeId, conditions, fallbackNodeId } = currentNode.config;
      const conditionPassed = evaluateAllConditions(conditions, {
        stats,
        relationships,
        choicesMade,
      });
      const dest = conditionPassed ? targetNodeId : fallbackNodeId || targetNodeId;
      if (dest && nodeMap.current.has(dest)) {
        setCurrentNodeId(dest);
        return;
      }
    }

    if (currentNode.nextNodeId && nodeMap.current.has(currentNode.nextNodeId)) {
      const nextId = currentNode.nextNodeId;
      setCurrentNodeId(nextId);

      // Local & Remote checkpoint saving
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `plot_progress_${storySlug}`,
          JSON.stringify({
            episodeNumber,
            currentNodeId: nextId,
            stats,
            relationships,
            choicesMade,
            updatedAt: Date.now(),
          })
        );
      }
    } else {
      // If at end of nodes, trigger completion
      setIsEpisodeFinished(true);
    }
  }, [currentNode, stats, relationships, choicesMade, storySlug, episodeNumber]);

  // Auto-advance through silent modifier nodes (STAT_CHANGE, RELATIONSHIP_CHANGE, MUSIC_CHANGE, SFX)
  useEffect(() => {
    if (!currentNode) return;
    if (
      [
        "STAT_CHANGE",
        "RELATIONSHIP_CHANGE",
        "MUSIC_CHANGE",
        "SFX",
        "JUMP",
        "DELAY",
      ].includes(currentNode.type)
    ) {
      const delayMs = currentNode.type === "DELAY" ? currentNode.config.durationMs || 1000 : 120;
      const timer = setTimeout(() => {
        advanceNode();
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [currentNode, advanceNode]);

  // Handle Choice Selection
  const handleSelectChoiceOption = async (option: StoryChoiceOption) => {
    // If choice requires currency, execute server spending
    if (option.diamondCost > 0 || option.coinCost > 0) {
      if (option.diamondCost > 0 && userDiamonds < option.diamondCost) {
        pushNotification({
          type: "stat",
          title: t("notEnoughDiamonds"),
          amount: 0,
        });
        return;
      }
      if (option.coinCost > 0 && userCoins < option.coinCost) {
        pushNotification({
          type: "stat",
          title: t("notEnoughCoins"),
          amount: 0,
        });
        return;
      }

      // Call API
      try {
        const res = await fetch("/api/story/choice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyId,
            episodeId,
            nodeId: currentNode.nodeId,
            choiceOptionId: option.id,
            choiceOptionText: option.text,
            diamondCost: option.diamondCost || 0,
            coinCost: option.coinCost || 0,
          }),
        });
        const data = await res.json();
        if (!data.success && data.error?.includes("INSUFFICIENT")) {
          pushNotification({
            type: "stat",
            title: option.diamondCost > 0 ? t("notEnoughDiamonds") : t("notEnoughCoins"),
            amount: 0,
          });
          return;
        }
        if (data.wallet) {
          if (data.wallet.diamonds !== undefined) setUserDiamonds(data.wallet.diamonds);
          if (data.wallet.coins !== undefined) setUserCoins(data.wallet.coins);
        }
      } catch {}

      if (option.diamondCost > 0) {
        setUserDiamonds((prev) => Math.max(0, prev - option.diamondCost));
        soundManager.playSfx("diamond_spent");
        pushNotification({
          type: "stat",
          title: `-${option.diamondCost} ${t("diamonds")}`,
          amount: -option.diamondCost,
        });
      }
      if (option.coinCost > 0) {
        setUserCoins((prev) => Math.max(0, prev - option.coinCost));
        soundManager.playSfx("coin_spent");
        pushNotification({
          type: "stat",
          title: `-${option.coinCost} ${t("coins")}`,
          amount: -option.coinCost,
        });
      }
    }

    // Apply Choice Effects
    if (option.effects && option.effects.length > 0) {
      option.effects.forEach((eff) => {
        if (eff.type === "stat") {
          setStats((prev) => ({
            ...prev,
            [eff.targetKey]: Math.max(0, Math.min(100, (prev[eff.targetKey] ?? 50) + eff.amount)),
          }));
          pushNotification({
            type: "stat",
            title: eff.targetKey,
            amount: eff.amount,
          });
        } else if (eff.type === "relationship_love" || eff.type === "relationship_trust") {
          const kind = eff.type === "relationship_love" ? "love" : "trust";
          setRelationships((prev) => {
            const cur = prev[eff.targetKey] || { love: 0, trust: 0 };
            return {
              ...prev,
              [eff.targetKey]: {
                ...cur,
                [kind]: Math.max(0, Math.min(100, cur[kind] + eff.amount)),
              },
            };
          });
          pushNotification({
            type: eff.type,
            title: `${eff.targetKey.toUpperCase()} ${kind.toUpperCase()}`,
            amount: eff.amount,
          });
        }
      });
    }

    // Record Choice
    const updatedChoices = { ...choicesMade, [currentNode.nodeId]: option.id };
    setChoicesMade(updatedChoices);

    if (onChoiceSelected) {
      onChoiceSelected({
        nodeId: currentNode.nodeId,
        optionId: option.id,
        optionText: option.text,
      });
    }

    // Route to destination node
    if (option.nextNodeId && nodeMap.current.has(option.nextNodeId)) {
      setCurrentNodeId(option.nextNodeId);
    } else {
      advanceNode();
    }
  };

  const handleUnlockEpisodeClick = async () => {
    if (onUnlockEpisode) {
      const ok = await onUnlockEpisode();
      if (ok) {
        setIsLockedPrompt(false);
        setUserCoins((prev) => Math.max(0, prev - coinPrice));
        soundManager.playSfx("coin_spent");
        pushNotification({
          type: "stat",
          title: `-${coinPrice} ${t("coins")}`,
          amount: -coinPrice,
        });
      }
    } else {
      try {
        const res = await fetch("/api/story/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ episodeId }),
        });
        const data = await res.json();
        if (data.success) {
          setIsLockedPrompt(false);
          if (data.remainingCoins !== undefined) {
            setUserCoins(data.remainingCoins);
          } else {
            setUserCoins((prev) => Math.max(0, prev - coinPrice));
          }
          soundManager.playSfx("coin_spent");
          pushNotification({
            type: "stat",
            title: `-${coinPrice} ${t("coins")}`,
            amount: -coinPrice,
          });
        } else {
          pushNotification({
            type: "stat",
            title: t("notEnoughCoins"),
            amount: 0,
          });
        }
      } catch {
        pushNotification({
          type: "stat",
          title: t("notEnoughCoins"),
          amount: 0,
        });
      }
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowRight" || e.code === "Enter") {
        if (currentNode?.type === "DIALOGUE" || currentNode?.type === "NARRATION") {
          advanceNode();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentNode, advanceNode]);

  // Clean up BGM on unmount
  useEffect(() => {
    return () => {
      soundManager.stopBgm();
    };
  }, []);

  // Show Ending Screen
  if (activeEnding) {
    const endingTitleStr =
      locale === "id" && activeEnding.endingTitleId
        ? activeEnding.endingTitleId
        : activeEnding.endingTitle || "The Final Truth";
    const summaryStr =
      locale === "id" && activeEnding.summaryId
        ? activeEnding.summaryId
        : activeEnding.summary || "";
    const badgeStr =
      locale === "id" && activeEnding.badgeTitleId
        ? activeEnding.badgeTitleId
        : activeEnding.badgeTitle || "ENDING REACHED";

    return (
      <EndingScreen
        storyTitle={storyTitle}
        storySlug={storySlug}
        endingTitle={endingTitleStr}
        endingType={activeEnding.endingType || "TRUE_LOVE"}
        badgeTitle={badgeStr}
        summary={summaryStr}
        stats={stats}
        relationships={relationships}
        onReplay={() => {
          setActiveEnding(null);
          setCurrentNodeId(nodes[0]?.nodeId || "");
        }}
        onRestartStory={() => {
          localStorage.removeItem(`plot_progress_${storySlug}`);
          router.push(`/story/${storySlug}`);
        }}
      />
    );
  }

  if (!nodes || nodes.length === 0 || !currentNode) {
    return (
      <div className="relative w-full h-full min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-3xl bg-zinc-900 border border-white/10 text-center flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 text-rose-400 animate-pulse" />
          <h3 className="text-lg font-black text-white">Episode Siap Dimainkan</h3>
          <p className="text-xs text-zinc-400">
            Sedang menyiapkan adegan cerita dan karakter.
          </p>
          <Link
            href={`/story/${storySlug}`}
            className="px-5 py-2.5 rounded-xl bg-rose-600 font-bold text-white text-xs"
          >
            {t("episodeGuide")}
          </Link>
        </div>
      </div>
    );
  }

  // Determine localized dialogue text
  const dialogueText =
    locale === "id" && currentNode?.config?.textId
      ? currentNode.config.textId
      : currentNode?.config?.text || "";

  const dialogueSpeaker =
    locale === "id" && currentNode?.config?.speakerId
      ? currentNode.config.speakerId
      : currentNode?.config?.speaker;

  const narrationText =
    locale === "id" && currentNode?.config?.textId
      ? currentNode.config.textId
      : currentNode?.config?.text || "";

  const choicePrompt =
    locale === "id" && currentNode?.config?.promptId
      ? currentNode.config.promptId
      : currentNode?.config?.prompt || t("makeYourChoice");

  const localizedOptions = (currentNode?.config?.options || []).map((opt: any) => ({
    ...opt,
    text: locale === "id" && opt.textId ? opt.textId : opt.text,
  }));

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden touch-manipulation select-none">
      {/* Constrained Cinematic Vertical Container on Desktop */}
      <div className="relative w-full h-full md:h-[92vh] md:max-w-[430px] md:rounded-[36px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] md:border md:border-white/15 flex flex-col justify-between bg-slate-950">
        {/* Floating Stat & Relationship Toasts */}
        <StatToast notifications={notifications} />

        {/* Top Floating HUD Bar */}
        <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          {/* Back Button */}
          <Link
            href={`/story/${storySlug}`}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition"
            aria-label="Back to story"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Episode Badge */}
          <div className="px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[11px] font-bold text-zinc-200">
            Ep. {episodeNumber}
          </div>

          {/* Currency Pill & Settings Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-bold">
              <span className="flex items-center gap-1 text-amber-400">
                <Coins className="w-3 h-3" />
                {userCoins}
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <Gem className="w-3 h-3" />
                {userDiamonds}
              </span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition"
              aria-label={t("settingsTitle")}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Locked Episode Paywall Modal */}
        {isLockedPrompt && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/90 backdrop-blur-xl">
            <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 text-center shadow-2xl flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Episode {episodeNumber}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {episodeTitle}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {t("unlockEpisodeDesc")}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  onClick={handleUnlockEpisodeClick}
                  disabled={userCoins < coinPrice}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                    userCoins >= coinPrice
                      ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-950/50"
                      : "bg-zinc-800 text-zinc-500 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>
                    {t("unlockFor")} {coinPrice} {t("coins")}
                  </span>
                </button>

                {userCoins < coinPrice && (
                  <Link
                    href="/wallet"
                    className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs text-center shadow-md transition"
                  >
                    {t("buyCoins")}
                  </Link>
                )}

                <Link
                  href={`/story/${storySlug}`}
                  className="text-xs text-zinc-400 hover:text-zinc-200 mt-1 py-1"
                >
                  {t("episodeGuide")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Scene Viewport & Tap Surface */}
        <div
          onClick={advanceNode}
          className="absolute inset-0 w-full h-full cursor-pointer"
        >
          {(() => {
            const displayCharacters: Record<string, PlayerCharacterState> = { ...activeCharacters };
            if (currentNode?.type === "DIALOGUE" && currentNode.config) {
              const charSlug = currentNode.config.characterSlug || "lead";
              displayCharacters[charSlug] = {
                slug: charSlug,
                name: (locale === "id" && currentNode.config.speakerId) ? currentNode.config.speakerId : (currentNode.config.speaker || charSlug),
                expression: currentNode.config.expression || "normal",
                position: currentNode.config.position || "center",
                isVisible: true,
                animation: "pulse",
                activity: currentNode.config.activity,
                activityTextId: currentNode.config.activityTextId,
                activityTextEn: currentNode.config.activityTextEn,
                reactionFx: currentNode.config.reactionFx || "none",
              };
            }

            return (
              <SceneView
                backgroundSlug={backgroundSlug}
                backgroundUrl={backgroundUrl}
                backgroundEffect={backgroundEffect}
                activeCharacters={displayCharacters}
                overlayEffect={overlayEffect}
                activeSpeakerSlug={currentNode?.type === "DIALOGUE" ? (currentNode?.config?.characterSlug || "lead") : undefined}
              />
            );
          })()}
        </div>

        {/* Interactive Bottom Layer: Dialogue / Narration / Choices */}
        <div className="relative z-30 mt-auto w-full">
          {/* Episode Complete Modal */}
          {isEpisodeFinished && !activeEnding && (
            <div className="p-4 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg mx-auto rounded-3xl bg-zinc-950/95 border border-emerald-500/30 p-5 backdrop-blur-2xl shadow-2xl text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {t("episodeCompletedTitle")}
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold mt-1">
                    {t("episodeCompletedReward", {
                      coins: endEpisodeConfig?.rewardCoins || 10,
                      diamonds: endEpisodeConfig?.rewardDiamonds || 2,
                    })}
                  </p>
                  {endEpisodeConfig?.teaserText && (
                    <p className="text-xs text-zinc-400 mt-2 italic">
                      "{endEpisodeConfig.teaserText}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full mt-2">
                  <button
                    onClick={() => {
                      setIsEpisodeFinished(false);
                      setCurrentNodeId(nodes[0]?.nodeId || "");
                    }}
                    className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                    title={t("restartEpisode")}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/story/${storySlug}/episode/${episodeNumber + 1}`}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-extrabold text-white text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50"
                  >
                    <span>{t("nextEpisodeButton", { num: episodeNumber + 1 })}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}

          {/* Choice Overlay */}
          {!isEpisodeFinished && currentNode?.type === "CHOICE" && (
            <ChoiceOverlay
              prompt={choicePrompt}
              options={localizedOptions}
              userCoins={userCoins}
              userDiamonds={userDiamonds}
              stats={stats}
              relationships={relationships}
              choicesMade={choicesMade}
              onSelectOption={handleSelectChoiceOption}
              onOpenWallet={() => router.push("/wallet")}
            />
          )}

          {/* Dialogue Box */}
          {!isEpisodeFinished && currentNode?.type === "DIALOGUE" && (
            <DialogueBox
              speaker={dialogueSpeaker}
              characterSlug={currentNode.config.characterSlug}
              expression={currentNode.config.expression}
              activityText={
                locale === "id" && currentNode.config.activityTextId
                  ? currentNode.config.activityTextId
                  : currentNode.config.activityTextEn || currentNode.config.activity
              }
              text={dialogueText}
              onAdvance={advanceNode}
              isChoiceActive={false}
            />
          )}

          {/* Narration Box */}
          {!isEpisodeFinished && currentNode?.type === "NARRATION" && (
            <DialogueBox
              isNarration={true}
              narrationStyle={currentNode.config.style || "standard"}
              text={narrationText}
              onAdvance={advanceNode}
              isChoiceActive={false}
            />
          )}
        </div>

        {/* Settings Modal */}
        <PlayerSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onRestartEpisode={() => {
            setCurrentNodeId(nodes[0]?.nodeId || "");
            setIsEpisodeFinished(false);
            setActiveEnding(null);
          }}
        />
      </div>
    </div>
  );
};
