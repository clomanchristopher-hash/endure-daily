"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { DevotionCard } from "@/components/devotion/DevotionCard";

export default function LibraryPage() {
  const { devotions, isFavorite, toggleFavorite } = useAppState();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    devotions.forEach((d) => d.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [devotions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devotions.filter((d) => {
      const matchesQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.theme.toLowerCase().includes(q) ||
        d.scripture_reference.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTag = !activeTag || d.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [devotions, query, activeTag]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Devotion Library</h1>
      <p className="mt-1 text-sm text-muted">
        Browse every devotion — search by theme, Scripture, or topic.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3 py-2.5">
        <Search size={16} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search devotions..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            activeTag === null ? "bg-gold text-[#0d1510]" : "bg-surface-raised text-muted"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeTag === tag ? "bg-gold text-[#0d1510]" : "bg-surface-raised text-muted"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">
        {filtered.length} devotion{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((devotion) => (
          <DevotionCard
            key={devotion.id}
            devotion={devotion}
            favorited={isFavorite(devotion.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted">
          No devotions match your search. Try a different keyword or tag.
        </p>
      )}
    </div>
  );
}
