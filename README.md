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
    signup/ login/          Auth screens
    forgot-password/ reset-password/
  components/
    layout/                 SideNav, BottomNav, TopBar, nav-items
    ui/                     Card, Button, Badge, ModeToggle, StreakBadge, PremiumLockCard
    home/                    Greeting, DailyProgressCard, ReflectionCard (Home-only pieces)
    auth/                    AuthLayout, FormField, FormMessage, AccountSection
    devotion/                DevotionCard, DevotionDetailClient
    plans/                   PlanCard, PlanDetailClient
    journal/                 JournalPageClient
  context/
    AuthContext.tsx          Supabase session + auth methods (no-op offline)
    AppStateContext.tsx      App "database": profile, favorites, streak, checklist,
                              reflections, journal, admin overrides — localStorage first,
                              synced to Supabase when signed in
  lib/
    data/devotions.ts         Seed devotion data (12 entries) + daily rotation helper
    data/plans.ts              Seed plan data (5 plans)
    data/challenges.ts          General daily challenges + daily rotation helper
    motivation.ts               Theme + mode -> workout motivation copy
    storage.ts                   localStorage read/write helpers
    supabase/client.ts           Env-guarded Supabase browser client
    supabase/schema.sql          Run this once in the Supabase SQL editor
  types/index.ts                Shared TypeScript types (Devotion, Plan, JournalEntry, UserProfile)
```

## Authentication & data (Supabase)

The app has **optional** Supabase auth + sync. With no env vars it runs in **offline mode**
(everything in `localStorage`, single anonymous user). Add credentials to enable accounts and
cross-device sync. Either way, `localStorage` stays the offline fallback — the app never breaks
when the network or Supabase is unavailable.

### Enable it

1. Create a project at [supabase.com](https://supabase.com).
2. Run `src/lib/supabase/schema.sql` in the Supabase SQL editor (Dashboard → SQL → New query).
   It creates the tables, row-level-security policies, and a trigger that auto-creates a
   profile row on signup. Safe to re-run.
3. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).
4. (Optional) In Supabase → Authentication → URL Configuration, add your site URL and
   `…/reset-password` as redirect URLs so the password-reset email links back correctly.
5. Restart `npm run dev`.

### What syncs

| Data                                   | Where it lives                          |
| -------------------------------------- | --------------------------------------- |
| Name, email, mode (leisure/athlete)    | `profiles` table + auth user            |
| Streak / longest streak                | `profiles` table                        |
| Favorites                              | `favorites` table                       |
| Daily checklist (+ history for totals) | `daily_progress` table                  |
| Home reflection answers                | `reflections` table                     |
| Plans progress, admin edits, Journal   | `localStorage` only (future sprint)     |

### How it works

- `src/lib/supabase/client.ts` builds the browser client **only if** the env vars exist;
  otherwise it exports `null` and `isSupabaseConfigured = false`.
- `src/context/AuthContext.tsx` owns the session and the `signUp` / `signIn` / `signOut` /
  `requestPasswordReset` / `updatePassword` methods, with friendly error messages. Every method
  no-ops with a friendly notice when Supabase isn't configured.
- `src/context/AppStateContext.tsx` loads from `localStorage` first (fast, offline), then — if
  signed in — hydrates from Supabase and mirrors every write back to it. All mutators use
  functional state updates so rapid taps never clobber each other.
- Auth screens live at `/signup`, `/login`, `/forgot-password`, `/reset-password`.

Admin content (devotions/plans) is still seeded from `src/lib/data/` and layered with a
local overrides map — that's intentionally not user-synced.

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
