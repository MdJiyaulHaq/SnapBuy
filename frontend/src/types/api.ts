// Authentication Types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// Product Types
export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  slug: string;
  inventory: number;
  unit_price: number;
  price_with_tax: string;
  collection: number;
  images: ProductImage[];
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Collection Types
export interface Collection {
  id: number;
  title: string;
  product_count: number;
  featured_product: number | null;
}

// Cart Types
export interface SimpleProduct {
  id: number;
  title: string;
  unit_price: number;
}

export interface CartItem {
  id: number;
  product: SimpleProduct;
  quantity: number;
  total_price: string;
}

export interface Cart {
  id: string; // UUID string
  items: CartItem[];
  total_price: string;
  created_at: string;
}

export interface AddToCartData {
  product: number;
  quantity: number;
}

// Order Types
export interface OrderItem {
  id: number;
  product: SimpleProduct;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer: number;
  Order_placed_at: string;
  payment_status: "C" | "P" | "F";
  items: OrderItem[];
}

export interface CreateOrderData {
  cart_id: string; // UUID string
}

// Customer Types
export interface Customer {
  id: number;
  user_id: number;
  phone_number: string;
  birth_date?: string;
  membership: "B" | "S" | "G";
}
