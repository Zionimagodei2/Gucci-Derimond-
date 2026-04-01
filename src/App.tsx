import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AnnouncementBar from './components/AnnouncementBar';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ShopByGeneration from './components/ShopByGeneration';
import ShopByCategory from './components/ShopByCategory';
import FeaturedCarousel from './components/FeaturedCarousel';
import SpotlightProduct from './components/SpotlightProduct';
import Marquee from './components/Marquee';
import AboutSection from './components/AboutSection';
import BlogPreview from './components/BlogPreview';
import RewardsSection from './components/RewardsSection';
import Newsletter from './components/Newsletter';
import CartDrawer from './components/CartDrawer';
import WelcomePopup from './components/WelcomePopup';
import AuthModal from './components/AuthModal';
import CollectionPage from './pages/CollectionPage';
import GenerationCategoryPage from './pages/GenerationCategoryPage';
import ProductPage from './pages/ProductPage';
import AdminPage from './pages/AdminPage';
import ContentPage from './pages/ContentPage';
import ScrollToTop from './components/ScrollToTop';

import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ShopByGeneration />
      <ShopByCategory />
      <FeaturedCarousel />
      <SpotlightProduct />
      <Marquee />
      <AboutSection />
      <BlogPreview />
      <RewardsSection />
      <Newsletter />
    </main>
  );
}

export default function App() {
  React.useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname })
        });
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };
    trackVisit();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <AnnouncementBar />
            <Header />
            <Navigation />
            
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generation/:slug" element={<GenerationCategoryPage />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/collections" element={<CollectionPage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/pages/:slug" element={<ContentPage />} />
                <Route path="/policies/:slug" element={<ContentPage />} />
                <Route path="/blogs/news" element={<BlogPage />} />
                <Route path="/blogs/news/:id" element={<BlogPostPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/orders" element={<OrderHistoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Placeholder routes for other pages */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
            
            <Footer />
            <CartDrawer />
            <WelcomePopup />
            <AuthModal />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
