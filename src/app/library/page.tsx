import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StoryCard } from "@/components/story/StoryCard";
import Link from "next/link";
import { BookOpen, Sparkles, Play, Clock, CheckCircle2 } from "lucide-react";

export default async function LibraryPage() {
  const user = await getCurrentUser();

  let inProgressStories: any[] = [];
  let completedStories: any[] = [];

  if (user) {
    const progressList = await db.userStoryProgress.findMany({
      where: { userId: user.id },
      include: {
        story: {
          include: {
            genres: { include: { genre: true } },
            _count: { select: { episodes: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    inProgressStories = progressList.filter((p) => !p.isCompleted);
    completedStories = progressList.filter((p) => p.isCompleted);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-rose-400">
          <BookOpen className="w-4 h-4" />
          <span>Your Personal Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Reading History & Saved
        </h1>
      </div>

      {!user ? (
        <div className="rounded-3xl p-8 bg-zinc-950 border border-white/10 text-center max-w-lg mx-auto flex flex-col items-center gap-4 shadow-xl">
          <Sparkles className="w-12 h-12 text-rose-400 opacity-60" />
          <h3 className="text-xl font-bold text-white">Save Your Story Choices</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Create an account or sign in to sync your progress across devices, bookmark stories, and track unlocked endings.
          </p>
          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs transition shadow-lg shadow-rose-950/40"
          >
            Sign In to Unlock Library
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Continue Reading Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-bold text-white">In Progress</h2>
            </div>

            {inProgressStories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {inProgressStories.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <StoryCard
                      id={item.story.id}
                      title={item.story.title}
                      slug={item.story.slug}
                      shortDescription={item.story.shortDescription}
                      author={item.story.author}
                      coverImage={item.story.coverImage}
                      genres={item.story.genres}
                      episodeCount={item.story._count.episodes}
                    />
                    <div className="flex items-center justify-between px-2 text-[11px] text-zinc-400">
                      <span>Ep. {item.currentEpisodeNumber}</span>
                      <span className="text-rose-400 font-bold">Resume →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/5 text-center text-xs text-zinc-500">
                Your next obsession hasn't started yet. Browse Discover to begin!
              </div>
            )}
          </section>

          {/* Completed Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Completed Stories</h2>
            </div>

            {completedStories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {completedStories.map((item) => (
                  <StoryCard
                    key={item.id}
                    id={item.story.id}
                    title={item.story.title}
                    slug={item.story.slug}
                    shortDescription={item.story.shortDescription}
                    author={item.story.author}
                    coverImage={item.story.coverImage}
                    genres={item.story.genres}
                    episodeCount={item.story._count.episodes}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/5 text-center text-xs text-zinc-500">
                No completed stories yet. Play through Episode 10 to unlock your first ending!
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
