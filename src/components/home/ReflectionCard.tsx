"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, NotebookPen, Save } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { todayKey } from "@/lib/storage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ReflectionCard({
  question,
  journalHref,
}: {
  question: string;
  journalHref: string;
}) {
  const { ready, dailyReflections, saveDailyReflection } = useAppState();
  const today = todayKey();
  const savedToday = (dailyReflections[today] ?? "").trim().length > 0;

  return (
    <Card className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Today&apos;s Reflection
      </p>
      <p className="mt-2 font-serif text-lg text-foreground">{question}</p>

      {/* Mount the form only after state hydrates so the saved answer seeds the
          textarea without a hydration mismatch. */}
      {ready && (
        <ReflectionForm
          key={today}
          initial={dailyReflections[today] ?? ""}
          onSave={(text) => saveDailyReflection(today, text)}
        />
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <Link
          href={journalHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft hover:text-gold"
        >
          <NotebookPen size={15} />
          Open Journal
        </Link>
        {ready && savedToday && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-evergreen">
            <Check size={13} /> Saved to Journal
          </span>
        )}
      </div>
    </Card>
  );
}

function ReflectionForm({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = text !== initial;

  function handleSave() {
    onSave(text.trim());
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (justSaved) setJustSaved(false);
        }}
        placeholder="Type your answer here..."
        rows={3}
        className="w-full resize-none rounded-lg border border-border-subtle bg-surface-raised p-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-gold/50"
      />
      <div className="mt-2 flex items-center justify-end gap-3">
        {justSaved && (
          <span className="flex items-center gap-1 text-xs font-medium text-evergreen">
            <Check size={14} /> Saved
          </span>
        )}
        <Button onClick={handleSave} disabled={!dirty && !text.trim()}>
          <Save size={15} />
          Save Reflection
        </Button>
      </div>
    </div>
  );
}
