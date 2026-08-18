import { notFound } from "next/navigation";
import { getStoryBySlug } from "@/lib/services/story";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/services/analytics";
import { EpisodeList } from "@/components/story/EpisodeList";
import Link from "next/link";
import { Play, Sparkles, Heart, Users, BookOpen, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
      title: `${story.title} — PLOT`,
      description: story.shortDescription,
      images: [
        {
          url: story.coverImage,
          width: 800,
          height: 1000,
          alt: story.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.shortDescription,
      images: [story.coverImage],
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

  // Track story view server-side
  await trackEvent(
    "story_view",
    {
      storySlug: story.slug,
      storyId: story.id,
    },
    user?.id
  );

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
    coverImage: ep.coverImage,
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

      {/* Hero Cover & Above-The-Fold TikTok Optimized Landing Card */}
      <div className="rounded-3xl bg-zinc-950 border border-white/10 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-2xl relative overflow-hidden">
        {/* Cinematic Ambient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/30 via-zinc-950 to-slate-950 pointer-events-none" />

        {/* Cover Poster Image with Artwork */}
        <div className="relative w-full sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-2xl border border-white/15">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600/95 backdrop-blur-md text-white shadow-lg">
            {story.ageRating}
          </div>
          <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-center">
            <span className="text-[11px] font-bold text-amber-300">
              {story.episodes.length || 16} Episode • {story.endings.length || 5} Ending
            </span>
          </div>
        </div>

        {/* Story Metadata & Direct CTA */}
        <div className="relative z-10 flex flex-col justify-between flex-1 gap-4">
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {story.title}
            </h1>

            {/* Short Dramatic Hook Quote for TikTok */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 my-3">
              <p className="text-xs sm:text-sm text-rose-200/90 italic leading-relaxed">
                &ldquo;{story.shortDescription}&rdquo;
              </p>
            </div>

            <p className="text-xs text-zinc-400 mb-2">
              Ditulis oleh <span className="text-zinc-200 font-semibold">{story.author}</span> • {story.viewCount} Pembaca
            </p>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3">
              {story.description}
            </p>
          </div>

          {/* Primary Action Button - MAIN SEKARANG */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href={`/story/${story.slug}/episode/${currentEpisodeNumber}`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 font-black text-white text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2.5 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isStarted
                  ? `LANJUTKAN EPISODE ${currentEpisodeNumber}`
                  : "MAIN SEKARANG (EPISODE 1 GRATIS)"}
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

      {/* Discovered Endings Gallery */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              Ending Gallery ({story.endings.length} Endings)
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Discover all routes through your choices
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {story.endings.map((ending) => {
            const isUnlocked = userProgress?.unlockedEndings
              ? JSON.parse(userProgress.unlockedEndings).includes(ending.slug)
              : false;

            return (
              <div
                key={ending.id}
                className={`p-4 rounded-2xl border transition ${
                  isUnlocked
                    ? "bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-900 border-rose-500/40 shadow-lg"
                    : "bg-zinc-950/60 border-white/5 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {isUnlocked ? ending.badgeTitleId || ending.badgeTitle : "LOCKED ENDING"}
                  </span>
                  <span className="text-xs">{isUnlocked ? "🏆" : "🔒"}</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {isUnlocked ? ending.titleId || ending.title : "??? Ending Rahasia"}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isUnlocked
                    ? ending.descriptionId || ending.description
                    : "Mainkan ulang dan buat keputusan berbeda di momen penting untuk membuka ending ini."}
                </p>
              </div>
            );
          })}
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
