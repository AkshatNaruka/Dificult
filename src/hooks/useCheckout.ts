'use client';

import { useCallback, useState } from 'react';

interface CheckoutPayload {
  priceId: string;
  mode: 'subscription' | 'payment';
  metadata?: Record<string, string>;
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = useCallback(async (payload: CheckoutPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? 'Checkout failed');
      }
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert('Please sign in to complete checkout.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { startCheckout, isLoading };
}
