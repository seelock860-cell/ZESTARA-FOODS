import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { WhatsAppButton } from './components/WhatsAppButton';
import { StoreProvider, useStore } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppShell() {
  const { toast } = useStore();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#14231B]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      {!isAdminRoute && <WhatsAppButton />}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all ${
            toast.tone === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-[#143D2B] text-[#FAF9F5] border-[#246346]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </BrowserRouter>
  );
}

