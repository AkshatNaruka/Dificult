import DodoPayments from 'dodopayments';

let dodoClient: DodoPayments | null = null;

export function getDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;

  if (!bearerToken) {
    throw new Error('Dodo Payments API key missing');
  }

  if (!dodoClient) {
    dodoClient = new DodoPayments({
      bearerToken,
      environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') ?? 'test_mode',
      webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    });
  }

  return dodoClient;
}