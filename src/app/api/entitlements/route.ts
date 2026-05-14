import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export async function GET() {
  const supabase = await createClient();
  const fallback = getDefaultEntitlements();

  if (!supabase) {
    return NextResponse.json(fallback);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(fallback);
  }

  try {
    const entitlements = await getEntitlementsForUser(supabase, user.id);
    return NextResponse.json(entitlements);
  } catch (error) {
    console.error('Failed to load entitlements', error);
    return NextResponse.json(fallback);
  }
}
