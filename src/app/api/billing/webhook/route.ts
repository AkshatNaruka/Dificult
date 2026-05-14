import { NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { getDodoClient } from '@/utils/dodo';

type PurchaseMetadata = {
  user_id?: string;
  entitlement_type?: string;
  entitlement_key?: string;
};

function readPurchaseMetadata(payload: unknown): PurchaseMetadata {
  const candidates: unknown[] = [];

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    candidates.push(payload, record.data, record.payment, record.checkout, record.checkout_session, record.session);
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    const record = candidate as Record<string, unknown>;
    if (record.metadata && typeof record.metadata === 'object') {
      return record.metadata as PurchaseMetadata;
    }

    if (record.data && typeof record.data === 'object') {
      const nested = record.data as Record<string, unknown>;
      if (nested.metadata && typeof nested.metadata === 'object') {
        return nested.metadata as PurchaseMetadata;
      }
    }
  }

  return {};
}

function readSessionId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.session_id === 'string') {
    return record.session_id;
  }
  if (typeof record.id === 'string') {
    return record.id;
  }

  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>;
    if (typeof nested.session_id === 'string') {
      return nested.session_id;
    }
    if (typeof nested.id === 'string') {
      return nested.id;
    }
  }

  return null;
}

export async function POST(request: Request) {
  if (!process.env.DODO_PAYMENTS_API_KEY || !process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return NextResponse.json({ error: 'Dodo Payments webhook not configured' }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: { type?: string; data?: unknown };
  try {
    const dodo = getDodoClient();
    event = dodo.webhooks.unwrap(rawBody, {
      headers: {
        'webhook-id': request.headers.get('webhook-id') ?? '',
        'webhook-signature': request.headers.get('webhook-signature') ?? '',
        'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
      },
    }) as { type?: string; data?: unknown };
  } catch (error) {
    console.error('Dodo webhook verification failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (event.type !== 'payment.succeeded' && event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const metadata = readPurchaseMetadata(event.data);
  const userId = metadata.user_id;
  const entitlementType = metadata.entitlement_type;
  const entitlementKey = metadata.entitlement_key;

  if (!userId || !entitlementType || !entitlementKey) {
    return NextResponse.json({ received: true });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service key missing' }, { status: 500 });
  }

  await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        entitlement_type: entitlementType,
        entitlement_key: entitlementKey,
        source: 'purchase',
        active: true,
        dodo_checkout_session_id: readSessionId(event.data),
      },
      { onConflict: 'user_id,entitlement_type,entitlement_key' }
    );

  return NextResponse.json({ received: true });
}
