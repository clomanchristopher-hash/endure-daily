import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FormMessage({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  const isError = tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
        isError
          ? "border-ember/40 bg-ember/10 text-ember"
          : "border-evergreen/40 bg-evergreen/10 text-evergreen"
      }`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="text-foreground/90">{children}</span>
    </div>
  );
}
