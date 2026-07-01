# Endure Daily

A mobile-first faith and fitness devotional web app. Daily Scripture, a short devotion,
prayer, reflection question, workout motivation, and a movement challenge — for Christians
who want to grow spiritually and physically, whether that's a casual walk or a competitive
training session.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. Data currently lives
in local files + `localStorage`, structured so it can be swapped for Supabase later without
touching the UI (see below).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The bottom nav (mobile) / left sidebar
(desktop, ≥768px) covers all 8 pages: Home, Library, Fitness, Plans, Journal, Favorites,
Profile, and Admin.

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Project Structure

```
src/
  app/                     Routes (App Router)
    page.tsx               Home / Today's Devotion
    library/                Devotion Library (+ /library/[id] detail)
    fitness/                Fitness Motivation
    plans/                  Plans (+ /plans/[id] detail)
    journal/                Journal
    favorites/              Favorites
    profile/                Profile
    admin/                  Admin Dashboard
  components/
    layout/                 SideNav, BottomNav, TopBar, nav-items
    ui/                     Card, Button, Badge, ModeToggle, StreakBadge, PremiumLockCard
    home/                    Greeting, DailyProgressCard, ReflectionCard (Home-only pieces)
    devotion/                DevotionCard, DevotionDetailClient
    plans/                   PlanCard, PlanDetailClient
    journal/                 JournalPageClient
  context/
    AppStateContext.tsx      Client-side "database": profile, favorites, streak,
                              journal entries, admin devotion overrides — all persisted
                              to localStorage
  lib/
    data/devotions.ts         Seed devotion data (12 entries) + daily rotation helper
    data/plans.ts              Seed plan data (5 plans)
    data/challenges.ts          General daily challenges + daily rotation helper
    motivation.ts               Theme + mode -> workout motivation copy
    storage.ts                   localStorage read/write helpers
  types/index.ts                Shared TypeScript types (Devotion, Plan, JournalEntry, UserProfile)
```

## How data works today

Everything is local:

- **Devotions & Plans** ship as static arrays in `src/lib/data/`.
- **Admin edits** (add/edit/delete) are stored as an "overrides" map + a deleted-id list in
  `localStorage`, and merged with the seed data at read time
  (`AppStateContext.tsx` → `mergeDevotions`). This means the original seed file is never
  mutated — admin changes are a diff layer on top of it.
- **Profile, favorites, streak, plan progress, and journal entries** all live in
  `localStorage` under the `endure-daily:` prefix (see `src/lib/storage.ts`).
- **Streak** is recalculated once per session on mount by comparing the last visit date to
  today/yesterday — no manual "check-in" button required.

## Connecting Supabase later

The local layer was written so the swap is mechanical, not a rewrite:

1. **Types stay the same.** `src/types/index.ts` already mirrors what your Supabase tables
   should look like: `devotions`, `plans`, `journal_entries`, and a `profiles` table
   (favorites/streak/plan_progress can stay JSON columns or become their own tables).
2. **Replace `src/lib/data/*.ts` reads** with Supabase queries (e.g. `supabase.from('devotions').select()`),
   or keep them as a fallback/seed script for `supabase db seed`.
3. **Replace `src/lib/storage.ts`** with a Supabase-backed equivalent (e.g. `getProfile` /
   `upsertProfile` calling the client), and swap `AppStateContext`'s `useEffect` hydration
   step for a fetch against the authenticated user's row instead of `readJSON`.
4. **Admin Dashboard** already isolates all mutations behind `adminAddDevotion` /
   `adminUpdateDevotion` / `adminDeleteDevotion` in `AppStateContext` — point those at
   `supabase.from('devotions').insert/update/delete` instead of the overrides map.
5. Add Supabase Auth for real user accounts (the app currently assumes a single anonymous
   local user).

No page or component needs to change — they all go through `useAppState()`.

## Design

- Dark, masculine, faith-centered palette (navy background, warm gold accent, ember/evergreen
  for status) — see CSS variables in `src/app/globals.css`.
- `Fraunces` (serif) for headings, `Inter` for body — set up in `src/app/layout.tsx`.
- Mobile-first: bottom nav + "More" sheet under 768px, full sidebar above.

## Premium placeholders

Profile page includes "Coming Soon" cards for: Premium Devotion Plans, Team Devotion Packs,
Prayer Reminders, Stripe Subscription, and Coach/Team Dashboard. These are UI-only stubs
(`PremiumLockCard`) with no backend wired up yet.

## Deploying

This is a standard Next.js app — deploys as-is to Vercel, or anywhere that supports Node.
No environment variables are required until Supabase/Stripe are wired in.
