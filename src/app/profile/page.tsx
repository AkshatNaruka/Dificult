import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements'
import { AdBanner } from '@/components/AdBanner'

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
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar
                user={user}
                isPro={entitlements.isPro}
                logoutSlot={
                    <form action={logout}>
                        <button
                            className="font-typing text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{
                                color: 'var(--text-main)',
                                background: 'none',
                                border: '1px solid var(--border-glass)',
                                cursor: 'pointer',
                                opacity: 0.6,
                            }}
                        >
                            Log out
                        </button>
                    </form>
                }
            />

            <main className="flex-1 pt-24">
                <div className="max-w-3xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-6">

                    {/* Profile header card */}
                    <div
                        className="rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 select-none"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            {user.email?.[0]?.toUpperCase() ?? 'U'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <h1 className="text-xl font-bold font-typing truncate" style={{ color: 'var(--text-primary)' }}>
                                {user.email?.split('@')[0]}
                            </h1>
                            <p className="text-xs font-typing" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                                Level {level} · {xp} XP
                            </p>
                            {/* XP bar */}
                            <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--border-glass)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${xpPct}%`, background: 'var(--text-accent)' }}
                                />
                            </div>
                            <p className="text-[10px] font-typing" style={{ color: 'var(--text-main)', opacity: 0.45 }}>
                                {xp} / {xpToNext} XP to level {level + 1}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {!entitlements.isPro && (
                                <Link
                                    href="/pricing"
                                    className="font-typing text-xs font-bold px-4 py-2 rounded-lg transition-all hover:opacity-90"
                                    style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                                >
                                    Upgrade
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Best WPM', value: highestWpm, unit: 'wpm' },
                            { label: 'Avg Accuracy', value: avgAccuracy, unit: '%' },
                            { label: 'Tests', value: testsCompleted, unit: '' },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="rounded-2xl border p-5 flex flex-col items-center gap-2 text-center"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                            >
                                <span
                                    className="font-typing text-[10px] uppercase tracking-widest"
                                    style={{ color: 'var(--text-main)', opacity: 0.5 }}
                                >
                                    {s.label}
                                </span>
                                <span
                                    className="font-typing text-3xl font-bold leading-none"
                                    style={{ color: 'var(--text-accent)' }}
                                >
                                    {s.value}
                                    {s.unit && (
                                        <span className="text-base font-normal ml-0.5" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                                            {s.unit}
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Membership card */}
                    <div
                        className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                    >
                        <div className="flex-1 space-y-1">
                            <div
                                className="text-[10px] uppercase tracking-[0.22em] font-typing"
                                style={{ color: 'var(--text-main)', opacity: 0.5 }}
                            >
                                Membership
                            </div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                {entitlements.isPro ? '✓ Pro active' : 'Free tier'}
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.65 }}>
                                {entitlements.isPro
                                    ? 'Ads removed · XP boosted · all packs unlocked.'
                                    : 'Upgrade for ad-free typing and premium cosmetic packs.'}
                            </p>
                        </div>
                        {entitlements.ownedBundles.length > 0 && (
                            <div
                                className="shrink-0 text-xs px-3 py-1.5 rounded-lg font-typing"
                                style={{
                                    background: 'color-mix(in srgb, var(--text-accent) 12%, transparent)',
                                    color: 'var(--text-accent)',
                                }}
                            >
                                {entitlements.ownedBundles.length} bundle{entitlements.ownedBundles.length > 1 ? 's' : ''} owned
                            </div>
                        )}
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
