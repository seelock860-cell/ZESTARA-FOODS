import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Check,
  Edit3,
  FolderPlus,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useStore } from '../context/StoreContext';
import { COMPANY_INFO, formatNaira } from '../data/catalog';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  createCategory,
  createProduct,
  deleteProduct,
  fetchAllOrders,
  fetchContactMessages,
  fetchCustomersDirectory,
  getCurrentProfile,
  signInWithEmail,
  signOutAuth,
  updateMessageStatus,
  updateOrderStatus,
  updateProduct,
  uploadProductImage,
  type CustomerSummary,
} from '../services/storeService';
import type {
  ContactMessage,
  Order,
  OrderStatus,
  Product,
  Profile,
} from '../types';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers' | 'messages';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending: 'text-amber-800 bg-amber-50 border-amber-200',
  Confirmed: 'text-blue-800 bg-blue-50 border-blue-200',
  Processing: 'text-indigo-800 bg-indigo-50 border-indigo-200',
  Shipped: 'text-purple-800 bg-purple-50 border-purple-200',
  Delivered: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  Cancelled: 'text-red-800 bg-red-50 border-red-200',
};

export function AdminPage() {
  const { products, categories, refreshCatalog, showToast } = useStore();

  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pCategoryId, setPCategoryId] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pIngredients, setPIngredients] = useState('');
  const [pUsageTips, setPUsageTips] = useState('');
  const [pWeight, setPWeight] = useState('100g');
  const [pPrice, setPPrice] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pStockQty, setPStockQty] = useState('100');
  const [pFeatured, setPFeatured] = useState(false);
  const [pInStock, setPInStock] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Quick Category Creation
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setDataLoading(true);
    try {
      const [fetchedOrders, fetchedMessages] = await Promise.all([
        fetchAllOrders(),
        fetchContactMessages(),
      ]);
      setOrders(fetchedOrders);
      setMessages(fetchedMessages);
      const cust = await fetchCustomersDirectory(fetchedOrders);
      setCustomers(cust);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to load admin records.',
        'error'
      );
    } finally {
      setDataLoading(false);
    }
  }, [showToast]);

  const checkSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        setProfile(null);
        return;
      }
      const p = await getCurrentProfile();
      setProfile(p);
      if (p?.role === 'admin') {
        await loadAdminData();
      }
    } finally {
      setAuthLoading(false);
    }
  }, [loadAdminData]);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      await signInWithEmail(loginEmail.trim(), loginPassword);
      const p = await getCurrentProfile();
      if (!p || p.role !== 'admin') {
        await signOutAuth();
        setProfile(null);
        setLoginError(
          'This account does not have administrator privileges. Set role = "admin" in public.profiles for your user.'
        );
        return;
      }
      setProfile(p);
      showToast('Signed in to ZESTARA Admin Portal.');
      await loadAdminData();
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : 'Invalid login credentials.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOutAuth();
    setProfile(null);
    setOrders([]);
    setCustomers([]);
    setMessages([]);
    showToast('Signed out securely.', 'info');
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setPName('');
    setPCategoryId(categories[0]?.id || '');
    setPDescription('');
    setPIngredients('');
    setPUsageTips('');
    setPWeight('100g');
    setPPrice('');
    setPImageUrl('');
    setPStockQty('100');
    setPFeatured(false);
    setPInStock(true);
  };

  const openAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPCategoryId(product.category_id || categories[0]?.id || '');
    setPDescription(product.description);
    setPIngredients(product.ingredients || '');
    setPUsageTips(product.usage_tips || '');
    setPWeight(product.weight);
    setPPrice(String(product.price));
    setPImageUrl(product.image_url);
    setPStockQty(String(product.stock_quantity));
    setPFeatured(product.is_featured);
    setPInStock(product.in_stock);
    setShowProductForm(true);
  };

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setPImageUrl(publicUrl);
      showToast('Product image uploaded to Supabase Storage.');
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Image upload failed. Verify the "product-images" Storage bucket exists.',
        'error'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(pPrice);
    if (!pName.trim() || !pDescription.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Provide a valid product name, description, and price in Naira.', 'error');
      return;
    }

    setSavingProduct(true);
    try {
      const payload = {
        name: pName.trim(),
        category_id: pCategoryId || null,
        description: pDescription.trim(),
        ingredients: pIngredients.trim() || undefined,
        usage_tips: pUsageTips.trim() || undefined,
        weight: pWeight.trim() || '100g',
        price: numericPrice,
        image_url:
          pImageUrl.trim() ||
          '/src/assets/images/product_mixed_zestara_1794853677928.jpg',
        is_featured: pFeatured,
        in_stock: pInStock,
        stock_quantity: Math.max(0, Number(pStockQty) || 0),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast(`Updated ${payload.name}.`);
      } else {
        await createProduct(payload);
        showToast(`Added ${payload.name} to catalog.`);
      }

      await refreshCatalog();
      setShowProductForm(false);
      resetProductForm();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to save product.',
        'error'
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      await refreshCatalog();
      showToast(`Deleted ${product.name}.`, 'info');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to delete product.',
        'error'
      );
    }
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const created = await createCategory(newCategoryName);
      setNewCategoryName('');
      await refreshCatalog();
      setPCategoryId(created.id);
      showToast(`Category "${created.name}" created.`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to create category.',
        'error'
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      showToast(`Order status updated to ${status}.`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to update order status.',
        'error'
      );
    }
  };

  const handleMessageStatusChange = async (
    id: string,
    status: 'New' | 'Read' | 'Replied'
  ) => {
    try {
      await updateMessageStatus(id, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to update message status.',
        'error'
      );
    }
  };

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalSales = validOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const pendingCount = orders.filter((o) => o.status === 'Pending').length;
    return {
      totalOrders: orders.length,
      totalSales,
      pendingCount,
      totalProducts: products.length,
      totalCustomers: customers.length,
    };
  }, [orders, products.length, customers.length]);

  if (authLoading) {
    return (
      <div className="bg-[#FAF9F5] min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-[#4F6257]">Verifying administrator session...</p>
      </div>
    );
  }

  // Unconfigured Supabase Notice + Admin Login Gate
  if (!isSupabaseConfigured || !profile || profile.role !== 'admin') {
    return (
      <div className="bg-[#FAF9F5] min-h-[75vh] py-14 px-4">
        <div className="max-w-lg mx-auto bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#143D2B] text-[#EAB308] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#143D2B]">
                Administrator Sign In
              </h1>
              <p className="text-xs text-[#5A6B61]">
                {COMPANY_INFO.companyName} · ZESTARA Store Console
              </p>
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E1D6] space-y-3 text-sm text-[#3D5246]">
              <p className="font-semibold text-[#143D2B]">
                Supabase Configuration Required
              </p>
              <p className="text-xs leading-relaxed">
                To enable secure administrator authentication, Supabase Storage product image uploads, and live order management:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs">
                <li>
                  Run <code className="font-mono bg-[#F2EFE9] px-1 rounded">supabase/schema.sql</code> in your Supabase SQL Editor.
                </li>
                <li>
                  Add <code className="font-mono bg-[#F2EFE9] px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                  <code className="font-mono bg-[#F2EFE9] px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your environment variables (or Vercel Project Settings).
                </li>
                <li>
                  Create your admin user in Supabase Auth and set <code className="font-mono bg-[#F2EFE9] px-1 rounded">role = &apos;admin&apos;</code> in <code className="font-mono bg-[#F2EFE9] px-1 rounded">public.profiles</code>.
                </li>
              </ol>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed"
                >
                  {loginError}
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                >
                  Administrator Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="zestarafoods@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 px-4 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
              >
                {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-[80vh] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E1D6]">
          <div>
            <p className="text-xs font-semibold text-[#9A6D08]">
              {COMPANY_INFO.companyName} · Admin Console
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B]">
              ZESTARA Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#4F6257] truncate max-w-[200px]">
              {profile.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E6E1D6] bg-[#FFFFFF] text-xs font-semibold text-[#143D2B] hover:bg-[#F2EFE9] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F2EFE9] border border-[#E6E1D6] w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#143D2B] text-[#FAF9F5]'
                    : 'text-[#3D5246] hover:text-[#143D2B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6]">
                <p className="text-xs text-[#5A6B61]">Total Sales Revenue</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#143D2B] mt-2">
                  {formatNaira(stats.totalSales)}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6]">
                <p className="text-xs text-[#5A6B61]">Total Orders</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#143D2B] mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6]">
                <p className="text-xs text-[#5A6B61]">Pending Fulfillment</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#9A6D08] mt-2">
                  {stats.pendingCount}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6]">
                <p className="text-xs text-[#5A6B61]">Active Spice SKUs</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#143D2B] mt-2">
                  {stats.totalProducts}
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F2EFE9] flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#143D2B]">
                  Recent Customer Orders
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#143D2B] hover:text-[#9A6D08] cursor-pointer"
                >
                  Manage All Orders
                </button>
              </div>
              {dataLoading ? (
                <div className="p-6 text-sm text-[#5A6B61]">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#5A6B61]">
                  No orders recorded yet. Customer orders from Checkout will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAF9F5] border-b border-[#E6E1D6] text-xs text-[#5A6B61]">
                      <tr>
                        <th className="px-6 py-3 font-medium">Order Ref</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Destination</th>
                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EFE9]">
                      {orders.slice(0, 6).map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF9F5]">
                          <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[#143D2B]">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-3.5 text-[#143D2B] font-medium">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-3.5 text-[#4F6257]">
                            {order.city}, {order.state}
                          </td>
                          <td className="px-6 py-3.5 font-mono tabular-nums text-right font-semibold text-[#143D2B]">
                            {formatNaira(order.total_amount)}
                          </td>
                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded border text-xs font-medium ${
                                STATUS_STYLE[order.status]
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openAddProduct}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-xs font-semibold hover:bg-[#1B4D36] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#EAB308]" />
                  <span>Add New Product</span>
                </button>

                <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="px-3 py-2 rounded-lg border border-[#E6E1D6] bg-[#FFFFFF] text-xs text-[#143D2B]"
                  />
                  <button
                    type="submit"
                    disabled={creatingCategory}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E6E1D6] bg-[#FFFFFF] text-xs font-semibold text-[#143D2B] hover:bg-[#F2EFE9] cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Product Add / Edit Form */}
            {showProductForm && (
              <form
                onSubmit={handleSaveProduct}
                className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
                  <h2 className="font-display text-xl font-semibold text-[#143D2B]">
                    {editingProduct ? `Edit ${editingProduct.name}` : 'Add New ZESTARA Product'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      resetProductForm();
                    }}
                    className="text-xs text-[#5A6B61] hover:text-[#143D2B] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="e.g. ZESTARA Fried Rice Spice"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Category
                    </label>
                    <select
                      value={pCategoryId}
                      onChange={(e) => setPCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Price in Naira (₦) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="50"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="2500"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={pWeight}
                        onChange={(e) => setPWeight(e.target.value)}
                        placeholder="100g"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                        Stock Qty
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pStockQty}
                        onChange={(e) => setPStockQty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Natural Ingredients
                    </label>
                    <input
                      type="text"
                      value={pIngredients}
                      onChange={(e) => setPIngredients(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143D2B] mb-1">
                      Culinary Usage Tips
                    </label>
                    <input
                      type="text"
                      value={pUsageTips}
                      onChange={(e) => setPUsageTips(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm"
                    />
                  </div>

                  {/* Image Upload to Supabase Storage */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold text-[#143D2B]">
                      Product Image (Upload to Supabase Storage or paste URL)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#143D2B] text-[#143D2B] text-xs font-semibold hover:bg-[#F2EFE9] cursor-pointer whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="sr-only"
                        />
                      </label>
                      <input
                        type="text"
                        value={pImageUrl}
                        onChange={(e) => setPImageUrl(e.target.value)}
                        placeholder="https://... or /src/assets/images/..."
                        className="flex-1 w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-6 pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#143D2B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pInStock}
                        onChange={(e) => setPInStock(e.target.checked)}
                        className="rounded border-[#E6E1D6]"
                      />
                      <span>Available In Stock</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#143D2B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pFeatured}
                        onChange={(e) => setPFeatured(e.target.checked)}
                        className="rounded border-[#E6E1D6]"
                      />
                      <span>Feature on Home Page</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={savingProduct || uploadingImage}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] disabled:opacity-60 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#EAB308]" />
                    <span>{savingProduct ? 'Saving...' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F5] border-b border-[#E6E1D6] text-xs text-[#5A6B61]">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Weight</th>
                      <th className="px-5 py-3 font-medium text-right">Price</th>
                      <th className="px-5 py-3 font-medium text-right">Stock</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9]">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FAF9F5]">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#F2EFE9] shrink-0">
                              <ResilientImage
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-[#143D2B]">{product.name}</p>
                              <p className="text-xs text-[#5A6B61]">
                                {product.is_featured ? 'Featured on Home' : 'Standard SKU'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#4F6257]">
                          {product.category?.name || '—'}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-[#4F6257]">
                          {product.weight}
                        </td>
                        <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold text-[#143D2B]">
                          {formatNaira(product.price)}
                        </td>
                        <td className="px-5 py-3 font-mono tabular-nums text-right text-xs">
                          <span className={product.in_stock ? 'text-[#16A34A]' : 'text-red-700'}>
                            {product.in_stock ? `${product.stock_quantity} units` : 'Out'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProduct(product)}
                              aria-label={`Edit ${product.name}`}
                              className="p-2 rounded-lg border border-[#E6E1D6] text-[#143D2B] hover:bg-[#F2EFE9] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              aria-label={`Delete ${product.name}`}
                              className="p-2 rounded-lg border border-[#E6E1D6] text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl p-10 text-center text-sm text-[#5A6B61]">
                No orders placed yet.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl p-6 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2EFE9] pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-[#143D2B]">
                          {order.order_number}
                        </span>
                        <span className="text-xs text-[#5A6B61]">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#143D2B] mt-1">
                        {order.customer_name} · {order.customer_phone} · {order.customer_email}
                      </p>
                      <p className="text-xs text-[#4F6257] mt-0.5">
                        {order.delivery_address}, {order.city}, {order.state} State
                      </p>
                      {order.order_notes && (
                        <p className="text-xs text-[#5A6B61] mt-1">
                          Note: {order.order_notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-lg font-bold tabular-nums text-[#143D2B]">
                        {formatNaira(order.total_amount)}
                      </span>
                      <select
                        aria-label={`Order status for ${order.order_number}`}
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                          STATUS_STYLE[order.status]
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#F2EFE9]"
                        >
                          <span className="text-[#143D2B] font-medium truncate">
                            {item.product_name} × {item.quantity}
                          </span>
                          <span className="font-mono tabular-nums text-[#4F6257] shrink-0 ml-2">
                            {formatNaira(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#5A6B61]">
                No customer records yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F5] border-b border-[#E6E1D6] text-xs text-[#5A6B61]">
                    <tr>
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Phone</th>
                      <th className="px-5 py-3 font-medium">Location</th>
                      <th className="px-5 py-3 font-medium text-right">Orders</th>
                      <th className="px-5 py-3 font-medium text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9]">
                    {customers.map((c) => (
                      <tr key={c.key} className="hover:bg-[#FAF9F5]">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-[#143D2B]">{c.full_name}</p>
                          <p className="text-xs text-[#5A6B61]">{c.email}</p>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#4F6257]">
                          {c.phone}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[#4F6257]">
                          {c.city}, {c.state}
                        </td>
                        <td className="px-5 py-3.5 font-mono tabular-nums text-right">
                          {c.orders_count}
                        </td>
                        <td className="px-5 py-3.5 font-mono tabular-nums text-right font-semibold text-[#143D2B]">
                          {formatNaira(c.total_spent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl p-10 text-center text-sm text-[#5A6B61]">
                No contact inquiries received yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base text-[#143D2B]">
                        {msg.subject}
                      </h3>
                      <p className="text-xs text-[#5A6B61]">
                        {msg.full_name} · {msg.email} {msg.phone ? `· ${msg.phone}` : ''} ·{' '}
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <select
                      aria-label={`Status for message from ${msg.full_name}`}
                      value={msg.status}
                      onChange={(e) =>
                        handleMessageStatusChange(
                          msg.id,
                          e.target.value as 'New' | 'Read' | 'Replied'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-xs font-semibold text-[#143D2B] cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </div>
                  <p className="text-sm text-[#3D5246] leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
