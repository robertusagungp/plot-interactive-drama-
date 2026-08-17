import { notFound } from "next/navigation";
import { getEpisodeWithNodes } from "@/lib/services/story";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StoryPlayer } from "@/components/player/StoryPlayer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; episodeNumber: string }>;
}): Promise<Metadata> {
  const { slug, episodeNumber } = await params;
  const num = parseInt(episodeNumber, 10);
  const data = await getEpisodeWithNodes(slug, num);

  if (!data) return { title: "Episode Not Found — PLOT" };

  return {
    title: `Ep. ${num}: ${data.episode.title} — ${data.story.title}`,
    description: data.episode.synopsis || `Play Episode ${num} of ${data.story.title} on PLOT.`,
  };
}

export default async function StoryPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; episodeNumber: string }>;
}) {
  const { slug, episodeNumber } = await params;
  const num = parseInt(episodeNumber, 10);

  if (isNaN(num)) {
    notFound();
  }

  const data = await getEpisodeWithNodes(slug, num);
  if (!data) {
    notFound();
  }

  const { story, episode, nodes } = data;
  const user = await getCurrentUser();

  let userCoins = 100;
  let userDiamonds = 20;
  let isUnlocked = episode.unlockType === "FREE" || episode.coinPrice === 0;
  let userStats: Record<string, number> = { REPUTATION: 50, REVENGE: 50 };
  let userRelationships: Record<string, { love: number; trust: number }> = {
    adrian: { love: 10, trust: 15 },
    luca: { love: 30, trust: 60 },
  };

  if (user) {
    // Check wallet and unlocks
    const [wallet, unlock, dbStats, dbRelationships] = await Promise.all([
      db.wallet.findUnique({ where: { userId: user.id } }),
      db.episodeUnlock.findUnique({
        where: {
          userId_episodeId: {
            userId: user.id,
            episodeId: episode.id,
          },
        },
      }),
      db.userStoryStat.findMany({
        where: { userId: user.id, storyId: story.id },
      }),
      db.userRelationship.findMany({
        where: { userId: user.id, storyId: story.id },
        include: { character: true },
      }),
    ]);

    if (wallet) {
      userCoins = wallet.coins;
      userDiamonds = wallet.diamonds;
    }

    if (unlock) {
      isUnlocked = true;
    }

    if (dbStats.length > 0) {
      dbStats.forEach((s) => {
        userStats[s.statKey] = s.value;
      });
    }

    if (dbRelationships.length > 0) {
      dbRelationships.forEach((r) => {
        userRelationships[r.character.slug] = {
          love: r.loveValue,
          trust: r.trustValue,
        };
      });
    }
  }

  return (
    <div className="w-full h-full min-h-screen bg-black">
      <StoryPlayer
        storyId={story.id}
        storySlug={story.slug}
        storyTitle={story.title}
        episodeId={episode.id}
        episodeNumber={episode.number}
        episodeTitle={episode.title}
        nodes={nodes}
        initialCoins={userCoins}
        initialDiamonds={userDiamonds}
        initialStats={userStats}
        initialRelationships={userRelationships}
        isUnlocked={isUnlocked}
        coinPrice={episode.coinPrice}
        isLoggedIn={!!user}
      />
    </div>
  );
}
