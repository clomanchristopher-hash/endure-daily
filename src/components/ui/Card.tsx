import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm shadow-black/20 ${className}`}
      {...props}
    />
  );
}
