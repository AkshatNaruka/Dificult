import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ThemePicker } from '@/components/ThemePicker';

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Top 20 by XP
    const { data: topXpProfiles } = await supabase
        .from('profiles')
        .select('id, email, xp, level')
        .order('xp', { ascending: false })
        .limit(20);

    // 2. Fetch Top 20 by Max WPM
    // Supabase RPC or complex joins are slightly trickier without raw SQL, 
    // so we can query highest WPMs directly from stats, then join the profile data.
    const { data: topStats } = await supabase
        .from('stats')
        .select('wpm, accuracy, profiles!inner(id, email)')
        .order('wpm', { ascending: false })
        .limit(50); // Fetch more to deduplicate

    const uniqueWpmMap = new Map();
    if (topStats) {
        for (const stat of topStats) {
            const profile = Array.isArray(stat.profiles) ? stat.profiles[0] : stat.profiles;
            const userId = (profile as any)?.id;
            if (!userId) continue;
            if (!uniqueWpmMap.has(userId)) {
                uniqueWpmMap.set(userId, {
                    id: userId,
                    email: (profile as any)?.email,
                    wpm: stat.wpm,
                    accuracy: stat.accuracy
                });
            }
            if (uniqueWpmMap.size >= 20) break;
        }
    }
    const topWpmUsers = Array.from(uniqueWpmMap.values());

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
                    type<span style={{ color: 'var(--text-accent)' }}>warrior</span>
                </Link>
                <div className="flex items-center gap-5">
                    <ThemePicker />
                    {user ? (
                        <Link href="/profile" className="font-typing text-sm hover:opacity-80 transition-opacity">
                            {user.email?.split('@')[0]}
                        </Link>
                    ) : (
                        <Link href="/login" className="px-4 py-1.5 rounded-full text-sm font-bold font-typing transition-all hover:bg-opacity-80" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
                            Log In
                        </Link>
                    )}
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center py-12 px-6">
                <div className="w-full max-w-5xl flex flex-col gap-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold font-typing" style={{ color: 'var(--text-accent)' }}>Global Leaderboard</h1>
                        <p className="font-typing text-sm mt-2" style={{ color: 'var(--text-main)' }}>Rank up. Dominate the boards.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top WPM Board */}
                        <div className="p-8 rounded-3xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                            <h2 className="text-2xl font-bold font-typing mb-6 flex items-center gap-2">
                                <span className="text-3xl">⚡</span> Highest WPM
                            </h2>
                            <div className="flex flex-col gap-3">
                                {topWpmUsers.length === 0 ? (
                                    <div className="text-sm font-typing opacity-50">No stats recorded yet.</div>
                                ) : (
                                    topWpmUsers.map((p, idx) => (
                                        <div key={`wpm-${p.id}`} className="flex items-center justify-between p-4 rounded-xl transition-transform hover:scale-[1.02]" style={{ background: user?.id === p.id ? 'var(--text-accent)' : 'black', color: user?.id === p.id ? 'var(--bg-primary)' : 'inherit', border: '1px solid var(--border-glass)' }}>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold font-typing" style={{ opacity: 0.5, width: '20px' }}>#{idx + 1}</span>
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                                                    {p.email?.[0].toUpperCase()}
                                                </div>
                                                <span className="font-bold truncate max-w-[120px]">{p.email?.split('@')[0]}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-xl font-typing">{p.wpm}</span>
                                                <span className="text-xs opacity-70 font-typing">{p.accuracy}% acc</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Top XP Board */}
                        <div className="p-8 rounded-3xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                            <h2 className="text-2xl font-bold font-typing mb-6 flex items-center gap-2">
                                <span className="text-3xl">⭐</span> Highest Level (XP)
                            </h2>
                            <div className="flex flex-col gap-3">
                                {!topXpProfiles || topXpProfiles.length === 0 ? (
                                    <div className="text-sm font-typing opacity-50">No profiles found.</div>
                                ) : (
                                    topXpProfiles.map((p, idx) => (
                                        <div key={`xp-${p.id}`} className="flex items-center justify-between p-4 rounded-xl transition-transform hover:scale-[1.02]" style={{ background: user?.id === p.id ? 'var(--text-accent)' : 'black', color: user?.id === p.id ? 'var(--bg-primary)' : 'inherit', border: '1px solid var(--border-glass)' }}>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold font-typing" style={{ opacity: 0.5, width: '20px' }}>#{idx + 1}</span>
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                                                    {p.email?.[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold truncate max-w-[120px]">{p.email?.split('@')[0]}</span>
                                                    <span className="text-xs opacity-70 font-typing">Lvl {p.level || 1}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-xl font-typing">{p.xp || 0}</span>
                                                <span className="text-xs opacity-70 font-typing">XP</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
