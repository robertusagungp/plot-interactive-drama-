import { db } from "@/lib/db";
import { StoryNodeData, StoryNodeType } from "@/lib/types/story";
import { unlockAchievementForUser } from "./achievements";

export async function getPublishedStories(options?: {
  genreSlug?: string;
  status?: string;
  sortBy?: "trending" | "newest" | "most_played" | "completed";
  search?: string;
  limit?: number;
}) {
  const where: any = {
    status: options?.status || { in: ["PUBLISHED", "COMPLETED"] },
  };

  if (options?.genreSlug) {
    where.genres = {
      some: {
        genre: {
          slug: options.genreSlug,
        },
      },
    };
  }

  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { shortDescription: { contains: options.search } },
      { description: { contains: options.search } },
      { author: { contains: options.search } },
    ];
  }

  let orderBy: any = { viewCount: "desc" };
  if (options?.sortBy === "newest") orderBy = { publishedAt: "desc" };
  if (options?.sortBy === "most_played") orderBy = { startCount: "desc" };
  if (options?.sortBy === "completed") orderBy = { completionCount: "desc" };

  return await db.story.findMany({
    where,
    orderBy,
    take: options?.limit || 20,
    include: {
      genres: {
        include: { genre: true },
      },
      tags: true,
      episodes: {
        where: { status: "PUBLISHED" },
        select: { id: true, number: true, unlockType: true, coinPrice: true },
      },
      characters: {
        take: 3,
        select: { id: true, name: true, slug: true, avatarUrl: true, role: true },
      },
      _count: {
        select: { episodes: true, endings: true },
      },
    },
  });
}

export async function getStoryBySlug(slug: string) {
  return await db.story.findUnique({
    where: { slug },
    include: {
      genres: {
        include: { genre: true },
      },
      tags: true,
      characters: {
        include: { assets: true },
      },
      statDefinitions: true,
      episodes: {
        where: { status: "PUBLISHED" },
        orderBy: { number: "asc" },
      },
      endings: true,
    },
  });
}

export async function getEpisodeWithNodes(storySlug: string, episodeNumber: number) {
  const story = await db.story.findUnique({
    where: { slug: storySlug },
    select: { id: true, title: true, slug: true },
  });

  if (!story) return null;

  const episode = await db.episode.findUnique({
    where: {
      storyId_number: {
        storyId: story.id,
        number: episodeNumber,
      },
    },
    include: {
      nodes: {
        orderBy: { nodeIndex: "asc" },
      },
    },
  });

  if (!episode) return null;

  const parsedNodes: StoryNodeData[] = episode.nodes.map((n) => ({
    id: n.id,
    nodeId: n.nodeId,
    nodeIndex: n.nodeIndex,
    type: n.type as StoryNodeType,
    config: JSON.parse(n.configJson || "{}"),
    nextNodeId: n.nextNodeId,
  }));

  return {
    story,
    episode,
    nodes: parsedNodes,
  };
}

