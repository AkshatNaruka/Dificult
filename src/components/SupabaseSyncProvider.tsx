'use client';

import { useSupabaseSync } from '@/hooks/useSupabaseSync';

export function SupabaseSyncProvider() {
    useSupabaseSync();
    return null;
}
