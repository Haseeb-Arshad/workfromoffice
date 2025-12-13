import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/infrastructure/config/supabase-client'

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createBrowserSupabaseClient()

    useEffect(() => {
        let mounted = true;

        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (mounted) {
                if (session) setUser(session.user)
                setLoading(false)
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        })

        return () => {
            mounted = false;
            subscription.unsubscribe()
        }
    }, [supabase])

    return { user, loading }
}
