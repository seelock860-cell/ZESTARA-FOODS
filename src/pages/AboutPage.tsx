import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, HeartHandshake, Target } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { COMPANY_INFO } from '../data/catalog';

const COMPANY_VALUES = [
  {
    title: 'Uncompromising Purity',
    detail:
      'We mill whole, sun-cured Nigerian spices with zero artificial colouring, synthetic MSG fillers, or stale imports.',
  },
  {
    title: 'Nutritional Stewardship',
    detail:
      'Low-temperature dehydration preserves natural antioxidants, curcuminoids, and essential aromatic oils in every jar.',
  },
  {
    title: 'Community Agro-Empowerment',
    detail:
      'From Umuahia outgrowers to regional spice farmers, we build reliable, fair partnerships across Nigeria’s agricultural value chain.',
  },
  {
    title: 'Culinary Excellence',
    detail:
      'Tested by experienced Nigerian cooks and caterers so both home kitchens and commercial restaurants achieve dependable flavour.',
  },
];

export function AboutPage() {
  return (
    <div className="bg-[#FAF9F5]">
      {/* Intro Header */}
      <section className="bg-[#143D2B] text-[#FAF9F5] py-14 sm:py-20 border-b border-[#1B4D36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold text-[#EAB308] tracking-wide">
              {COMPANY_INFO.companyName} · {COMPANY_INFO.location}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight headline-balance">
              Rooted in Abia State, Nourishing Homes Across Nigeria.
            </h1>
            <p className="text-base sm:text-lg text-[#E6E1D6]/90 leading-relaxed">
              The Well-Lands AgroFoods LTD. is a proud Nigerian food manufacturing enterprise dedicated to transforming wholesome local agricultural harvests into the ZESTARA FOODS range of aromatic culinary spices.
            </p>
          </div>
        </div>
      </section>

      {/* Story + Photo Split */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6">
              <div className="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-[#E6E1D6] bg-[#F2EFE9]">
                <ResilientImage
                  src={COMPANY_INFO.aboutImage}
                  alt="Fresh harvested Nigerian spices, peppers, ginger, and turmeric prepared by The Well-Lands AgroFoods LTD."
                  fallbackLabel="The Well-Lands AgroFoods LTD."
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B] headline-balance">
                Our Commitment to Flavour, Nutrition and Quality Manufacturing
              </h2>
              <p className="text-base text-[#3D5246] leading-relaxed">
                Founded in Umuahia, Abia State, {COMPANY_INFO.companyName} was established with a clear purpose: to give Nigerian households, diaspora families, and hospitality kitchens convenient access to clean, authentic spices without sacrificing nutritional integrity.
              </p>
              <p className="text-base text-[#3D5246] leading-relaxed">
                Every ZESTARA blend—from our native Banga and Pepper Soup spices to our vibrant Curry, Stew, Jollof Rice, Protein, and Mixed Spices—undergoes rigorous sorting, washing, controlled drying, and airtight packaging to preserve natural potency.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] transition-colors"
                >
                  <span>Explore ZESTARA Spices</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-5 py-3 rounded-lg border border-[#E6E1D6] bg-[#FFFFFF] text-[#143D2B] text-sm font-semibold hover:bg-[#F2EFE9] transition-colors"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#F2EFE9] border-y border-[#E6E1D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6] space-y-4">
            <div className="w-11 h-11 rounded-lg bg-[#143D2B] text-[#EAB308] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#143D2B]">Our Mission</h2>
            <p className="text-base text-[#3D5246] leading-relaxed">
              To manufacture safe, nutrient-rich, and delightfully aromatic food products from Nigeria’s agricultural bounty—bringing flavour, nutrition, and excellence to every home while upholding ethical sourcing and modern food processing standards.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6] space-y-4">
            <div className="w-11 h-11 rounded-lg bg-[#D99B16] text-[#0C261A] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#143D2B]">Our Vision</h2>
            <p className="text-base text-[#3D5246] leading-relaxed">
              To become West Africa’s most trusted household agrofood brand—celebrated for clean ingredients, unmistakable culinary taste, and reliable distribution from Umuahia to tables across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-[#9A6D08]" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143D2B]">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COMPANY_VALUES.map((val) => (
              <div
                key={val.title}
                className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E6E1D6] space-y-2.5"
              >
                <div className="flex items-center gap-2 text-[#143D2B]">
                  <CheckCircle2 className="w-4 h-4 text-[#D99B16] shrink-0" />
                  <h3 className="font-display text-lg font-semibold">{val.title}</h3>
                </div>
                <p className="text-sm text-[#4F6257] leading-relaxed">{val.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
