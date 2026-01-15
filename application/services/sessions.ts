'use server'

// import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'
import { Session } from '../types/session.types'

// --- Session Log ---

export async function getSessions(): Promise<Session[]> {
    const { createClient } = await import('@/infrastructure/config/supabase-server');
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
    const { createClient } = await import('@/infrastructure/config/supabase-server');
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
    const { createClient } = await import('@/infrastructure/config/supabase-server');
    const supabase = await createClient()

    // RLS will handle permission check, or we can check
    const { error } = await supabase
        .from('focus_sessions')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

// Chat functions moved to application/services/chat.ts
