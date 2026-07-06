import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Support — Endure Daily",
  description: "Get help with Endure Daily.",
};

const EMAIL = "clomanchristopher@gmail.com";
const SUPPORT_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Endure Daily Support")}`;

export default function SupportPage() {
  return (
    <LegalShell title="Support" updated="July 2026">
      <LegalSection heading="Get help">
        <p>
          Need a hand or have a question? Email us any time at{" "}
          <a href={SUPPORT_MAILTO} className="font-semibold text-gold-soft hover:text-gold">
            {EMAIL}
          </a>
          . You can also use the Send Feedback option in the More menu.
        </p>
      </LegalSection>

      <LegalSection heading="Common questions">
        <p>
          <span className="font-semibold text-foreground">Where is my data stored?</span> On your
          device by default. If you create an account, some data also syncs to your account so it
          carries across devices.
        </p>
        <p>
          <span className="font-semibold text-foreground">Can I use the app offline?</span> Yes.
          An account is optional — Endure Daily works fully offline.
        </p>
        <p>
          <span className="font-semibold text-foreground">How do I start over?</span> Use Reset
          Onboarding in the More menu to run the personalization flow again.
        </p>
        <p>
          <span className="font-semibold text-foreground">Are the premium journeys available?</span>{" "}
          The free previews are available now. Full guided Premium Journeys are being prepared for
          a future release and are not purchasable yet.
        </p>
      </LegalSection>

      <LegalSection heading="Response time">
        <p>
          Endure Daily is a small project. We read every message and aim to reply as soon as we
          reasonably can.
        </p>
      </LegalSection>

      <LegalSection heading="More">
        <p>
          See our{" "}
          <Link href="/privacy" className="font-semibold text-gold-soft hover:text-gold">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-gold-soft hover:text-gold">
            Terms of Use
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
