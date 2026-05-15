import { createClient } from '@/utils/supabase/server';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';
import { AdBanner } from '@/components/AdBanner';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

interface ProfileJoin {
    id: string;
    email?: string;
}

const rankLabel = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
};

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();
    const leaderboardLimit = entitlements.leaderboardLimit;

    let topXpProfiles: { id: string; email: string; xp: number; level: number }[] | null = null;
    let topWpmUsers: { id: string; email: string; wpm: number; accuracy: number }[] = [];

    if (supabase) {
        const { data } = await supabase
            .from('profiles')
            .select('id, email, xp, level')
            .order('xp', { ascending: false })
            .limit(leaderboardLimit);
        topXpProfiles = data;

        const { data: topStats } = await supabase
            .from('stats')
            .select('wpm, accuracy, profiles!inner(id, email)')
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
                        email: profile?.email,
                        wpm: stat.wpm,
                        accuracy: stat.accuracy
                    });
                }
                if (uniqueWpmMap.size >= leaderboardLimit) break;
            }
        }
        topWpmUsers = Array.from(uniqueWpmMap.values());
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-24">
                <div className="max-w-5xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-10">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                            Global rankings
                        </div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Leaderboard
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                            Rank up. Dominate the boards.
                        </p>
                    </div>

                    {/* Upsell banner */}
                    {!entitlements.isPro && (
                        <div
                            className="flex items-center justify-between gap-4 p-5 rounded-2xl border"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                        >
                            <div className="space-y-0.5">
                                <div className="text-xs uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--text-main)' }}>
                                    Pro leaderboard
                                </div>
                                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    Unlock top 50 rankings + advanced filters
                                </div>
                            </div>
                            <Link
                                href="/pricing"
                                className="shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                                style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                            >
                                Upgrade
                            </Link>
                        </div>
                    )}

                    {/* Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WPM board */}
                        <div
                            className="rounded-2xl border overflow-hidden"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                        >
                            <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-glass)' }}>
                                <span className="text-lg">⚡</span>
                                <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Highest WPM</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                                {topWpmUsers.length === 0 ? (
                                    <div className="px-6 py-8 text-sm opacity-40 text-center" style={{ color: 'var(--text-main)' }}>
                                        No stats recorded yet.
                                    </div>
                                ) : topWpmUsers.map((p, idx) => {
                                    const isMe = user?.id === p.id;
                                    return (
                                        <div
                                            key={`wpm-${p.id}`}
                                            className="flex items-center px-5 py-3.5 gap-3 transition-colors"
                                            style={{
                                                background: isMe ? 'color-mix(in srgb, var(--text-accent) 10%, transparent)' : 'transparent',
                                            }}
                                        >
                                            <span
                                                className="text-sm font-bold w-8 shrink-0 text-center"
                                                style={{ color: idx < 3 ? 'var(--text-accent)' : 'var(--text-main)', opacity: idx < 3 ? 1 : 0.45 }}
                                            >
                                                {rankLabel(idx)}
                                            </span>
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                                style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                            >
                                                {p.email?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <span
                                                className="flex-1 font-medium text-sm truncate"
                                                style={{ color: isMe ? 'var(--text-accent)' : 'var(--text-primary)' }}
                                            >
                                                {p.email?.split('@')[0]}
                                                {isMe && <span className="ml-2 text-[10px] opacity-60">(you)</span>}
                                            </span>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{p.wpm}</div>
                                                <div className="text-[10px] opacity-50" style={{ color: 'var(--text-main)' }}>{p.accuracy}% acc</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* XP board */}
                        <div
                            className="rounded-2xl border overflow-hidden"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                        >
                            <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-glass)' }}>
                                <span className="text-lg">⭐</span>
                                <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Highest Level</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                                {!topXpProfiles || topXpProfiles.length === 0 ? (
                                    <div className="px-6 py-8 text-sm opacity-40 text-center" style={{ color: 'var(--text-main)' }}>
                                        No profiles found.
                                    </div>
                                ) : topXpProfiles.map((p, idx) => {
                                    const isMe = user?.id === p.id;
                                    return (
                                        <div
                                            key={`xp-${p.id}`}
                                            className="flex items-center px-5 py-3.5 gap-3 transition-colors"
                                            style={{
                                                background: isMe ? 'color-mix(in srgb, var(--text-accent) 10%, transparent)' : 'transparent',
                                            }}
                                        >
                                            <span
                                                className="text-sm font-bold w-8 shrink-0 text-center"
                                                style={{ color: idx < 3 ? 'var(--text-accent)' : 'var(--text-main)', opacity: idx < 3 ? 1 : 0.45 }}
                                            >
                                                {rankLabel(idx)}
                                            </span>
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                                style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                            >
                                                {p.email?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="font-medium text-sm truncate"
                                                    style={{ color: isMe ? 'var(--text-accent)' : 'var(--text-primary)' }}
                                                >
                                                    {p.email?.split('@')[0]}
                                                    {isMe && <span className="ml-2 text-[10px] opacity-60">(you)</span>}
                                                </div>
                                                <div className="text-[10px] opacity-45" style={{ color: 'var(--text-main)' }}>
                                                    Level {p.level || 1}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{p.xp || 0}</div>
                                                <div className="text-[10px] opacity-50" style={{ color: 'var(--text-main)' }}>XP</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
                </div>
            </main>
        </div>
    );
}
