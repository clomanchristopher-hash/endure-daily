"use client";

import { useState } from "react";
import { Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Devotion } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type FormState = Omit<Devotion, "tags"> & { tags: string };

const emptyForm: FormState = {
  id: "",
  title: "",
  theme: "",
  scripture_reference: "",
  scripture_text: "",
  devotion_text: "",
  prayer: "",
  reflection_question: "",
  leisure_challenge: "",
  athlete_challenge: "",
  tags: "",
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const { devotions, adminAddDevotion, adminUpdateDevotion, adminDeleteDevotion } = useAppState();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(devotion: Devotion) {
    setForm({ ...devotion, tags: devotion.tags.join(", ") });
    setEditingId(devotion.id);
    setFormOpen(true);
  }

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const id = editingId ?? (form.id.trim() || slugify(form.title));
    const devotion: Devotion = {
      id,
      title: form.title.trim(),
      theme: form.theme.trim(),
      scripture_reference: form.scripture_reference.trim(),
      scripture_text: form.scripture_text.trim(),
      devotion_text: form.devotion_text.trim(),
      prayer: form.prayer.trim(),
      reflection_question: form.reflection_question.trim(),
      leisure_challenge: form.leisure_challenge.trim(),
      athlete_challenge: form.athlete_challenge.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editingId) {
      adminUpdateDevotion(devotion);
    } else {
      adminAddDevotion(devotion);
    }
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="shrink-0 text-gold-soft" />
            <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="mt-1 text-sm text-muted">
            Add, edit, or remove devotions. Changes save to this browser only for now.
          </p>
        </div>
        {!formOpen && (
          <Button onClick={openNew} className="shrink-0">
            <Plus size={16} /> New Devotion
          </Button>
        )}
      </div>

      {formOpen && (
        <Card className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {editingId ? "Edit Devotion" : "New Devotion"}
            </h2>
            <button
              className="text-muted hover:text-foreground"
              onClick={() => setFormOpen(false)}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => handleField("title", e.target.value)}
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Theme">
                <input
                  required
                  value={form.theme}
                  onChange={(e) => handleField("theme", e.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="Scripture Reference">
                <input
                  required
                  value={form.scripture_reference}
                  onChange={(e) => handleField("scripture_reference", e.target.value)}
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Scripture Text">
              <textarea
                required
                rows={2}
                value={form.scripture_text}
                onChange={(e) => handleField("scripture_text", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Devotion Text">
              <textarea
                required
                rows={4}
                value={form.devotion_text}
                onChange={(e) => handleField("devotion_text", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Prayer">
              <textarea
                required
                rows={2}
                value={form.prayer}
                onChange={(e) => handleField("prayer", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Reflection Question">
              <input
                required
                value={form.reflection_question}
                onChange={(e) => handleField("reflection_question", e.target.value)}
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gentle Challenge">
                <textarea
                  required
                  rows={2}
                  value={form.leisure_challenge}
                  onChange={(e) => handleField("leisure_challenge", e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Active Challenge">
                <textarea
                  required
                  rows={2}
                  value={form.athlete_challenge}
                  onChange={(e) => handleField("athlete_challenge", e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>
            </div>
            <Field label="Tags (comma separated)">
              <input
                value={form.tags}
                onChange={(e) => handleField("tags", e.target.value)}
                className="admin-input"
                placeholder="strength, discipline, faith"
              />
            </Field>

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Save Changes" : "Create Devotion"}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {devotions.map((devotion) => (
          <Card key={devotion.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <Badge tone="gold" className="shrink-0">
                  {devotion.theme}
                </Badge>
                <p className="min-w-0 truncate text-xs text-muted">{devotion.id}</p>
              </div>
              <p className="mt-1 truncate font-serif text-base font-semibold text-foreground">
                {devotion.title}
              </p>
              <p className="truncate text-xs text-muted">{devotion.scripture_reference}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                aria-label="Edit"
                onClick={() => openEdit(devotion)}
                className="rounded-lg bg-surface-raised p-2 text-muted hover:text-gold-soft"
              >
                <Pencil size={16} />
              </button>
              <button
                aria-label="Delete"
                onClick={() => {
                  if (confirm(`Delete "${devotion.title}"? This cannot be undone.`)) {
                    adminDeleteDevotion(devotion.id);
                  }
                }}
                className="rounded-lg bg-surface-raised p-2 text-muted hover:text-ember"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}
