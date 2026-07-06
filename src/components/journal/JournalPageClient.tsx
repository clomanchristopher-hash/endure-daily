"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { todayKey } from "@/lib/storage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function JournalPageClient() {
  const searchParams = useSearchParams();
  const devotionIdParam = searchParams.get("devotionId");
  const { devotions, journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } =
    useAppState();

  const linkedDevotion = devotionIdParam ? devotions.find((d) => d.id === devotionIdParam) : null;

  const [content, setContent] = useState(() =>
    linkedDevotion ? `Reflecting on "${linkedDevotion.title}":\n` : ""
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Newest date first so today's entries (incl. the synced reflection) sit up top.
  const sortedEntries = [...journalEntries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at)
  );

  function handleSave() {
    if (!content.trim()) return;
    addJournalEntry({
      devotion_id: linkedDevotion?.id ?? null,
      devotion_title: linkedDevotion?.title ?? null,
      date: todayKey(),
      content: content.trim(),
    });
    setContent("");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Journal</h1>
      <p className="mt-1 text-sm text-muted">
        Reflections are saved privately on this device.
      </p>

      <Card className="mt-4">
        {linkedDevotion && (
          <Badge tone="gold" className="mb-2">
            {linkedDevotion.title}
          </Badge>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is God showing you today?"
          rows={5}
          className="w-full resize-none rounded-lg border border-border-subtle bg-surface-raised p-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-gold/50"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={handleSave} disabled={!content.trim()}>
            <Save size={15} />
            Save Reflection
          </Button>
        </div>
      </Card>

      <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">Past Entries</h2>
      <div className="mt-3 flex flex-col gap-3">
        {journalEntries.length === 0 && (
          <p className="text-sm text-muted">No entries yet. Your first reflection starts above.</p>
        )}
        {sortedEntries.map((entry) => {
          const isReflection = entry.source === "reflection";
          return (
          <Card key={entry.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {entry.date}
                </p>
                {isReflection ? (
                  <Badge tone="gold" className="mt-1">
                    Today&apos;s Reflection
                  </Badge>
                ) : (
                  entry.devotion_title && (
                    <Badge tone="gold" className="mt-1">
                      {entry.devotion_title}
                    </Badge>
                  )
                )}
              </div>
              {/* Reflection entries are synced from the Today screen — edit them
                  there to keep the two in step. */}
              {!isReflection && (
                <div className="flex gap-2">
                  <button
                    aria-label="Edit entry"
                    className="text-muted hover:text-gold-soft"
                    onClick={() => {
                      setEditingId(entry.id);
                      setEditContent(entry.content);
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    aria-label="Delete entry"
                    className="text-muted hover:text-ember"
                    onClick={() => deleteJournalEntry(entry.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>

            {!isReflection && editingId === entry.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border-subtle bg-surface-raised p-3 text-sm text-foreground outline-none focus:border-gold/50"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    <X size={14} /> Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      updateJournalEntry(entry.id, editContent.trim());
                      setEditingId(null);
                    }}
                  >
                    <Save size={14} /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {entry.content}
              </p>
            )}
          </Card>
          );
        })}
      </div>
    </div>
  );
}
