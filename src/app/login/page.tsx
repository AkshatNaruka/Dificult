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
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-5 py-16 pt-24">
                <div
                    className="w-full max-w-sm rounded-2xl p-8 space-y-6"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                >
                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold font-typing" style={{ color: 'var(--text-primary)' }}>
                            Welcome back
                        </h1>
                        <p className="text-xs font-typing leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                            Sign in to save stats, access the leaderboard, and track progress.
                        </p>
                    </div>

                    {/* Google */}
                    <form>
                        <button
                            formAction={loginWithGoogle}
                            className="w-full py-2.5 rounded-xl font-bold font-typing text-sm flex items-center justify-center gap-3 transition-all hover:opacity-80 active:scale-[0.98]"
                            style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-glass)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
                        <span className="text-xs font-typing" style={{ color: 'var(--text-main)', opacity: 0.45 }}>or</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
                    </div>

                    {/* Email form */}
                    <form className="flex flex-col gap-4 font-typing text-sm">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="px-3.5 py-2.5 rounded-xl outline-none transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                }}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="px-3.5 py-2.5 rounded-xl outline-none transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="px-4 py-3 rounded-xl text-sm text-center" style={{ background: 'var(--bg-error)', color: 'var(--text-error)' }}>
                                {error as string}
                            </p>
                        )}
                        {message && (
                            <p className="px-4 py-3 rounded-xl text-sm text-center bg-green-500/10 text-green-500">
                                {message as string}
                            </p>
                        )}

                        <div className="flex flex-col gap-2 pt-1">
                            <button
                                formAction={login}
                                className="w-full py-2.5 rounded-xl font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)', cursor: 'pointer', fontSize: '14px' }}
                            >
                                Log In
                            </button>
                            <button
                                formAction={signup}
                                className="w-full py-2.5 rounded-xl font-bold transition-all hover:opacity-80"
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-main)',
                                    border: '1px solid var(--border-glass)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                Create account
                            </button>
                        </div>
                    </form>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="font-typing text-xs transition-opacity hover:opacity-80 decoration-transparent"
                            style={{ color: 'var(--text-main)', opacity: 0.45 }}
                        >
                            ← Back to typing
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
