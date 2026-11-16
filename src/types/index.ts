export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  ingredients: string | null;
  usage_tips: string | null;
  weight: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  in_stock: boolean;
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
  category?: Category | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  state: string;
  city: string;
  order_notes: string | null;
  total_amount: number;
  status: OrderStatus;
  order_channel: 'website' | 'whatsapp';
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  created_at: string;
}
