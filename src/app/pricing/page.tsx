import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ThemePicker } from '@/components/ThemePicker';
import { PricingPlans } from '@/components/Pricing/PricingPlans';

export default async function PricingPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
          difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/store" className="text-sm font-typing opacity-70 hover:opacity-100">Store</Link>
          <Link href="/gear" className="text-sm font-typing opacity-70 hover:opacity-100">Gear</Link>
          <Link href="/tournaments" className="text-sm font-typing opacity-70 hover:opacity-100">Tournaments</Link>
          <ThemePicker />
          {user ? (
            <Link href="/profile" className="text-sm font-typing opacity-70 hover:opacity-100">
              {user.email?.split('@')[0]}
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-1.5 rounded-full text-sm font-bold font-typing transition-all hover:bg-opacity-80" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
              Log In
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-5xl space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs uppercase tracking-[0.32em] opacity-60" style={{ color: 'var(--text-main)' }}>
              Pricing
            </div>
            <h1 className="text-4xl font-bold">Upgrade to Pro</h1>
            <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
              Themes, XP boosts, extra leaderboard depth, and zero ads.
            </p>
          </div>
          <PricingPlans />
        </div>
      </main>
    </div>
  );
}
