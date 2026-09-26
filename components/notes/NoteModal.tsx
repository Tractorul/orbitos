"use client";

import { useState, useEffect } from "react";
import { ActionSheet } from "@/components/ui/ActionSheet";
import { Button } from "@/components/ui/Button";
import { NoteItem } from "@/types/notes";
import { Bookmark, Pin, Trash2 } from "lucide-react";
import { t } from "@/lib/i18n";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: NoteItem | null;
  onSave: (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate?: (id: string, updates: Partial<NoteItem>) => void;
  onDelete?: (id: string) => void;
}

export function NoteModal({
  isOpen,
  onClose,
  noteToEdit,
  onSave,
  onUpdate,
  onDelete,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [tag, setTag] = useState("");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setPinned(!!noteToEdit.pinned);
      setTag(noteToEdit.tag || "");
    } else {
      setTitle("");
      setContent("");
      setPinned(false);
      setTag("");
    }
  }, [noteToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (noteToEdit && onUpdate) {
      onUpdate(noteToEdit.id, {
        title: title.trim() || "Notiță fără titlu",
        content: content.trim(),
        pinned,
        tag: tag.trim() || undefined,
      });
    } else {
      onSave({
        title: title.trim() || "Notiță fără titlu",
        content: content.trim(),
        pinned,
        tag: tag.trim() || undefined,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (noteToEdit && onDelete) {
      onDelete(noteToEdit.id);
      onClose();
    }
  };

  const commonTags = ["Școală", "Personal", "Proiecte", "Idei", "Cumpărături", "Important"];

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={noteToEdit ? "Editează notița" : "Notiță nouă"}
      description={noteToEdit ? "Modifică ideile și notițele tale" : "Captează un gând, o listă sau o idee"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 pb-1">
        {/* Title & Pin Switch */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titlu notiță..."
            className="flex-1 glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setPinned(!pinned)}
            aria-label="Fixează notița"
            className={`p-3 rounded-2xl border transition-all ${
              pinned
                ? "bg-nord-8/20 border-nord-8 text-nord-8 shadow-[0_0_12px_rgba(136,192,208,0.3)]"
                : "bg-white/[0.04] border-white/[0.08] text-nord-4/40 hover:text-nord-6"
            }`}
          >
            <Pin className={`w-4 h-4 ${pinned ? "fill-nord-8" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Conținut notiță
          </label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrie notița ta aici..."
            className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Tag chips */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5 flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-nord-8" />
            <span>Etichetă</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {commonTags.map((tItem) => (
              <button
                type="button"
                key={tItem}
                onClick={() => setTag(tag === tItem ? "" : tItem)}
                className={`text-[11px] px-2.5 py-1 rounded-xl font-medium transition-all ${
                  tag === tItem
                    ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_0_10px_rgba(136,192,208,0.3)]"
                    : "bg-white/[0.04] text-nord-4/70 hover:bg-white/[0.08] hover:text-nord-6 border border-white/[0.06]"
                }`}
              >
                {tItem}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-3">
          {noteToEdit && onDelete && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              className="text-nord-11 hover:bg-nord-11/15 px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            {t.common.cancel}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="flex-1 font-bold shadow-[0_0_15px_rgba(136,192,208,0.3)]"
          >
            {noteToEdit ? t.common.save : "Salvează notița"}
          </Button>
        </div>
      </form>
    </ActionSheet>
  );
}
