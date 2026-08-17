import { notFound } from "next/navigation";
import { getStoryBySlug } from "@/lib/services/story";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EpisodeList } from "@/components/story/EpisodeList";
import Link from "next/link";
import { Play, Sparkles, Heart, Users, BookOpen, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) return { title: "Story Not Found — PLOT" };

  return {
    title: `${story.title} — PLOT Interactive Drama`,
    description: story.shortDescription,
    openGraph: {
      title: story.title,
      description: story.shortDescription,
      type: "article",
    },
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const user = await getCurrentUser();

  // Fetch user progress and unlocks if logged in
  let userProgress: any = null;
  const unlockedEpisodeIds = new Set<string>();
  let userCoins = 100;

  if (user) {
    const [progress, unlocks, wallet] = await Promise.all([
      db.userStoryProgress.findUnique({
        where: { userId_storyId: { userId: user.id, storyId: story.id } },
      }),
      db.episodeUnlock.findMany({
        where: { userId: user.id },
        select: { episodeId: true },
      }),
      db.wallet.findUnique({
        where: { userId: user.id },
        select: { coins: true },
      }),
    ]);

    userProgress = progress;
    unlocks.forEach((u) => unlockedEpisodeIds.add(u.episodeId));
    if (wallet) userCoins = wallet.coins;
  }

  const currentEpisodeNumber = userProgress?.currentEpisodeNumber || 1;
  const isStarted = !!userProgress;

  const enrichedEpisodes = story.episodes.map((ep) => ({
    id: ep.id,
    number: ep.number,
    title: ep.title,
    titleId: ep.titleId,
    synopsis: ep.synopsis,
    synopsisId: ep.synopsisId,
    unlockType: ep.unlockType,
    coinPrice: ep.coinPrice,
    isUnlocked: unlockedEpisodeIds.has(ep.id),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
      {/* Back Link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Hero Cover & Summary Card */}
      <div className="rounded-3xl bg-zinc-950 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/30 via-zinc-950 to-slate-950 pointer-events-none" />

        {/* Cover Poster */}
        <div className="relative w-full md:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-2xl border border-white/10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), linear-gradient(135deg, #451A03 0%, #1E1B4B 100%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-10 h-10 text-rose-400 mb-2 opacity-80" />
            <span className="text-xl font-black text-white leading-tight">
              {story.title}
            </span>
          </div>

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
            {story.ageRating}
          </div>
        </div>

        {/* Story Metadata */}
        <div className="relative z-10 flex flex-col justify-between flex-1">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {story.genres.map((g, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-950/80 border border-rose-500/30 text-rose-300"
                >
                  {g.genre.name}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
              {story.title}
            </h1>

            <p className="text-xs text-zinc-400 mb-4">
              Written by <span className="text-zinc-200 font-semibold">{story.author}</span> • {story.viewCount} Reads
            </p>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {story.description}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href={`/story/${story.slug}/episode/${currentEpisodeNumber}`}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 font-extrabold text-white text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isStarted
                  ? `Continue Episode ${currentEpisodeNumber}`
                  : "Start Playing (Episode 1 Free)"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Characters */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">Cast & Characters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {story.characters.map((char) => (
            <div
              key={char.id}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-extrabold text-white">
                    {char.name}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-rose-400 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30">
                    {char.role.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {char.biography}
                </p>
              </div>

              {char.relationshipEnabled && (
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-rose-300">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>Relationship Tracked</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Episodes List */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              Episodes ({story.episodes.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Episodes 1–3 are completely free
          </span>
        </div>

        <EpisodeList
          storySlug={story.slug}
          episodes={enrichedEpisodes}
          userCoins={userCoins}
        />
      </section>
    </div>
  );
}
