import { getPublishedStories } from "@/lib/services/story";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryCard } from "@/components/story/StoryCard";
import Link from "next/link";
import { Play, Sparkles, TrendingUp, Heart, Flame, Award, ChevronRight } from "lucide-react";

export const revalidate = 60; // Cache 60s for high performance

export default async function HomePage() {
  const user = await getCurrentUser();
  const allStories = await getPublishedStories({ limit: 10 });
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

  // Segment stories
  const trendingStories = allStories;
  const romanceStories = allStories.filter((s) =>
    s.genres.some((g) => g.genre.slug === "romance" || g.genre.slug === "enemies-to-lovers")
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
                Episode {activeProgress.currentEpisodeNumber} of 10
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
        <StoryHero
          story={featuredStory}
          currentProgress={activeProgress}
        />
      )}

      {/* 3. Trending Stories Carousel / Grid */}
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
                The most played interactive visual dramas this week
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
          {trendingStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              slug={story.slug}
              shortDescription={story.shortDescription}
              author={story.author}
              coverImage={story.coverImage}
              genres={story.genres}
              episodeCount={story._count.episodes}
              viewCount={story.viewCount}
              featured={story.featured}
            />
          ))}
        </div>
      </section>

      {/* 4. Romance & Enemies to Lovers Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">
                Enemies to Lovers & Romance
              </h2>
              <p className="text-xs text-zinc-400">
                High stakes contracts, undeniable tension, and shocking twists
              </p>
            </div>
          </div>

          <Link
            href="/discover?genre=romance"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {romanceStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              slug={story.slug}
              shortDescription={story.shortDescription}
              author={story.author}
              coverImage={story.coverImage}
              genres={story.genres}
              episodeCount={story._count.episodes}
              viewCount={story.viewCount}
            />
          ))}
        </div>
      </section>

      {/* 5. Recommended For You */}
      <section className="rounded-3xl p-6 md:p-8 bg-zinc-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1 block">
            Your Choices Shape The Ending
          </span>
          <h3 className="text-2xl font-black text-white mb-2">
            Unlock 4 Unique Endings in PLOT
          </h3>
          <p className="text-sm text-zinc-300 max-w-xl">
            Every dialogue choice alters your relationship stats and corporate reputation. Will you surrender to love, seize the empire, or claim total revenge?
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
