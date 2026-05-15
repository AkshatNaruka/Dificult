import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
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
        <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-24">
                <div className="max-w-3xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-10">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div
                            className="text-xs uppercase tracking-[0.32em]"
                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                        >
                            Tournaments
                        </div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Branded speed events
                        </h1>
                        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-main)', opacity: 0.65 }}>
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

                    <div className="flex flex-col gap-5">
                        {tournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="rounded-2xl border overflow-hidden"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                            >
                                {/* Card top */}
                                <div className="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b" style={{ borderColor: 'var(--border-glass)' }}>
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {tournament.name}
                                        </div>
                                        <div
                                            className="text-[11px] uppercase tracking-[0.16em]"
                                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                                        >
                                            {new Date(tournament.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                    <a
                                        href={tournament.sponsor.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 hover:opacity-80 transition-opacity"
                                        style={{ borderColor: 'var(--border-glass)', color: 'var(--text-main)' }}
                                    >
                                        by {tournament.sponsor.logoText}
                                    </a>
                                </div>

                                {/* Description + stats */}
                                <div className="p-6 flex flex-col gap-5">
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                        {tournament.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Entry fee', value: tournament.entryFee },
                                            { label: 'Prize pool', value: tournament.prizePool },
                                            { label: 'Leaderboard', value: tournament.leaderboardNote },
                                        ].map(({ label, value }) => (
                                            <div
                                                key={label}
                                                className="rounded-xl border px-3 py-3 space-y-1"
                                                style={{ borderColor: 'var(--border-glass)', background: 'rgba(255,255,255,0.03)' }}
                                            >
                                                <div
                                                    className="text-[10px] uppercase tracking-[0.16em]"
                                                    style={{ color: 'var(--text-main)', opacity: 0.5 }}
                                                >
                                                    {label}
                                                </div>
                                                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="w-full sm:w-auto sm:self-start px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                                        style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                                    >
                                        Join waitlist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
