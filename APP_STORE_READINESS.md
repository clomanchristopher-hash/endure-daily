# App Store Readiness — Endure Daily

Status notes for reviewers and the team on monetization and premium content.

**Store listing copy:** see [`STORE_LISTING.md`](STORE_LISTING.md) for the app
name, subtitle, promotional text, full description, keywords, category
recommendation, "What's New", App Review notes, screenshot captions, and the
TestFlight invite message.

## Payments

- **Payments are not active in this version.** Endure Daily is fully usable for
  free — there is nothing to purchase and no checkout of any kind.
- **No Stripe or Apple In-App Purchase is currently enabled.** There is no
  payment SDK, price, paywall, or purchase button anywhere in the app.

## Premium Journeys

- **Premium Journeys are visible as future-release items**, not as purchasable
  products. They appear alongside the free previews so users can see what is
  being prepared, but they cannot be started or bought.
- **Free previews are fully available now:**
  - First 5K Preview (Running)
  - Foundation Strength Preview (Strength)
- Tapping a locked premium journey shows a polished, intentional message:
  > **Premium Journey Preview** — Premium Journeys will be available in a future
  > release. Full guided running and strength journeys are being prepared for a
  > future release.
- Locked journeys are presented as premium-ready previews, not as broken,
  disabled, or unfinished features.

## Future payment plan (not yet implemented)

When monetization is introduced, the planned approach is:

- **iOS:** RevenueCat / Apple In-App Purchase.
- **Web:** Stripe.

No pricing, entitlement checks, or purchase flows are wired up yet. The codebase
marks the integration points with `TODO(premium)` comments (see
`src/types/index.ts`, `src/lib/data/journeys.ts`, and the journey lock
components) so the access gate can be swapped for real entitlement later without
UI changes.

## Legal & Support

- **Privacy Policy** (`/privacy`), **Terms of Use** (`/terms`), and **Support**
  (`/support`) pages are in the app and reachable from the More menu, the
  desktop sidebar, and a "Legal & Support" section on Profile.
- Content reflects actual behavior: local-first storage, optional account/sync
  (Supabase), no ads/third-party tracking, no purchases, BSB attribution, and a
  contact email (`clomanchristopher@gmail.com`).

## PWA / installability (verified)

Verified in the browser at commit for this pass:

- **Web app manifest** (`/manifest.webmanifest`): `id` and `scope` set to `/`,
  `display: standalone`, `orientation: portrait`, `lang: en`, `dir: ltr`,
  `categories: [health, lifestyle]`, `background_color`/`theme_color` = `#0d1510`.
- **Icons** — all return HTTP 200:
  - `icon-192.png`, `icon-512.png` (purpose `any`)
  - `icon-maskable-192.png`, `icon-maskable-512.png` (purpose `maskable`, with a
    ~10% safe-zone so Android/PWA masks never clip the artwork). Source art kept
    at `assets/app-icon-source.png`.
- **Apple touch icon**: served at `/apple-icon.png` (180×180) via the Next
  `app/apple-icon.png` convention; `<link rel="apple-touch-icon">` present.
- **Theme color**: `<meta name="theme-color" content="#0d1510">` present.
- **iOS Add to Home Screen**: both `apple-mobile-web-app-capable` and
  `mobile-web-app-capable` = `yes`, plus `apple-mobile-web-app-title` =
  "Endure Daily" and `apple-mobile-web-app-status-bar-style` = `default`, so it
  launches standalone with the correct name and status bar.
- **Viewport / safe area**: `viewport-fit=cover` is set, and the fixed mobile
  bottom navigation applies `padding-bottom: env(safe-area-inset-bottom)` so it
  clears the iPhone home indicator (renders normally on devices without one).
- Earth-tone green palette and mobile responsiveness unchanged; no console
  errors; lint and build pass.

Note: this covers the installable **PWA / Add-to-Home-Screen** path. A native
App Store / TestFlight binary would still require a wrapper (e.g. Capacitor) and
its own native icon set — not part of this pass.

## Accessibility & QA polish (verified)

Light accessibility pass for WCAG compliance and mobile UX:

- **Focus states** — Added visible `outline: 2px solid var(--gold)` with 2px offset
  to all buttons, links, and inputs via CSS and Tailwind `focus-visible:*` utilities
  for keyboard navigation support. Users can now clearly see which element is focused
  when tabbing through the app.
- **Tap target sizes** — Increased button padding from `py-2.5` (10px) to `py-3`
  (12px) across the Board (Button component, DailyProgressCard, BottomNav, FeedbackButton,
  OnboardingFlow) to meet the recommended 44×44 px minimum; buttons now measure ~46px tall
  on mobile.
- **Icon-only buttons** — All icon-only buttons already have descriptive `aria-label`s:
  Close menu button in More sheet ("Close menu"), navigation links have visible text labels.
- **Color contrast** — Earth-tone palette (#0d1510 bg, #f4f1e6 text, #8faf7a gold accents)
  meets WCAG AA standards for normal text (4.5:1 minimum).
- **Mobile overflow** — No horizontal overflow; bottom nav includes `env(safe-area-inset-bottom)`
  padding for notched devices.
- **Keyboard accessibility** — Tab order follows visual flow; all interactive elements
  (buttons, links, form inputs) are keyboard-accessible; modals use `role="dialog"`
  and `aria-modal="true"`.

No app flows, features, or styling were changed — only accessibility enhancements.
