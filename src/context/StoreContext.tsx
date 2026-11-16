import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/catalog';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchCatalog } from '../services/storeService';
import type { CartItem, Category, Product } from '../types';

const CART_STORAGE_KEY = 'zestara_cart_v1';

interface ToastState {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'error';
}

interface StoreContextValue {
  products: Product[];
  categories: Category[];
  catalogLoading: boolean;
  catalogSource: 'supabase' | 'local-preview';
  catalogError: string | null;
  refreshCatalog: () => Promise<void>;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toast: ToastState | null;
  showToast: (message: string, tone?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item?.product?.id) && typeof item.quantity === 'number' && item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(isSupabaseConfigured);
  const [catalogSource, setCatalogSource] = useState<'supabase' | 'local-preview'>('local-preview');
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, tone: 'success' | 'info' | 'error' = 'success') => {
      const id = Date.now();
      setToast({ id, message, tone });
      window.setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, 3200);
    },
    []
  );

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const res = await fetchCatalog();
      setCategories(res.categories);
      setProducts(res.products);
      setCatalogSource(res.source);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load catalog from Supabase.';
      setCatalogError(message);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (!product.in_stock) {
        showToast(`${product.name} is currently out of stock.`, 'error');
        return;
      }
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, product, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
      showToast(`Added ${product.name} to your cart.`);
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      showToast('Item removed from cart.', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [cart]
  );

  const value: StoreContextValue = {
    products,
    categories,
    catalogLoading,
    catalogSource,
    catalogError,
    refreshCatalog,
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
