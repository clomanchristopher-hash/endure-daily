"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { DevotionCard } from "@/components/devotion/DevotionCard";

export default function FavoritesPage() {
  const { devotions, profile, toggleFavorite } = useAppState();
  const favorites = devotions.filter((d) => profile.favorites.includes(d.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Favorites</h1>
      <p className="mt-1 text-sm text-muted">Devotions you&apos;ve saved for quick return.</p>

      {favorites.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-muted">
          <Heart size={28} />
          <p>No favorites yet.</p>
          <Link href="/library" className="text-sm font-semibold text-gold-soft">
            Browse the Devotion Library
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((devotion) => (
            <DevotionCard
              key={devotion.id}
              devotion={devotion}
              favorited
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
