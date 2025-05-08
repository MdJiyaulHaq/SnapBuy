import { createCart, getCart } from '../api/cart';

// Get cart ID from local storage or create a new one
export const getCartId = async (): Promise<string> => {
  let cartId = localStorage.getItem('cart_id');
  
  if (!cartId) {
    try {
      const cart = await createCart();
      cartId = cart.id;
      localStorage.setItem('cart_id', cartId);
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    }
  }
  
  return cartId;
};

// Format price
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericPrice);
};

// Calculate total items in cart
export const calculateTotalItems = (cartItems: any[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};