import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { gearItems } from '@/data/gear';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function GearPage() {
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
                <div className="max-w-5xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-10">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div
                            className="text-xs uppercase tracking-[0.32em]"
                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                        >
                            Gear guide
                        </div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Recommended keyboard setups
                        </h1>
                        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-main)', opacity: 0.65 }}>
                            Curated tools for speed and comfort. Affiliate links — we may earn a commission.
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

                    <div className="grid gap-5 md:grid-cols-2">
                        {gearItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group rounded-2xl border p-6 flex flex-col gap-4 transition-all hover:border-[var(--text-accent)]"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                                            {item.name}
                                        </div>
                                        <div
                                            className="text-[11px] uppercase tracking-[0.16em]"
                                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                                        >
                                            {item.brand} · {item.category}
                                        </div>
                                    </div>
                                    <span
                                        className="text-sm font-bold shrink-0 px-2.5 py-1 rounded-lg"
                                        style={{
                                            color: 'var(--text-accent)',
                                            background: 'color-mix(in srgb, var(--text-accent) 12%, transparent)',
                                        }}
                                    >
                                        {item.priceRange}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                    {item.description}
                                </p>

                                <div
                                    className="flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all"
                                    style={{ color: 'var(--text-accent)' }}
                                >
                                    View deal
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
