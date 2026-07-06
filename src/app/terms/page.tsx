import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Use — Endure Daily",
  description: "The terms for using Endure Daily.",
};

const EMAIL = "clomanchristopher@gmail.com";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Use" updated="July 2026">
      <LegalSection heading="Acceptance">
        <p>
          By using Endure Daily, you agree to these terms. The app is offered free of charge for
          personal devotional and general wellness use.
        </p>
      </LegalSection>

      <LegalSection heading="Not medical advice">
        <p>
          Endure Daily provides general movement, devotional, and encouragement content. It is
          not medical, health, or professional advice. Move at your own pace, modify exercises as
          needed, and consult a qualified professional before beginning a new training program.
          You are responsible for exercising safely.
        </p>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          There are no purchases in this version of the app. Nothing is for sale, and no payment
          information is collected. Premium Journeys are shown as future-release previews and are
          not available to buy.
        </p>
      </LegalSection>

      <LegalSection heading="Your content">
        <p>
          Reflections and journal entries you write are yours. They are stored on your device (and
          in your account if you create one). You are responsible for the content you enter.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Please use Endure Daily lawfully and as intended. Do not attempt to disrupt, misuse, or
          reverse-engineer the app.
        </p>
      </LegalSection>

      <LegalSection heading="Scripture">
        <p>Scripture quotations are from the Berean Standard Bible (BSB).</p>
      </LegalSection>

      <LegalSection heading="Disclaimer and liability">
        <p>
          The app is provided &ldquo;as is,&rdquo; without warranties of any kind. To the extent
          permitted by law, the app owner is not liable for any injury, loss, or damages arising
          from your use of the app or its content.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          These terms may be updated as the app evolves; the &ldquo;Last updated&rdquo; date above
          reflects the current version.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${EMAIL}`} className="font-semibold text-gold-soft hover:text-gold">
            {EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
