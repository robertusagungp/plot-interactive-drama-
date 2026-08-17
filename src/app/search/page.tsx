"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, BookOpen, User } from "lucide-react";
import { StoryCard } from "@/components/story/StoryCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.stories || []);
        setHasSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search stories, characters (Adrian, Sarah), genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-zinc-900 border border-white/15 focus:border-rose-500 text-white placeholder:text-zinc-500 text-sm md:text-base outline-none shadow-2xl transition"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Suggested Search Chips */}
      {!hasSearched && (
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Trending Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              "I Married My Enemy",
              "Adrian Hartono",
              "Enemies to Lovers",
              "Contract Marriage",
              "Billionaire Romance",
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-zinc-400">
            {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((story) => (
                <StoryCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  slug={story.slug}
                  shortDescription={story.shortDescription}
                  author={story.author}
                  coverImage={story.coverImage}
                  genres={story.genres}
                  episodeCount={story.episodes?.length || 10}
                  viewCount={story.viewCount}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-zinc-950 border border-white/10 max-w-lg mx-auto w-full">
              <Sparkles className="w-10 h-10 text-rose-400/50 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                No plot twist found
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                We couldn't find any stories matching "{query}". Try checking your spelling or search for "Adrian" or "Romance".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
