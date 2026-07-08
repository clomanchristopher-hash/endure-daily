# Capacitor/TestFlight Preparation — Endure Daily

Status: **Capacitor setup prepared; static export implemented; iOS platform not yet initialized (requires Mac).**

## What is Capacitor?

Capacitor is a bridge that wraps a web app (React, Next.js, Vue, etc.) into a native iOS/Android shell. It allows the web app to:
- Run on iOS/Android as a native app
- Access native APIs (camera, location, etc.) through JavaScript
- Install from the App Store or via TestFlight
- Have a native app icon on the home screen

For Endure Daily, Capacitor enables one codebase (the Next.js React app) to run on the web (PWA) and on iOS/Android (via Capacitor) without duplicating the UI.

## Current Status

### What was installed

- **Capacitor Core** (`@capacitor/core`) — runtime library for native bridge
- **Capacitor CLI** (`@capacitor/cli`) — command-line tools to manage the project
- **Capacitor iOS** (`@capacitor/ios`) — iOS-specific wrapper (dev dependency)

### What was configured

- **Capacitor config file** (`capacitor.config.json`):
  - `appId`: `com.enduredaily.app`
  - `appName`: `Endure Daily`
  - `webDir`: `out` (static output directory)

### What was added to npm scripts

```bash
npm run cap:sync      # Sync web files to iOS app
npm run cap:open:ios  # Open Xcode to build/test
npm run cap:add:ios   # Initialize iOS platform (one-time, on Mac)
```

### What still requires Mac/Xcode

The following tasks **must be done on a Mac with Xcode installed**:

1. **Run `npm run cap:add:ios`** — Initializes the iOS platform
   - Creates the `ios/` directory with Xcode project files
   - Sets up code signing identifiers
   - **Requires**: Mac, Xcode 14+, Apple Developer Account

2. **Run `npm run cap:open:ios`** — Opens Xcode
   - Allows you to build and test on simulator or device
   - Requires setting up signing certificates and provisioning profiles
   - **Requires**: Mac, Xcode 14+, Apple Developer Account

3. **Archive and upload to TestFlight**
   - Done in Xcode: `Product > Archive`
   - Then upload via Xcode or Transporter to App Store Connect
   - **Requires**: Mac, Xcode 14+, Apple Developer Account

4. **Set up App Store Connect project**
   - Create the app entry, TestFlight access, and submission page
   - **Requires**: Apple Developer Program membership ($99/year)

## Static Export Status

### Current State

✅ **Static export is now IMPLEMENTED and working.**

The app now uses `output: "export"` in `next.config.ts` and builds as static HTML/JS/CSS files in the `out/` directory.

**Build output:** 6.8 MB of static files containing:
- All route pages pre-rendered as HTML
- JavaScript bundles for client-side interactivity
- CSS stylesheets
- Images and assets
- manifest.webmanifest for PWA

### How It Works

All dynamic routes now use `generateStaticParams` to pre-render all possible pages at build time:

- **`/journeys/[id]`** — 12 journey detail pages pre-generated
- **`/library/[id]`** — 13 devotion detail pages pre-generated
- **`/plans/[id]`** — 5 plan detail pages pre-generated

Example from `src/app/journeys/[id]/page.tsx`:
```typescript
import { journeys } from "@/lib/data/journeys";

export async function generateStaticParams() {
  return journeys.map((journey) => ({
    id: journey.id,
  }));
}
```

The manifest.webmanifest is also marked as static with `export const dynamic = "force-static"`.

### How Capacitor Uses It

When you run `npm run build`:
1. Next.js compiles all pages to static HTML in `out/`
2. `npm run cap:sync ios` copies `out/` to the iOS app's web assets
3. The iOS app serves these static files instead of connecting to a server

**Result:** Smaller app size, faster load time, no server dependency.

### What Was Changed

