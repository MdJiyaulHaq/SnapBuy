import api from './index';
import { Order, CreateOrderData } from '../types/api';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/store/orders/');
  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/store/orders/${id}/`);
  return response.data;
};

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  const response = await api.post<Order>('/store/orders/', orderData);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: 'C' | 'P' | 'F') => {
  const response = await api.patch(`/store/orders/${id}/`, { payment_status: status });
  return response.data;
};