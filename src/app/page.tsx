import { getPublishedStories } from "@/lib/services/story";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryCard } from "@/components/story/StoryCard";
import Link from "next/link";
import {
  Play,
  Sparkles,
  TrendingUp,
  Heart,
  Flame,
  Award,
  ChevronRight,
  Zap,
  Shield,
  Eye,
  Clock,
  Crown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const allStories = await getPublishedStories({ limit: 50 });
  const featuredStory = allStories.find((s) => s.featured) || allStories[0];

  // User active progress
  let activeProgress: any = null;
  if (user) {
    activeProgress = await db.userStoryProgress.findFirst({
      where: { userId: user.id },
      include: { story: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  // Segment stories into shelves
  const trendingStories = allStories.slice(0, 5);
  const newReleases = allStories.slice(5, 10);
  const celebrityStories = allStories.filter((s) =>
    s.genres.some((g) => g.genre.slug === "celebrity")
  );
  const enemiesToLovers = allStories.filter((s) =>
    s.genres.some((g) => g.genre.slug === "enemies-to-lovers")
  );
  const revengeStories = allStories.filter((s) =>
    s.genres.some((g) => g.genre.slug === "thriller") || s.slug.includes("revenge")
  );
  const fantasyStories = allStories.filter((s) =>
    s.genres.some((g) => g.genre.slug === "fantasy" || g.genre.slug === "time-travel")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-10">
      {/* 1. Continue Playing Bar (if user has progress) */}
      {activeProgress && (
        <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-rose-700 to-amber-600 flex-shrink-0 flex items-center justify-center font-black text-white text-xs shadow-md">
              Ep. {activeProgress.currentEpisodeNumber}
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-rose-400 block">
                Continue Your Story
              </span>
              <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                {activeProgress.story.title}
              </h3>
              <p className="text-xs text-zinc-400">
                Episode {activeProgress.currentEpisodeNumber} of 16
              </p>
            </div>
          </div>

          <Link
            href={`/story/${activeProgress.story.slug}/episode/${activeProgress.currentEpisodeNumber}`}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/40 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </Link>
        </div>
      )}

      {/* 2. Featured Story Hero */}
      {featuredStory && (
        <StoryHero story={featuredStory} currentProgress={activeProgress} />
      )}

      {/* 3. Trending Now (with Rank 1..5 numbers) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">
                Trending Now
              </h2>
              <p className="text-xs text-zinc-400">
                The top interactive visual dramas readers are obsessed with
              </p>
            </div>
          </div>

          <Link
            href="/discover?sort=trending"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingStories.map((story, idx) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              titleId={story.titleId}
              slug={story.slug}
              shortDescription={story.shortDescription}
              shortDescriptionId={story.shortDescriptionId}
              author={story.author}
              coverImage={story.coverImage}
              genres={story.genres}
              episodeCount={story._count.episodes}
              viewCount={story.viewCount}
              badge={idx === 0 ? "HOT" : undefined}
              rank={idx + 1}
            />
          ))}
        </div>
      </section>

      {/* 4. New Releases (with NEW badge) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">
                New Releases
              </h2>
              <p className="text-xs text-zinc-400">
                Fresh episodes, new twists, and newly published visual dramas
              </p>
            </div>
          </div>

          <Link
            href="/discover?sort=new"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              titleId={story.titleId}
              slug={story.slug}
              shortDescription={story.shortDescription}
              shortDescriptionId={story.shortDescriptionId}
              author={story.author}
              coverImage={story.coverImage}
              genres={story.genres}
              episodeCount={story._count.episodes}
              viewCount={story.viewCount}
              badge="NEW"
            />
          ))}
        </div>
      </section>

      {/* 5. Celebrity & Idol Dramas */}
      {celebrityStories.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  Celebrity & Idol Life
                </h2>
                <p className="text-xs text-zinc-400">
                  Secret backstage romances, private jet encounters, and red carpet scandals
                </p>
              </div>
            </div>

            <Link
              href="/discover?genre=celebrity"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {celebrityStories.slice(0, 5).map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                titleId={story.titleId}
                slug={story.slug}
                shortDescription={story.shortDescription}
                shortDescriptionId={story.shortDescriptionId}
                author={story.author}
                coverImage={story.coverImage}
                genres={story.genres}
                episodeCount={story._count.episodes}
                viewCount={story.viewCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Enemies to Lovers */}
      {enemiesToLovers.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  Enemies to Lovers
                </h2>
                <p className="text-xs text-zinc-400">
                  High-stakes corporate rivalries, fiery hatred, and irresistible attraction
                </p>
              </div>
            </div>

            <Link
              href="/discover?genre=enemies-to-lovers"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {enemiesToLovers.slice(0, 5).map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                titleId={story.titleId}
                slug={story.slug}
                shortDescription={story.shortDescription}
                shortDescriptionId={story.shortDescriptionId}
                author={story.author}
                coverImage={story.coverImage}
                genres={story.genres}
                episodeCount={story._count.episodes}
                viewCount={story.viewCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Revenge & Thriller */}
      {revengeStories.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  Revenge & High Suspense
                </h2>
                <p className="text-xs text-zinc-400">
                  Payback contracts, dangerous family conspiracies, and sweet retribution
                </p>
              </div>
            </div>

            <Link
              href="/discover?genre=thriller"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {revengeStories.slice(0, 5).map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                titleId={story.titleId}
                slug={story.slug}
                shortDescription={story.shortDescription}
                shortDescriptionId={story.shortDescriptionId}
                author={story.author}
                coverImage={story.coverImage}
                genres={story.genres}
                episodeCount={story._count.episodes}
                viewCount={story.viewCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Callout Banner: Interactive Choice Mechanics */}
      <section className="rounded-3xl p-6 md:p-8 bg-zinc-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1 block">
            Your Choices Shape The Ending
          </span>
          <h3 className="text-2xl font-black text-white mb-2">
            Branching Paths & Multiple Endings
          </h3>
          <p className="text-sm text-zinc-300 max-w-xl">
            Every dialogue choice alters character love, trust, and your public reputation. Will you build a lasting romance, rise to power, or claim your revenge?
          </p>
        </div>

        {featuredStory && (
          <Link
            href={`/story/${featuredStory.slug}/episode/1`}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-black text-white text-sm shadow-xl flex-shrink-0 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Episode 1 Free</span>
          </Link>
        )}
      </section>
    </div>
  );
}
