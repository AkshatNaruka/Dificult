import Link from 'next/link';
import { ThemePicker } from '@/components/ThemePicker';

export default function BillingCancelPage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
          difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-typing opacity-70 hover:opacity-100">Pricing</Link>
          <ThemePicker />
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-xl w-full text-center space-y-4 p-10 rounded-3xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
          <div className="text-4xl">🧾</div>
          <h1 className="text-3xl font-bold">Checkout canceled</h1>
          <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
            No worries — you can come back anytime and pick up a pack or bundle.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/pricing" className="px-4 py-2 rounded-xl font-bold" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
              View pricing
            </Link>
            <Link href="/" className="px-4 py-2 rounded-xl border font-bold" style={{ borderColor: 'var(--border-glass)' }}>
              Back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
