export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Record<string, StripeProduct> = {
  test: {
    priceId: 'price_1RMNN6IiDKGueWGHRbcFHOzD',
    name: 'Test',
    description: 'Test product for $1.00',
    mode: 'payment',
  },
};