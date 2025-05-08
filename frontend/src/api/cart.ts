import api from './index';
import { Cart, AddToCartData } from '../types/api';

export const createCart = async (): Promise<Cart> => {
  const response = await api.post<Cart>('/store/carts/', {});
  return response.data;
};

export const getCart = async (cartId: string): Promise<Cart> => {
  const response = await api.get<Cart>(`/store/carts/${cartId}/`);
  return response.data;
};

export const addToCart = async (cartId: string, itemData: AddToCartData): Promise<Cart> => {
  const response = await api.post(`/store/carts/${cartId}/items/`, itemData);
  return response.data;
};

export const updateCartItem = async (cartId: string, itemId: number, quantity: number): Promise<Cart> => {
  const response = await api.patch(`/store/carts/${cartId}/items/${itemId}/`, { quantity });
  return response.data;
};

export const removeCartItem = async (cartId: string, itemId: number): Promise<void> => {
  await api.delete(`/store/carts/${cartId}/items/${itemId}/`);
};