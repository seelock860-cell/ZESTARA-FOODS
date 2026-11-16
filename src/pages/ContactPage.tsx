import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { COMPANY_INFO, buildWhatsAppOrderUrl } from '../data/catalog';
import { isSupabaseConfigured } from '../lib/supabase';
import { submitContactMessage } from '../services/storeService';

export function ContactPage() {
  const { showToast } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Order & Distribution Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await submitContactMessage({
        full_name: fullName,
        email,
        phone,
        subject,
        message,
      });
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      showToast('Your message has been sent to ZESTARA FOODS.');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not send message. You can reach us directly on WhatsApp or email.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-[75vh] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-[#9A6D08] tracking-wide">
            {COMPANY_INFO.companyName}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#143D2B] headline-balance">
            Contact ZESTARA FOODS
          </h1>
          <p className="text-base text-[#4F6257]">
            Reach our team in Umuahia for household spice orders, wholesale distribution, supermarket stockists, or hospitality supply.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#143D2B] text-[#FAF9F5] rounded-2xl p-7 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  Direct Channels
                </h2>
                <p className="text-sm text-[#E6E1D6]/85 mt-1">
                  Speak directly with our Umuahia customer care and wholesale desk.
                </p>
              </div>

              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E6E1D6]/75">Phone & WhatsApp</p>
                    <a
                      href={`tel:${COMPANY_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                      className="font-mono font-semibold text-base hover:text-[#EAB308] transition-colors tabular-nums"
                    >
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E6E1D6]/75">Email</p>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="font-semibold text-base hover:text-[#EAB308] transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E6E1D6]/75">Manufacturing Location</p>
                    <p className="font-semibold text-base">{COMPANY_INFO.location}</p>
                  </div>
                </li>
              </ul>

              <div className="pt-2 space-y-3">
                <a
                  href={buildWhatsAppOrderUrl(
                    'Hello ZESTARA FOODS! I have an inquiry regarding your spice products.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#D99B16] text-[#0C261A] text-sm font-bold hover:bg-[#EAB308] transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={COMPANY_INFO.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#246346] bg-[#0C261A]/50 text-[#FAF9F5] text-sm font-semibold hover:border-[#EAB308] transition-colors min-h-[44px]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.81a8.23 8.23 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.22z" />
                  </svg>
                  <span>Follow {COMPANY_INFO.tiktokHandle} on TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E6E1D6] rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#143D2B]">
                  Message Received
                </h2>
                <p className="text-sm text-[#4F6257] max-w-md mx-auto">
                  Thank you for contacting {COMPANY_INFO.companyName}. Our team will respond shortly via email or WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#F2EFE9] pb-4">
                  <h2 className="font-display text-xl font-semibold text-[#143D2B]">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-[#5A6B61] mt-1">
                    Inquiries are stored securely in our Supabase customer inbox.
                  </p>
                </div>

                {!isSupabaseConfigured && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    Connect Supabase credentials (<code className="font-mono">VITE_SUPABASE_URL</code> &{' '}
                    <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>) to store contact form submissions in Supabase, or click <strong>Chat on WhatsApp</strong>.
                  </div>
                )}

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                    >
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#143D2B] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can The Well-Lands AgroFoods LTD. help you?"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E6E1D6] bg-[#FAF9F5] text-sm text-[#143D2B] focus:outline-none focus:border-[#143D2B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#143D2B] text-[#FAF9F5] text-sm font-semibold hover:bg-[#1B4D36] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
