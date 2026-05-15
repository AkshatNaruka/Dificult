import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function BillingSuccessPage() {
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-5 py-16 pt-24">
                <div
                    className="max-w-md w-full text-center space-y-5 p-10 rounded-2xl border"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                >
                    <div className="text-5xl">🎉</div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Purchase complete
                    </h1>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                        Your packs and bundle unlocks will appear shortly. Thanks for supporting Dificult!
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Start typing
                        </Link>
                        <Link
                            href="/store"
                            className="px-5 py-2.5 rounded-xl border font-bold text-sm transition-all hover:opacity-80"
                            style={{ borderColor: 'var(--border-glass)', color: 'var(--text-primary)' }}
                        >
                            Back to store
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
