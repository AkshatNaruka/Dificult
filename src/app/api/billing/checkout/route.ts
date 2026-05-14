import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getDodoClient } from '@/utils/dodo';

interface CheckoutRequest {
  productId: string;
  quantity?: number;
  metadata?: Record<string, string>;
  returnUrl?: string;
}

export async function POST(request: Request) {
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    return NextResponse.json({ error: 'Dodo Payments not configured' }, { status: 500 });
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
  if (!body?.productId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';
  const dodo = getDodoClient();
  const session = await (dodo as any).checkoutSessions.create({
    product_cart: [{
      product_id: body.productId,
      quantity: body.quantity ?? 1,
    }],
    return_url: body.returnUrl ?? `${origin}/billing/success`,
    metadata: {
      user_id: user.id,
      user_email: user.email ?? '',
      ...body.metadata,
    },
  });

  return NextResponse.json({
    checkout_url: session.checkout_url ?? session.checkoutUrl ?? session.url,
    session_id: session.session_id ?? session.sessionId ?? null,
  });
}
