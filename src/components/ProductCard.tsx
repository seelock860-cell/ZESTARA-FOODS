import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../data/catalog';
import type { Product } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const categoryName = product.category?.name || 'ZESTARA Spice Blend';

  return (
    <article className="group flex flex-col bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Product Image (4:3 uniform aspect ratio) */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] block"
      >
        <ResilientImage
          src={product.image_url}
          alt={product.name}
          fallbackLabel={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Unboxed clean metadata with typographic separator */}
          <div className="flex items-center gap-2 text-xs text-[#5A6B61]">
            <span className="truncate">{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums shrink-0">{product.weight}</span>
            {!product.in_stock && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-red-700 font-medium shrink-0">Out of stock</span>
              </>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-[#143D2B] leading-snug">
              <Link to={`/products/${product.slug}`} className="hover:text-[#1B4D36]">
                {product.name}
              </Link>
            </h3>
            <span className="font-mono text-base font-semibold tabular-nums text-[#143D2B] shrink-0">
              {formatNaira(product.price)}
            </span>
          </div>

          <p className="text-sm text-[#4F6257] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F2EFE9]">
          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => addToCart(product, 1)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-xs font-semibold hover:bg-[#1B4D36] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>{product.in_stock ? 'Add to Cart' : 'Unavailable'}</span>
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-[#143D2B] text-xs font-semibold hover:bg-[#F2EFE9] transition-colors whitespace-nowrap min-h-[40px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
