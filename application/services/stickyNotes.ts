'use server'

import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'

export type StickyNoteColor = "yellow" | "pink" | "green" | "blue" | "purple" | "orange";

export type StickyNote = {
    id: string
    title: string
    content: string
    color: StickyNoteColor
    x: number
    y: number
    z: number
}

export async function getStickyNotes() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('sticky_notes')
        .select('*')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching sticky notes:', error)
        return []
    }

    return data.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        color: note.color as StickyNoteColor,
        x: note.x_position,
        y: note.y_position,
        z: note.z_index,
    }))
}

export async function createStickyNote(note: Omit<StickyNote, 'id' | 'z'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // simple z-index max logic
    const { data: maxZ } = await supabase
        .from('sticky_notes')
        .select('z_index')
        .eq('user_id', user.id)
        .order('z_index', { ascending: false })
        .limit(1)

    const nextZ = maxZ && maxZ.length > 0 ? maxZ[0].z_index + 1 : 1

    const { data, error } = await supabase
        .from('sticky_notes')
        .insert({
            user_id: user.id,
            title: note.title,
            content: note.content,
            color: note.color,
            x_position: note.x,
            y_position: note.y,
            z_index: nextZ
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/')
    return {
        id: data.id,
        title: data.title,
        content: data.content,
        color: data.color as StickyNoteColor,
        x: data.x_position,
        y: data.y_position,
        z: data.z_index,
    }
}

export async function updateStickyNote(id: string, updates: Partial<StickyNote>) {
    const supabase = await createClient()

    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.content !== undefined) dbUpdates.content = updates.content
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.x !== undefined) dbUpdates.x_position = updates.x
    if (updates.y !== undefined) dbUpdates.y_position = updates.y
    if (updates.z !== undefined) dbUpdates.z_index = updates.z

    const { error } = await supabase
        .from('sticky_notes')
        .update(dbUpdates)
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function deleteStickyNote(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}
