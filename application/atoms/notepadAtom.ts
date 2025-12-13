import { atom } from "jotai";
import { LexicalEditor } from "lexical";

// Define the structure for a single note
export interface Note {
  id: string;
  name: string;
  content: string; // Serialized Lexical EditorState JSON string
  lastModified: number; // Timestamp
}

// --- Atoms ---

// Atom for the list of all notes
export const notesAtom = atom<Note[]>([]);

// Atom for the ID of the currently active/selected note
const baseActiveNoteIdAtom = atom<string | null>(null);

export const activeNoteIdAtom = atom(
  (get) => {
    const activeId = get(baseActiveNoteIdAtom);
    const notes = get(notesAtom);
    // Ensure the active ID exists in the notes list
    if (activeId && notes.some((note) => note.id === activeId)) {
      return activeId;
    }
    // If not, don't auto-select here, let component handle it
    return activeId;
  },
  (get, set, newId: string | null) => {
    set(baseActiveNoteIdAtom, newId);
  }
);

// Derived atom to get the content of the active note
export const activeNoteContentAtom = atom<string | null>((get) => {
  const activeId = get(activeNoteIdAtom);
  const notes = get(notesAtom);
  return notes.find((note) => note.id === activeId)?.content ?? null;
});

// --- Action Atoms ---

// Atom to handle saving the active note content and deriving its name (Optimistic update)
export const saveActiveNoteAtom = atom(
  null,
  (
    get,
    set,
    payload: { content: string; editor?: LexicalEditor; noteId?: string }
  ) => {
    const noteIdToSave = payload.noteId ?? get(activeNoteIdAtom);
    if (!noteIdToSave) return;

    const { content: newContent } = payload;

    set(notesAtom, (prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteIdToSave
          ? {
            ...note,
            content: newContent,
            lastModified: Date.now(),
          }
          : note
      )
    );
  }
);
