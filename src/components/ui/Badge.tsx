import { HTMLAttributes } from "react";

type Tone = "gold" | "muted" | "ember" | "evergreen";

const toneClasses: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold-soft",
  muted: "bg-surface-raised text-muted",
  ember: "bg-ember/15 text-ember",
  evergreen: "bg-evergreen/15 text-evergreen",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "muted", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
