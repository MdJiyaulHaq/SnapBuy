import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types/api';
import { getCartId } from '../utils/cart';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/cart';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
  retryFetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const cartId = await getCartId();
      const cartData = await getCart(cartId);
      setCart(cartData);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      let errorMessage = 'Failed to load cart. Please check your internet connection and try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.response) {
        // Server responded with an error
        errorMessage = `Server error: ${error.response.status}. Please try again later.`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Unable to reach the server. Please check if the server is running.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const retryFetchCart = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      const cartId = await getCartId();
      await addToCart(cartId, { product: productId, quantity });
      await fetchCart();
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      await updateCartItem(cart.id, itemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      await removeCartItem(cart.id, itemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      toast.error('Failed to remove item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart_id');
    setCart(null);
    fetchCart();
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        totalItems,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        retryFetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};