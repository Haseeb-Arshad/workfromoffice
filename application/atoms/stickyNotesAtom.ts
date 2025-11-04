import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type StickyNoteColor = "yellow" | "pink" | "green" | "blue" | "purple" | "orange";

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: StickyNoteColor;
  x: number; // px relative to canvas left
  y: number; // px relative to canvas top
  z: number; // stacking order
  createdAt: string; // ISO
}

export const stickyNotesAtom = atomWithStorage<StickyNote[]>("wfcos-sticky-notes", []);

export const addStickyNoteAtom = atom(null, (get, set, note: Omit<StickyNote, "id" | "z" | "createdAt">) => {
  const existing = get(stickyNotesAtom);
  const maxZ = existing.reduce((m, n) => Math.max(m, n.z), 0);
  const newNote: StickyNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    z: maxZ + 1,
    createdAt: new Date().toISOString(),
    ...note,
  };
  set(stickyNotesAtom, [...existing, newNote]);
});

export const updateStickyNoteAtom = atom(null, (get, set, update: Partial<StickyNote> & { id: string }) => {
  const existing = get(stickyNotesAtom);
  set(
    stickyNotesAtom,
    existing.map((n) => (n.id === update.id ? { ...n, ...update } : n))
  );
});

export const deleteStickyNoteAtom = atom(null, (get, set, id: string) => {
  const existing = get(stickyNotesAtom);
  set(stickyNotesAtom, existing.filter((n) => n.id !== id));
});

export const bringNoteToFrontAtom = atom(null, (get, set, id: string) => {
  const notes = get(stickyNotesAtom);
  const maxZ = notes.reduce((m, n) => Math.max(m, n.z), 0) + 1;
  set(
    stickyNotesAtom,
    notes.map((n) => (n.id === id ? { ...n, z: maxZ } : n))
  );
});


