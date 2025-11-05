"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtom, useSetAtom } from "jotai";
import {
    StickyNote,
    StickyNoteColor,
    addStickyNoteAtom,
    bringNoteToFrontAtom,
    sendNoteToBackAtom,
    deleteStickyNoteAtom,
    pruneExpiredNotesAtom,
    stickyNotesAtom,
    updateStickyNoteAtom,
    duplicateNoteAtom,
} from "@/application/atoms/stickyNotesAtom";
import { Button } from "@/presentation/components/ui/button";
import { Calendar, Clock, MoreVertical, Plus, Trash2, Pin, Lock, Unlock, Copy, Edit2 } from "lucide-react";

type NoteCategory = NonNullable<StickyNote["category"]>;

const CATEGORY_TO_DURATION: Record<NoteCategory, number> = {
    quick: 2 * 60 * 60 * 1000, // 2 hours
    daily: 24 * 60 * 60 * 1000, // 1 day
    weekly: 7 * 24 * 60 * 60 * 1000, // 1 week
    longTerm: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const COLOR_BG: Record<StickyNoteColor, string> = {
    yellow: "bg-yellow-200",
    pink: "bg-pink-200",
    green: "bg-green-200",
    blue: "bg-blue-200",
    purple: "bg-purple-200",
    orange: "bg-orange-200",
};

export const StickyNotesWall: React.FC = () => {
    const [notes] = useAtom(stickyNotesAtom);
    const addNote = useSetAtom(addStickyNoteAtom);
    const updateNote = useSetAtom(updateStickyNoteAtom);
    const deleteNote = useSetAtom(deleteStickyNoteAtom);
    const bringToFront = useSetAtom(bringNoteToFrontAtom);
    const sendToBack = useSetAtom(sendNoteToBackAtom);
    const pruneExpired = useSetAtom(pruneExpiredNotesAtom);
    const duplicateNote = useSetAtom(duplicateNoteAtom);

    const wallRef = useRef<HTMLDivElement>(null);
    const [showAdder, setShowAdder] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newColor, setNewColor] = useState<StickyNoteColor>("yellow");
    const [newCategory, setNewCategory] = useState<NoteCategory>("daily");
    const [showManager, setShowManager] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);

    // Drag state
    const draggingIdRef = useRef<string | null>(null);
    const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isShiftDownRef = useRef(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!draggingIdRef.current || !wallRef.current) return;
            const rect = wallRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left - dragOffsetRef.current.x;
            let y = e.clientY - rect.top - dragOffsetRef.current.y;
            if (isShiftDownRef.current) {
                const grid = 16;
                x = Math.round(x / grid) * grid;
                y = Math.round(y / grid) * grid;
            }
            updateNote({ id: draggingIdRef.current, x: Math.max(0, x), y: Math.max(0, y) });
        },
        [updateNote]
    );

    const stopDragging = useCallback(() => {
        draggingIdRef.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", stopDragging);
    }, [handleMouseMove]);

    useEffect(() => () => stopDragging(), [stopDragging]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") isShiftDownRef.current = true;
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") isShiftDownRef.current = false;
        };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useEffect(() => {
        // Periodically prune expired notes
        pruneExpired();
        const id = setInterval(() => pruneExpired(), 60 * 1000);
        return () => clearInterval(id);
    }, [pruneExpired]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setContextMenu(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [contextMenu]);

    const startDragging = (id: string, e: React.MouseEvent, startX: number, startY: number) => {
        bringToFront(id);
        draggingIdRef.current = id;
        dragOffsetRef.current = { x: e.clientX - startX, y: e.clientY - startY };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);
    };

    const addNewNote = () => {
        if (!wallRef.current) return;
        const rect = wallRef.current.getBoundingClientRect();
        const expiresInMs = CATEGORY_TO_DURATION[newCategory];
        addNote({
            title: newTitle.trim() || "Untitled",
            content: newContent.trim(),
            color: newColor,
            category: newCategory,
            x: Math.round(rect.width / 2 - 80),
            y: 120,
            expiresInMs,
        });
        setNewTitle("");
        setNewContent("");
        setNewColor("yellow");
        setNewCategory("daily");
        setShowAdder(false);
    };

    return (
        <div
            ref={wallRef}
            className="pointer-events-none fixed inset-0 z-10 select-none"
            aria-hidden
        >
            {/* subtle wall texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_28%)]" />

            {/* notes */}
            {notes.map((note) => (
                <WallNote
                    key={note.id}
                    note={note}
                    onStartDrag={startDragging}
                    onDelete={() => deleteNote(note.id)}
                    onUpdate={updateNote}
                    onDuplicate={() => duplicateNote(note.id)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({ id: note.id, x: e.clientX, y: e.clientY });
                    }}
                />
            ))}

            {/* floating add button */}
            <div className="pointer-events-auto fixed bottom-4 right-4 z-[10000] flex flex-col items-end gap-2">
                {showAdder && (
                    <div className="w-[300px] rounded-xl border border-primary/15 bg-white/90 p-3 shadow-[0_10px_30px_rgba(47,32,16,0.18)] backdrop-blur">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/60">New Sticky</div>
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Title"
                            className="mb-2 w-full rounded-md border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20"
                        />
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="Write something..."
                            rows={3}
                            className="mb-2 w-full rounded-md border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20"
                        />
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                {(["yellow", "pink", "green", "blue", "purple", "orange"] as StickyNoteColor[]).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setNewColor(c)}
                                        className={`h-6 w-6 rounded-md border ${COLOR_BG[c]} ${newColor === c ? "ring-2 ring-secondary" : "border-primary/15"}`}
                                        title={c}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                                    className="rounded-md border border-primary/15 bg-white px-2 py-1 text-xs outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20"
                                    aria-label="Note category"
                                >
                                    <option value="quick">Quick</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="longTerm">Long-term</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={addNewNote} className="bg-secondary hover:bg-accent text-white px-3 py-2 rounded-md text-sm">
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                            <Button onClick={() => setShowAdder(false)} variant="outline" className="px-3 py-2 text-sm">Cancel</Button>
                            <Button onClick={() => setShowManager(true)} variant="outline" className="px-3 py-2 text-sm">Open Manager</Button>
                        </div>
                    </div>
                )}
                <Button
                    onClick={() => setShowAdder((s) => !s)}
                    className="rounded-full bg-secondary text-white shadow-md hover:bg-accent"
                    size="icon"
                    aria-label="Add Sticky Note"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            {/* Context Menu (Portal) */}
            {contextMenu && createPortal(
                <div
                    className="pointer-events-auto fixed z-[10000] w-56 rounded-md border border-primary/15 bg-white shadow-lg animate-in fade-in slide-in-from-top-1"
                    style={{ left: Math.min(contextMenu.x, window.innerWidth - 224), top: Math.min(contextMenu.y, window.innerHeight - 240) }}
                    onMouseLeave={() => setContextMenu(null)}
                    onClick={() => setContextMenu(null)}
                >
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={() => updateNote({ id: contextMenu.id, pinned: true })}>Pin</button>
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={() => updateNote({ id: contextMenu.id, locked: true })}>Lock</button>
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={() => bringToFront(contextMenu.id as any)}>Bring to front</button>
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={() => sendToBack(contextMenu.id as any)}>Send to back</button>
                    <div className="my-1 h-px bg-primary/10" />
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={() => duplicateNote(contextMenu.id)}>Duplicate</button>
                    <button className="block w-full px-3 py-2 text-left text-xs hover:bg-accent/10" onClick={async () => { const n = notes.find(n => n.id === contextMenu.id); if (n) await navigator.clipboard.writeText(`${n.title}\n${n.content}`); }}>Copy text</button>
                    <div className="my-1 h-px bg-primary/10" />
                    <button className="block w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10" onClick={() => deleteNote(contextMenu.id)}>Delete</button>
                </div>,
                document.body
            )}

            {/* Manager Modal (Portal) */}
            {showManager && createPortal((
                <div className="pointer-events-auto fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowManager(false); }}>
                    <div className="relative w-full max-w-3xl rounded-xl border border-primary/15 bg-white/95 p-4 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-semibold text-primary">Sticky Notes Manager</div>
                            <button className="rounded-md border border-primary/10 bg-white px-2 py-1 text-xs" onClick={() => setShowManager(false)}>Close</button>
                        </div>
                        <div className="mb-3 flex items-center gap-2">
                            <input placeholder="Search notes..." className="flex-1 rounded-md border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20" />
                            <select aria-label="Filter notes by category" className="rounded-md border border-primary/15 bg-white px-2 py-2 text-sm outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20">
                                <option>All</option>
                                <option>Quick</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Long-term</option>
                            </select>
                        </div>
                        <div className="max-h-[65vh] overflow-auto pr-1">
                            <div className="grid grid-cols-1 gap-2">
                                {notes.length === 0 && (
                                    <div className="text-xs text-primary/60">No notes yet.</div>
                                )}
                                {notes.map((n) => (
                                    <div key={n.id} className="flex items-start justify-between rounded-md border border-primary/10 bg-white px-3 py-2">
                                        <div className="flex items-start gap-2">
                                            <div className={`mt-1 h-3 w-3 rounded-sm ${COLOR_BG[n.color]}`} />
                                            <div>
                                                <div className="text-sm font-medium text-primary">{n.title || "Untitled"}</div>
                                                {n.content && <div className="text-xs text-primary/70 line-clamp-2 max-w-[52ch]">{n.content}</div>}
                                                <div className="mt-1 flex items-center gap-2 text-[10px] text-primary/60">
                                                    <span className="rounded border border-primary/10 bg-white px-1.5 py-0.5">{n.category ?? "none"}</span>
                                                    {n.expiresAt && <span className="rounded border border-primary/10 bg-white px-1.5 py-0.5">expires {new Date(n.expiresAt).toLocaleString()}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="rounded-md border border-primary/10 bg-white px-2 py-1 text-xs" onClick={() => updateNote({ id: n.id, pinned: !n.pinned })}>{n.pinned ? "Unpin" : "Pin"}</button>
                                            <button className="rounded-md border border-primary/10 bg-white px-2 py-1 text-xs" onClick={() => duplicateNote(n.id)}>Duplicate</button>
                                            <button className="rounded-md border border-primary/10 bg-white px-2 py-1 text-xs text-destructive" onClick={() => deleteNote(n.id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ), document.body)}
        </div>
    );
};

const WallNote: React.FC<{
    note: StickyNote;
    onStartDrag: (id: string, e: React.MouseEvent, startX: number, startY: number) => void;
    onDelete: () => void;
    onUpdate: (update: Partial<StickyNote> & { id: string }) => void;
    onDuplicate: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
}> = ({ note, onStartDrag, onDelete, onUpdate, onDuplicate, onContextMenu }) => {
    const [open, setOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const optionsBtnRef = useRef<HTMLButtonElement | null>(null);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const [resizing, setResizing] = useState(false);
    const expiresIn = note.expiresAt ? Math.max(0, new Date(note.expiresAt).getTime() - Date.now()) : null;

    const resizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setResizing(true);
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = note.width ?? 176;
        const startH = note.height ?? 140;
        const onMove = (ev: MouseEvent) => {
            const dw = ev.clientX - startX;
            const dh = ev.clientY - startY;
            const width = Math.max(120, startW + dw);
            const height = Math.max(100, startH + dh);
            onUpdate({ id: note.id, width, height });
        };
        const onUp = () => {
            setResizing(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const nearExpiry = expiresIn !== null && expiresIn < 60 * 60 * 1000;
    const canDrag = !note.locked;

    return (
        <div
            className={`pointer-events-auto absolute rounded-md shadow-sm border ${nearExpiry ? "ring-2 ring-accent/50" : "border-black/10"} ${COLOR_BG[note.color]}`}
            style={{ left: note.x, top: note.y, zIndex: note.z, width: note.width ?? 176, height: note.height ?? 140, transform: `rotate(${note.rotationDeg ?? 0}deg)` }}
            onContextMenu={onContextMenu}
            onDoubleClick={() => {
                setEditing(true);
                setEditTitle(note.title);
                setEditContent(note.content);
            }}
        >
            <div className="pointer-events-none absolute left-1/2 top-0 h-4 w-16 -translate-x-1/2 -translate-y-1 rotate-1 rounded-[2px] bg-white/60 shadow-sm" />

            <div
                className={`flex items-center justify-between px-2 py-1 ${canDrag ? "cursor-move" : "cursor-default"}`}
                onMouseDown={(e) => {
                    if (!canDrag) return;
                    onStartDrag(note.id, e, note.x, note.y);
                }}
            >
                <div className="flex min-w-0 items-center gap-2 pr-2">
                    {note.pinned && <Pin className="h-3.5 w-3.5 text-secondary" />}
                    <div className="text-[11px] font-semibold text-primary/80 truncate">{note.title}</div>
                </div>
                <button
                    ref={optionsBtnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        const next = !open;
                        setOpen(next);
                        if (next && optionsBtnRef.current) {
                            const r = optionsBtnRef.current.getBoundingClientRect();
                            const estimatedH = 320; // approximate menu height
                            let x = Math.min(r.right - 176, window.innerWidth - 192);
                            let y = r.bottom + 8;
                            if (y + estimatedH > window.innerHeight) y = Math.max(8, r.top - estimatedH - 8);
                            setMenuPos({ x: Math.max(8, x), y });
                        }
                    }}
                    className="rounded p-1 hover:bg-black/10"
                    aria-label="Note options"
                >
                    <MoreVertical className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="px-2 pb-2 text-sm text-primary/90 whitespace-pre-wrap break-words h-[calc(100%-40px)] overflow-auto">
                {editing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            className="rounded border border-primary/20 bg-white/80 px-2 py-1 text-xs outline-none"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            autoFocus
                        />
                        <textarea
                            className="min-h-16 rounded border border-primary/20 bg-white/80 px-2 py-1 text-xs outline-none"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Write..."
                            rows={4}
                        />
                        <div className="flex gap-2">
                            <button
                                className="rounded-md border border-primary/15 bg-white px-2 py-1 text-xs"
                                onClick={() => {
                                    onUpdate({ id: note.id, title: editTitle.trim() || "Untitled", content: editContent });
                                    setEditing(false);
                                }}
                            >
                                Save
                            </button>
                            <button className="rounded-md border border-primary/15 bg-white px-2 py-1 text-xs" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    note.content
                )}
            </div>

            {!note.locked && (
                <div
                    className={`absolute bottom-1 right-1 h-3 w-3 cursor-se-resize rounded-sm bg-black/20 ${resizing ? "opacity-100" : "opacity-70"}`}
                    onMouseDown={resizeStart}
                    title="Resize"
                />
            )}

            {open && menuPos && createPortal(
                <div className="fixed z-[10000] w-44 rounded-md border border-primary/15 bg-white shadow-lg animate-in fade-in slide-in-from-top-1" style={{ left: menuPos.x, top: menuPos.y }} onMouseLeave={() => setOpen(false)}>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { setEditing(true); setOpen(false); }}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onDuplicate(); setOpen(false); }}><Copy className="h-3.5 w-3.5" /> Duplicate</button>
                    <div className="my-1 h-px bg-primary/10" />
                    <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-primary/50">Color</div>
                    {(["yellow", "pink", "green", "blue", "purple", "orange"] as StickyNoteColor[]).map((c) => (
                        <button key={c} className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, color: c }); setOpen(false); }}>{c[0].toUpperCase() + c.slice(1)}</button>
                    ))}
                    <div className="my-1 h-px bg-primary/10" />
                    <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-primary/50">Duration</div>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, category: "quick", expiresAt: new Date(Date.now() + CATEGORY_TO_DURATION.quick).toISOString() }); setOpen(false); }}>Quick (2h)</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, category: "daily", expiresAt: new Date(Date.now() + CATEGORY_TO_DURATION.daily).toISOString() }); setOpen(false); }}>Daily (1d)</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, category: "weekly", expiresAt: new Date(Date.now() + CATEGORY_TO_DURATION.weekly).toISOString() }); setOpen(false); }}>Weekly (7d)</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, category: "longTerm", expiresAt: new Date(Date.now() + CATEGORY_TO_DURATION.longTerm).toISOString() }); setOpen(false); }}>Long-term (30d)</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, expiresAt: null, category: undefined }); setOpen(false); }}>No expiry</button>
                    <div className="my-1 h-px bg-primary/10" />
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, pinned: !note.pinned }); setOpen(false); }}>{note.pinned ? <><Pin className="h-3.5 w-3.5" /> Unpin</> : <><Pin className="h-3.5 w-3.5" /> Pin</>}</button>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-accent/10" onClick={() => { onUpdate({ id: note.id, locked: !note.locked }); setOpen(false); }}>{note.locked ? <><Unlock className="h-3.5 w-3.5" /> Unlock</> : <><Lock className="h-3.5 w-3.5" /> Lock</>}</button>
                    <div className="my-1 h-px bg-primary/10" />
                    <button
                        className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => { onDelete(); setOpen(false); }}
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                    {expiresIn !== null && (
                        <div className="px-2 py-1 text-[10px] text-primary/60 flex items-center gap-1"><Clock className="h-3 w-3" /> expires in ~{Math.max(1, Math.round(expiresIn / 3600000))}h</div>
                    )}
                </div>, document.body)
            }
        </div>
    );
};

export default StickyNotesWall;


