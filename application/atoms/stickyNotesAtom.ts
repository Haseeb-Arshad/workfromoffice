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
  // optional smart fields
  category?: "quick" | "daily" | "weekly" | "longTerm";
  expiresAt?: string | null; // ISO when note should auto-expire
  // sizing and visuals
  width?: number; // px
  height?: number; // px
  rotationDeg?: number; // small tilt
  pinned?: boolean; // visually pinned
  locked?: boolean; // prevent drag/resize
  // reminders
  reminderAt?: string | null; // ISO
}

export const stickyNotesAtom = atomWithStorage<StickyNote[]>("wfcos-sticky-notes", []);

export const addStickyNoteAtom = atom(null, (get, set, note: Omit<StickyNote, "id" | "z" | "createdAt" | "expiresAt" | "reminderAt"> & { expiresInMs?: number }) => {
  const existing = get(stickyNotesAtom);
  const maxZ = existing.reduce((m, n) => Math.max(m, n.z), 0);
  const newNote: StickyNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    z: maxZ + 1,
    createdAt: new Date().toISOString(),
    width: note.width ?? 176,
    height: note.height ?? 140,
    rotationDeg: note.rotationDeg ?? (Math.random() * 5 - 2.5),
    pinned: note.pinned ?? false,
    locked: note.locked ?? false,
    reminderAt: null,
    ...note,
    expiresAt: typeof note.expiresInMs === "number" ? new Date(Date.now() + note.expiresInMs).toISOString() : null,
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

export const sendNoteToBackAtom = atom(null, (get, set, id: string) => {
  const notes = get(stickyNotesAtom);
  const minZ = notes.reduce((m, n) => Math.min(m, n.z), Infinity) - 1;
  set(
    stickyNotesAtom,
    notes.map((n) => (n.id === id ? { ...n, z: minZ } : n))
  );
});

// Prune expired notes helper
export const pruneExpiredNotesAtom = atom(null, (get, set) => {
  const now = Date.now();
  const notes = get(stickyNotesAtom);
  const filtered = notes.filter((n) => !n.expiresAt || new Date(n.expiresAt).getTime() > now);
  if (filtered.length !== notes.length) {
    set(stickyNotesAtom, filtered);
  }
});

export const duplicateNoteAtom = atom(null, (get, set, id: string) => {
  const notes = get(stickyNotesAtom);
  const src = notes.find((n) => n.id === id);
  if (!src) return;
  const maxZ = notes.reduce((m, n) => Math.max(m, n.z), 0);
  const copy: StickyNote = {
    ...src,
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x: src.x + 20,
    y: src.y + 20,
    z: maxZ + 1,
    createdAt: new Date().toISOString(),
  };
  set(stickyNotesAtom, [...notes, copy]);
});


