import { login, signup, loginWithGoogle } from './actions'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const error = resolvedParams.error
    const message = resolvedParams.message

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[440px] flex flex-col items-center">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h1 className="heading-display text-4xl md:text-5xl mb-2">Welcome back</h1>
                        <p className="text-body">Sign in to save stats, access the leaderboard, and track progress.</p>
                    </div>

                    {/* Login Card / HUD Container */}
                    <div className="w-full space-y-6">
                        {/* Social Login */}
                        <form>
                            <button
                                formAction={loginWithGoogle}
                                className="btn-secondary w-full !justify-center !gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12 5.04c1.94 0 3.51.68 4.75 1.83l3.51-3.51C17.91 1.26 15.21 0 12 0 7.31 0 3.25 2.67 1.19 6.6l4.12 3.2c1.01-2.99 3.8-5.17 6.69-5.17z" fill="#EA4335"></path>
                                    <path d="M23.49 12.27c0-.83-.07-1.63-.2-2.39H12v4.51h6.47c-.28 1.48-1.12 2.74-2.38 3.58l3.71 2.87c2.16-2 3.69-4.94 3.69-8.57z" fill="#4285F4"></path>
                                    <path d="M5.31 14.2c-.25-.74-.4-1.53-.4-2.35s.15-1.61.4-2.35L1.19 6.6C.43 8.11 0 9.8 0 11.85s.43 3.74 1.19 5.25l4.12-3.2z" fill="#FBBC05"></path>
                                    <path d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.71-2.87c-1.13.75-2.58 1.2-4.23 1.2-2.89 0-5.68-2.18-6.69-5.17L1.19 17.4C3.25 21.33 7.31 24 12 24z" fill="#34A853"></path>
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                            <span className="flex-shrink mx-4 text-ui" style={{ color: 'var(--text-muted)' }}>or</span>
                            <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                        </div>

                        {/* Form */}
                        <form className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-ui block mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b py-2 font-sans text-sm outline-none transition-colors focus:border-[var(--accent)]"
                                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-ui block mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-transparent border-b py-2 font-sans text-sm outline-none transition-colors focus:border-[var(--accent)]"
                                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <p className="text-ui text-center" style={{ color: 'var(--accent-error)' }}>
                                    {error as string}
                                </p>
                            )}
                            {message && (
                                <p className="text-ui text-center" style={{ color: 'var(--accent)' }}>
                                    {message as string}
                                </p>
                            )}

                            <button
                                formAction={login}
                                type="submit"
                                className="btn-primary w-full"
                            >
                                Log In
                            </button>
                        </form>

                        {/* Footer Actions */}
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <form>
                                <button
                                    formAction={signup}
                                    className="text-ui transition-colors cursor-pointer"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Create account
                                </button>
                            </form>
                            <Link
                                href="/"
                                className="text-ui flex items-center gap-2 transition-colors"
                                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                            >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                Back to typing
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
