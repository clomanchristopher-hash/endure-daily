"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpenText, Dumbbell, Flame, Heart, NotebookPen, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getDevotionForDate } from "@/lib/data/devotions";
import { getWorkoutMotivation } from "@/lib/motivation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export default function HomePage() {
  const { ready, profile, devotions, isFavorite, toggleFavorite } = useAppState();

  const devotion = useMemo(() => getDevotionForDate(new Date(), devotions), [devotions]);
  const challenge =
    profile.mode === "athlete" ? devotion.athlete_challenge : devotion.leisure_challenge;
  const motivation = getWorkoutMotivation(devotion.theme, profile.mode);
  const favorited = ready && isFavorite(devotion.id);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">{todayLabel}</p>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Today&apos;s Devotion
          </h1>
        </div>
        <ModeToggle />
      </div>

      <Card className="mt-5 bg-gradient-to-br from-surface-raised to-surface">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <Sparkles size={12} /> Theme of the Day
          </Badge>
          {ready && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ember">
              <Flame size={16} />
              {profile.streak} day streak
            </div>
          )}
        </div>
        <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">{devotion.theme}</h2>
        <p className="mt-1 font-serif text-lg text-gold-soft">{devotion.title}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Scripture of the Day
        </p>
        <blockquote className="mt-2 border-l-2 border-gold pl-4 font-serif text-lg italic leading-relaxed text-foreground">
          &ldquo;{devotion.scripture_text}&rdquo;
        </blockquote>
        <p className="mt-2 text-sm font-semibold text-gold-soft">
          {devotion.scripture_reference}
        </p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Devotion
        </p>
        <p className="mt-2 leading-relaxed text-foreground/90">{devotion.devotion_text}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Prayer</p>
        <p className="mt-2 leading-relaxed text-foreground/90">{devotion.prayer}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Reflection Question
        </p>
        <p className="mt-2 font-serif text-lg text-foreground">{devotion.reflection_question}</p>
        <Link
          href={`/journal?devotionId=${devotion.id}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft hover:text-gold"
        >
          <NotebookPen size={15} />
          Write your reflection
        </Link>
      </Card>

      <Card className="mt-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
          <Dumbbell size={13} /> Workout Motivation
        </p>
        <p className="mt-2 font-serif text-lg leading-snug text-foreground">{motivation}</p>
      </Card>

      <Card className="mt-4 border-gold/30 bg-gold/5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
            <Flame size={13} /> Daily Movement Challenge
          </p>
          <Badge tone={profile.mode === "athlete" ? "ember" : "evergreen"}>
            {profile.mode === "athlete" ? "Athlete" : "Leisure"}
          </Badge>
        </div>
        <p className="mt-2 leading-relaxed text-foreground">{challenge}</p>
      </Card>

      <div className="mt-5 flex gap-3">
        <Button
          variant={favorited ? "primary" : "outline"}
          className="flex-1"
          onClick={() => toggleFavorite(devotion.id)}
        >
          <Heart size={16} fill={favorited ? "currentColor" : "none"} />
          {favorited ? "Saved to Favorites" : "Save to Favorites"}
        </Button>
        <Link href={`/library`} className="flex-1">
          <Button variant="secondary" className="w-full">
            <BookOpenText size={16} />
            Browse Library
          </Button>
        </Link>
      </div>
    </div>
  );
}
