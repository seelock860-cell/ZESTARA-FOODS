import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
];

export function Navbar() {
  const { cartCount, setIsCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E6E1D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#143D2B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#143D2B]"
        >
          ZESTARA FOODS
        </Link>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2E4237]"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#143D2B] ${
                  isActive
                    ? 'border-[#D99B16] text-[#143D2B] font-semibold'
                    : 'border-transparent hover:text-[#143D2B] hover:border-[#D99B16]/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action (Cart) + Mobile menu toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping cart with ${cartCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-medium hover:bg-[#1B4D36] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99B16] min-h-[40px]"
          >
            <ShoppingBag className="w-4 h-4 text-[#EAB308]" />
            <span>Cart</span>
            <span className="font-mono tabular-nums text-xs px-1.5 py-0.5 rounded bg-[#0C261A] text-[#EAB308]">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E6E1D6] text-[#143D2B] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E1D6] bg-[#FAF9F5] px-4 py-3">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#143D2B] text-[#FAF9F5]'
                      : 'text-[#2E4237] hover:bg-[#F2EFE9] hover:text-[#143D2B]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
