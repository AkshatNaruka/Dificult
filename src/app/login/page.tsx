import { login, signup } from './actions'
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
                    type<span style={{ color: 'var(--text-accent)' }}>warrior</span>
                </Link>
                <ThemePicker />
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-typing mb-2" style={{ color: 'var(--text-accent)' }}>Welcome Back</h1>
                        <p className="text-sm font-typing" style={{ color: 'var(--text-main)' }}>Sign in to save your stats and access multiplayer.</p>
                    </div>

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
                </div>
            </div>
        </div>
    )
}
