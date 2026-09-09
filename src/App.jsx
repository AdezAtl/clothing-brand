import React, { useState, useEffect } from 'react';
import TopNotice from './components/TopNotice';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import StoreVisit from './components/StoreVisit';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SizingGuide from './components/SizingGuide';
import QuickViewModal from './components/QuickViewModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { StoreManager } from './services/storeManager';
import { AuthService } from './services/authService';

export default function App() {
  const [view, setView] = useState(() => (window.location.hash === '#/admin' ? 'admin' : 'store'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => AuthService.isAuthenticated());
  const [activeCategory, setActiveCategory] = useState('All Pieces');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [products, setProducts] = useState(() => StoreManager.getProducts());

  // Listen to hash changes (e.g. #/admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/admin') {
        setView('admin');
      } else {
        setView('store');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync auth state changes across windows / logout triggers
  useEffect(() => {
    const handleAuth = () => {
      setIsAdminAuthenticated(AuthService.isAuthenticated());
    };
    window.addEventListener('lolashub_auth_changed', handleAuth);
    return () => window.removeEventListener('lolashub_auth_changed', handleAuth);
  }, []);

  // Sync products when admin updates them
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(StoreManager.getProducts());
    };
    window.addEventListener('lolashub_products_updated', handleProductsUpdate);
    return () => window.removeEventListener('lolashub_products_updated', handleProductsUpdate);
  }, []);

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToAdmin = () => {
    window.location.hash = '#/admin';
    setView('admin');
  };

  const handleBackToStore = () => {
    window.location.hash = '';
    setView('store');
  };

  const handleSignOut = async () => {
    await AuthService.logout();
    setIsAdminAuthenticated(false);
  };

  if (view === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToStore={handleBackToStore}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToStore={handleBackToStore}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="site-wrapper">
      {/* Top Announcement Bar */}
      <TopNotice onGoToAdmin={handleGoToAdmin} />

      {/* Primary Sticky Editorial Nav */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onGoToAdmin={handleGoToAdmin}
      />

      {/* Main Content Sections */}
      <main>
        {/* Editorial Hero */}
        <Hero />

        {/* Curated Catalog Section */}
        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* Physical Store & Location */}
        <StoreVisit />

        {/* Real Customer Reviews */}
        <Reviews />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onGoToAdmin={handleGoToAdmin}
      />

      {/* Overlays & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <SizingGuide />
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
