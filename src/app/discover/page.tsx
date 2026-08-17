import { getPublishedStories } from "@/lib/services/story";
import { db } from "@/lib/db";
import { StoryCard } from "@/components/story/StoryCard";
import Link from "next/link";
import { Compass, Filter, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const selectedGenre = typeof resolvedParams.genre === "string" ? resolvedParams.genre : undefined;
  const selectedSort = typeof resolvedParams.sort === "string" ? (resolvedParams.sort as any) : "trending";

  const [genres, stories] = await Promise.all([
    db.genre.findMany(),
    getPublishedStories({
      genreSlug: selectedGenre,
      sortBy: selectedSort,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-rose-400">
          <Compass className="w-4 h-4" />
          <span>Discover Interactive Dramas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Explore The Catalog
        </h1>
        <p className="text-sm text-zinc-400">
          Find your next binge-worthy romance, revenge thriller, or corporate intrigue.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <Link
          href="/discover"
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
            !selectedGenre
              ? "bg-rose-600 text-white shadow-lg shadow-rose-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-white/5"
          }`}
        >
          All Genres
        </Link>

        {genres.map((g) => {
          const isActive = selectedGenre === g.slug;
          return (
            <Link
              key={g.id}
              href={`/discover?genre=${g.slug}${selectedSort ? `&sort=${selectedSort}` : ""}`}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                isActive
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-950/40"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-white/5"
              }`}
            >
              {g.name}
            </Link>
          );
        })}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-xs font-semibold text-zinc-400">
          Showing {stories.length} interactive {stories.length === 1 ? "story" : "stories"}
        </span>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-zinc-500 hidden sm:inline">Sort:</span>
          {[
            { label: "Trending", value: "trending" },
            { label: "Newest", value: "newest" },
            { label: "Most Played", value: "most_played" },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/discover?${selectedGenre ? `genre=${selectedGenre}&` : ""}sort=${s.value}`}
              className={`px-3 py-1 rounded-xl transition ${
                selectedSort === s.value
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stories.map((story) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-zinc-950 border border-white/10">
          <Sparkles className="w-10 h-10 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No stories found</h3>
          <p className="text-xs text-zinc-400">
            Try switching genre filters to discover more interactive visual dramas.
          </p>
        </div>
      )}
    </div>
  );
}
