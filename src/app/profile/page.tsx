import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements'
import { AdBanner } from '@/components/AdBanner'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatChip } from '@/components/ui/StatChip'
import { Footer } from '@/components/Footer'

export default async function ProfilePage() {
    const supabase = await createClient()
    const user = supabase ? (await supabase.auth.getUser()).data.user : null

    if (!user) redirect('/login')

    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements()

    const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: stats } = await supabase!
        .from('stats')
        .select('*')
        .eq('user_id', user.id)

    const highestWpm = stats?.length ? Math.max(...stats.map(s => s.wpm)) : 0
    const avgAccuracy = stats?.length
        ? (stats.reduce((acc, curr) => acc + curr.accuracy, 0) / stats.length).toFixed(1)
        : '0'
    const testsCompleted = stats?.length || 0
    const level = profile?.level || 1
    const xp = profile?.xp || 0
    const xpToNext = level * 1000
    const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100))

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
        >
            <Navbar
                user={user}
                isPro={entitlements.isPro}
                logoutSlot={
                    <form action={logout}>
                        <button
                            className="text-ui px-3 py-1.5 rounded transition-all"
                            style={{
                                color: 'var(--text-secondary)',
                                background: 'none',
                                border: '1px solid var(--border-subtle)',
                                cursor: 'pointer',
                                opacity: 0.6,
                            }}
                        >
                            Log out
                        </button>
                    </form>
                }
            />

            <main className="flex-1 pt-8">
                <div className="max-w-3xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-6">

                    {/* Profile header card */}
                    <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Avatar */}
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 select-none"
                            style={{ background: 'var(--accent)', color: 'var(--bg-base)' }}
                        >
                            {user.email?.[0]?.toUpperCase() ?? 'U'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <h1 className="heading-section text-xl truncate">
                                {user.email?.split('@')[0]}
                            </h1>
                            <p className="text-ui" style={{ color: 'var(--text-secondary)' }}>
                                Level {level} · {xp} XP
                            </p>
                            {/* XP bar */}
                            <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: xpPct + '%', background: 'var(--accent)' }}
                                />
                            </div>
                            <p className="text-ui" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                                {xp} / {xpToNext} XP to level {level + 1}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {!entitlements.isPro && (
                                <Link
                                    href="/pricing"
                                    className="btn-primary !px-4 !py-2 !text-xs"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Upgrade
                                </Link>
                            )}
                        </div>
                    </GlassCard>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Best WPM', value: highestWpm, unit: 'wpm' },
                            { label: 'Avg Accuracy', value: avgAccuracy, unit: '%' },
                            { label: 'Tests', value: testsCompleted, unit: '' },
                        ].map((s) => (
                            <GlassCard key={s.label} className="p-5 flex flex-col items-center gap-2 text-center">
                                <span className="text-ui" style={{ color: 'var(--text-muted)' }}>
                                    {s.label}
                                </span>
                                <span className="text-stat text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                                    {s.value}
                                    {s.unit && (
                                        <span className="text-sm font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>
                                            {s.unit}
                                        </span>
                                    )}
                                </span>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Membership card */}
                    <GlassCard className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 space-y-1">
                            <div className="text-ui" style={{ color: 'var(--text-muted)' }}>
                                Membership
                            </div>
                            <div className="heading-section text-sm">
                                {entitlements.isPro ? '✓ Pro active' : 'Free tier'}
                            </div>
                            <p className="text-body text-xs">
                                {entitlements.isPro
                                    ? 'Ads removed · XP boosted · all packs unlocked.'
                                    : 'Upgrade for ad-free typing and premium cosmetic packs.'}
                            </p>
                        </div>
                        {entitlements.ownedBundles.length > 0 && (
                            <div
                                className="shrink-0 text-xs px-3 py-1.5 rounded-lg"
                                style={{
                                    background: 'rgba(167,139,250,0.12)',
                                    color: 'var(--accent)',
                                }}
                            >
                                {entitlements.ownedBundles.length} bundle{entitlements.ownedBundles.length > 1 ? 's' : ''} owned
                            </div>
                        )}
                        {!entitlements.isPro && (
                            <Link
                                href="/pricing"
                                className="btn-primary !px-4 !py-2 !text-xs"
                                style={{ textDecoration: 'none' }}
                            >
                                Upgrade
                            </Link>
                        )}
                    </GlassCard>

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

            <Footer />
        </div>
    )
}
