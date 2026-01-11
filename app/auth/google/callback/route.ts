import { NextResponse } from 'next/server'
import { handleGoogleCallback } from '@/application/services/googleCalendar'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.redirect(`${origin}/schedule?error=google_auth_failed`)
    }

    if (code) {
        try {
            const tokens = await handleGoogleCallback(code)

            const cookieStore = await cookies()

            // Securely store tokens in cookies
            if (tokens.access_token) {
                cookieStore.set('google_access_token', tokens.access_token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 3600 // 1 hour typically
                })
            }

            if (tokens.refresh_token) {
                cookieStore.set('google_refresh_token', tokens.refresh_token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 30 * 24 * 60 * 60 // 30 days
                })
            }

            if (tokens.expiry_date) {
                cookieStore.set('google_expiry_date', tokens.expiry_date.toString(), {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                })
            }

            return NextResponse.redirect(`${origin}?google_connected=true`)
        } catch (err) {
            console.error('Google Auth Error:', err)
            return NextResponse.redirect(`${origin}?error=token_exchange_failed`)
        }
    }

    return NextResponse.redirect(`${origin}`)
}
