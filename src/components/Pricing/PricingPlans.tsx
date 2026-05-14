'use client';

import React from 'react';
import { pricingPlans } from '@/data/commerce';
import { useCheckout } from '@/hooks/useCheckout';
import { useEntitlements } from '@/hooks/useEntitlements';

const perks = [
  'Premium themes, cursor packs, and sound packs',
  'Background packs with GIF and video-style loops',
  'One-time access with no recurring billing',
  'Packed leaderboard and challenge bonuses',
  'Extra visual modes for intense typing sessions',
  'Future cosmetic drops included in the creator bundle',
];

export function PricingPlans() {
  const { entitlements } = useEntitlements();
  const { startCheckout, isLoading } = useCheckout();

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border p-8 space-y-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
        <div>
          <div className="text-xs uppercase tracking-[0.32em] opacity-60" style={{ color: 'var(--text-main)' }}>
            Pack perks
          </div>
          <h2 className="text-3xl font-bold mt-2">Buy once, unlock the whole vibe</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
            Keep the app moving with one-time purchases for cosmetics, media-heavy backgrounds, and premium packs.
          </p>
        </div>
        <ul className="grid gap-3 text-sm">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span style={{ color: 'var(--text-main)' }}>{perk}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="rounded-3xl border p-6 space-y-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">{plan.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.6 }}>{plan.description}</div>
              </div>
              {plan.badge && (
                <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-[0.2em]" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--text-accent)' }}>
                  {plan.badge}
                </span>
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-xs pb-1" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                {plan.billingLabel}
              </span>
            </div>
            <button
              disabled={isLoading || entitlements.ownedBundles.includes(plan.id)}
              onClick={() => plan.priceId && startCheckout({
                productId: plan.priceId,
                metadata: {
                  entitlement_type: 'bundle',
                  entitlement_key: plan.id,
                },
              })}
              className="w-full py-2 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
            >
              {entitlements.ownedBundles.includes(plan.id) ? 'Owned' : 'Buy once'}
            </button>
            {plan.highlight && (
              <div className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                {plan.highlight}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
