import { login, signup, loginWithGoogle } from './actions'
import Link from 'next/link'
import { ThemePicker } from '@/components/ThemePicker'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const error = resolvedParams.error
    const message = resolvedParams.message

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
                    difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
                </Link>
                <ThemePicker />
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-typing mb-2" style={{ color: 'var(--text-accent)' }}>Welcome Back</h1>
                        <p className="text-sm font-typing" style={{ color: 'var(--text-main)' }}>Sign in to save your stats, access the leaderboard, and track progress.</p>
                    </div>

                    {/* Google Sign-In */}
                    <form className="mb-5">
                        <button
                            formAction={loginWithGoogle}
                            className="w-full py-3 rounded-xl font-bold font-typing text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-glass)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
                        <span className="text-xs font-typing" style={{ color: 'var(--text-main)', opacity: 0.5 }}>or</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
                    </div>

                    {/* Email/Password Form */}
                    <form className="flex flex-col gap-5 font-typing text-sm">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" style={{ color: 'var(--text-main)' }}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="px-4 py-3 rounded-xl outline-none transition-all duration-200"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" style={{ color: 'var(--text-main)' }}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="px-4 py-3 rounded-xl outline-none transition-all duration-200"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="p-4 bg-red-500/10 text-red-500 rounded-xl text-center">
                                {error as string}
                            </p>
                        )}
                        {message && (
                            <p className="p-4 bg-green-500/10 text-green-500 rounded-xl text-center">
                                {message as string}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                formAction={login}
                                className="w-full py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                            >
                                Log In
                            </button>
                            <button
                                formAction={signup}
                                className="w-full py-3 rounded-xl font-bold transition-all hover:bg-opacity-80"
                                style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--text-main)' }}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {/* Back to typing */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="font-typing text-xs transition-opacity hover:opacity-80"
                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                        >
                            ← Back to typing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
