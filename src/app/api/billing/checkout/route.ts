import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getStripeClient } from '@/utils/stripe';

interface CheckoutRequest {
  priceId: string;
  mode: 'subscription' | 'payment';
  metadata?: Record<string, string>;
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutRequest;
  if (!body?.priceId || !body?.mode) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: body.mode,
    line_items: [{ price: body.priceId, quantity: 1 }],
    success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/billing/cancel`,
    allow_promotion_codes: true,
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    metadata: {
      user_id: user.id,
      ...body.metadata,
    },
    subscription_data: body.mode === 'subscription'
      ? { metadata: { user_id: user.id, ...body.metadata } }
      : undefined,
  });

  return NextResponse.json({ url: session.url });
}
