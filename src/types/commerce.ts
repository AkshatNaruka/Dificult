import { PlanId } from './entitlements';

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  billingLabel: string;
  description: string;
  highlight?: string;
  badge?: string;
  priceId?: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'theme' | 'sound' | 'border' | 'caret' | 'background';
  description: string;
  price: number;
  priceId?: string;
  entitlementKey: string;
  previewThemeId?: string;
}
