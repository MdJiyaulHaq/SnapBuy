import api from './index';
import { Customer } from '../types/api';

export const getCurrentCustomer = async (): Promise<Customer> => {
  const response = await api.get<Customer[]>('/store/customers/me/');
  return response.data[0];
};

export const updateCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  const response = await api.patch<Customer>('/store/customers/me/', customerData);
  return response.data;
};

export const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  const response = await api.post<Customer>('/store/customers/', customerData);
  return response.data;
};