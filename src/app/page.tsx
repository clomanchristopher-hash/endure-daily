"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpenText, Dumbbell, Flame, Heart, Sparkles, Target } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getDevotionForDate } from "@/lib/data/devotions";
import { getChallengeForDate } from "@/lib/data/challenges";
import { getWorkoutMotivation } from "@/lib/motivation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Greeting } from "@/components/home/Greeting";
import { DailyProgressCard } from "@/components/home/DailyProgressCard";
import { ReflectionCard } from "@/components/home/ReflectionCard";

export default function HomePage() {
  const { ready, profile, devotions, isFavorite, toggleFavorite } = useAppState();

  const devotion = useMemo(() => getDevotionForDate(new Date(), devotions), [devotions]);
  const dailyChallenge = useMemo(() => getChallengeForDate(new Date()), []);
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
      {/* 1. Greeting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted">{todayLabel}</p>
          <Greeting />
        </div>
        <ModeToggle />
      </div>

      {/* 2. Daily Progress */}
      <DailyProgressCard />

      {/* 3. Theme of the Day */}
      <Card className="mt-4 bg-gradient-to-br from-surface-raised to-surface">
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

      {/* 4. Scripture */}
      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Scripture of the Day
        </p>
        <blockquote className="mt-2 border-l-2 border-gold pl-4 font-serif text-lg italic leading-relaxed text-foreground">
          &ldquo;{devotion.scripture_text}&rdquo;
        </blockquote>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm font-semibold text-gold-soft">{devotion.scripture_reference}</p>
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            BSB
          </span>
        </div>
      </Card>

      {/* 5. Devotion */}
      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Devotion</p>
        <p className="mt-2 leading-relaxed text-foreground/90">{devotion.devotion_text}</p>
      </Card>

      {/* 6. Prayer */}
      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Prayer</p>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/90">
          {devotion.prayer}
        </p>
      </Card>

      {/* 7. Reflection */}
      <ReflectionCard
        question={devotion.reflection_question}
        journalHref={`/journal?devotionId=${devotion.id}`}
      />

      {/* 8. Daily Challenge */}
      <Card className="mt-4 border-gold/30 bg-gold/5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
          <Target size={13} /> Today&apos;s Challenge
        </p>
        <p className="mt-2 font-serif text-lg leading-snug text-foreground">{dailyChallenge}</p>
      </Card>

      {/* Existing: Workout Motivation */}
      <Card className="mt-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
          <Dumbbell size={13} /> Workout Motivation
        </p>
        <p className="mt-2 font-serif text-lg leading-snug text-foreground">{motivation}</p>
      </Card>

      {/* Existing: Daily Movement Challenge (Gentle / Active) */}
      <Card className="mt-4 border-gold/30 bg-gold/5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
            <Flame size={13} /> Daily Movement Challenge
          </p>
          <Badge tone={profile.mode === "athlete" ? "ember" : "evergreen"}>
            {profile.mode === "athlete" ? "Active" : "Gentle"}
          </Badge>
        </div>
        <p className="mt-2 leading-relaxed text-foreground">{challenge}</p>
      </Card>

      {/* Existing: Favorites / Library actions */}
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
