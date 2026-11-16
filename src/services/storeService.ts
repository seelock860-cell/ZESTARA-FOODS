import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/catalog';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  CartItem,
  Category,
  ContactMessage,
  Order,
  OrderStatus,
  Product,
  Profile,
} from '../types';

export interface CatalogResponse {
  categories: Category[];
  products: Product[];
  source: 'supabase' | 'local-preview';
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  state: string;
  city: string;
  order_notes?: string;
  order_channel: 'website' | 'whatsapp';
  items: CartItem[];
}

export interface CustomerSummary {
  key: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  orders_count: number;
  total_spent: number;
  last_order_at: string;
  source: 'registered' | 'guest';
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function generateOrderNumber(): string {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ZST-${y}${m}${d}-${rand}`;
}

export async function fetchCatalog(): Promise<CatalogResponse> {
  if (!supabase || !isSupabaseConfigured) {
    const categoriesMap = new Map(INITIAL_CATEGORIES.map((c) => [c.id, c]));
    return {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS.map((p) => ({
        ...p,
        category: p.category_id ? categoriesMap.get(p.category_id) || null : null,
      })),
      source: 'local-preview',
    };
  }

  const [{ data: catData, error: catError }, { data: prodData, error: prodError }] =
    await Promise.all([
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: true }),
    ]);

  if (catError) throw catError;
  if (prodError) throw prodError;

  const categories = (catData as Category[]) || [];
  const products = ((prodData as Product[]) || []).map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  return {
    categories,
    products,
    source: 'supabase',
  };
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<{ orderNumber: string; orderId: string; totalAmount: number; persistedToSupabase: boolean }> {
  const totalAmount = payload.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const orderNumber = generateOrderNumber();
  const orderId = crypto.randomUUID();

  if (!supabase || !isSupabaseConfigured) {
    throw new Error(
      'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to save orders to the database.'
    );
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id || null;

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    customer_id: userId,
    customer_name: payload.customer_name.trim(),
    customer_phone: payload.customer_phone.trim(),
    customer_email: payload.customer_email.trim(),
    delivery_address: payload.delivery_address.trim(),
    state: payload.state,
    city: payload.city.trim(),
    order_notes: payload.order_notes?.trim() || null,
    total_amount: totalAmount,
    status: 'Pending',
    order_channel: payload.order_channel,
  });

  if (orderError) throw orderError;

  const isUuid = (val: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

  const itemsRows = payload.items.map((item) => ({
    order_id: orderId,
    product_id: isUuid(item.product.id) ? item.product.id : null,
    product_name: item.product.name,
    quantity: item.quantity,
    unit_price: Number(item.product.price),
    subtotal: Number(item.product.price) * item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemsRows);
  if (itemsError) throw itemsError;

  return {
    orderNumber,
    orderId,
    totalAmount,
    persistedToSupabase: true,
  };
}

export async function submitContactMessage(payload: {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to store contact inquiries.'
    );
  }

  const { error } = await supabase.from('contact_messages').insert({
    full_name: payload.full_name.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || null,
    subject: payload.subject.trim(),
    message: payload.message.trim(),
  });

  if (error) throw error;
}

// ============================================================================
// ADMIN AUTHENTICATION & MANAGEMENT SERVICES
// ============================================================================

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutAuth() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userRes.user.id)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `spices/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createProduct(input: {
  name: string;
  category_id: string | null;
  description: string;
  ingredients?: string;
  usage_tips?: string;
  weight: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  in_stock: boolean;
  stock_quantity: number;
}): Promise<Product> {
  if (!supabase) throw new Error('Supabase client is not configured.');

  const slug = `${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      slug,
    })
    .select('*, category:categories(*)')
    .single();

  if (error) throw error;
  return { ...(data as Product), price: Number(data.price) };
}

export async function updateProduct(
  id: string,
  updates: Partial<{
    name: string;
    category_id: string | null;
    description: string;
    ingredients: string | null;
    usage_tips: string | null;
    weight: string;
    price: number;
    image_url: string;
    is_featured: boolean;
    in_stock: boolean;
    stock_quantity: number;
  }>
): Promise<Product> {
  if (!supabase) throw new Error('Supabase client is not configured.');

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('*, category:categories(*)')
    .single();

  if (error) throw error;
  return { ...(data as Product), price: Number(data.price) };
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: name.trim(),
      slug: slugify(name),
      description: description?.trim() || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Category;
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data as Order[]) || []).map((o) => ({
    ...o,
    total_amount: Number(o.total_amount),
  }));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw error;
}

export async function fetchCustomersDirectory(orders: Order[]): Promise<CustomerSummary[]> {
  if (!supabase) return [];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const profiles = (profilesData as Profile[]) || [];
  const customerMap = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const key = order.customer_email.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.orders_count += 1;
      existing.total_spent += Number(order.total_amount);
      if (new Date(order.created_at) > new Date(existing.last_order_at)) {
        existing.last_order_at = order.created_at;
      }
    } else {
      customerMap.set(key, {
        key,
        full_name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        city: order.city,
        state: order.state,
        orders_count: 1,
        total_spent: Number(order.total_amount),
        last_order_at: order.created_at,
        source: order.customer_id ? 'registered' : 'guest',
      });
    }
  }

  for (const profile of profiles) {
    if (profile.role === 'admin' || !profile.email) continue;
    const key = profile.email.toLowerCase();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        key,
        full_name: profile.full_name || 'Registered Customer',
        email: profile.email,
        phone: profile.phone || '—',
        city: profile.city || '—',
        state: profile.state || '—',
        orders_count: 0,
        total_spent: 0,
        last_order_at: profile.created_at,
        source: 'registered',
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.source = 'registered';
    }
  }

  return Array.from(customerMap.values()).sort((a, b) => b.total_spent - a.total_spent);
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as ContactMessage[]) || [];
}

export async function updateMessageStatus(
  id: string,
  status: 'New' | 'Read' | 'Replied'
): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) throw error;
}
