export type PlanId = 'pro_monthly' | 'pro_yearly';

export interface Entitlements {
  isPro: boolean;
  ownedBundles: PlanId[];
  adsEnabled: boolean;
  xpMultiplier: number;
  dailyChallengeBonusMultiplier: number;
  leaderboardLimit: number;
  unlockedThemes: string[];
  unlockedSounds: string[];
  unlockedBorders: string[];
  unlockedCarets: string[];
  unlockedBackgrounds: string[];
}
