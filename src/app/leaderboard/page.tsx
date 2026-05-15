import { createClient } from '@/utils/supabase/server';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RankBadge } from '@/components/ui/RankBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { AdBanner } from '@/components/AdBanner';
import Link from 'next/link';

interface ProfileJoin {
    id: string;
    email?: string;
    level?: number;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();
    const leaderboardLimit = entitlements.leaderboardLimit;

    let topWpmUsers: { id: string; email: string; wpm: number; accuracy: number; level: number; date: string }[] = [];

    if (supabase) {
        const { data: topStats } = await supabase
            .from('stats')
            .select('wpm, accuracy, created_at, profiles!inner(id, email, level)')
            .order('wpm', { ascending: false })
            .limit(Math.max(leaderboardLimit * 3, 30));

        const uniqueWpmMap = new Map();
        if (topStats) {
            for (const stat of topStats) {
                const profile = (Array.isArray(stat.profiles) ? stat.profiles[0] : stat.profiles) as ProfileJoin | undefined;
                const userId = profile?.id;
                if (!userId) continue;
                if (!uniqueWpmMap.has(userId)) {
                    uniqueWpmMap.set(userId, {
                        id: userId,
                        email: profile?.email || 'Unknown',
                        level: profile?.level || 1,
                        wpm: stat.wpm,
                        accuracy: stat.accuracy,
                        date: stat.created_at || new Date().toISOString()
                    });
                }
                if (uniqueWpmMap.size >= leaderboardLimit) break;
            }
        }
        topWpmUsers = Array.from(uniqueWpmMap.values());
    }

    const top3 = topWpmUsers.slice(0, 3);
    const rest = topWpmUsers.slice(3);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-28 pb-24 px-6 max-w-[1100px] mx-auto w-full">
                <SectionHeader label="Global Rankings" heading="Leaderboard" subtitle="Rank up. Dominate the boards. Optimize your flow." />

                {/* Top 3 Podium */}
                {top3.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        {top3.map((p, idx) => (
                            <GlassCard key={p.id} className={`p-6 text-center ${idx === 0 ? 'md:order-2 ring-1 ring-[#fbbf24]/30' : idx === 1 ? 'md:order-1' : 'md:order-3'}`}>
                                <RankBadge rank={idx + 1} size="lg" />
                                <div className="mt-4 mb-2">
                                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-lg font-bold font-mono" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>
                                        {p.email[0].toUpperCase()}
                                    </div>
                                </div>
                                <p className="font-mono text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{p.email.split('@')[0]}</p>
                                <p className="text-stat text-3xl font-bold mt-2" style={{ color: 'var(--accent)' }}>{p.wpm}</p>
                                <p className="text-ui mt-1" style={{ color: 'var(--text-muted)' }}>WPM</p>
                            </GlassCard>
                        ))}
                    </div>
                )}

                {/* Filter Bar */}
                <div className="glass-card p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                        {['Global', 'Friends'].map(tab => (
                            <button key={tab} className="text-ui px-4 py-1.5 rounded transition-colors" style={{ background: tab === 'Global' ? 'rgba(167,139,250,0.1)' : 'transparent', color: tab === 'Global' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="bg-transparent text-ui py-1 px-2 rounded" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <option value="30">30s</option>
                            <option value="60">60s</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <th className="text-ui px-6 py-4" style={{ color: 'var(--text-muted)' }}>Rank</th>
                                <th className="text-ui px-6 py-4" style={{ color: 'var(--text-muted)' }}>Typist</th>
                                <th className="text-ui px-6 py-4 text-right" style={{ color: 'var(--text-muted)' }}>WPM</th>
                                <th className="text-ui px-6 py-4 text-right hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Accuracy</th>
                                <th className="text-ui px-6 py-4 text-right hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>When</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rest.length === 0 && top3.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-body">No stats recorded yet.</td></tr>
                            )}
                            {rest.map((p, idx) => {
                                const rank = idx + 4;
                                const isMe = user?.id === p.id;
                                return (
                                    <tr key={p.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)', background: isMe ? 'rgba(167,139,250,0.05)' : undefined }}>
                                        <td className="px-6 py-4"><RankBadge rank={rank} size="sm" /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
                                                    {p.email[0].toUpperCase()}
                                                </div>
                                                <span className="font-mono text-sm" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>
                                                    {p.email.split('@')[0]}
                                                    {isMe && <span className="ml-2 text-ui px-1.5 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--accent)', fontSize: '9px' }}>YOU</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-stat text-lg font-bold" style={{ color: 'var(--accent)' }}>{p.wpm}</td>
                                        <td className="px-6 py-4 text-right text-stat text-sm hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{p.accuracy}%</td>
                                        <td className="px-6 py-4 text-right text-ui hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{timeAgo(p.date)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pro Barrier */}
                {!entitlements.isPro && topWpmUsers.length > 0 && (
                    <div className="glass-card p-12 text-center mt-6">
                        <span className="text-ui block mb-4" style={{ color: 'var(--accent-warning)' }}>PRO FEATURE</span>
                        <h3 className="heading-section text-xl mb-2">Unlock Full Rankings</h3>
                        <p className="text-body mb-6">See top 50 rankings, advanced stats, and personal progress tracking.</p>
                        <Link href="/pricing" className="btn-primary !px-8" style={{ textDecoration: 'none' }}>Upgrade to Pro</Link>
                    </div>
                )}

                {entitlements.adsEnabled && (
                    <div className="flex justify-center mt-12">
                        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''} format="horizontal" className="w-full max-w-[728px]" style={{ minHeight: '90px' }} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
