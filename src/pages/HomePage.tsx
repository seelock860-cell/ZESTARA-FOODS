import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Award, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';
import { COMPANY_INFO, TESTIMONIALS } from '../data/catalog';
import { useStore } from '../context/StoreContext';

const WHY_CHOOSE_ITEMS = [
  {
    number: '01.',
    title: 'Pure Nigerian Farm Sourcing',
    description:
      'Every root, seed, and aromatic leaf is selected directly from trusted growers across Abia State and Nigeria’s finest agricultural belts.',
    icon: Leaf,
  },
  {
    number: '02.',
    title: 'Hygienic Food Manufacturing',
    description:
      'Cleaned, low-heat dehydrated, and precision-milled at The Well-Lands AgroFoods LTD. facility in Umuahia to lock in natural essential oils.',
    icon: ShieldCheck,
  },
  {
    number: '03.',
    title: 'Zero Artificial Fillers',
    description:
      'No synthetic dyes, chalky starch bulking, or harsh preservatives—only honest whole spices crafted for everyday family nutrition.',
    icon: Sparkles,
  },
  {
    number: '04.',
    title: 'Consistent Kitchen Aroma',
    description:
      'Standardized recipes ensure every jar of Banga, Jollof, Curry, or Pepper Soup Spice delivers rich flavour from the first spoon to the last.',
    icon: Award,
  },
];

export function HomePage() {
  const { products, catalogLoading } = useStore();
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="bg-[#143D2B] text-[#FAF9F5] border-b border-[#1B4D36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Copy Column */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center space-y-6"
            >
              <div className="text-xs font-medium text-[#EAB308] tracking-wide">
                {COMPANY_INFO.companyName} · {COMPANY_INFO.location}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-[#FAF9F5] headline-balance">
                Bringing Flavour, Nutrition and Excellence to Every Home.
              </h1>

              <p className="text-base sm:text-lg text-[#E6E1D6]/90 leading-relaxed max-w-xl">
                Welcome to ZESTARA FOODS. Manufactured in Umuahia by{' '}
                <strong className="font-semibold text-[#FAF9F5]">
                  {COMPANY_INFO.companyName}
                </strong>
                , our pure Nigerian spice blends elevate everyday family meals and commercial kitchens with authentic aroma and wholesome nutrition.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#D99B16] text-[#0C261A] text-sm font-bold hover:bg-[#EAB308] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-[#E6E1D6]/35 text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            {/* Right Editorial Hero Photography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-[#246346] bg-[#0C261A]">
                <ResilientImage
                  src={COMPANY_INFO.heroImage}
                  alt="ZESTARA FOODS natural Nigerian culinary spices in bowls with brass measuring spoons"
                  fallbackLabel="ZESTARA FOODS Spice Collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E6E1D6]">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold text-[#9A6D08] tracking-wide">
                Crafted in Umuahia · Nationwide Delivery
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B] headline-balance">
                Signature ZESTARA Spice Blends
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#143D2B] hover:text-[#9A6D08] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore all 7 spices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {catalogLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#F2EFE9]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-24 bg-[#F2EFE9] rounded" />
                    <div className="h-5 w-3/4 bg-[#F2EFE9] rounded" />
                    <div className="h-10 w-full bg-[#F2EFE9] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE ZESTARA */}
      <section className="py-16 sm:py-20 bg-[#F2EFE9] border-y border-[#E6E1D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs font-semibold text-[#9A6D08] tracking-wide">
                Our Manufacturing Standard
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B] headline-balance">
                Why Families & Chefs Choose ZESTARA
              </h2>
              <p className="text-sm sm:text-base text-[#4F6257] leading-relaxed">
                At {COMPANY_INFO.companyName}, flavour and food safety go hand in hand. Every batch is tested for moisture balance, colour integrity, and clean aroma.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#143D2B] hover:text-[#9A6D08] transition-colors"
                >
                  <span>Read our story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_CHOOSE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#9A6D08]">
                        {item.number}
                      </span>
                      <Icon className="w-5 h-5 text-[#143D2B]" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#143D2B]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#4F6257] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CUSTOMER TESTIMONIALS & SOCIAL */}
      <section className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold text-[#9A6D08] tracking-wide">
                Trusted Across Nigerian Kitchens
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B] headline-balance">
                What Our Customers Say
              </h2>
            </div>
            <a
              href={COMPANY_INFO.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FFFFFF] text-sm font-semibold text-[#143D2B] hover:border-[#143D2B] transition-colors whitespace-nowrap shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.81a8.23 8.23 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.22z" />
              </svg>
              <span>Follow {COMPANY_INFO.tiktokHandle} on TikTok</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6] flex flex-col justify-between gap-6"
              >
                <p className="text-sm sm:text-base text-[#2E4237] leading-relaxed">
                  “{testimonial.quote}”
                </p>
                <footer className="pt-4 border-t border-[#F2EFE9]">
                  <p className="font-semibold text-sm text-[#143D2B]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#5A6B61] mt-0.5">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
