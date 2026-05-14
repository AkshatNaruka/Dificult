import type { SupabaseClient } from '@supabase/supabase-js';
import { Entitlements, PlanId, SubscriptionStatus } from '@/types/entitlements';

const defaultEntitlements: Entitlements = {
  isPro: false,
  plan: null,
  status: null,
  currentPeriodEnd: null,
  adsEnabled: true,
  xpMultiplier: 1,
  dailyChallengeBonusMultiplier: 1,
  leaderboardLimit: 20,
  unlockedThemes: [],
  unlockedSounds: [],
  unlockedBorders: [],
  unlockedCarets: [],
};

export function getDefaultEntitlements(): Entitlements {
  return { ...defaultEntitlements };
}

function isSubscriptionActive(status?: SubscriptionStatus | null, currentPeriodEnd?: string | null) {
  if (!status) return false;
  if (status !== 'active' && status !== 'trialing') return false;
  if (!currentPeriodEnd) return true;
  return new Date(currentPeriodEnd).getTime() > Date.now();
}

export async function getEntitlementsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Entitlements> {
  const entitlements = getDefaultEntitlements();

  const { data: subscriptionRows } = await supabase
    .from('subscriptions')
    .select('plan,status,current_period_end')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  const subscription = subscriptionRows?.[0];
  const isPro = isSubscriptionActive(
    subscription?.status as SubscriptionStatus | null,
    subscription?.current_period_end ?? null
  );

  if (isPro) {
    entitlements.isPro = true;
    entitlements.plan = subscription?.plan as PlanId | null;
    entitlements.status = subscription?.status as SubscriptionStatus | null;
    entitlements.currentPeriodEnd = subscription?.current_period_end ?? null;
    entitlements.adsEnabled = false;
    entitlements.xpMultiplier = 1.25;
    entitlements.dailyChallengeBonusMultiplier = 1.25;
    entitlements.leaderboardLimit = 50;
  }

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
      default:
        break;
    }
  });

  return entitlements;
}
