import { NoteItem } from "@/types/notes";

const NOTES_STORAGE_KEY = "orbit_notes_v1";
const NOTES_EVENT = "orbit_notes_updated";

const DEMO_NOTE_IDS = new Set(["note-1", "note-2", "note-3", "1", "2", "3"]);

export function getDefaultNotes(): NoteItem[] {
  return [];
}

export function getStoredNotes(): NoteItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((n) => !DEMO_NOTE_IDS.has(n.id));
        if (cleaned.length !== parsed.length) {
          saveStoredNotes(cleaned);
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("[noteStore] Failed to read notes from localStorage", err);
  }
  return [];
}

export function saveStoredNotes(notes: NoteItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    window.dispatchEvent(new Event(NOTES_EVENT));
  } catch (err) {
    console.warn("[noteStore] Failed to save notes to localStorage", err);
  }
}

export function addNote(note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">): NoteItem {
  const current = getStoredNotes();
  const now = new Date().toISOString();
  const newNote: NoteItem = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  const updated = [newNote, ...current];
  saveStoredNotes(updated);
  return newNote;
}

export function updateNote(id: string, updates: Partial<NoteItem>): void {
  const current = getStoredNotes();
  const updated = current.map((n) =>
    n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
  );
  saveStoredNotes(updated);
}

export function toggleNotePinned(id: string): void {
  const current = getStoredNotes();
  const updated = current.map((n) =>
    n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
  );
  saveStoredNotes(updated);
}

export function deleteNote(id: string): void {
  const current = getStoredNotes();
  const updated = current.filter((n) => n.id !== id);
  saveStoredNotes(updated);
}

export function subscribeToNotes(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(NOTES_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(NOTES_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