export function validateEpisodeGraph(nodes: StoryNodeData[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!nodes || nodes.length === 0) {
    return { isValid: false, errors: ["Episode has no nodes."] };
  }

  const nodeIds = new Set(nodes.map((n) => n.nodeId));

  nodes.forEach((node, idx) => {
    // Check nextNodeId
    if (node.nextNodeId && !nodeIds.has(node.nextNodeId)) {
      errors.push(
        `Node #${idx + 1} (${node.nodeId}) points to non-existent nextNodeId: "${node.nextNodeId}"`
      );
    }

    // Check Choice Options
    if (node.type === "CHOICE") {
      const options = node.config.options || [];
      if (options.length === 0) {
        errors.push(`Choice Node (${node.nodeId}) has no options.`);
      }
      options.forEach((opt: any, optIdx: number) => {
        if (!opt.text) {
          errors.push(`Choice Node (${node.nodeId}) option #${optIdx + 1} has no text.`);
        }
        if (opt.nextNodeId && !nodeIds.has(opt.nextNodeId)) {
          errors.push(
            `Choice Node (${node.nodeId}) option "${opt.text}" points to missing destination "${opt.nextNodeId}"`
          );
        }
        if (opt.coinCost < 0 || opt.diamondCost < 0) {
          errors.push(`Choice Node (${node.nodeId}) has negative currency cost.`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function saveUserStoryProgress(data: {
  userId: string;
  storyId: string;
  episodeId: string;
  episodeNumber: number;
  lastNodeId?: string;
  isCompleted?: boolean;
  endingSlug?: string;
  stats?: Record<string, number>;
  relationships?: Record<string, { love: number; trust: number }>;
  choicesMade?: Record<string, string>;
}) {
  const { userId, storyId, episodeId, episodeNumber, isCompleted, endingSlug, stats, relationships } = data;

  // Upsert Episode Progress
  await db.userEpisodeProgress.upsert({
    where: {
      userId_episodeId: { userId, episodeId },
    },
    update: {
      isCompleted: isCompleted || false,
      completedAt: isCompleted ? new Date() : undefined,
      lastNodeId: data.lastNodeId,
    },
    create: {
      userId,
      episodeId,
      isCompleted: isCompleted || false,
      completedAt: isCompleted ? new Date() : undefined,
      lastNodeId: data.lastNodeId,
    },
  });

  // Upsert Overall Story Progress
  const existingStoryProgress = await db.userStoryProgress.findUnique({
    where: { userId_storyId: { userId, storyId } },
  });

  let unlockedEndings: string[] = [];
  try {
    unlockedEndings = JSON.parse(existingStoryProgress?.unlockedEndings || "[]");
  } catch {}

  if (endingSlug && !unlockedEndings.includes(endingSlug)) {
    unlockedEndings.push(endingSlug);
  }

  await db.userStoryProgress.upsert({
    where: { userId_storyId: { userId, storyId } },
    update: {
      currentEpisodeNumber: Math.max(
        existingStoryProgress?.currentEpisodeNumber || 1,
        episodeNumber
      ),
      lastPlayedNodeId: data.lastNodeId,
      isCompleted: isCompleted && episodeNumber >= 10,
      unlockedEndings: JSON.stringify(unlockedEndings),
    },
    create: {
      userId,
      storyId,
      currentEpisodeNumber: episodeNumber,
      lastPlayedNodeId: data.lastNodeId,
      isCompleted: isCompleted && episodeNumber >= 10,
      unlockedEndings: JSON.stringify(unlockedEndings),
    },
  });

  // Save Relationships
  if (relationships) {
    for (const [charSlug, rel] of Object.entries(relationships)) {
      const character = await db.character.findFirst({
        where: { storyId, slug: charSlug },
      });
      if (character) {
        await db.userRelationship.upsert({
          where: {
            userId_storyId_characterId: {
              userId,
              storyId,
              characterId: character.id,
            },
          },
          update: {
            loveValue: rel.love,
            trustValue: rel.trust,
          },
          create: {
            userId,
            storyId,
            characterId: character.id,
            loveValue: rel.love,
            trustValue: rel.trust,
          },
        });

        // Trigger relationship achievement check
        if (rel.love >= 80) {
          await unlockAchievementForUser(userId, "HOPELESS_ROMANTIC");
        }
      }
    }
  }

  // Save Stats
  if (stats) {
    for (const [key, val] of Object.entries(stats)) {
      await db.userStoryStat.upsert({
        where: {
          userId_storyId_statKey: {
            userId,
            storyId,
            statKey: key,
          },
        },
        update: { value: val },
        create: {
          userId,
          storyId,
          statKey: key,
          value: val,
        },
      });

      if (key === "REVENGE" && val >= 80) {
        await unlockAchievementForUser(userId, "HEARTBREAKER");
      }
    }
  }

  // Sync with timeline
  try {
    const { saveTimelineProgress } = await import("./timelines");
    await saveTimelineProgress({
      userId,
      storyId,
      episodeNumber,
      lastPlayedNodeId: data.lastNodeId,
      isCompleted,
      stats,
      relationships,
      endingSlug,
    });
  } catch {}

  // Trigger achievements
  if (isCompleted) {
    await unlockAchievementForUser(userId, "FIRST_EPISODE");
    if (episodeNumber >= 10) {
      await unlockAchievementForUser(userId, "FIRST_STORY_COMPLETE");
      if (unlockedEndings.length >= 4) {
        await unlockAchievementForUser(userId, "COMPLETIONIST");
      }
    }
  }
}

export async function getUserStoryJourney(userId: string, storySlug: string) {
  const story = await db.story.findUnique({
    where: { slug: storySlug },
    include: {
      endings: true,
      characters: true,
    },
  });

  if (!story) return null;

  const [choices, userProgress, relationships, stats] = await Promise.all([
    db.userChoice.findMany({
      where: { userId, storyId: story.id },
      include: { episode: { select: { number: true, title: true, titleId: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.userStoryProgress.findUnique({
      where: { userId_storyId: { userId, storyId: story.id } },
    }),
    db.userRelationship.findMany({
      where: { userId, storyId: story.id },
      include: { character: true },
    }),
    db.userStoryStat.findMany({
      where: { userId, storyId: story.id },
    }),
  ]);

  const unlockedEndingSlugs: string[] = JSON.parse(userProgress?.unlockedEndings || "[]");

  // Calculate dynamic PLOT DNA persona from choices
  const totalChoices = choices.length;
  const romanticCount = choices.filter((c) => c.choiceOptionText.toLowerCase().includes("love") || c.choiceOptionText.toLowerCase().includes("cinta") || c.choiceOptionText.toLowerCase().includes("peluk") || c.choiceOptionText.toLowerCase().includes("bisik")).length;
  const strategicCount = choices.filter((c) => c.choiceOptionText.toLowerCase().includes("tenang") || c.choiceOptionText.toLowerCase().includes("rencana") || c.choiceOptionText.toLowerCase().includes("wibawa") || c.choiceOptionText.toLowerCase().includes("strategi")).length;

  const plotDna = {
    romantic: totalChoices > 0 ? Math.min(100, Math.round((romanticCount / totalChoices) * 100 + 40)) : 50,
    strategic: totalChoices > 0 ? Math.min(100, Math.round((strategicCount / totalChoices) * 100 + 50)) : 60,
    loyal: 85,
    dominantTrait: romanticCount >= strategicCount ? "Romantic Devotion" : "Strategic Mastermind",
    dominantTraitId: romanticCount >= strategicCount ? "Penuh Cinta & Romantis" : "Ahli Strategi & Berwibawa",
  };

  // Compile "Previously on PLOT" dynamic recap from choices
  const recaps = choices.slice(-3).map((c) => ({
    episodeNumber: c.episode.number,
    episodeTitle: c.episode.titleId || c.episode.title,
    choiceText: c.choiceOptionText,
  }));

  return {
    story,
    currentEpisode: userProgress?.currentEpisodeNumber || 1,
    isCompleted: userProgress?.isCompleted || false,
    unlockedEndings: story.endings.filter((e) => unlockedEndingSlugs.includes(e.slug)),
    allEndingsCount: story.endings.length,
    relationships,
    stats,
    choices,
    recaps,
    plotDna,
  };
}
