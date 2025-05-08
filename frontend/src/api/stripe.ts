import { products } from '../stripe-config';

export const createCheckoutSession = async (
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  mode: 'payment' | 'subscription'
) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return url;
};

export const getProduct = (productId: string) => {
  return products[productId];
};

export const getAllProducts = () => {
  return Object.entries(products).map(([id, product]) => ({
    id,
    ...product,
  }));
};