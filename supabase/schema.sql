create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('pro_monthly', 'pro_yearly')),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create unique index if not exists subscriptions_stripe_id_idx on public.subscriptions (stripe_subscription_id);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement_type text not null check (entitlement_type in ('theme', 'sound', 'border', 'caret')),
  entitlement_key text not null,
  source text not null check (source in ('purchase', 'gift')),
  active boolean default true,
  expires_at timestamptz,
  stripe_checkout_session_id text,
  created_at timestamptz default now()
);

create index if not exists entitlements_user_id_idx on public.entitlements (user_id);
create index if not exists entitlements_type_key_idx on public.entitlements (entitlement_type, entitlement_key);
create unique index if not exists entitlements_user_key_idx on public.entitlements (user_id, entitlement_type, entitlement_key);

alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;

create policy "Subscriptions are readable by owner"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Entitlements are readable by owner"
  on public.entitlements for select
  using (auth.uid() = user_id);
