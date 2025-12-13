'use server'

import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'
import { Session } from '../types/session.types'

// --- Session Log ---

export async function getSessions(): Promise<Session[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })

    if (error) {
        console.error('Error fetching sessions:', error)
        return []
    }

    return data.map((s: any) => ({
        id: s.id,
        date: s.date,
        duration: s.duration_minutes,
        taskId: s.task_id || null,
        startTime: s.started_at ? new Date(s.started_at).getTime() : 0,
        endTime: s.ended_at ? new Date(s.ended_at).getTime() : 0
    }))
}

// Update logSession to match Session type partially
export async function logSession(session: Omit<Session, 'id'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('focus_sessions')
        .insert({
            user_id: user.id,
            date: session.date,
            duration_minutes: session.duration,
            task_id: session.taskId,
            started_at: session.startTime ? new Date(session.startTime).toISOString() : null,
            ended_at: session.endTime ? new Date(session.endTime).toISOString() : null
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/')
    return {
        id: data.id,
        date: data.date,
        duration: data.duration_minutes,
        taskId: data.task_id,
        startTime: data.started_at ? new Date(data.started_at).getTime() : 0,
        endTime: data.ended_at ? new Date(data.ended_at).getTime() : 0
    }
}

export async function deleteSession(id: string) {
    const supabase = await createClient()

    // RLS will handle permission check, or we can check
    const { error } = await supabase
        .from('focus_sessions')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}


// --- Chat ---

export type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export async function getChatHistory(sessionId: string) {
    const supabase = await createClient()

    // First ensure session exists? Or just fetch messages filtering by session_id
    // Security: check if user owns the session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

    if (error) {
        // If session doesn't exist or other error, return empty
        return []
    }

    return data.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at)
    }))
}

export async function saveChatMessage(sessionId: string, message: { role: 'user' | 'assistant', content: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Ensure session exists
    const { data: session } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', sessionId)
        .single()

    if (!session) {
        // Create session
        await supabase
            .from('chat_sessions')
            .insert({
                id: sessionId,
                user_id: user.id
            })
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            session_id: sessionId,
            role: message.role,
            content: message.content
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    return {
        id: data.id,
        role: data.role,
        content: data.content,
        timestamp: new Date(data.created_at)
    }
}

export async function clearChatHistory(sessionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // Validation handled by RLS policy implicitly if session needs to belong to user

    const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

    if (error) throw new Error(error.message)
}
