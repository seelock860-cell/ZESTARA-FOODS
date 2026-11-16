import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/catalog';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0C261A] text-[#E6E1D6] border-t border-[#1B4D36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <p className="font-display text-2xl font-bold text-[#FAF9F5] tracking-tight">
                ZESTARA FOODS
              </p>
              <p className="text-xs text-[#EAB308] font-medium mt-1">
                {COMPANY_INFO.companyName}
              </p>
            </div>
            <p className="text-sm text-[#E6E1D6]/85 leading-relaxed max-w-xs">
              {COMPANY_INFO.tagline} Naturally sourced, hygienically processed Nigerian spices crafted in Abia State.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#FAF9F5] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#EAB308] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#EAB308] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#EAB308] transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#EAB308] transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#EAB308] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#EAB308] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#FAF9F5] mb-4">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm text-[#E6E1D6]/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EAB308] shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                  className="hover:text-[#EAB308] transition-colors tabular-nums"
                >
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EAB308] shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-[#EAB308] transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Direct Ordering */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#FAF9F5] mb-4">
              Connect With Us
            </h3>
            <p className="text-sm text-[#E6E1D6]/85 leading-relaxed mb-4">
              Follow our kitchen recipes, spice pairing tips, and factory updates on TikTok or order directly on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={COMPANY_INFO.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#246346] bg-[#143D2B] text-sm font-medium text-[#FAF9F5] hover:border-[#EAB308] hover:text-[#EAB308] transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.81a8.23 8.23 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.22z" />
                </svg>
                <span>TikTok {COMPANY_INFO.tiktokHandle}</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D99B16] text-[#0C261A] text-sm font-semibold hover:bg-[#EAB308] transition-colors whitespace-nowrap"
              >
                <span>WhatsApp Store</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1B4D36] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6E1D6]/75">
          <p>
            © {year} {COMPANY_INFO.companyName} All rights reserved.
          </p>
          <p>
            ZESTARA FOODS · Umuahia, Abia State, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
