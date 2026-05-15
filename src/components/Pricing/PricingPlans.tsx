'use client';

import React from 'react';
import { pricingPlans } from '@/data/commerce';
import { useCheckout } from '@/hooks/useCheckout';
import { useEntitlements } from '@/hooks/useEntitlements';

const perks = [
    { icon: '🎨', text: 'Premium themes, cursor packs, and sound packs' },
    { icon: '🖼️', text: 'Background packs with GIF and video-style loops' },
    { icon: '💳', text: 'One-time access — no subscription, no recurring billing' },
    { icon: '🏆', text: 'Boosted leaderboard XP and challenge bonuses' },
    { icon: '🌪️', text: 'Extra visual distraction modes for intense sessions' },
    { icon: '📦', text: 'Future cosmetic drops included in the creator bundle' },
];

export function PricingPlans() {
    const { entitlements } = useEntitlements();
    const { startCheckout, isLoading } = useCheckout();

    return (
        <div className="flex flex-col gap-12">
            {/* Plans row */}
            <div className="grid gap-5 md:grid-cols-2">
                {pricingPlans.map((plan) => {
                    const owned = entitlements.ownedBundles.includes(plan.id);
                    const isHighlighted = !!plan.badge;

                    return (
                        <div
                            key={plan.id}
                            className="rounded-2xl border flex flex-col gap-6 p-7 relative overflow-hidden transition-all"
                            style={{
                                background: isHighlighted
                                    ? 'linear-gradient(135deg, var(--bg-secondary) 0%, color-mix(in srgb, var(--text-accent) 8%, var(--bg-secondary)) 100%)'
                                    : 'var(--bg-secondary)',
                                borderColor: isHighlighted ? 'var(--text-accent)' : 'var(--border-glass)',
                                borderWidth: isHighlighted ? '1.5px' : '1px',
                            }}
                        >
                            {plan.badge && (
                                <div
                                    className="absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-[0.2em] font-bold"
                                    style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                                >
                                    {plan.badge}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="text-xs uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--text-main)' }}>
                                    {plan.billingLabel}
                                </div>
                                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    {plan.name}
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="flex items-end gap-1.5">
                                <span className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    ${plan.price}
                                </span>
                                <span className="text-sm pb-1 opacity-50" style={{ color: 'var(--text-main)' }}>
                                    USD · {plan.billingLabel}
                                </span>
                            </div>

                            <button
                                disabled={isLoading || owned}
                                onClick={() => plan.priceId && startCheckout({
                                    productId: plan.priceId,
                                    metadata: {
                                        entitlement_type: 'bundle',
                                        entitlement_key: plan.id,
                                    },
                                })}
                                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: isHighlighted ? 'var(--text-accent)' : 'rgba(255,255,255,0.07)',
                                    color: isHighlighted ? 'var(--bg-primary)' : 'var(--text-primary)',
                                    border: isHighlighted ? 'none' : '1px solid var(--border-glass)',
                                }}
                            >
                                {owned ? '✓ Owned' : 'Buy once'}
                            </button>

                            {plan.highlight && (
                                <div className="text-xs text-center opacity-50" style={{ color: 'var(--text-main)' }}>
                                    {plan.highlight}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Perks section */}
            <div
                className="rounded-2xl border p-8"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
            >
                <div className="text-xs uppercase tracking-[0.28em] opacity-50 mb-4" style={{ color: 'var(--text-main)' }}>
                    What you get
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {perks.map((perk) => (
                        <div key={perk.text} className="flex items-start gap-3">
                            <span className="text-lg leading-none mt-0.5">{perk.icon}</span>
                            <span className="text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
                                {perk.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ-style assurance strip */}
            <div className="grid gap-4 sm:grid-cols-3 text-center">
                {[
                    { icon: '🔒', title: 'Secure checkout', body: 'Powered by Dodo Payments' },
                    { icon: '♾️', title: 'Lifetime access', body: 'Pay once, keep forever' },
                    { icon: '📧', title: 'Support', body: 'Reach us any time via email' },
                ].map(item => (
                    <div
                        key={item.title}
                        className="rounded-2xl border p-5 space-y-1.5"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}
                    >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                        <div className="text-xs opacity-55" style={{ color: 'var(--text-main)' }}>{item.body}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
