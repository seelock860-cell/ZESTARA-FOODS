import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export function ProductsPage() {
  const { products, categories, catalogLoading, catalogError } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category_id === selectedCategory;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.ingredients || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#FAF9F5] min-h-[75vh] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#9A6D08] tracking-wide">
            ZESTARA FOODS Catalog
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#143D2B] headline-balance">
            Our Signature Nigerian Spices
          </h1>
          <p className="text-base text-[#4F6257]">
            Browse our full range of hygienically crafted culinary spices—priced clearly in Nigerian Naira and ready for nationwide dispatch.
          </p>
        </div>

        {/* Category Tabs + Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6E1D6]">
          <div
            role="tablist"
            aria-label="Product Categories"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F2EFE9] rounded-xl border border-[#E6E1D6]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#143D2B] text-[#FAF9F5]'
                  : 'text-[#3D5246] hover:text-[#143D2B]'
              }`}
            >
              All Spices ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#143D2B] text-[#FAF9F5]'
                    : 'text-[#3D5246] hover:text-[#143D2B]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-[#5A6B61] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spices or ingredients..."
              aria-label="Search spices"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E6E1D6] text-sm text-[#143D2B] placeholder:text-[#7E8D84] focus:outline-none focus:border-[#143D2B]"
            />
          </div>
        </div>

        {catalogError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
            Could not refresh catalog from Supabase ({catalogError}). Showing saved catalog items.
          </div>
        )}

        {/* Product Grid */}
        {catalogLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#F2EFE9]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-28 bg-[#F2EFE9] rounded" />
                  <div className="h-5 w-3/4 bg-[#F2EFE9] rounded" />
                  <div className="h-10 w-full bg-[#F2EFE9] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-[#5A6B61] mx-auto" />
            <h2 className="font-display text-xl font-semibold text-[#143D2B]">
              No matching spices found
            </h2>
            <p className="text-sm text-[#4F6257]">
              Try clearing your search or selecting another spice category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
