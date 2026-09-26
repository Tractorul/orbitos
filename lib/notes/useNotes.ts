"use client";

import { useState, useEffect, useCallback } from "react";
import { NoteItem } from "@/types/notes";
import {
  getStoredNotes,
  addNote as storeAddNote,
  updateNote as storeUpdateNote,
  toggleNotePinned as storeTogglePinned,
  deleteNote as storeDeleteNote,
  subscribeToNotes,
} from "./noteStore";

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const data = getStoredNotes();
    setNotes(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToNotes(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const addNote = useCallback((note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => {
    return storeAddNote(note);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<NoteItem>) => {
    storeUpdateNote(id, updates);
  }, []);

  const togglePinned = useCallback((id: string) => {
    storeTogglePinned(id);
  }, []);

  const deleteNote = useCallback((id: string) => {
    storeDeleteNote(id);
  }, []);

  return {
    notes,
    isLoaded,
    addNote,
    updateNote,
    togglePinned,
    deleteNote,
    refresh,
  };
}
