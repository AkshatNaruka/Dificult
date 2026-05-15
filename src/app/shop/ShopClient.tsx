'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { themes } from '@/data/themes';
import { gearItems } from '@/data/gear';
import { pricingPlans } from '@/data/commerce';
import { useCheckout } from '@/hooks/useCheckout';
import { useEntitlements } from '@/hooks/useEntitlements';

type Tab = 'themes' | 'sounds' | 'gear';

export function ShopClient() {
    const [activeTab, setActiveTab] = useState<Tab>('themes');
    const { entitlements } = useEntitlements();
    const { startCheckout, isLoading } = useCheckout();

    const premiumPlan = pricingPlans.find(p => p.id === 'pro_monthly');
    const ownsPremium = premiumPlan && entitlements.ownedBundles.includes(premiumPlan.id);

    return (
        <>
            <SectionHeader label="Shop" heading="Customize your setup" subtitle="Themes, sounds, and gear for the competitive typist." />

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-8 glass-card p-1.5 w-fit mx-auto">
                {(['themes', 'sounds', 'gear'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="text-ui px-5 py-2 rounded transition-colors capitalize"
                        style={{
                            background: activeTab === tab ? 'rgba(167,139,250,0.1)' : 'transparent',
                            color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab ? 700 : 500,
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Themes Tab */}
            {activeTab === 'themes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map(theme => (
                        <GlassCard key={theme.id} className="p-4 overflow-hidden">
                            <div className="rounded mb-3 p-3 h-20 flex items-center justify-center" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                                <span className="font-mono text-xs" style={{ color: theme.colors.text }}>
                                    the quick brown fox
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{theme.name}</p>
                                    <p className="text-ui" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{theme.description}</p>
                                </div>
                                {(!theme.access || theme.access.type === 'free') ? (
                                    <span className="text-ui" style={{ color: 'var(--accent-secondary)', fontSize: '9px' }}>FREE</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm" style={{ color: 'var(--accent-warning)' }}>lock</span>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Sounds Tab */}
            {activeTab === 'sounds' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Mechanical', 'Soft Touch', 'Typewriter', 'Bubble Pop'].map(sound => (
                        <GlassCard key={sound} className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>graphic_eq</span>
                                <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{sound}</span>
                            </div>
                            <button className="text-ui px-3 py-1 rounded" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                Preview
                            </button>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Gear Tab */}
            {activeTab === 'gear' && (
                <div className="space-y-4">
                    <p className="text-ui mb-6" style={{ color: 'var(--text-muted)' }}>
                        Affiliate links — we may earn a commission.
                    </p>
                    {gearItems.map(item => (
                        <GlassCard key={item.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 h-36 rounded overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-surface-elevated)' }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--text-muted)' }}>keyboard</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="heading-section text-base">{item.name}</h3>
                                        <p className="text-ui" style={{ color: 'var(--accent)' }}>{item.brand} · {item.category}</p>
                                    </div>
                                    <span className="text-stat text-sm" style={{ color: 'var(--text-secondary)' }}>{item.priceRange}</span>
                                </div>
                                <p className="text-body mb-3">{item.description}</p>
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-ui inline-flex items-center gap-1 transition-colors" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                    View deal <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Pricing CTA */}
            {!ownsPremium && (
                <div className="glass-card p-8 mt-12 text-center">
                    <h3 className="heading-section text-xl mb-2">Unlock everything</h3>
                    <p className="text-body mb-6">Premium themes, sounds, and XP boosts in one purchase.</p>
                    <button
                        disabled={isLoading}
                        onClick={() => premiumPlan?.priceId && startCheckout({ productId: premiumPlan.priceId, metadata: { entitlement_type: 'bundle', entitlement_key: premiumPlan.id } })}
                        className="btn-primary"
                    >
                        {isLoading ? 'Loading...' : 'Buy Premium — $7'}
                    </button>
                </div>
            )}
        </>
    );
}
