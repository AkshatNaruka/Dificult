import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient } from '@/utils/stripe';
import { createServiceClient } from '@/utils/supabase/service';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(request: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
  }

  const signature = (await headers()).get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service key missing' }, { status: 500 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (session.mode === 'payment' && userId) {
      const entitlementType = session.metadata?.entitlement_type;
      const entitlementKey = session.metadata?.entitlement_key;

      if (entitlementType && entitlementKey) {
        await supabase
          .from('entitlements')
          .upsert({
            user_id: userId,
            entitlement_type: entitlementType,
            entitlement_key: entitlementKey,
            source: 'purchase',
            active: true,
            stripe_checkout_session_id: session.id,
          }, { onConflict: 'user_id,entitlement_type,entitlement_key' });
      }
    }
  }

  if (event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object as Stripe.Subscription & { current_period_end?: number };
    const userId = subscription.metadata?.user_id;
    const plan = subscription.metadata?.plan;

    if (userId && plan) {
      const payload = {
        user_id: userId,
        plan,
        status: subscription.status,
        stripe_customer_id: subscription.customer?.toString() ?? null,
        stripe_subscription_id: subscription.id,
        current_period_end: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from('subscriptions')
        .upsert(payload, { onConflict: 'stripe_subscription_id' });
    }
  }

  return NextResponse.json({ received: true });
}
