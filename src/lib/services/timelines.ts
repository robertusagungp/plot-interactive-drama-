import { db } from "@/lib/db";
import { getUserEntitlements } from "./entitlements";

export interface TimelineData {
  id: string;
  name: string;
  slotIndex: number;
  currentEpisodeNumber: number;
  lastPlayedNodeId?: string | null;
  isCompleted: boolean;
  stats: Record<string, number>;
  relationships: Record<string, { love: number; trust: number }>;
  flags: string[];
  choices: Record<string, string>;
  unlockedEndings: string[];
  updatedAt: Date;
}

export async function getStoryTimelines(userId: string, storyId: string): Promise<{
  timelines: TimelineData[];
  maxSlots: number;
  canCreateMore: boolean;
}> {
  const [entitlements, dbTimelines] = await Promise.all([
    getUserEntitlements(userId),
    db.userStoryTimeline.findMany({
      where: { userId, storyId },
      orderBy: { slotIndex: "asc" },
    }),
  ]);

  const timelines: TimelineData[] = dbTimelines.map((t) => ({
    id: t.id,
    name: t.name,
    slotIndex: t.slotIndex,
    currentEpisodeNumber: t.currentEpisodeNumber,
    lastPlayedNodeId: t.lastPlayedNodeId,
    isCompleted: t.isCompleted,
    stats: JSON.parse(t.statsJson || "{}"),
    relationships: JSON.parse(t.relationshipsJson || "{}"),
    flags: JSON.parse(t.flagsJson || "[]"),
    choices: JSON.parse(t.choicesJson || "{}"),
    unlockedEndings: JSON.parse(t.unlockedEndings || "[]"),
    updatedAt: t.updatedAt,
  }));

  // If no timelines exist, create slot 0 as default primary timeline
  if (timelines.length === 0) {
    const primary = await db.userStoryTimeline.create({
      data: {
        userId,
        storyId,
        slotIndex: 0,
        name: "Timeline Utama",
        currentEpisodeNumber: 1,
        statsJson: "{}",
        relationshipsJson: "{}",
        flagsJson: "[]",
        choicesJson: "{}",
        unlockedEndings: "[]",
      },
    });

    timelines.push({
      id: primary.id,
      name: primary.name,
      slotIndex: primary.slotIndex,
      currentEpisodeNumber: primary.currentEpisodeNumber,
      lastPlayedNodeId: primary.lastPlayedNodeId,
      isCompleted: primary.isCompleted,
      stats: {},
      relationships: {},
      flags: [],
      choices: {},
      unlockedEndings: [],
      updatedAt: primary.updatedAt,
    });
  }

  return {
    timelines,
    maxSlots: entitlements.maxTimelineSlots,
    canCreateMore: timelines.length < entitlements.maxTimelineSlots,
  };
}

export async function saveTimelineProgress(params: {
  userId: string;
  storyId: string;
  slotIndex?: number;
  name?: string;
  episodeNumber: number;
  lastPlayedNodeId?: string;
  isCompleted?: boolean;
  stats?: Record<string, number>;
  relationships?: Record<string, { love: number; trust: number }>;
  flags?: string[];
  choices?: Record<string, string>;
  endingSlug?: string;
}): Promise<TimelineData> {
  const slotIndex = params.slotIndex ?? 0;

  // Retrieve existing to merge unlocked endings safely
  const existing = await db.userStoryTimeline.findUnique({
    where: {
      userId_storyId_slotIndex: {
        userId: params.userId,
        storyId: params.storyId,
        slotIndex,
      },
    },
  });

  const existingEndings: string[] = existing ? JSON.parse(existing.unlockedEndings || "[]") : [];
  if (params.endingSlug && !existingEndings.includes(params.endingSlug)) {
    existingEndings.push(params.endingSlug);
  }

  const updated = await db.userStoryTimeline.upsert({
    where: {
      userId_storyId_slotIndex: {
        userId: params.userId,
        storyId: params.storyId,
        slotIndex,
      },
    },
    update: {
      name: params.name || existing?.name || (slotIndex === 0 ? "Timeline Utama" : `Timeline Alternatif ${slotIndex}`),
      currentEpisodeNumber: params.episodeNumber,
      lastPlayedNodeId: params.lastPlayedNodeId,
      isCompleted: params.isCompleted ?? existing?.isCompleted ?? false,
      statsJson: params.stats ? JSON.stringify(params.stats) : existing?.statsJson ?? "{}",
      relationshipsJson: params.relationships ? JSON.stringify(params.relationships) : existing?.relationshipsJson ?? "{}",
      flagsJson: params.flags ? JSON.stringify(params.flags) : existing?.flagsJson ?? "[]",
      choicesJson: params.choices ? JSON.stringify(params.choices) : existing?.choicesJson ?? "{}",
      unlockedEndings: JSON.stringify(existingEndings),
    },
    create: {
      userId: params.userId,
      storyId: params.storyId,
      slotIndex,
      name: params.name || (slotIndex === 0 ? "Timeline Utama" : `Timeline Alternatif ${slotIndex}`),
      currentEpisodeNumber: params.episodeNumber,
      lastPlayedNodeId: params.lastPlayedNodeId,
      isCompleted: params.isCompleted ?? false,
      statsJson: JSON.stringify(params.stats || {}),
      relationshipsJson: JSON.stringify(params.relationships || {}),
      flagsJson: JSON.stringify(params.flags || []),
      choicesJson: JSON.stringify(params.choices || {}),
      unlockedEndings: JSON.stringify(existingEndings),
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    slotIndex: updated.slotIndex,
    currentEpisodeNumber: updated.currentEpisodeNumber,
    lastPlayedNodeId: updated.lastPlayedNodeId,
    isCompleted: updated.isCompleted,
    stats: JSON.parse(updated.statsJson || "{}"),
    relationships: JSON.parse(updated.relationshipsJson || "{}"),
    flags: JSON.parse(updated.flagsJson || "[]"),
    choices: JSON.parse(updated.choicesJson || "{}"),
    unlockedEndings: JSON.parse(updated.unlockedEndings || "[]"),
    updatedAt: updated.updatedAt,
  };
}

export async function createNewStoryTimeline(params: {
  userId: string;
  storyId: string;
  name: string;
}): Promise<{ success: boolean; timeline?: TimelineData; error?: string }> {
  const { timelines, maxSlots, canCreateMore } = await getStoryTimelines(params.userId, params.storyId);

  if (!canCreateMore) {
    return {
      success: false,
      error: `Limit slot timeline tercapai (${timelines.length}/${maxSlots}). Berlangganan PLOT+ untuk membuka hingga 5 slot timeline alternatif.`,
    };
  }

  const nextSlot = timelines.length;
  const created = await db.userStoryTimeline.create({
    data: {
      userId: params.userId,
      storyId: params.storyId,
      slotIndex: nextSlot,
      name: params.name || `Timeline Alternatif ${nextSlot}`,
      currentEpisodeNumber: 1,
      statsJson: "{}",
      relationshipsJson: "{}",
      flagsJson: "[]",
      choicesJson: "{}",
      unlockedEndings: "[]",
    },
  });

  return {
    success: true,
    timeline: {
      id: created.id,
      name: created.name,
      slotIndex: created.slotIndex,
      currentEpisodeNumber: created.currentEpisodeNumber,
      lastPlayedNodeId: created.lastPlayedNodeId,
      isCompleted: created.isCompleted,
      stats: {},
      relationships: {},
      flags: [],
      choices: {},
      unlockedEndings: [],
      updatedAt: created.updatedAt,
    },
  };
}
