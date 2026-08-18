import { notFound, redirect } from "next/navigation";
import { getStoryBySlug } from "@/lib/services/story";
import { trackEvent } from "@/lib/services/analytics";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { Play, Sparkles, Flame, ArrowRight } from "lucide-react";
import Image from "next/image";

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
    title: `Mainkan: ${story.title} — PLOT Interactive Drama`,
    description: story.shortDescription,
    openGraph: {
      title: story.title,
      description: story.shortDescription,
      images: [story.coverImage],
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

export default async function DirectPlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const user = await getCurrentUser();

  // Track landing view server-side
  await trackEvent(
    "landing_view",
    {
      storySlug: story.slug,
      storyId: story.id,
      entryType: "direct_play",
      utmSource: search.utm_source as string,
      utmCampaign: search.utm_campaign as string,
      utmContent: search.utm_content as string,
    },
    user?.id
  );

  const episode1Url = `/story/${story.slug}/episode/1`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Ambient background blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${story.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Main High-Conversion Card */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center gap-6 p-6 rounded-3xl bg-zinc-950/80 border border-white/15 backdrop-blur-xl shadow-2xl">
        {/* Story Cover */}
        <div className="relative w-48 h-64 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(244,63,94,0.3)] border border-white/20">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow">
            <Flame className="w-3 h-3 fill-current" />
            <span>GRATIS</span>
          </div>
        </div>

        {/* Story Title & Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-xs text-rose-400 font-bold tracking-wider uppercase">
            <span>{story.episodes.length || 16} EPISODE</span>
            <span>•</span>
            <span>{story.endings.length || 5} ENDING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight leading-tight">
            {story.title}
          </h1>
          <p className="text-sm text-zinc-300 line-clamp-3 italic px-2">
            &ldquo;{story.shortDescription}&rdquo;
          </p>
        </div>

        {/* Primary CTA Button */}
        <Link
          href={episode1Url}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-base uppercase tracking-wider shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2.5 group"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>MAIN SEKARANG — EPISODE 1</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Micro reassurance */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Langsung main tanpa download • Gratis Episode 1</span>
        </div>
      </div>
    </div>
  );
}
