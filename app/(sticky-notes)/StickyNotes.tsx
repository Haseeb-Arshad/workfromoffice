"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  StickyNote,
  StickyNoteColor,
  addStickyNoteAtom,
  bringNoteToFrontAtom,
  deleteStickyNoteAtom,
  stickyNotesAtom,
  updateStickyNoteAtom,
} from "@/application/atoms/stickyNotesAtom";
import { Button } from "@/presentation/components/ui/button";
import { Plus, X } from "lucide-react";
import { getStickyNotes, createStickyNote, updateStickyNote, deleteStickyNote } from "@/application/services/stickyNotes"; // Use src path

const COLORS: { key: StickyNoteColor; label: string; bg: string; }[] = [
  { key: "yellow", label: "Yellow", bg: "bg-yellow-200" },
  { key: "pink", label: "Pink", bg: "bg-pink-200" },
  { key: "green", label: "Green", bg: "bg-green-200" },
  { key: "blue", label: "Blue", bg: "bg-blue-200" },
  { key: "purple", label: "Purple", bg: "bg-purple-200" },
  { key: "orange", label: "Orange", bg: "bg-orange-200" },
];

import { useUser } from "@/application/hooks/useUser";
import { useAuthSync } from "@/application/hooks/useAuthSync";
import { localStickyNotesAtom } from "@/application/atoms/stickyNotesAtom";

