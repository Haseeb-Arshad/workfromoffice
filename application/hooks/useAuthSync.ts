import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { localStickyNotesAtom, stickyNotesAtom } from '@/application/atoms/stickyNotesAtom'
import { createStickyNote } from '@/application/services/stickyNotes'
import { useUser } from './useUser'
import { getStickyNotes } from '@/application/services/stickyNotes'

export function useAuthSync() {
    const { user } = useUser()
    const [localNotes, setLocalNotes] = useAtom(localStickyNotesAtom)
    const [notes, setNotes] = useAtom(stickyNotesAtom)
    const syncingRef = useRef(false)

    useEffect(() => {
        // Only run if checking user is done and we have a user
        if (user && localNotes.length > 0 && !syncingRef.current) {
            const sync = async () => {
                syncingRef.current = true
                console.log("Syncing local notes to server...", localNotes.length)

                try {
                    await Promise.all(localNotes.map(async (note) => {
                        // Remove ID to let server generate new one, or separate logic
                        // The service createStickyNote generates ID if not provided, or we can assume it's a new note
                        // Service def: createStickyNote(note: Partial<StickyNote>)
                        try {
                            await createStickyNote({
                                title: note.title,
                                content: note.content,
                                color: note.color,
                                x: note.x,
                                y: note.y,
                                // z is handled by server (auto-increment)
                            })
                        } catch (err) {
                            console.error("Failed to sync specific note", note.id, err)
                        }
                    }));

                    // Clear local storage after successful sync attempt
                    setLocalNotes([])

                    // Refetch to get canonical IDs
                    const serverNotes = await getStickyNotes();
                    // Map logic similar to StickyNotes.tsx
                    const mapped = serverNotes.map(n => ({
                        ...n,
                        createdAt: new Date().toISOString() // Fallback
                    }));
                    setNotes(mapped as any); // Type assertion if needed based on service return

                } catch (e) {
                    console.error("Sync failed", e)
                } finally {
                    syncingRef.current = false
                }
            }
            sync()
        }
    }, [user, localNotes, setLocalNotes, setNotes])
}
