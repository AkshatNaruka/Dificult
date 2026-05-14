'use client';

import React from 'react';
import { cosmeticItems } from '@/data/commerce';
import { useCheckout } from '@/hooks/useCheckout';
import { useEntitlements } from '@/hooks/useEntitlements';
import { themes } from '@/data/themes';
import Link from 'next/link';

export function StoreCatalog() {
  const { entitlements } = useEntitlements();
  const { startCheckout, isLoading } = useCheckout();

  const themeLookup = new Map(themes.map((theme) => [theme.id, theme]));

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
        <div>
          <div className="text-xs uppercase tracking-[0.24em] opacity-60" style={{ color: 'var(--text-main)' }}>Pro bundle</div>
          <h2 className="text-2xl font-bold mt-1">Unlock everything instantly</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
            Get all premium themes, remove ads, and boost XP — or pick cosmetics à la carte.
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-4 py-2 rounded-xl font-bold text-sm"
          style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
        >
          Upgrade to Pro
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {cosmeticItems.map((item) => {
          const isUnlocked = entitlements.isPro
            || (item.type === 'theme' && entitlements.unlockedThemes.includes(item.entitlementKey))
            || (item.type === 'sound' && entitlements.unlockedSounds.includes(item.entitlementKey))
            || (item.type === 'border' && entitlements.unlockedBorders.includes(item.entitlementKey))
            || (item.type === 'caret' && entitlements.unlockedCarets.includes(item.entitlementKey));

          const previewTheme = item.previewThemeId ? themeLookup.get(item.previewThemeId) : null;

          return (
            <div key={item.id} className="rounded-3xl border p-6 space-y-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{item.name}</div>
                  <div className="text-xs uppercase tracking-[0.16em] opacity-60 mt-1" style={{ color: 'var(--text-main)' }}>
                    {item.type}
                  </div>
                </div>
                {previewTheme && (
                  <div className="flex gap-1">
                    {[previewTheme.colors.background, previewTheme.colors.accent, previewTheme.colors.text].map((c, idx) => (
                      <span key={idx} className="w-3 h-3 rounded-full" style={{ background: c, border: '1px solid rgba(255,255,255,0.2)' }} />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">${item.price}</div>
                {isUnlocked ? (
                  <span className="text-xs uppercase tracking-[0.2em] opacity-70" style={{ color: 'var(--text-accent)' }}>
                    {entitlements.isPro ? 'Pro unlocked' : 'Owned'}
                  </span>
                ) : (
                  <button
                    disabled={isLoading || !item.priceId}
                    onClick={() => item.priceId && startCheckout({
                      priceId: item.priceId,
                      mode: 'payment',
                      metadata: {
                        entitlement_type: item.type,
                        entitlement_key: item.entitlementKey,
                      },
                    })}
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                  >
                    Buy now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