export const StickyNotes: React.FC = () => {
  const [notes, setNotes] = useAtom(stickyNotesAtom);
  const [localNotes, setLocalNotes] = useAtom(localStickyNotesAtom);
  const addNoteLocal = useSetAtom(addStickyNoteAtom);
  const updateNoteLocal = useSetAtom(updateStickyNoteAtom);
  const deleteNoteLocal = useSetAtom(deleteStickyNoteAtom);
  const bringToFront = useSetAtom(bringNoteToFrontAtom);

  const { user, loading } = useUser();
  useAuthSync(); // Handle sync on login

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<StickyNoteColor>("yellow");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Simple drag state
  const draggingIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const finalPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Determine source
    const fetchNotes = async () => {
      if (loading) return;

      if (!user) {
        // GUEST MODE: Load from local atom (which is persisted)
        // Ensure localNotes (from atomWithStorage) are put into runtime notesAtom
        setNotes(localNotes);
        return;
      }

      // AUTH MODE: Fetch from server
      try {
        const serverNotes = await getStickyNotes();
        const mapped: StickyNote[] = serverNotes.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          color: n.color as StickyNoteColor,
          x: n.x,
          y: n.y,
          z: n.z,
          createdAt: new Date().toISOString()
        }));
        setNotes(mapped);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotes();
  }, [setNotes, user, loading, localNotes]); // Depend on localNotes so guest updates reflect? Careful of loops.
  // Actually, for guest mode, 'localNotes' is the source. 
  // If we change 'localNotes', 'notes' should update.
  // But 'localNotes' is updated via setLocalNotes...

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingIdRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffsetRef.current.x;
    const y = e.clientY - rect.top - dragOffsetRef.current.y;

    const constrainedX = Math.max(0, x);
    const constrainedY = Math.max(0, y);

    updateNoteLocal({ id: draggingIdRef.current, x: constrainedX, y: constrainedY });
    finalPosRef.current = { x: constrainedX, y: constrainedY };
  }, [updateNoteLocal]);

  const stopDragging = useCallback(async () => {
    const draggedId = draggingIdRef.current;
    const finalPos = finalPosRef.current;

    draggingIdRef.current = null;
    finalPosRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDragging);

    if (draggedId && finalPos) {
      if (!user) {
        // Guest: update local persist
        setLocalNotes(prev => prev.map(n => n.id === draggedId ? { ...n, x: finalPos.x, y: finalPos.y } : n));
        return;
      }

      // Persist position
      try {
        await updateStickyNote(draggedId, { x: finalPos.x, y: finalPos.y });
      } catch (e) { console.error(e); }
    }
  }, [handleMouseMove, user, setLocalNotes]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [stopDragging, handleMouseMove]);

  const startDragging = (id: string, e: React.MouseEvent, startX: number, startY: number) => {
    bringToFront(id);
    draggingIdRef.current = id;
    dragOffsetRef.current = { x: e.clientX - startX, y: e.clientY - startY };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
  };

  const handleAddNote = async () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const newNotePartial = {
      title: title.trim() || "Untitled",
      content: content.trim(),
      color,
      x: Math.round(rect.width / 2 - 80),
      y: 40,
    };

    const tempId = user ? `temp-${Date.now()}` : crypto.randomUUID();

    // Logic for Guest vs Auth is split here
    if (!user) {
      const newNote: StickyNote = {
        id: tempId,
        ...newNotePartial,
        z: (localNotes.reduce((m, n) => Math.max(m, n.z), 0) || 0) + 1,
        createdAt: new Date().toISOString()
      } as StickyNote;

      setLocalNotes(prev => [...prev, newNote]);
      // Runtime update happens via useEffect or direct setNotes if we decide 
      // But useEffect [localNotes] handles it.

      setTitle("");
      setContent("");
      setColor("yellow");
      setShowForm(false);
      return;
    }

    addNoteLocal({
      id: tempId,
      ...newNotePartial,
      z: 9999, // temporary high z
      createdAt: new Date().toISOString()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    setTitle("");
    setContent("");
    setColor("yellow");
    setShowForm(false);

    try {
      const created = await createStickyNote(newNotePartial);
      // Replace temp
      setNotes(prev => prev.map(n => n.id === tempId ? {
        ...n,
        id: created.id,
        z: created.z
      } : n));
    } catch (e) {
      console.error(e);
      setNotes(prev => prev.filter(n => n.id !== tempId));
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      setLocalNotes(prev => prev.filter(n => n.id !== id));
      return;
    }

    deleteNoteLocal(id);
    try {
      await deleteStickyNote(id);
    } catch (e) { console.error(e); }
  }

  return (
    <div className="flex flex-col h-full p-4 bg-stone-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold text-primary">Sticky Notes</h1>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="bg-secondary hover:bg-accent text-white px-3 py-2 rounded-md text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div className="mb-3 rounded-md border border-primary/10 bg-white p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="rounded-md border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20"
            />
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`h-7 w-7 rounded-md border ${c.bg} ${color === c.key ? "ring-2 ring-secondary" : "border-primary/15"}`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            rows={3}
            className="w-full rounded-md border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 resize-none"
          />
          <div className="mt-2 flex gap-2">
            <Button
              onClick={handleAddNote}
              className="bg-secondary hover:bg-accent text-white px-3 py-2 rounded-md text-sm"
            >
              Add Note
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="px-3 py-2 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div ref={canvasRef} className="relative flex-1 rounded-md border border-primary/10 bg-white overflow-hidden">
        {notes.map((note) => (
          <StickyNoteItem
            key={note.id}
            note={note}
            onStartDrag={startDragging}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

const StickyNoteItem: React.FC<{
  note: StickyNote;
  onStartDrag: (id: string, e: React.MouseEvent, startX: number, startY: number) => void;
  onDelete: () => void;
}> = ({ note, onStartDrag, onDelete }) => {
  const bg = {
    yellow: "bg-yellow-200",
    pink: "bg-pink-200",
    green: "bg-green-200",
    blue: "bg-blue-200",
    purple: "bg-purple-200",
    orange: "bg-orange-200",
  }[note.color] || "bg-yellow-200";

  return (
    <div
      className={`absolute w-40 min-h-32 ${bg} rounded-md shadow-sm`}
      style={{ left: note.x, top: note.y, zIndex: note.z }}
    >
      <div
        className="flex items-center justify-between px-2 py-1 cursor-move"
        onMouseDown={(e) => onStartDrag(note.id, e, note.x, note.y)}
      >
        <div className="text-xs font-semibold text-primary/80 truncate pr-2">{note.title}</div>
        <button onClick={onDelete} className="p-1 rounded hover:bg-black/10">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-2 pb-2 text-sm text-primary/90 whitespace-pre-wrap break-words">
        {note.content}
      </div>
    </div>
  );
};

export default StickyNotes;
