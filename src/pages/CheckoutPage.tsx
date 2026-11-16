import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useStore } from '../context/StoreContext';
import {
  COMPANY_INFO,
  NIGERIAN_STATES,
  buildWhatsAppOrderUrl,
  formatNaira,
} from '../data/catalog';
import { isSupabaseConfigured } from '../lib/supabase';
import { createOrder } from '../services/storeService';

interface ConfirmedReceipt {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  state: string;
  city: string;
  whatsappUrl: string;
}

export function CheckoutPage() {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    showToast,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('Abia');
  const [city, setCity] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ConfirmedReceipt | null>(null);

  const buildOrderMessage = (orderRef?: string) => {
    const lines = [
      `Hello ZESTARA FOODS (${COMPANY_INFO.companyName})!`,
      orderRef ? `Order Reference: ${orderRef}` : 'New Order Request:',
      '',
      'Items:',
      ...cart.map(
        (item, index) =>
          `${index + 1}. ${item.product.name} (${item.product.weight}) x ${item.quantity} = ${formatNaira(
            Number(item.product.price) * item.quantity
          )}`
      ),
      '',
      `Total Amount: ${formatNaira(cartTotal)}`,
      '',
      'Customer Delivery Details:',
      `Name: ${fullName || 'Not provided'}`,
      `Phone: ${phone || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      `Address: ${address || 'Not provided'}`,
      `City / State: ${city || '—'}, ${stateName}`,
      orderNotes ? `Notes: ${orderNotes}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const whatsappDirectUrl = buildWhatsAppOrderUrl(buildOrderMessage());

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add spices before checking out.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setErrorMsg('Please complete all required customer and delivery fields.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createOrder({
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email,
        delivery_address: address,
        state: stateName,
        city,
        order_notes: orderNotes,
        order_channel: 'website',
        items: cart,
      });

      const receiptWhatsapp = buildWhatsAppOrderUrl(buildOrderMessage(result.orderNumber));
      setReceipt({
        orderNumber: result.orderNumber,
        customerName: fullName,
        totalAmount: result.totalAmount,
        state: stateName,
        city,
        whatsappUrl: receiptWhatsapp,
      });
      clearCart();
      showToast(`Order ${result.orderNumber} placed successfully.`);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not place your order right now. Please try WhatsApp ordering or check your connection.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <div className="bg-[#FAF9F5] min-h-[75vh] py-14 sm:py-20 px-4">
        <div className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono font-semibold text-[#9A6D08]">
              Order #{receipt.orderNumber} Confirmed
            </p>
            <h1 className="font-display text-3xl font-bold text-[#143D2B]">
              Thank You, {receipt.customerName}
            </h1>
            <p className="text-sm text-[#4F6257] leading-relaxed">
              Your ZESTARA FOODS order has been recorded and queued for dispatch from Umuahia to{' '}
              <strong className="text-[#143D2B]">
                {receipt.city}, {receipt.state} State
              </strong>
              .
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E1D6] flex items-center justify-between">
            <span className="text-sm text-[#4F6257]">Order Total</span>
            <span className="font-mono text-xl font-bold tabular-nums text-[#143D2B]">
              {formatNaira(receipt.totalAmount)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={receipt.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors"
            >
              Confirm Delivery on WhatsApp
            </a>
            <Link
              to="/products"
              className="flex-1 py-3 px-4 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-[#143D2B] text-sm font-semibold hover:bg-[#F2EFE9] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-[75vh] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F6257] hover:text-[#143D2B]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#143D2B]">
              Checkout & Delivery
            </h1>
          </div>
          <p className="text-sm text-[#4F6257]">
            Dispatched fresh from Umuahia, Abia State
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-12 text-center space-y-4">
            <ShoppingBag className="w-10 h-10 text-[#143D2B] mx-auto" />
            <h2 className="font-display text-2xl font-semibold text-[#143D2B]">
              Your shopping cart is currently empty
            </h2>
            <p className="text-sm text-[#4F6257] max-w-md mx-auto">
              Add any of our signature ZESTARA spices to proceed with online checkout or WhatsApp ordering.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] transition-colors"
            >
              Browse ZESTARA Spices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer Delivery Form */}
            <form
              onSubmit={handleSubmitOrder}
              className="lg:col-span-7 bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="border-b border-[#F2EFE9] pb-4">
                <h2 className="font-display text-xl font-semibold text-[#143D2B]">
                  Customer & Delivery Information
                </h2>
                <p className="text-xs text-[#5A6B61] mt-1">
                  Enter your accurate delivery details for nationwide order fulfillment.
                </p>
              </div>

              {!isSupabaseConfigured && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Database Notice:</strong> Connect your Supabase environment variables (
                  <code className="font-mono">VITE_SUPABASE_URL</code> &{' '}
                  <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>) to store orders in Supabase, or use the{' '}
                  <strong>Order via WhatsApp</strong> button below immediately.
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chidinma Okafor"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    Delivery Street Address *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, street name, bus stop or landmark"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-state"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    State *
                  </label>
                  <select
                    id="checkout-state"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    City / Town *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Umuahia, Aba, Ikeja"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-notes"
                    className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                  >
                    Order Details / Delivery Instructions
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Preferred delivery time, wholesale carton request, or recipient instructions..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-6 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                >
                  {submitting
                    ? 'Submitting Order...'
                    : `Submit Order · ${formatNaira(cartTotal)}`}
                </button>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-lg bg-[#D99B16] text-[#0C261A] text-sm font-bold text-center hover:bg-[#EAB308] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  Order via WhatsApp
                </a>
              </div>
            </form>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-5 bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-6 space-y-5 lg:sticky lg:top-24">
              <div className="border-b border-[#F2EFE9] pb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-[#143D2B]">
                  Order Summary
                </h2>
                <span className="text-xs font-mono text-[#5A6B61]">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 pb-3 border-b border-[#F2EFE9] last:border-b-0"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F2EFE9] shrink-0">
                      <ResilientImage
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#143D2B] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#5A6B61] font-mono tabular-nums">
                        {formatNaira(item.product.price)} each
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="inline-flex items-center border border-[#E6E1D6] rounded">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label={`Decrease ${item.product.name}`}
                            className="w-6 h-6 flex items-center justify-center text-[#143D2B] hover:bg-[#F2EFE9] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            aria-label={`Increase ${item.product.name}`}
                            className="w-6 h-6 flex items-center justify-center text-[#143D2B] hover:bg-[#F2EFE9] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#6E7D75] hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#143D2B] shrink-0">
                      {formatNaira(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E6E1D6] space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#4F6257]">
                  <span>Items Subtotal</span>
                  <span className="font-mono tabular-nums">{formatNaira(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[#4F6257]">
                  <span>Delivery Fee</span>
                  <span className="text-xs text-[#5A6B61]">Confirmed on dispatch</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9] text-base font-bold text-[#143D2B]">
                  <span>Total</span>
                  <span className="font-mono text-xl tabular-nums">
                    {formatNaira(cartTotal)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
