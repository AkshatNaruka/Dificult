import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ThemePicker } from '@/components/ThemePicker';
import { StoreCatalog } from '@/components/Store/StoreCatalog';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function StorePage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const entitlements = user && supabase
    ? await getEntitlementsForUser(supabase, user.id)
    : getDefaultEntitlements();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
          difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-typing opacity-70 hover:opacity-100">Pricing</Link>
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

      <main className="flex-1 flex flex-col items-center py-14 px-6">
        <div className="w-full max-w-5xl space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs uppercase tracking-[0.32em] opacity-60" style={{ color: 'var(--text-main)' }}>
                Pack store
            </div>
              <h1 className="text-4xl font-bold">Themes, sounds, and background packs</h1>
            <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                Buy individual packs or unlock larger one-time bundles.
            </p>
          </div>
          {entitlements.adsEnabled && (
            <div className="flex justify-center">
              <AdBanner
                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''}
                format="horizontal"
                className="w-full"
                style={{ minHeight: '90px' }}
              />
            </div>
          )}
          <StoreCatalog />
        </div>
      </main>
    </div>
  );
}
