# App Store Readiness — Endure Daily

Status notes for reviewers and the team on monetization and premium content.

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
