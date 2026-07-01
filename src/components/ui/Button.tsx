import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold text-[#1a1204] hover:bg-gold-soft",
  secondary: "bg-surface-raised text-foreground hover:bg-border-subtle",
  ghost: "bg-transparent text-muted hover:bg-surface-raised hover:text-foreground",
  outline: "border border-border-subtle text-foreground hover:bg-surface-raised",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
