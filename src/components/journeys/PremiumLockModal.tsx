"use client";

import { Lock } from "lucide-react";
import { JourneyCategory } from "@/types";
import { premiumMessage } from "@/lib/data/journeys";
import { Button } from "@/components/ui/Button";

// Polished future-release message for locked premium journeys. No pricing or
// purchase yet — TODO(premium): replace with a real upgrade flow once IAP /
// subscriptions ship (RevenueCat / Apple IAP on iOS, Stripe on web).
export function PremiumLockModal({
  category,
  onClose,
}: {
  category: JourneyCategory | null;
  onClose: () => void;
}) {
  if (!category) return null;
  const msg = premiumMessage(category);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm [animation:celebrateIn_300ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border-subtle bg-surface p-8 text-center [animation:celebrateIn_450ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold-soft">
          <Lock size={22} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">
          {msg.eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold text-foreground">{msg.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{msg.body}</p>
        <Button className="mt-6 w-full" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}
