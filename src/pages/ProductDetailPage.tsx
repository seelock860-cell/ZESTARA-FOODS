import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppOrderUrl, formatNaira } from '../data/catalog';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return (
      <div className="bg-[#FAF9F5] min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4 bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl p-8">
          <h1 className="font-display text-2xl font-bold text-[#143D2B]">
            Product Not Found
          </h1>
          <p className="text-sm text-[#4F6257]">
            The spice product you are looking for may have been updated or removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const whatsappDirect = buildWhatsAppOrderUrl(
    `Hello ZESTARA FOODS! I would like to order ${quantity}x ${product.name} (${product.weight}) at ${formatNaira(
      Number(product.price) * quantity
    )}.`
  );

  return (
    <div className="bg-[#FAF9F5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3D5246] hover:text-[#143D2B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Spices</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Sticky Gallery Left */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E6E1D6] bg-[#F2EFE9]">
              <ResilientImage
                src={product.image_url}
                alt={product.name}
                fallbackLabel={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contiguous Purchase Module Right */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-3 border-b border-[#F2EFE9] pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6B61]">
                <span>{product.category?.name || 'ZESTARA Spice Collection'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">Net Wt. {product.weight}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    product.in_stock
                      ? 'text-[#16A34A] font-semibold'
                      : 'text-red-700 font-semibold'
                  }
                >
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#143D2B]">
                {product.name}
              </h1>

              <p className="font-mono text-2xl font-bold tabular-nums text-[#143D2B]">
                {formatNaira(product.price)}
              </p>

              <p className="text-base text-[#3D5246] leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Purchase Controls */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center border border-[#E6E1D6] rounded-lg bg-[#FAF9F5]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#143D2B] hover:bg-[#E6E1D6]/60 rounded-l-lg cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-sm font-semibold tabular-nums text-[#143D2B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#143D2B] hover:bg-[#E6E1D6]/60 rounded-r-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!product.in_stock}
                  onClick={() => {
                    addToCart(product, quantity);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] disabled:opacity-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#EAB308]" />
                  <span>
                    Add to Cart · {formatNaira(Number(product.price) * quantity)}
                  </span>
                </button>
              </div>

              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg border border-[#143D2B] text-[#143D2B] text-sm font-semibold hover:bg-[#F2EFE9] transition-colors min-h-[44px]"
              >
                Order Directly via WhatsApp
              </a>
            </div>

            {/* Ingredients & Culinary Usage */}
            <div className="space-y-4 pt-4 border-t border-[#F2EFE9]">
              {product.ingredients && (
                <div>
                  <h2 className="text-xs font-semibold text-[#9A6D08] uppercase tracking-wider mb-1">
                    Key Natural Ingredients
                  </h2>
                  <p className="text-sm text-[#3D5246] leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {product.usage_tips && (
                <div>
                  <h2 className="text-xs font-semibold text-[#9A6D08] uppercase tracking-wider mb-1">
                    Culinary Usage Tip
                  </h2>
                  <p className="text-sm text-[#3D5246] leading-relaxed">
                    {product.usage_tips}
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5A6B61]">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  100% Natural Spices
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  Processed in Umuahia, Nigeria
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  Nationwide Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
