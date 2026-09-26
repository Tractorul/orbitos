"use client";

import { useState } from "react";
import { Search, Plus, Clock, FileText, Pin, Bookmark, Edit2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { NoteModal } from "@/components/notes/NoteModal";
import { useNotes } from "@/lib/notes/useNotes";
import { NoteItem } from "@/types/notes";
import { formatRomanianShortDate } from "@/lib/utils/dateUtils";
import { t } from "@/lib/i18n";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteItem | null>(null);

  const { notes, addNote, updateNote, togglePinned, deleteNote } = useNotes();

  const handleOpenAdd = () => {
    setNoteToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  // Collect all unique tags
  const tags = Array.from(new Set(notes.map((n) => n.tag).filter(Boolean))) as string[];

  const filteredNotes = notes
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.tag && n.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag ? n.tag === selectedTag : true;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const formatNoteTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const diffMins = Math.round((Date.now() - d.getTime()) / (1000 * 60));
      if (diffMins < 2) return "acum";
      if (diffMins < 60) return `acum ${diffMins} min`;
      const diffHours = Math.round(diffMins / 60);
      if (diffHours < 24) return `acum ${diffHours} ore`;
      return formatRomanianShortDate(d);
    } catch {
      return "recent";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-nord-6 tracking-tight">
            {t.notes.title}
          </h1>
          <p className="text-xs text-nord-4/60 font-medium mt-0.5">
            {notes.length} notițe salvate
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="rounded-full px-3.5 h-8 text-xs font-semibold shadow-[0_0_15px_rgba(136,192,208,0.35)]"
        >
          <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.8]" />
          <span>{t.notes.newNote}</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-nord-4/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.notes.searchPlaceholder}
          className="w-full glass-input rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
        />
      </div>

      {/* Tag filter bar */}
      {tags.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              selectedTag === null
                ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_0_10px_rgba(136,192,208,0.3)]"
                : "bg-white/[0.04] text-nord-4/60 hover:text-nord-6 hover:bg-white/[0.08]"
            }`}
          >
            Toate
          </button>
          {tags.map((tItem) => (
            <button
              key={tItem}
              onClick={() => setSelectedTag(selectedTag === tItem ? null : tItem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
                selectedTag === tItem
                  ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_0_10px_rgba(136,192,208,0.3)]"
                  : "bg-white/[0.04] text-nord-4/60 hover:text-nord-6 hover:bg-white/[0.08]"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>{tItem}</span>
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid / List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredNotes.length === 0 ? (
          <GlassCard className="p-8 sm:p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-nord-8">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-nord-5">
              {searchQuery ? t.notes.noResults : t.notes.empty}
            </p>
            <p className="text-xs text-nord-4/60 max-w-xs mx-auto">
              {searchQuery ? "Încearcă un alt termen de căutare" : t.notes.emptySubtext}
            </p>
            <div className="pt-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handleOpenAdd}
                className="text-xs text-nord-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Scrie prima notiță
              </Button>
            </div>
          </GlassCard>
        ) : (
          filteredNotes.map((note) => (
            <GlassCard
              key={note.id}
              onClick={() => handleOpenEdit(note)}
              className={`p-4 sm:p-5 hover:border-nord-8/30 transition-all duration-200 cursor-pointer group ${
                note.pinned ? "border-nord-8/30 bg-nord-8/[0.03]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {note.pinned && (
                    <Pin className="w-3.5 h-3.5 text-nord-8 fill-nord-8 shrink-0" />
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-nord-6 truncate group-hover:text-nord-8 transition-colors">
                    {note.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-nord-4/50 flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">
                    <Clock className="w-3 h-3" />
                    {formatNoteTime(note.updatedAt)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinned(note.id);
                    }}
                    title={note.pinned ? "Anulează fixarea" : "Fixează sus"}
                    className="text-nord-4/40 hover:text-nord-8 p-1 rounded-lg hover:bg-white/[0.04]"
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-nord-8 text-nord-8" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(note);
                    }}
                    className="text-nord-4/40 hover:text-nord-8 p-1 rounded-lg hover:bg-white/[0.04]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-nord-4/80 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                {note.content}
              </p>

              {note.tag && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-nord-9 bg-nord-9/10 border border-nord-9/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Bookmark className="w-2.5 h-2.5" />
                    {note.tag}
                  </span>
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNoteToEdit(null);
        }}
        noteToEdit={noteToEdit}
        onSave={addNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
    </div>
  );
}
