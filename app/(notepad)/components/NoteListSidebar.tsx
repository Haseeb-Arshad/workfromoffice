"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import {
  notesAtom,
  activeNoteIdAtom,
} from "@/application/atoms/notepadAtom";
import { Button } from "@/presentation/components/ui/button";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { Input } from "@/presentation/components/ui/input";
import { cn } from "@/infrastructure/lib/utils";
import { Trash2, FilePlus, Pencil } from "lucide-react";
import { playSound } from "@/infrastructure/lib/utils";
import { createNote, deleteNote, saveNote } from "@/application/services/notepad"; // Use src/ path

// Constants for resizing
const MIN_WIDTH = 150; // Minimum sidebar width in pixels
const MAX_WIDTH = 500; // Maximum sidebar width in pixels
const DEFAULT_WIDTH = 256; // Default width (w-64)

export const NoteListSidebar = () => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [activeNoteId, setActiveNoteId] = useAtom(activeNoteIdAtom);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (editingNoteId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingNoteId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize"; // Change cursor during resize
  };

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      document.body.style.cursor = "default"; // Restore default cursor
    }
  }, [isResizing]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;

      const currentX = e.clientX;
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newWidth = Math.max(MIN_WIDTH, Math.min(currentX - sidebarRect.left, MAX_WIDTH));
      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  // Add and remove global mouse listeners for resizing
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default"; // Ensure cursor is reset on unmount
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleCreateNote = async () => {
    playSound("/sounds/click.mp3");
    // Optimistic creation
    const tempId = `temp-${Date.now()}`;
    const newNote = {
      id: tempId,
      name: "New Note",
      content: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
      lastModified: Date.now()
    };

    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(tempId);
    setEditingNoteId(tempId);
    setEditedName("New Note");

    try {
      const created = await createNote("New Note", newNote.content);
      // Update temporary note with real one
      setNotes(prev => prev.map(n => n.id === tempId ? { ...n, id: created.id } : n));
      setActiveNoteId(created.id);
      setEditingNoteId(created.id); // Keep editing if we were editing temp
    } catch (e) {
      console.error("Failed to create note", e);
      setNotes(prev => prev.filter(n => n.id !== tempId)); // Revert
    }
  };

  const handleDeleteNote = async (
    noteId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    playSound("/sounds/click.mp3");
    if (editingNoteId === noteId) {
      setEditingNoteId(null);
    }
    const noteName = notes.find((n) => n.id === noteId)?.name ?? "this note";

    if (window.confirm(`Are you sure you want to delete "${noteName}"?`)) {
      const deletedNoteIndex = notes.findIndex(n => n.id === noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));

      if (activeNoteId === noteId) {
        const nextNote = notes[deletedNoteIndex + 1] || notes[deletedNoteIndex - 1];
        setActiveNoteId(nextNote ? nextNote.id : null);
      }

      try {
        await deleteNote(noteId);
      } catch (e) {
        console.error("Failed to delete note", e);
        // Could revert here by re-fetching or re-adding
        // For now assume success or reload page to fix sync
      }
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleSaveName = async (noteId: string) => {
    if (editingNoteId === noteId) {
      const nameToSave = editedName.trim() || "Untitled Note";
      if (nameToSave !== "") {
        playSound("/sounds/click.mp3");
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, name: nameToSave, lastModified: Date.now() } : n));

        try {
          await saveNote(noteId, { title: nameToSave });
        } catch (e) {
          console.error("Failed to update note title", e);
        }
      }
    }
    setEditingNoteId(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    noteId: string
  ) => {
    if (event.key === "Enter") {
      handleSaveName(noteId);
    } else if (event.key === "Escape") {
      setEditingNoteId(null);
    }
  };

  const handleStartEditing = (
    noteId: string,
    currentName: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    playSound("/sounds/click.mp3");
    setEditingNoteId(noteId);
    setEditedName(currentName || "Untitled Note");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      ref={sidebarRef}
      className="relative border-r border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden"
      style={{ width: `${sidebarWidth}px`, flexShrink: 0 }}
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-blue-200 active:bg-blue-300 z-10"
        onMouseDown={handleMouseDown}
        title="Resize Sidebar"
      />

      <div className="p-2 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCreateNote}
          title="New Note"
        >
          <FilePlus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-2">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notes yet.</div>
            ) : (
              <ul className="space-y-1">
                {notes.map((note) => (
                  <li key={note.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (editingNoteId !== note.id) {
                          playSound("/sounds/click.mp3");
                          setActiveNoteId(note.id);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          editingNoteId !== note.id &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          playSound("/sounds/click.mp3");
                          setActiveNoteId(note.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-300 flex justify-between items-start group cursor-pointer",
                        activeNoteId === note.id
                          ? "bg-blue-100 hover:bg-blue-200"
                          : ""
                      )}
                    >
                      <div className="flex-grow overflow-hidden mr-2 w-0">
                        {editingNoteId === note.id ? (
                          <Input
                            ref={inputRef}
                            value={editedName}
                            onBlur={() => handleSaveName(note.id)}
                            onChange={handleNameChange}
                            onKeyDown={(e) => handleKeyDown(e, note.id)}
                            onFocus={(e) => e.target.select()}
                            className="h-7 py-1 px-1.5 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <div className="font-medium truncate text-sm">
                              {note.name || "Untitled Note"}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {formatTimestamp(note.lastModified)}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 p-0 text-gray-600 hover:bg-gray-200",
                            activeNoteId === note.id && "opacity-100"
                          )}
                          onClick={(e) =>
                            handleStartEditing(note.id, note.name, e)
                          }
                          title="Rename Note"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 p-0 text-red-500 hover:bg-red-100",
                            activeNoteId === note.id && "opacity-100"
                          )}
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          title="Delete Note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
