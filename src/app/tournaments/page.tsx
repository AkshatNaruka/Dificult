import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ThemePicker } from '@/components/ThemePicker';
import { tournaments } from '@/data/tournaments';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function TournamentsPage() {
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
          <Link href="/store" className="text-sm font-typing opacity-70 hover:opacity-100">Store</Link>
          <Link href="/gear" className="text-sm font-typing opacity-70 hover:opacity-100">Gear</Link>
          <Link href="/pricing" className="text-sm font-typing opacity-70 hover:opacity-100">Pricing</Link>
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
              Tournaments
            </div>
            <h1 className="text-4xl font-bold">Branded speed events</h1>
            <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
              Monthly competitions with sponsor-backed prize pools and leaderboard branding.
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

          <div className="grid gap-5">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="rounded-3xl border p-6 space-y-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">{tournament.name}</div>
                    <div className="text-xs uppercase tracking-[0.16em] opacity-60" style={{ color: 'var(--text-main)' }}>
                      {new Date(tournament.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <a
                    href={tournament.sponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold px-3 py-1.5 rounded-full border"
                    style={{ borderColor: 'var(--border-glass)' }}
                  >
                    Sponsored by {tournament.sponsor.logoText}
                  </a>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>{tournament.description}</p>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-glass)' }}>
                    <div className="text-xs uppercase tracking-[0.16em] opacity-60" style={{ color: 'var(--text-main)' }}>Entry fee</div>
                    <div className="font-bold">{tournament.entryFee}</div>
                  </div>
                  <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-glass)' }}>
                    <div className="text-xs uppercase tracking-[0.16em] opacity-60" style={{ color: 'var(--text-main)' }}>Prize pool</div>
                    <div className="font-bold">{tournament.prizePool}</div>
                  </div>
                  <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-glass)' }}>
                    <div className="text-xs uppercase tracking-[0.16em] opacity-60" style={{ color: 'var(--text-main)' }}>Leaderboard</div>
                    <div className="font-bold">{tournament.leaderboardNote}</div>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl font-bold" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
                  Join waitlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
