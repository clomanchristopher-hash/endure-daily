import { Mail } from "lucide-react";

// Feedback goes to the app owner. Swap this address to change the recipient.
const FEEDBACK_EMAIL = "clomanchristopher@gmail.com";
const SUBJECT = "Endure Daily Feedback";
const BODY = `Hey Chris,

Here's my feedback on Endure Daily:

What I liked:

What confused me:

What I would change:

Feature I would like to see:

Would I use this daily? Yes / No / Maybe

Additional thoughts:
`;

const mailtoHref = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
  SUBJECT
)}&body=${encodeURIComponent(BODY)}`;

export function FeedbackButton({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 text-center text-xs text-muted">
        Help shape the future of Endure Daily.
      </p>
      <a
        href={mailtoHref}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-surface-raised px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-border-subtle"
      >
        <Mail size={16} />
        Send Feedback
      </a>
    </div>
  );
}
