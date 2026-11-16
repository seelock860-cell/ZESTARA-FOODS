import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppOrderUrl, formatNaira } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const whatsappSummary = [
    'Hello ZESTARA FOODS! I would like to place an order:',
    '',
    ...cart.map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (${item.product.weight}) x ${item.quantity} = ${formatNaira(
          Number(item.product.price) * item.quantity
        )}`
    ),
    '',
    `Total: ${formatNaira(cartTotal)}`,
  ].join('\n');

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-[#0C261A]/55 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF9F5] h-full flex flex-col border-l border-[#E6E1D6] shadow-2xl">
        <div className="px-6 py-5 border-b border-[#E6E1D6] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#143D2B]" />
            <h2 className="font-display text-xl font-semibold text-[#143D2B]">
              Your Cart
            </h2>
            <span className="text-xs font-mono tabular-nums text-[#5A6B61]">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping cart"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#3D5246] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F2EFE9] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#143D2B]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#143D2B]">
                Your spice basket is empty
              </h3>
              <p className="text-sm text-[#4F6257] mt-1.5 max-w-xs">
                Explore ZESTARA authentic Nigerian spices crafted in Umuahia for every meal.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
                className="mt-6 px-5 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-medium hover:bg-[#1B4D36] transition-colors cursor-pointer"
              >
                Browse Spices
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6]"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F2EFE9] shrink-0">
                  <ResilientImage
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-[#143D2B] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-[#5A6B61] mt-0.5 tabular-nums">
                        {item.product.weight} · {formatNaira(item.product.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name}`}
                      className="p-1.5 rounded-md text-[#6E7D75] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-[#E6E1D6] rounded-lg bg-[#FAF9F5]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#143D2B] hover:bg-[#E6E1D6]/60 rounded-l-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold tabular-nums text-[#143D2B]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#143D2B] hover:bg-[#E6E1D6]/60 rounded-r-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-mono font-semibold tabular-nums text-[#143D2B]">
                      {formatNaira(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E6E1D6] bg-[#FFFFFF] space-y-3">
            <div className="flex items-center justify-between text-sm text-[#4F6257]">
              <span>Subtotal</span>
              <span className="font-mono text-lg font-semibold tabular-nums text-[#143D2B]">
                {formatNaira(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-[#5A6B61]">
              Nationwide delivery across Nigeria from Umuahia, Abia State.
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
              <a
                href={buildWhatsAppOrderUrl(whatsappSummary)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg border border-[#143D2B] text-[#143D2B] text-sm font-semibold text-center hover:bg-[#F2EFE9] transition-colors"
              >
                Order Directly on WhatsApp
              </a>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#6E7D75] hover:text-red-700 py-1 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
