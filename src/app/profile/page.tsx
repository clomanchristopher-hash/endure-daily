"use client";

import Link from "next/link";
import {
  Bell,
  BookOpenText,
  CheckCircle2,
  Crown,
  Dumbbell,
  Flame,
  Heart,
  NotebookPen,
  RotateCcw,
  Trophy,
  Users,
  CreditCard,
} from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { PremiumLockCard } from "@/components/ui/PremiumLockCard";
import { AccountSection } from "@/components/auth/AccountSection";

export default function ProfilePage() {
  const {
    profile,
    journalEntries,
    updateDisplayName,
    totalDevotionDays,
    totalWorkouts,
    resetOnboarding,
  } = useAppState();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Profile</h1>

      <Card className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          Display Name
        </label>
        <input
          value={profile.display_name}
          onChange={(e) => updateDisplayName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-gold/50"
        />

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Training Mode
          </p>
          <ModeToggle className="mt-2" />
        </div>
      </Card>

      {/* Account: sign in / out and email (syncs when Supabase is connected) */}
      <AccountSection />

      <Button variant="outline" className="mt-4 w-full" onClick={resetOnboarding}>
        <RotateCcw size={15} /> Reset Onboarding
      </Button>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="flex flex-col items-center justify-center gap-1 py-5 text-center">
          <Flame size={20} className="text-ember" />
          <p className="text-2xl font-bold text-foreground">{profile.streak}</p>
          <p className="text-xs text-muted">Current Streak</p>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-1 py-5 text-center">
          <Trophy size={20} className="text-gold-soft" />
          <p className="text-2xl font-bold text-foreground">{profile.longest_streak}</p>
          <p className="text-xs text-muted">Longest Streak</p>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-1 py-5 text-center">
          <CheckCircle2 size={20} className="text-evergreen" />
          <p className="text-2xl font-bold text-foreground">{totalDevotionDays}</p>
          <p className="text-xs text-muted">Devotion Days</p>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-1 py-5 text-center">
          <Dumbbell size={20} className="text-gold-soft" />
          <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
          <p className="text-xs text-muted">Workouts Done</p>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/journal">
          <Card className="flex items-center gap-3 hover:border-gold/40">
            <NotebookPen size={18} className="text-gold-soft" />
            <div>
              <p className="text-lg font-bold text-foreground">{journalEntries.length}</p>
              <p className="text-xs text-muted">Journal Entries</p>
            </div>
          </Card>
        </Link>
        <Link href="/favorites">
          <Card className="flex items-center gap-3 hover:border-gold/40">
            <Heart size={18} className="text-ember" />
            <div>
              <p className="text-lg font-bold text-foreground">{profile.favorites.length}</p>
              <p className="text-xs text-muted">Favorites</p>
            </div>
          </Card>
        </Link>
      </div>

      {profile.active_plan_id && (
        <Link href={`/plans/${profile.active_plan_id}`}>
          <Card className="mt-4 flex items-center gap-3 border-gold/30 bg-gold/5 hover:border-gold/50">
            <BookOpenText size={18} className="text-gold-soft" />
            <div>
              <p className="text-sm font-semibold text-foreground">Active Plan</p>
              <p className="text-xs text-muted">
                {profile.plan_progress[profile.active_plan_id] ?? 0} days complete
              </p>
            </div>
          </Card>
        </Link>
      )}

      <div className="mt-10 flex items-center gap-2">
        <Crown size={18} className="text-gold-soft" />
        <h2 className="font-serif text-lg font-semibold text-foreground">Premium — Coming Soon</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Endure Daily is free today. These features are in development for future release.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PremiumLockCard
          icon={Crown}
          title="Premium Devotion Plans"
          description="Deeper multi-week series for advanced training and spiritual growth."
        />
        <PremiumLockCard
          icon={Users}
          title="Team Devotion Packs"
          description="Share devotions with your team, gym, or small group."
        />
        <PremiumLockCard
          icon={Bell}
          title="Prayer Reminders"
          description="Scheduled push notifications to pray and train consistently."
        />
        <PremiumLockCard
          icon={CreditCard}
          title="Stripe Subscription"
          description="Manage your subscription and billing directly in-app."
        />
        <PremiumLockCard
          icon={Trophy}
          title="Coach / Team Dashboard"
          description="Coaches can assign devotions and track team engagement."
        />
      </div>

      <p className="mt-10 border-t border-border-subtle pt-6 text-center text-xs text-muted">
        Scripture quotations are from the Berean Standard Bible (BSB).
      </p>
    </div>
  );
}
