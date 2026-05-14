'use client';

import { useCallback, useEffect, useState } from 'react';
import { Entitlements } from '@/types/entitlements';
import { getDefaultEntitlements } from '@/utils/entitlements';

export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<Entitlements>(getDefaultEntitlements());
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntitlements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/entitlements', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch entitlements');
      }
      const data = (await res.json()) as Entitlements;
      setEntitlements(data);
    } catch (error) {
      console.error(error);
      setEntitlements(getDefaultEntitlements());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  return { entitlements, isLoading, refresh: fetchEntitlements };
}
