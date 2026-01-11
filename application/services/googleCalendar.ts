'use server'

import { google } from 'googleapis'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const createOAuth2Client = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )
}

// 1. Get Auth URL
export async function getGoogleAuthUrl() {
    const oauth2Client = createOAuth2Client()
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
    ]

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    })
}

// 2. Exchange Code for Tokens
export async function handleGoogleCallback(code: string) {
    const oauth2Client = createOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)

    // In a real app with user sessions, you might store these tokens in Supabase
    // linked to the user. For now, we return them to the client to be stored in localStorage/cookie
    // or session, matching the current behavior.
    return tokens
}

// Helper to set credentials
const getAuthenticatedClient = (tokens: any) => {
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials(tokens)
    return google.calendar({ version: 'v3', auth: oauth2Client })
}

// 3. Get Events
export async function getCalendarEvents(tokens: any, timeMin?: string, timeMax?: string, maxResults: number = 50) {
    try {
        const calendar = getAuthenticatedClient(tokens)
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin || new Date().toISOString(),
            timeMax: timeMax,
            maxResults,
            singleEvents: true,
            orderBy: 'startTime',
        })
        return response.data.items || []
    } catch (error: any) {
        console.error('Error fetching calendar events:', error)
        throw new Error('Failed to fetch events')
    }
}

// 4. Get Today's Events
export async function getTodayCalendarEvents(tokens: any) {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    return getCalendarEvents(tokens, startOfDay.toISOString(), endOfDay.toISOString())
}

// 5. Create Event
export async function createCalendarEvent(tokens: any, eventData: {
    summary: string,
    description?: string,
    startTime: string,
    endTime: string,
    location?: string,
    timeZone?: string
}) {
    try {
        const calendar = getAuthenticatedClient(tokens)
        const event = {
            summary: eventData.summary,
            description: eventData.description,
            start: {
                dateTime: eventData.startTime,
                timeZone: eventData.timeZone || 'UTC',
            },
            end: {
                dateTime: eventData.endTime,
                timeZone: eventData.timeZone || 'UTC',
            },
            location: eventData.location,
        }

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        })

        return response.data
    } catch (error: any) {
        console.error('Error creating event:', error)
        throw new Error('Failed to create event')
    }
}

// 6. Delete Event
export async function deleteCalendarEvent(tokens: any, eventId: string) {
    try {
        const calendar = getAuthenticatedClient(tokens)
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        })
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting event:', error)
        throw new Error('Failed to delete event')
    }
}

// 7. Update Event
export async function updateCalendarEvent(tokens: any, eventId: string, eventData: {
    summary?: string,
    description?: string,
    startTime?: string,
    endTime?: string,
    location?: string,
    timeZone?: string
}) {
    try {
        const calendar = getAuthenticatedClient(tokens)
        // First get the event to merge? Or just patch. 
        // Google API update requires full resource usually if using update, or patch for partial.
        // Let's use patch.

        const patchBody: any = {
            summary: eventData.summary,
            description: eventData.description,
            location: eventData.location,
        }

        if (eventData.startTime) {
            patchBody.start = { dateTime: eventData.startTime, timeZone: eventData.timeZone || 'UTC' }
        }
        if (eventData.endTime) {
            patchBody.end = { dateTime: eventData.endTime, timeZone: eventData.timeZone || 'UTC' }
        }

        const response = await calendar.events.patch({
            calendarId: 'primary',
            eventId: eventId,
            requestBody: patchBody,
        })

        return response.data
    } catch (error: any) {
        console.error('Error updating event:', error)
        throw new Error('Failed to update event')
    }
}

// 8. Connection Helpers
export async function checkGoogleConnected() {
    const cookieStore = await cookies()
    return cookieStore.has('google_access_token') || cookieStore.has('google_refresh_token')
}

export async function fetchGoogleCalendarEvents() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('google_access_token')?.value
    const refreshToken = cookieStore.get('google_refresh_token')?.value

    if (!accessToken && !refreshToken) return []

    const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
    }

    try {
        return await getTodayCalendarEvents(tokens)
    } catch (error) {
        // If token invalid, maybe clear cookies?
        // For now just return empty or throw
        console.error("Failed to fetch google events with stored tokens", error)
        return []
    }
}
