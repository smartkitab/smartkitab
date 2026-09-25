import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsBar from './components/MetricsBar';
import CategoryGrid from './components/CategoryGrid';
import FeaturedBooksSection from './components/FeaturedBooksSection';
import BestSellersSection from './components/BestSellersSection';
import BookCycleBanner from './components/BookCycleBanner';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Global Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';

// Pages
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellBookPage from './pages/SellBookPage';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AuthPage from './pages/AuthPage';
import InfoPage from './pages/InfoPage';

// HomePage storefront view
function HomePage({ onAddToCart }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const sections = settings?.sections || {};

  return (
    <>
      {/* 1. Hero Section */}
      {sections.showHero !== false && (
        <HeroSection
          onBuyClick={() => {
            if (!isAuthenticated) {
              navigate('/login', {
                state: {
                  from: { pathname: '/catalog' },
                  message: 'Please log in first to browse and buy books.',
                },
              });
            } else {
              navigate('/catalog');
            }
          }}
          onSellClick={() => {
            if (!isAuthenticated) {
              navigate('/login', {
                state: {
                  from: { pathname: '/sell' },
                  message: 'Please log in first to list your books for sale.',
                },
              });
            } else {
              navigate('/sell');
            }
          }}
          onDonateClick={() => {
            if (!isAuthenticated) {
              navigate('/login', {
                state: {
                  from: { pathname: '/sell', search: '?type=donation' },
                  message: 'Please log in first to donate books to students.',
                },
              });
            } else {
              navigate('/sell?type=donation');
            }
          }}
        />
      )}

      {/* 2. Key Metrics Bar */}
      {sections.showMetricsBar !== false && <MetricsBar />}

      {/* 3. Circular Category Grid */}
      {sections.showCategoryGrid !== false && (
        <CategoryGrid
          onSelectCategory={(cat) => navigate(`/catalog?category=${encodeURIComponent(cat)}`)}
        />
      )}

      {/* 4. Featured Books Carousel */}
      {sections.showFeaturedBooks !== false && (
        <div id="featured-section">
          <FeaturedBooksSection onAddToCart={onAddToCart} />
        </div>
      )}

      {/* 5. Best Sellers Horizontal Slider */}
      {sections.showBestSellers !== false && <BestSellersSection onAddToCart={onAddToCart} />}

      {/* 6. BookCycle Membership & Promotional Banner */}
      {sections.showBookCycle !== false && (
        <BookCycleBanner
          onJoinClick={() => navigate('/catalog')}
          onKnowMoreClick={() => navigate('/catalog')}
          onGiftClick={() => navigate('/catalog')}
        />
      )}
    </>
  );
}

// Main App Layout & Routes Container
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, openCart } = useCart();
  const [notification, setNotification] = useState(null);

  // Check if current route is in the admin panel
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle unauthorized redirect notification
  useEffect(() => {
    if (location.state?.unauthorized) {
      setNotification('Access restricted: Administrator credentials required.');
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // If user requested to see cart prior to logging in, open the cart automatically once authenticated
  useEffect(() => {
    if (isAuthenticated && location.state?.openCartAfterLogin) {
      openCart();
    }
  }, [isAuthenticated, location.state, openCart]);

  const handleAddToCart = (book) => {
    if (!book) return;

    // Guard: Buy/Cart actions require login
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: `Please log in first to buy books or add them to your cart.`,
        },
      });
      return;
    }

    addToCart(book, 1);
    setNotification(`Added "${book.title}" to your cart!`);
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-stone-900 flex flex-col font-sans selection:bg-[#E07A5F]/20 selection:text-[#795238]">
      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#795238] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
          <button
            onClick={() => {
              setNotification(null);
              if (!isAuthenticated) {
                navigate('/login', {
                  state: {
                    from: location,
                    openCartAfterLogin: true,
                    message: 'Please log in first to view your cart.',
                  },
                });
                return;
              }
              openCart();
            }}
            className="ml-2 text-xs font-bold underline text-amber-200 hover:text-white cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Global Navbar (Storefront views only) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="/catalog" element={<CatalogPage onAddToCart={handleAddToCart} />} />
          <Route path="/book/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
          
          {/* Protected Sell & Donate Route */}
          <Route
            path="/sell"
            element={
              <ProtectedRoute requiredRole={null}>
                <SellBookPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Buyer Dashboard */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute requiredRole={null}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Seller Dashboard */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute requiredRole={null}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Aliases / Shortcuts */}
          <Route path="/orders" element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="/my-orders" element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="/my-listings" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="/dashboard" element={<Navigate to="/buyer/dashboard" replace />} />

          {/* Info & Support Routes */}
          <Route path="/about" element={<InfoPage initialTab="about" />} />
          <Route path="/how-it-works" element={<InfoPage initialTab="how-it-works" />} />
          <Route path="/faqs" element={<InfoPage initialTab="faqs" />} />
          <Route path="/delivery-returns" element={<InfoPage initialTab="delivery-returns" />} />
          <Route path="/terms" element={<InfoPage initialTab="terms" />} />
          <Route path="/privacy" element={<InfoPage initialTab="privacy" />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer (Storefront views only) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// Export Root App wrapped in BrowserRouter, AuthProvider, CartProvider, and SiteSettingsProvider
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <SiteSettingsProvider>
              <AppContent />
            </SiteSettingsProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
