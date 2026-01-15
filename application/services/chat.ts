'use server'

// import { createClient } from '@/infrastructure/config/supabase-server'

export type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export async function getChatHistory(sessionId: string) {
    const { createClient } = await import('@/infrastructure/config/supabase-server');
    const supabase = await createClient()

    // return [] as any; // removed mock

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

    if (error) {
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
    const { createClient } = await import('@/infrastructure/config/supabase-server');
    const supabase = await createClient()
    // return {} as any; // removed mock
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
    const { createClient } = await import('@/infrastructure/config/supabase-server');
    const supabase = await createClient()
    // return; // removed mock
    const { data: { user } } = await supabase.auth.getUser()
    // Validation handled by RLS policy implicitly if session needs to belong to user

    const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

    if (error) throw new Error(error.message)
}
