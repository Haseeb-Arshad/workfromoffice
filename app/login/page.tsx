import { GoogleLoginButton } from '@/presentation/components/auth/GoogleLoginButton'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-stone-50">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto">
                    {/* Logo or Title could go here */}
                </div>
            </div>

            <div className="relative flex place-items-center">
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                    <div className="space-y-6">
                        <h5 className="text-xl font-medium text-gray-900 text-center">Sign in to WorkBase</h5>
                        <p className="text-sm text-gray-500 text-center">
                            Login to access your personalized workspace.
                        </p>
                        <GoogleLoginButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
