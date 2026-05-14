'use client';

import { useCallback, useState } from 'react';

interface CheckoutPayload {
  productId: string;
  quantity?: number;
  metadata?: Record<string, string>;
  returnUrl?: string;
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
      if (!res.ok || !data?.checkout_url) {
        throw new Error(data?.error ?? 'Checkout failed');
      }
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error(error);
      alert('Unable to start checkout right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { startCheckout, isLoading };
}
