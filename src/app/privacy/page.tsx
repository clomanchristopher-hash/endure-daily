import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Endure Daily",
  description: "How Endure Daily handles your information.",
};

const EMAIL = "clomanchristopher@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="July 2026">
      <LegalSection heading="Overview">
        <p>
          Endure Daily is a faith and fitness devotional app. It is built to work privately on
          your device. This policy explains what information the app stores and how it is used.
        </p>
      </LegalSection>

      <LegalSection heading="Information stored on your device">
        <p>
          By default, everything you enter stays on your device in local storage and is not sent
          anywhere. This includes your name, daily reflections, journal entries, daily progress
          and streaks, favorites, and movement-journey progress.
        </p>
      </LegalSection>

      <LegalSection heading="Optional account and sync">
        <p>
          Creating an account is optional. If you sign up, your email address and a portion of
          your app data — your display name, movement mode, streak, favorites, daily checklist,
          and reflections — are stored in our secure database (Supabase) so they can sync across
          your devices. If you never create an account, no data leaves your device.
        </p>
      </LegalSection>

      <LegalSection heading="What we do not do">
        <p>
          Endure Daily does not show ads, does not use third-party advertising or analytics
          tracking, and does not sell or share your personal information. There are no purchases
          in the app, so no payment or billing information is collected.
        </p>
      </LegalSection>

      <LegalSection heading="Feedback you send">
        <p>
          The Send Feedback option opens your own email app with a pre-filled message. Only what
          you choose to write and send is shared, and it is sent directly to the app owner.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can use the app fully offline without an account. You can clear your locally stored
          data at any time by clearing the app&apos;s storage in your browser or device, or by
          using Reset Onboarding in the More menu. To request deletion of an account and its
          synced data, contact us at the email below.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          Endure Daily is a general-audience app and is not directed to children under 13.
        </p>
      </LegalSection>

      <LegalSection heading="Scripture">
        <p>Scripture quotations are from the Berean Standard Bible (BSB).</p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy as the app evolves. Material changes will be reflected by the
          &ldquo;Last updated&rdquo; date above.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a href={`mailto:${EMAIL}`} className="font-semibold text-gold-soft hover:text-gold">
            {EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
