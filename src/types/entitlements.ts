export type PlanId = 'pro_monthly' | 'pro_yearly';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unpaid';

export interface Entitlements {
  isPro: boolean;
  plan: PlanId | null;
  status: SubscriptionStatus | null;
  currentPeriodEnd: string | null;
  adsEnabled: boolean;
  xpMultiplier: number;
  dailyChallengeBonusMultiplier: number;
  leaderboardLimit: number;
  unlockedThemes: string[];
  unlockedSounds: string[];
  unlockedBorders: string[];
  unlockedCarets: string[];
}
