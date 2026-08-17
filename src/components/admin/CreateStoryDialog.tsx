"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export const CreateStoryDialog: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("PLOT Studio");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          shortDescription: shortDesc,
          description,
          author,
          status,
          featured: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErr(data.error || "Failed to create story");
      }
    } catch {
      setErr("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/50 transition"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Story</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1">Create Story</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Initialize a new visual drama storyline and configure metadata.
            </p>

            {err && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-bold">
                {err}
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-300">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Rivalry in Red Velvet"
                  className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. rivalry-in-red-velvet"
                  className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Short Pitch</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="One sentence hook for cards"
                  className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300">Full Synopsis</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive narrative premise..."
                  className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-xs outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-lg"
              >
                {loading ? "Creating..." : "Save & Open Story"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
