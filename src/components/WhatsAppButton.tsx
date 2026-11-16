import { COMPANY_INFO, buildWhatsAppOrderUrl } from '../data/catalog';

export function WhatsAppButton() {
  const href = buildWhatsAppOrderUrl(
    'Hello ZESTARA FOODS (The Well-Lands AgroFoods LTD.), I would like to place an order or make an enquiry.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-pump"
      />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat or order on WhatsApp ${COMPANY_INFO.phoneDisplay}`}
        className="relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#16A34A] text-white font-semibold text-sm shadow-lg hover:bg-[#15803D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D2B]"
      >
        <svg
          className="w-5 h-5 fill-current shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m5.81 14.07c-.24.69-1.42 1.32-1.95 1.4-.5.07-1.14.11-1.84-.11-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07s.76-2.18 1.04-2.48c.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.06.91 2.21.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.54-.15.15-.3.31-.13.61.18.3.78 1.29 1.67 2.09 1.15 1.03 2.12 1.35 2.42 1.5.3.15.48.13.66-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.75-.17 1.44" />
        </svg>
        <span className="whitespace-nowrap">Order on WhatsApp</span>
      </a>
    </div>
  );
}
