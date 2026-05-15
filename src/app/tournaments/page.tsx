import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { tournaments } from '@/data/tournaments';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';

export default async function TournamentsPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-8 pb-24 w-full">
                {/* Hero Section */}
                <section className="max-w-container-max mx-auto px-margin-safe text-center mb-24">
                    <SectionHeader
                        label="Tournaments"
                        heading="Branded speed events"
                        subtitle="Monthly competitions with sponsor-backed prize pools and leaderboard branding. Push your typing limits in the ultimate flow state environment."
                    />
                </section>

                {entitlements.adsEnabled && (
                    <div className="flex justify-center mb-12">
                        <AdBanner
                            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''}
                            format="horizontal"
                            className="w-full max-w-container-max"
                            style={{ minHeight: '90px' }}
                        />
                    </div>
                )}

                {/* Tournament Feed */}
                <div className="max-w-container-max mx-auto px-margin-safe space-y-12">
                    {tournaments.map((tournament) => (
                        <GlassCard key={tournament.id} className="p-8 md:p-12 relative group overflow-hidden">
                            {tournament.image && (
                                <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none overflow-hidden">
                                    <Image
                                        src={tournament.image}
                                        alt={tournament.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="heading-section">{tournament.name}</h2>
                                        <div className="flex gap-4 items-center">
                                            <span className="text-ui" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(tournament.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>/</span>
                                            <a className="text-ui transition-colors hover:underline" href={tournament.sponsor.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                                                by {tournament.sponsor.logoText}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-body max-w-3xl leading-relaxed">
                                    {tournament.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <div>
                                        <p className="text-ui uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Entry Fee</p>
                                        <p className="heading-section">{tournament.entryFee}</p>
                                    </div>
                                    <div>
                                        <p className="text-ui uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Prize Pool</p>
                                        <p className="heading-section">{tournament.prizePool}</p>
                                    </div>
                                    <div>
                                        <p className="text-ui uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Leaderboard</p>
                                        <p className="heading-section">{tournament.leaderboardNote}</p>
                                    </div>
                                </div>

                                <button className="btn-primary w-full">
                                    Join waitlist
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
