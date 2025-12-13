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
  category?: "quick" | "daily" | "weekly" | "longTerm";
  expiresAt?: string | null;
  pinned?: boolean;
  locked?: boolean;
  width?: number;
  height?: number;
  rotationDeg?: number;
}

// Atom for the list of sticky notes (initialized empty, populated by component)
export const stickyNotesAtom = atom<StickyNote[]>([]);

// Atom for local storage persistence (Guest Mode)
export const localStickyNotesAtom = atomWithStorage<StickyNote[]>("sticky-notes-local", []);

// Helper atoms for local state updates (no persistence side effects)
// Note: Component passes expiresInMs, we convert to expiresAt
export const addStickyNoteAtom = atom(null, (get, set, note: Partial<StickyNote> & { title: string, content: string, color: StickyNoteColor, x: number, y: number, expiresInMs?: number }) => {
  const existing = get(stickyNotesAtom);
  const maxZ = existing.reduce((m, n) => Math.max(m, n.z), 0) + 1;

  const { expiresInMs, ...rest } = note;
  const expiresAt = expiresInMs ? new Date(Date.now() + expiresInMs).toISOString() : rest.expiresAt;

  const newNote: StickyNote = {
    id: crypto.randomUUID(),
    z: maxZ,
    createdAt: new Date().toISOString(),
    expiresAt,
    ...rest
  } as StickyNote;
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
  const minZ = notes.reduce((m, n) => Math.min(m, n.z), 0) - 1;
  set(
    stickyNotesAtom,
    notes.map((n) => (n.id === id ? { ...n, z: minZ } : n))
  );
});

export const pruneExpiredNotesAtom = atom(null, (get, set) => {
  const notes = get(stickyNotesAtom);
  const now = new Date().toISOString();
  const active = notes.filter(n => !n.expiresAt || n.expiresAt > now);
  if (active.length !== notes.length) {
    set(stickyNotesAtom, active);
  }
});

export const duplicateNoteAtom = atom(null, (get, set, id: string) => {
  const notes = get(stickyNotesAtom);
  const note = notes.find(n => n.id === id);
  if (!note) return;
  const maxZ = notes.reduce((m, n) => Math.max(m, n.z), 0) + 1;
  const newNote = {
    ...note,
    id: crypto.randomUUID(),
    x: note.x + 20,
    y: note.y + 20,
    z: maxZ,
    createdAt: new Date().toISOString()
  };
  set(stickyNotesAtom, [...notes, newNote]);
});
