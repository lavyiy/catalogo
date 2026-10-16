export interface Category {
  id: string;
  store_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  offer_price: number | null;
  stock: number | null; // null = no stock control
  unit: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category_id: string | null;
  price: number;
  offer_price: number | null;
  stock: number | null;
  unit: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProductSearchFilters {
  search: string;
  category_id: string | null;
  onlyActive: boolean;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  product_unit: string;
  product_price: number; // precio actual (puede ser offer_price)
  quantity: number;
  subtotal: number; // quantity * price
}

export interface CartState {
  items: CartItem[];
  slug: string;
}

export interface CheckoutFormValues {
  customer_name: string;
  modality: 'retiro' | 'envio';
  address: string | null;
  payment_method: string | null;
  observations: string | null;
}