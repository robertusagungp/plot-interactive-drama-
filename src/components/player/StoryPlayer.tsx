"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Coins, Gem, Sparkles, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import {
  StoryNodeData,
  PlayerCharacterState,
  MotionPreset,
  StoryChoiceOption,
} from "@/lib/types/story";
import { SceneView } from "./SceneView";
import { DialogueBox } from "./DialogueBox";
import { ChoiceOverlay } from "./ChoiceOverlay";
import { StatToast, StatNotification } from "./StatToast";
import { EndingScreen } from "./EndingScreen";
import { PlayerSettingsModal } from "./PlayerSettingsModal";
import { soundManager } from "@/lib/services/audio";
import { evaluateAllConditions } from "@/lib/story-evaluator";

interface StoryPlayerProps {
  storyId: string;
  storySlug: string;
  storyTitle: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  nodes: StoryNodeData[];
  initialCoins?: number;
  initialDiamonds?: number;
  initialStats?: Record<string, number>;
  initialRelationships?: Record<string, { love: number; trust: number }>;
  initialChoicesMade?: Record<string, string>;
  initialNodeId?: string;
  isUnlocked?: boolean;
  coinPrice?: number;
  onUnlockEpisode?: () => Promise<boolean>;
  onSaveProgress?: (data: any) => Promise<void>;
  onChoiceSelected?: (data: { nodeId: string; optionId: string; optionText: string }) => Promise<void>;
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
  initialCoins = 100,
  initialDiamonds = 20,
  initialStats = { REPUTATION: 50, REVENGE: 50 },
  initialRelationships = { adrian: { love: 10, trust: 15 }, luca: { love: 30, trust: 60 } },
  initialChoicesMade = {},
  initialNodeId,
  isUnlocked = true,
  coinPrice = 0,
  onUnlockEpisode,
  onSaveProgress,
  onChoiceSelected,
  isLoggedIn = false,
}) => {
  const router = useRouter();

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
          if (config.transition === "flash") {
            setOverlayEffect("flash");
            setTimeout(() => setOverlayEffect("none"), 400);
          }

          if (config.charactersPresent) {
            const nextChars: Record<string, PlayerCharacterState> = {};
            config.charactersPresent.forEach((cp: any) => {
              nextChars[cp.characterSlug] = {
                slug: cp.characterSlug,
                name: cp.characterSlug.toUpperCase(),
                expression: cp.expression || "normal",
                position: cp.position || "center",
                isVisible: true,
                animation: "fade-in",
              };
            });
            setActiveCharacters(nextChars);
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
    // Deduct cost atomically
    if (option.diamondCost > 0) {
      setUserDiamonds((prev) => Math.max(0, prev - option.diamondCost));
      soundManager.playSfx("diamond_spent");
    }
    if (option.coinCost > 0) {
      setUserCoins((prev) => Math.max(0, prev - option.coinCost));
      soundManager.playSfx("coin_spent");
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
      }
    } else {
      setIsLockedPrompt(false);
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
    return (
      <EndingScreen
        storyTitle={storyTitle}
        storySlug={storySlug}
        endingTitle={activeEnding.endingTitle || "The Final Truth"}
        endingType={activeEnding.endingType || "TRUE_LOVE"}
        badgeTitle={activeEnding.badgeTitle || "Ending Unlocked"}
        summary={activeEnding.summary || "You navigated the web of deceit and unlocked your destiny."}
        stats={stats}
        relationships={relationships}
        onReplay={() => {
          setActiveEnding(null);
          setCurrentNodeId(nodes[0]?.nodeId || "");
        }}
        onRestartStory={() => {
          router.push(`/story/${storySlug}`);
        }}
      />
    );
  }

  // Show Locked Episode Paywall
  if (isLockedPrompt) {
    return (
      <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Locked Episode {episodeNumber}
          </span>
          <h2 className="text-xl font-bold text-white mt-1 mb-2">{episodeTitle}</h2>
          <p className="text-sm text-zinc-300 mb-6">
            Unlock this dramatic chapter to discover what Adrian and Sarah do next.
          </p>

          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-800/80 border border-white/10 mb-6">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-base font-extrabold text-white">
              {coinPrice} Coins
            </span>
            <span className="text-xs text-zinc-400">
              (You have {userCoins} coins)
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {userCoins >= coinPrice ? (
              <button
                onClick={handleUnlockEpisodeClick}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 font-bold text-white text-sm shadow-lg shadow-amber-900/30 transition"
              >
                Unlock Episode {episodeNumber}
              </button>
            ) : (
              <Link
                href="/wallet"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Get More Coins in Wallet
              </Link>
            )}

            <Link
              href={`/story/${storySlug}`}
              className="py-2.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Return to Story Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show Episode Completion Screen
  if (isEpisodeFinished) {
    return (
      <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-white/15 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-emerald-400" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Episode {episodeNumber} Complete!
          </span>
          <h2 className="text-xl font-black text-white mt-1 mb-2">{episodeTitle}</h2>

          {endEpisodeConfig?.teaserText && (
            <p className="text-xs text-zinc-300 italic mb-5 p-3 rounded-2xl bg-black/40 border border-white/5">
              "{endEpisodeConfig.teaserText}"
            </p>
          )}

          {/* Episode Rewards */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Coins className="w-3.5 h-3.5" />
              +{endEpisodeConfig?.rewardCoins ?? 10} Coins
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Gem className="w-3.5 h-3.5" />
              +{endEpisodeConfig?.rewardDiamonds ?? 2} Diamonds
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                const nextEp = episodeNumber + 1;
                router.push(`/story/${storySlug}/episode/${nextEp}`);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-bold text-white text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue to Episode {episodeNumber + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href={`/story/${storySlug}`}
              className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-medium text-zinc-300 text-xs border border-white/10"
            >
              Back to Episodes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isChoiceNode = currentNode?.type === "CHOICE";
  const isNarrationNode = currentNode?.type === "NARRATION";
  const isDialogueNode = currentNode?.type === "DIALOGUE";

  return (
    <div className="relative w-full h-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Desktop Cinematic Frame Container (Constrained 390-430px vertical mobile viewport on desktop) */}
      <div className="relative w-full h-full md:h-[92vh] md:max-w-[420px] md:rounded-[36px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] md:border md:border-white/15 flex flex-col justify-between bg-slate-950">
        {/* Floating Stat Popups */}
        <StatToast notifications={notifications} />

        {/* Top HUD */}
        <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          <Link
            href={`/story/${storySlug}`}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition"
            aria-label="Back to story"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[11px] font-bold text-zinc-200">
            Ep. {episodeNumber}
          </div>

          <div className="flex items-center gap-2">
            {/* Wallet Quick View */}
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
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Scene Stage */}
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => {
            if (!isChoiceNode) advanceNode();
          }}
        >
          <SceneView
            backgroundSlug={backgroundSlug}
            backgroundUrl={backgroundUrl}
            backgroundEffect={backgroundEffect}
            activeCharacters={activeCharacters}
            overlayEffect={overlayEffect}
          />
        </div>

        {/* Interactive Bottom Layer */}
        <div className="relative z-30 mt-auto w-full">
          {isChoiceNode ? (
            <ChoiceOverlay
              prompt={currentNode.config.prompt}
              options={currentNode.config.options || []}
              userCoins={userCoins}
              userDiamonds={userDiamonds}
              stats={stats}
              relationships={relationships}
              choicesMade={choicesMade}
              onSelectOption={handleSelectChoiceOption}
              onOpenWallet={() => router.push("/wallet")}
            />
          ) : isNarrationNode ? (
            <DialogueBox
              isNarration={true}
              narrationStyle={currentNode.config.style}
              text={currentNode.config.text || ""}
              onAdvance={advanceNode}
              isChoiceActive={false}
            />
          ) : isDialogueNode ? (
            <DialogueBox
              speaker={currentNode.config.speaker}
              characterSlug={currentNode.config.characterSlug}
              text={currentNode.config.text || ""}
              onAdvance={advanceNode}
              isChoiceActive={false}
            />
          ) : null}
        </div>

        {/* Settings Modal */}
        <PlayerSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onRestartEpisode={() => {
            setCurrentNodeId(nodes[0]?.nodeId || "");
            setIsEpisodeFinished(false);
          }}
        />
      </div>
    </div>
  );
};
