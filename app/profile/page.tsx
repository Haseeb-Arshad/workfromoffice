import { createClient } from '@/infrastructure/config/supabase-server'
import { redirect } from 'next/navigation'
import { signOut } from '@/application/auth/actions'
import { Button } from '@/presentation/components/ui/button'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex min-h-screen flex-col items-center p-24 bg-stone-50">
            <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex flex-col items-center pb-10">
                    {profile?.avatar_url ? (
                        <img
                            className="w-24 h-24 mb-3 rounded-full shadow-lg"
                            src={profile.avatar_url}
                            alt={profile.full_name || 'User'}
                        />
                    ) : (
                        <div className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                            {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <h5 className="mb-1 text-xl font-medium text-gray-900">{profile?.full_name || 'User'}</h5>
                    <span className="text-sm text-gray-500">{user.email}</span>

                    <div className="flex mt-4 space-x-3 md:mt-6">
                        <form action={signOut}>
                            <Button variant="destructive">Sign Out</Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Details</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Member since</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(user.last_sign_in_at || '').toLocaleDateString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
