import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <input
        id={id}
        className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-gold/50"
        {...props}
      />
    </label>
  );
}