- `next.config.ts` — Added `output: "export"`
- `src/app/manifest.ts` — Added `export const dynamic = "force-static"`
- `src/app/journeys/[id]/page.tsx` — Added `generateStaticParams`
- `src/app/library/[id]/page.tsx` — Added `generateStaticParams`
- `src/app/plans/[id]/page.tsx` — Added `generateStaticParams`

### Ready for Next Phase

The app is now **fully ready for Capacitor iOS builds**. No server required; all content is static.

---

## Future Workflow (after Mac/Xcode setup)

Once the iOS platform is initialized on a Mac, the typical workflow is:

### 1. Build the web app
```bash
npm run build
```
Output goes to `out/` (static export is now the default).

### 2. Sync to iOS
```bash
npm run cap:sync ios
```
Copies `out/` to the iOS app's web assets.

### 3. Open in Xcode
```bash
npm run cap:open:ios
```
Xcode launches; you can now:
- Test on simulator or real device
- Build for release

### 4. Archive in Xcode
```
Product → Archive
```

### 5. Upload to App Store Connect
```
Xcode → Organizer → Archives → [Select build] → Distribute App
```
Choose "TestFlight" or "App Store".

### 6. TestFlight Review
- Apple reviews the build (usually 1–24 hours)
- Once approved, invite testers via TestFlight link
- Testers download the app and send feedback

---

## Important Notes

### Payments

- **Payments are NOT active** in this version.
- No Stripe, Apple In-App Purchase, or RevenueCat is wired up.
- The app is fully usable for free.
- No paywall or purchase button is shown anywhere.

When payments are introduced in a future release, the entitlement gates are marked with `TODO(premium)` comments in the codebase.

### Push Notifications

- **Push notifications are NOT active** in this version.
- No permission requests or push APIs are implemented.
- The app stores data locally and syncs optionally to Supabase; no server pushes data to the device.

Push notifications can be added in a future release once the native iOS wrapper is stable. At that time, Capacitor plugins like `@capacitor/push-notifications` can be added.

### Local Notifications (Future)

Once the iOS app is stable, consider adding local device notifications (reminders to pray, move, etc.) using native APIs. This is different from server-side push and does not require backend infrastructure.

### Storage & Sync

The app is **offline-first**:
- All data is stored in `localStorage` (web) / `AsyncStorage` equivalent (iOS via Capacitor).
- Optional Supabase sync is available for account holders; data syncs only when the user is signed in.
- No data is required to be online to use the app.

---

## Apple Developer Program

To submit to TestFlight or the App Store, you need:

- **Apple Developer Program membership**: $99/year (required)
- **Team ID** and **app ID prefix** from Apple Developer portal
- **Code signing certificates** and **provisioning profiles** set up in Xcode
- **App Store Connect** project created for the app

These are one-time setup tasks on the Apple side; they're handled during the Mac/Xcode phase.

---

## Build & Lint Status

At the time of this commit:

- ✅ `npm run lint` — Passes
- ✅ `npm run build` — Passes (server-rendered Next.js build)
- ✅ Capacitor config validated
- ✅ No breaking changes to existing web app

---

## Next Steps

1. **When ready for native development**:
   - Schedule a Mac with Xcode access
   - Run `npm run cap:add:ios` to initialize the iOS platform
   - Set up Apple Developer Account and create App Store Connect project

2. **Before first TestFlight upload**:
   - Decide on static export approach (see "Static Export Status" above)
   - If static export: implement `generateStaticParams` and test `npm run build`
   - If server-side rendering: set up node server hosting (more complex)

3. **During beta testing**:
   - Test on real iPhone (not just simulator)
   - Verify local storage, Supabase sync, and all flows work
   - Collect feedback via TestFlight
   - Make bug fixes and prepare for App Store submission

---

## Related Documentation

- [`APP_STORE_READINESS.md`](APP_STORE_READINESS.md) — Payments, premium journeys, PWA readiness
- [`STORE_LISTING.md`](STORE_LISTING.md) — App Store copy and screenshots
- [`README.md`](README.md) — Developer setup and architecture
