import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import Link from 'next/link'
import { ThemePicker } from '@/components/ThemePicker'
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements'
import { AdBanner } from '@/components/AdBanner'

export default async function ProfilePage() {
    const supabase = await createClient()
    const user = supabase ? (await supabase.auth.getUser()).data.user : null

    if (!user) {
        redirect('/login')
    }

    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements()

    // Fetch Profile
    const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Stats
    const { data: stats } = await supabase!
        .from('stats')
        .select('*')
        .eq('user_id', user.id)

    const highestWpm = stats?.length ? Math.max(...stats.map(s => s.wpm)) : 0
    const avgAccuracy = stats?.length ? (stats.reduce((acc, curr) => acc + curr.accuracy, 0) / stats.length).toFixed(1) : 0
    const testsCompleted = stats?.length || 0

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
                    type<span style={{ color: 'var(--text-accent)' }}>warrior</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/store" className="text-sm font-typing opacity-70 hover:opacity-100">Store</Link>
                    <Link href="/gear" className="text-sm font-typing opacity-70 hover:opacity-100">Gear</Link>
                    <Link href="/tournaments" className="text-sm font-typing opacity-70 hover:opacity-100">Tournaments</Link>
                    <ThemePicker />
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center py-12 px-6">
                <div className="w-full max-w-4xl flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex items-center justify-between p-8 rounded-3xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
                                {user.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold font-typing mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {user.email?.split('@')[0]}
                                </h1>
                                <p className="font-typing text-sm" style={{ color: 'var(--text-main)' }}>Level {profile?.level || 1} Typist • {profile?.xp || 0} XP</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {!entitlements.isPro && (
                                <Link href="/pricing" className="px-6 py-2 rounded-xl font-bold font-typing transition-all hover:bg-opacity-80" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
                                    Upgrade to Pro
                                </Link>
                            )}
                            <form action={logout}>
                                <button className="px-6 py-2 rounded-xl font-bold font-typing transition-all hover:bg-opacity-80" style={{ border: '2px solid var(--text-accent)', color: 'var(--text-accent)' }}>
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
                        <div>
                            <div className="text-xs uppercase tracking-[0.24em] opacity-60" style={{ color: 'var(--text-main)' }}>
                                Membership
                            </div>
                            <div className="text-lg font-bold mt-1">
                                {entitlements.isPro ? 'Pro active' : 'Free tier'}
                            </div>
                            <div className="text-sm mt-1" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                {entitlements.isPro
                                    ? 'Ads removed, XP boosted, premium themes unlocked.'
                                    : 'Upgrade for ad-free typing and premium cosmetics.'}
                            </div>
                        </div>
                        {entitlements.isPro && entitlements.currentPeriodEnd && (
                            <div className="text-right text-sm" style={{ color: 'var(--text-main)' }}>
                                Renews {new Date(entitlements.currentPeriodEnd).toLocaleDateString('en-US')}
                            </div>
                        )}
                    </div>

                    {/* Stats Grid - DB integration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Highest WPM', value: highestWpm, suffix: 'wpm' },
                            { label: 'Average Accuracy', value: avgAccuracy, suffix: '%' },
                            { label: 'Tests Completed', value: testsCompleted, suffix: '' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl flex flex-col items-center justify-center gap-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                                <span className="font-typing text-sm" style={{ color: 'var(--text-main)' }}>{stat.label}</span>
                                <div className="flex items-baseline gap-1 font-typing text-4xl font-bold" style={{ color: 'var(--text-accent)' }}>
                                    {stat.value}
                                    {stat.suffix && <span className="text-xl">{stat.suffix}</span>}
                                </div>
                            </div>
                        ))}
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
    )
}
