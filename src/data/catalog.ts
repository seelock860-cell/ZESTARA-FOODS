import type { Category, Product } from '../types';

export const COMPANY_INFO = {
  companyName: 'The Well-Lands AgroFoods LTD.',
  brandName: 'ZESTARA FOODS',
  shortBrand: 'ZESTARA',
  tagline: 'Bringing Flavour, Nutrition and Excellence to Every Home.',
  location: 'Umuahia, Abia State, Nigeria',
  phoneDisplay: '+234 813 254 2731',
  phoneRaw: '2348132542731',
  email: 'zestarafoods@gmail.com',
  tiktokHandle: '@zestarafoods',
  tiktokUrl: 'https://www.tiktok.com/@zestarafoods',
  whatsappBaseUrl: 'https://wa.me/2348132542731',
  heroImage: '/src/assets/images/hero_zestara_spices_1794853655698.jpg',
  aboutImage: '/src/assets/images/about_well_lands_agro_1794853656761.jpg',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-traditional-soup',
    name: 'Traditional Soup Spices',
    slug: 'traditional-soup-spices',
    description: 'Authentic West African soup blends crafted for rich native broths.',
    display_order: 1,
  },
  {
    id: 'cat-rice-stew',
    name: 'Rice & Stew Blends',
    slug: 'rice-stew-blends',
    description: 'Vibrant tomato, pepper, and aromatic blends for Jollof rice and stews.',
    display_order: 2,
  },
  {
    id: 'cat-protein-grill',
    name: 'Protein & Grill Seasonings',
    slug: 'protein-grill-seasonings',
    description: 'Savory rubs and marinades for meats, poultry, and grilled fish.',
    display_order: 3,
  },
  {
    id: 'cat-all-purpose',
    name: 'All-Purpose & Everyday',
    slug: 'all-purpose-everyday',
    description: 'Versatile everyday culinary spices for wholesome Nigerian kitchens.',
    display_order: 4,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-banga-spice',
    category_id: 'cat-traditional-soup',
    name: 'ZESTARA Banga Spice',
    slug: 'zestara-banga-spice',
    description:
      'Rich, aromatic palm nut soup blend crafted from roasted native seeds, dried scent leaves, and sun-cured herbs for authentic Delta and Eastern Banga (Ofe Akwu).',
    ingredients:
      'Ataiko, oburunbebe stick, dried scent leaf, roasted nutmeg, uda pods, natural aromatic herbs.',
    usage_tips:
      'Add 1 to 2 tablespoons directly into simmering palm fruit extract 10 minutes before serving.',
    weight: '110g',
    price: 2500,
    image_url: '/src/assets/images/product_banga_zestara_1794853701249.jpg',
    is_featured: true,
    in_stock: true,
    stock_quantity: 120,
  },
  {
    id: 'prod-curry-spice',
    category_id: 'cat-all-purpose',
    name: 'ZESTARA Curry Spice',
    slug: 'zestara-curry-spice',
    description:
      'Vibrant golden turmeric-forward curry powder milled fresh for bright colour, warm fragrance, and balanced depth in fried rice, chicken, and vegetable dishes.',
    ingredients:
      'Sun-dried turmeric rhizomes, coriander seeds, cumin, fenugreek, ginger, sweet paprika, bay leaf.',
    usage_tips:
      'Bloom 1 teaspoon in warm cooking oil with chopped onions before adding rice or sauces.',
    weight: '110g',
    price: 2000,
    image_url: '/src/assets/images/product_curry_zestara_1794853677024.jpg',
    is_featured: true,
    in_stock: true,
    stock_quantity: 180,
  },
  {
    id: 'prod-stew-spice',
    category_id: 'cat-rice-stew',
    name: 'ZESTARA Stew Spice',
    slug: 'zestara-stew-spice',
    description:
      'Deep terracotta-red tomato stew seasoning balanced with thyme, roasted garlic, sweet bell pepper, and savory botanicals for rich Sunday Nigerian stews.',
    ingredients:
      'Dehydrated red bell pepper, sweet paprika, garlic flakes, onion granules, thyme, ginger, nutmeg.',
    usage_tips:
      'Stir 1 to 2 tablespoons into blended tomato-pepper base while frying for rich umami depth.',
    weight: '100g',
    price: 2200,
    image_url: '/src/assets/images/product_stew_zestara_1794853675533.jpg',
    is_featured: true,
    in_stock: true,
    stock_quantity: 150,
  },
  {
    id: 'prod-jollof-spice',
    category_id: 'cat-rice-stew',
    name: 'ZESTARA Jollof Rice Spice',
    slug: 'zestara-jollof-rice-spice',
    description:
      'Signature smoky party-Jollof seasoning blend infused with toasted spices, bay leaves, sweet chili, and savoury herbs for unmistakable Nigerian Jollof aroma.',
    ingredients:
      'Smoked paprika, dried tomato powder, bay leaf, thyme, roasted onion, white pepper, ginger, curry leaf.',
    usage_tips:
      'Add 2 tablespoons per 4 cups of rice when sautéing your Jollof pepper paste and stock.',
    weight: '120g',
    price: 2400,
    image_url: '/src/assets/images/product_jollof_zestara_1794853676289.jpg',
    is_featured: true,
    in_stock: true,
    stock_quantity: 160,
  },
  {
    id: 'prod-peppersoup-spice',
    category_id: 'cat-traditional-soup',
    name: 'ZESTARA Pepper Soup Spice',
    slug: 'zestara-pepper-soup-spice',
    description:
      'Warming, fragrant West African pepper soup blend featuring calabash nutmeg (ehuru), negro pepper (uda), cloves, and uziza for comforting goat meat, catfish, and chicken pepper soup.',
    ingredients:
      'Ehuru (calabash nutmeg), uda pods, uziza seeds, cloves, grains of paradise, dried ginger.',
    usage_tips:
      'Simmer 1.5 tablespoons with seasoned protein and water for 20 minutes; finish with fresh scent leaf.',
    weight: '120g',
    price: 2600,
    image_url: '/src/assets/images/product_peppersoup_zestara_1794853676381.jpg',
    is_featured: false,
    in_stock: true,
    stock_quantity: 140,
  },
  {
    id: 'prod-protein-spice',
    category_id: 'cat-protein-grill',
    name: 'ZESTARA Protein Spice',
    slug: 'zestara-protein-spice',
    description:
      'Coarse-ground savory rub formulated for beef, chicken, turkey, and whole fish—locking in natural juices while delivering crisp roasted herb flavour.',
    ingredients:
      'Cracked black pepper, rosemary needles, golden onion granules, garlic, ginger, white pepper, sea salt.',
    usage_tips:
      'Coat meat or fish generously and rest for 20 minutes before grilling, roasting, air-frying, or boiling.',
    weight: '90g',
    price: 2300,
    image_url: '/src/assets/images/product_protein_zestara_1794853678776.jpg',
    is_featured: false,
    in_stock: true,
    stock_quantity: 130,
  },
  {
    id: 'prod-mixed-spice',
    category_id: 'cat-all-purpose',
    name: 'ZESTARA Mixed Spice',
    slug: 'zestara-mixed-spice',
    description:
      'Wholesome all-purpose household spice blend uniting golden turmeric, crushed herbs, paprika, and aromatic seeds for stir-fries, pasta, yam pottage, and everyday cooking.',
    ingredients:
      'Turmeric, thyme, parsley, sweet paprika, coriander, onion, garlic, black pepper, mild chili.',
    usage_tips:
      'Sprinkle to taste into pottage, sauces, sautéed vegetables, eggs, or rice dishes.',
    weight: '80g',
    price: 1900,
    image_url: '/src/assets/images/product_mixed_zestara_1794853677928.jpg',
    is_featured: false,
    in_stock: true,
    stock_quantity: 200,
  },
];

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const TESTIMONIALS = [
  {
    name: 'Chef Chidinma Okafor',
    role: 'Executive Caterer, Golden Pot Catering',
    location: 'Umuahia, Abia State',
    quote:
      'Switching our kitchen to ZESTARA Jollof Rice Spice and Banga Spice cut our prep seasoning time by 35% while delivering consistent smoky flavour across 200-guest events.',
  },
  {
    name: 'Mrs. Ngozi Adeyemi',
    role: 'Home Cook & Nutrition Educator',
    location: 'Lekki, Lagos State',
    quote:
      'You smell the purity the moment you open the jar. No harsh artificial fillers—just clean turmeric, roasted herbs, and real Nigerian aroma my whole family trusts.',
  },
  {
    name: 'Mr. Emeka Nwosu',
    role: 'Operations Manager, Cedar Grill House',
    location: 'Port Harcourt, Rivers State',
    quote:
      'ZESTARA Protein Spice and Pepper Soup Spice have become non-negotiables on our line. Our grilled tilapia and catfish pepper soup orders doubled in four months.',
  },
];

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppOrderUrl(message: string): string {
  return `${COMPANY_INFO.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
