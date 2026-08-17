import { z } from "zod";

export type CharacterPosition = "left" | "center" | "right";
export type CharacterExpression =
  | "normal"
  | "happy"
  | "sad"
  | "angry"
  | "shocked"
  | "embarrassed"
  | "smirk"
  | "crying"
  | "determined";

export type MotionPreset =
  | "none"
  | "fade-in"
  | "fade-out"
  | "enter-left"
  | "enter-right"
  | "exit-left"
  | "exit-right"
  | "shake"
  | "small-shake"
  | "bounce"
  | "pulse"
  | "zoom-in"
  | "zoom-out"
  | "flash"
  | "slow-background-zoom";

export type AudioMood =
  | "romantic"
  | "dramatic"
  | "tense"
  | "mystery"
  | "sad"
  | "triumphant"
  | "casual"
  | "silence";

export type SfxType =
  | "heartbeat"
  | "glass_break"
  | "door_slam"
  | "gasp"
  | "camera_click"
  | "phone_ring"
  | "cheer"
  | "whisper"
  | "coin_spent"
  | "diamond_spent"
  | "stat_up"
  | "stat_down";

export type ComparisonOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

export const ConditionSchema = z.object({
  type: z.enum(["stat", "relationship_love", "relationship_trust", "choice_made"]),
  targetKey: z.string(), // stat key (e.g. 'REVENGE') or character slug (e.g. 'adrian') or nodeId
  operator: z.enum(["eq", "neq", "gt", "gte", "lt", "lte"]),
  value: z.union([z.number(), z.string(), z.boolean()]),
});
export type StoryCondition = z.infer<typeof ConditionSchema>;

export const ChoiceEffectSchema = z.object({
  type: z.enum(["stat", "relationship_love", "relationship_trust"]),
  targetKey: z.string(), // stat key or character slug
  amount: z.number(), // positive or negative
});
export type StoryChoiceEffect = z.infer<typeof ChoiceEffectSchema>;

export const ChoiceOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextNodeId: z.string(),
  coinCost: z.number().default(0),
  diamondCost: z.number().default(0),
  isPremium: z.boolean().default(false),
  conditions: z.array(ConditionSchema).optional().default([]),
  effects: z.array(ChoiceEffectSchema).optional().default([]),
});
export type StoryChoiceOption = z.infer<typeof ChoiceOptionSchema>;

// Discriminated configs for Story Nodes
export const DialogueConfigSchema = z.object({
  speaker: z.string(),
  characterSlug: z.string().optional(),
  text: z.string(),
  expression: z.string().default("normal"),
  position: z.enum(["left", "center", "right"]).default("center"),
  characterAnimation: z.string().default("none"),
  backgroundEffect: z.string().default("none"),
  sfx: z.string().optional(),
  sfxMood: z.string().optional(),
});

export const NarrationConfigSchema = z.object({
  text: z.string(),
  style: z.enum(["standard", "internal_thought", "cinematic_quote", "headline"]).default("standard"),
  backgroundEffect: z.string().default("none"),
  sfx: z.string().optional(),
});

export const ChoiceConfigSchema = z.object({
  prompt: z.string().default("What will you do?"),
  options: z.array(ChoiceOptionSchema),
});

export const StatChangeConfigSchema = z.object({
  statKey: z.string(),
  amount: z.number(),
  notificationText: z.string().optional(),
});

export const RelationshipChangeConfigSchema = z.object({
  characterSlug: z.string(),
  characterName: z.string(),
  type: z.enum(["love", "trust"]),
  amount: z.number(),
  notificationText: z.string().optional(),
});

export const SceneChangeConfigSchema = z.object({
  backgroundUrl: z.string().optional(),
  backgroundSlug: z.string().optional(), // e.g. "penthouse", "boardroom", "rain_street", "ballroom", "bedroom"
  backgroundTitle: z.string().optional(),
  transition: z.enum(["cut", "fade", "flash", "zoom"]).default("fade"),
  musicTrack: z.string().optional(),
  charactersPresent: z
    .array(
      z.object({
        characterSlug: z.string(),
        expression: z.string().default("normal"),
        position: z.enum(["left", "center", "right"]).default("center"),
      })
    )
    .optional(),
});

export const MusicChangeConfigSchema = z.object({
  track: z.string(),
  mood: z.string().default("dramatic"),
  volume: z.number().default(0.7),
  fadeDurationMs: z.number().default(1000),
});

export const SfxConfigSchema = z.object({
  sfx: z.string(),
  volume: z.number().default(0.8),
});

export const DelayConfigSchema = z.object({
  durationMs: z.number().default(1000),
  message: z.string().optional(),
});

export const JumpConfigSchema = z.object({
  targetNodeId: z.string(),
  conditions: z.array(ConditionSchema).optional().default([]),
  fallbackNodeId: z.string().optional(),
});

export const EndEpisodeConfigSchema = z.object({
  episodeNumber: z.number(),
  nextEpisodeNumber: z.number().optional(),
  teaserText: z.string().optional(),
  rewardCoins: z.number().default(10),
  rewardDiamonds: z.number().default(2),
});

export const EndingConfigSchema = z.object({
  endingSlug: z.string(),
  endingTitle: z.string(),
  endingType: z.enum(["TRUE_LOVE", "INDEPENDENT", "REVENGE", "SECRET"]),
  summary: z.string(),
  artworkUrl: z.string().optional(),
  badgeTitle: z.string(),
});

export const StoryNodeConfigSchema = z.union([
  DialogueConfigSchema,
  NarrationConfigSchema,
  ChoiceConfigSchema,
  StatChangeConfigSchema,
  RelationshipChangeConfigSchema,
  SceneChangeConfigSchema,
  MusicChangeConfigSchema,
  SfxConfigSchema,
  DelayConfigSchema,
  JumpConfigSchema,
  EndEpisodeConfigSchema,
  EndingConfigSchema,
  z.record(z.string(), z.any()),
]);

export type StoryNodeType =
  | "DIALOGUE"
  | "NARRATION"
  | "CHOICE"
  | "STAT_CHANGE"
  | "RELATIONSHIP_CHANGE"
  | "SCENE_CHANGE"
  | "MUSIC_CHANGE"
  | "SFX"
  | "DELAY"
  | "JUMP"
  | "END_EPISODE"
  | "ENDING";

export interface StoryNodeData {
  id: string;
  nodeId: string;
  nodeIndex: number;
  type: StoryNodeType;
  config: any;
  nextNodeId?: string | null;
}

export interface PlayerCharacterState {
  slug: string;
  name: string;
  avatarUrl?: string;
  expression: string;
  position: CharacterPosition;
  animation?: MotionPreset;
  isVisible: boolean;
}

export interface StoryPlayerState {
  currentEpisodeId: string;
  currentEpisodeNumber: number;
  currentNodeId: string;
  currentNodeIndex: number;
  history: string[];
  backgroundUrl: string;
  backgroundSlug: string;
  backgroundTitle?: string;
  backgroundEffect: MotionPreset;
  currentBgm?: string;
  activeCharacters: Record<string, PlayerCharacterState>;
  stats: Record<string, number>;
  relationships: Record<string, { love: number; trust: number }>;
  choicesMade: Record<string, string>; // nodeId -> choiceOptionId
  isFinished: boolean;
  activeEnding?: {
    slug: string;
    title: string;
    type: string;
    summary: string;
    badgeTitle: string;
  };
  isLoading: boolean;
}
