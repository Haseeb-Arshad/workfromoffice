'use server'

import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'

export type Note = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export async function getNotes() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching notes:', error)
        return []
    }

    return data.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
    }))
}

export async function createNote(title: string = 'Untitled Note', content: string = '') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('notes')
        .insert({
            user_id: user.id,
            title,
            content,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }
}

export async function saveNote(id: string, updates: { content?: string, title?: string }) {
    const supabase = await createClient()

    const dbUpdates: any = {
        updated_at: new Date().toISOString(),
    }
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.title !== undefined) dbUpdates.title = updates.title;

    const { error } = await supabase
        .from('notes')
        .update(dbUpdates)
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function deleteNote(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}
