'use server'

import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'

export type CalendarEvent = {
    id: string
    summary: string
    description?: string
    start: { dateTime: string; timeZone: string }
    end: { dateTime: string; timeZone: string }
    location?: string
    colorId?: string
    status?: string
}

export async function getEvents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Error fetching events:', error)
        return []
    }

    return data.map((event: any) => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.start_time, timeZone: 'UTC' }, // Adjust timezone handling as needed
        end: { dateTime: event.end_time, timeZone: 'UTC' },
        location: event.location,
        colorId: event.color_id,
        status: event.status,
    }))
}

export async function createEvent(event: Omit<CalendarEvent, 'id'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('calendar_events')
        .insert({
            user_id: user.id,
            summary: event.summary,
            description: event.description,
            start_time: event.start.dateTime,
            end_time: event.end.dateTime,
            location: event.location,
            color_id: event.colorId,
            status: event.status || 'confirmed',
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return {
        id: data.id,
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.start_time, timeZone: 'UTC' },
        end: { dateTime: data.end_time, timeZone: 'UTC' },
        location: data.location,
        colorId: data.color_id,
        status: data.status,
    }
}

export async function deleteEvent(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function updateEvent(id: string, event: Partial<CalendarEvent>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const updates: any = {}
    if (event.summary !== undefined) updates.summary = event.summary
    if (event.description !== undefined) updates.description = event.description
    if (event.start) updates.start_time = event.start.dateTime
    if (event.end) updates.end_time = event.end.dateTime
    if (event.location !== undefined) updates.location = event.location
    if (event.colorId !== undefined) updates.color_id = event.colorId
    if (event.status !== undefined) updates.status = event.status

    const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return {
        id: data.id,
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.start_time, timeZone: 'UTC' },
        end: { dateTime: data.end_time, timeZone: 'UTC' },
        location: data.location,
        colorId: data.color_id,
        status: data.status,
    }
}
