import type { SupabaseClient } from '@supabase/supabase-js';
import { Entitlements, PlanId } from '@/types/entitlements';

const defaultEntitlements: Entitlements = {
  isPro: false,
  ownedBundles: [],
  adsEnabled: true,
  xpMultiplier: 1,
  dailyChallengeBonusMultiplier: 1,
  leaderboardLimit: 20,
  unlockedThemes: [],
  unlockedSounds: [],
  unlockedBorders: [],
  unlockedCarets: [],
  unlockedBackgrounds: [],
};

export function getDefaultEntitlements(): Entitlements {
  return { ...defaultEntitlements };
}

export async function getEntitlementsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Entitlements> {
  const entitlements = getDefaultEntitlements();

  const { data: entitlementRows } = await supabase
    .from('entitlements')
    .select('entitlement_type, entitlement_key, active, expires_at')
    .eq('user_id', userId)
    .eq('active', true);

  const now = Date.now();
  (entitlementRows || []).forEach((row) => {
    if (row.expires_at && new Date(row.expires_at).getTime() <= now) {
      return;
    }
    switch (row.entitlement_type) {
      case 'theme':
        entitlements.unlockedThemes.push(row.entitlement_key);
        break;
      case 'sound':
        entitlements.unlockedSounds.push(row.entitlement_key);
        break;
      case 'border':
        entitlements.unlockedBorders.push(row.entitlement_key);
        break;
      case 'caret':
        entitlements.unlockedCarets.push(row.entitlement_key);
        break;
      case 'background':
        entitlements.unlockedBackgrounds.push(row.entitlement_key);
        break;
      case 'bundle': {
        const bundle = row.entitlement_key as PlanId;
        if (bundle === 'pro_monthly' || bundle === 'pro_yearly') {
          entitlements.ownedBundles.push(bundle);
        }
        break;
      }
      default:
        break;
    }
  });

  if (entitlements.ownedBundles.length > 0) {
    entitlements.isPro = true;
    entitlements.adsEnabled = false;
    entitlements.xpMultiplier = 1.25;
    entitlements.dailyChallengeBonusMultiplier = 1.25;
    entitlements.leaderboardLimit = 50;
  }

  return entitlements;
}
