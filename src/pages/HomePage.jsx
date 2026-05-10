import { useState, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero3D from '../components/Hero3D.jsx';
import ProductCard from '../components/ProductCard.jsx';
import OrderModal from '../components/OrderModal.jsx';
import OrderTrackingModal from '../components/OrderTrackingModal.jsx';
import AboutSection from '../components/AboutSection.jsx';
import Footer from '../components/Footer.jsx';
import AdminLoginModal from '../components/AdminLoginModal.jsx';
import { DB } from '../js/db.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function HomePage() {
  const [orderProduct, setOrderProduct] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const logoClickRef = useRef(0);
  const logoTimerRef = useRef(null);
  const { login } = useAuth();

  const products = DB.getProducts();

  const handleOrder = useCallback((product) => {
    setOrderProduct(product);
  }, []);

  const handleLogoClick = useCallback(() => {
    logoClickRef.current++;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    if (logoClickRef.current >= 7) {
      logoClickRef.current = 0;
      setAdminModalOpen(true);
      return;
    }
    logoTimerRef.current = setTimeout(() => { logoClickRef.current = 0; }, 3000);
  }, []);

  const handleAdminSuccess = useCallback(() => {
    setAdminModalOpen(false);
    window.location.href = '/admin';
  }, []);

  const handleNavClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div>
      <Navbar onLogoClick={handleLogoClick} onNavClick={handleNavClick} onTrackingClick={() => setTrackingOpen(true)} />
      <Hero3D />

      <section id="koleksi">
        <div className="section-header">
          <h2>Koleksi Terbaru</h2>
          <p>Tampil beda dengan <strong>TUI-Store</strong> &mdash; total <strong>{products.length}</strong> produk tersedia</p>
        </div>
        <div className="products">
          {products.length === 0 ? (
            <div className="product-empty">Belum ada produk tersedia. Silakan cek kembali nanti.</div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onOrder={handleOrder} />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <Footer />

      {orderProduct && (
        <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />
      )}

      <OrderTrackingModal open={trackingOpen} onClose={() => setTrackingOpen(false)} />

      <AdminLoginModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} onLogin={login} onLoginSuccess={handleAdminSuccess} />
    </div>
  );
}
