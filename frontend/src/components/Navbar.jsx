import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  BookMarked,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Navbar({
  cartCount: propCartCount,
  user: propUser,
  onSearch = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Consume Contexts (with fallback if context is not yet mounted)
  let cartCtx = null;
  let authCtx = null;

  try {
    cartCtx = useCart();
  } catch {
    cartCtx = null;
  }

  try {
    authCtx = useAuth();
  } catch {
    authCtx = null;
  }

  const activeCartCount = propCartCount !== undefined ? propCartCount : (cartCtx?.cartCount ?? 0);
  const currentUser = propUser !== undefined ? propUser : authCtx?.user;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Guard: Cart access requires login
  const handleCartClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login', {
        state: {
          from: location,
          openCartAfterLogin: true,
          message: 'Please log in first to view your cart and checkout.',
        },
      });
      return;
    }
    if (cartCtx?.openCart) {
      cartCtx.openCart();
    }
  };

  // Guard: Buy books requires login
  const handleBuyClick = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      navigate('/login', {
        state: {
          from: { pathname: '/catalog' },
          message: 'Please log in first to browse and buy books.',
        },
      });
    } else {
      navigate('/catalog');
    }
  };

  // Guard: Sell books requires login
  const handleSellClick = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      navigate('/login', {
        state: {
          from: { pathname: '/sell' },
          message: 'Please log in first to list your books for sale.',
        },
      });
    } else {
      navigate('/sell');
    }
  };

  // Guard: Donate books requires login
  const handleDonateClick = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      navigate('/login', {
        state: {
          from: { pathname: '/sell', search: '?type=donation' },
          message: 'Please log in first to donate books to students.',
        },
      });
    } else {
      navigate('/sell?type=donation');
    }
  };

  const handleLogout = () => {
    if (authCtx?.logout) {
      authCtx.logout();
    }
    setUserDropdownOpen(false);
    navigate('/');
  };

  const { settings } = useSiteSettings();
  const announcement = settings?.announcement;

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* 1. Announcement Top Banner */}
      {announcement?.enabled !== false && (
        <div className="bg-[#795238] text-[#FAF6EF] text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 font-medium transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto sm:mx-0 min-w-0">
              <span className="bg-[#E07A5F] text-white text-[10px] sm:text-xs uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded tracking-wide shrink-0">
                {announcement?.badge || 'Offer'}
              </span>
              <span className="truncate">
                {announcement?.text ||
                  'Read More. Pay Less. • Save up to 70% on curriculum & literature books!'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs opacity-90">
              <span>
                {announcement?.rightNotice ||
                  'Verified Book Quality Guarantee • Kathmandu Valley & Nationwide Delivery'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <nav className="bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#F3EBDD]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <img
                src="/logo.jpg"
                alt="SMARTKITAB Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-2xl shadow-sm border border-[#795238]/15 bg-[#FAF6EF] group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#795238] leading-none">
                  SMART<span className="text-[#E07A5F]">KITAB</span>
                </span>
                <span className="text-[9px] sm:text-xs tracking-wider text-[#365314] font-bold mt-0.5">
                  पुराना किताब, नयाँ ज्ञान
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 relative items-center"
            >
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Search by title, author, course, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-28 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full bg-[#F3EBDD]/70 border-2 border-[#795238]/25 text-[#2D2D2D] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#795238]/30 focus:border-[#795238] focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#795238] hover:bg-[#603f29] active:scale-95 text-white rounded-full flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  aria-label="Search books"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs sm:text-sm font-bold text-[#795238]">
              <button
                type="button"
                onClick={handleBuyClick}
                className="hover:text-[#E07A5F] transition-colors duration-150 py-1 cursor-pointer"
              >
                Buy Books
              </button>
              <button
                type="button"
                onClick={handleSellClick}
                className="hover:text-[#E07A5F] transition-colors duration-150 py-1 cursor-pointer"
              >
                Sell Books
              </button>
              <button
                type="button"
                onClick={handleDonateClick}
                className="flex items-center gap-1 hover:text-[#E07A5F] transition-colors duration-150 py-1 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Donate</span>
              </button>
              <Link
                to="/catalog?category=Novels"
                className="hover:text-[#E07A5F] transition-colors duration-150 py-1"
              >
                Novels
              </Link>
              <Link
                to="/about"
                className="hover:text-[#E07A5F] transition-colors duration-150 py-1"
              >
                About Us
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#795238]/10 text-[#795238] font-bold hover:bg-[#795238] hover:text-white transition text-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Cart Icon with Badge */}
              <button
                type="button"
                onClick={handleCartClick}
                aria-label="Shopping Cart"
                className="relative p-2.5 rounded-full hover:bg-[#F3EBDD] text-[#795238] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6" />
                {activeCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 bg-[#E07A5F] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAF6EF] shadow-sm">
                    {activeCartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown or Login Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full border border-[#795238]/20 bg-[#F3EBDD]/60 hover:bg-[#F3EBDD] transition text-sm font-medium text-[#795238] cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#795238] text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline-block max-w-[90px] truncate font-bold">
                      {currentUser.name || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#795238]/70" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#F3EBDD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-[#F3EBDD]">
                        <p className="text-[11px] text-stone-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-[#795238] truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FAF6EF] text-[#365314] rounded-md border border-[#365314]/20">
                          Role: {currentUser.role || 'Buyer'}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#795238] hover:bg-[#FAF6EF] transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#795238]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/buyer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-stone-800 hover:bg-[#FAF6EF] transition"
                      >
                        <Package className="w-4 h-4 text-[#795238]" />
                        <span>My Orders (Buyer)</span>
                      </Link>

                      <Link
                        to="/seller/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-stone-800 hover:bg-[#FAF6EF] transition"
                      >
                        <BookMarked className="w-4 h-4 text-[#365314]" />
                        <span>Seller Central</span>
                      </Link>

                      <Link
                        to="/sell"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF6EF] transition"
                      >
                        <HeartHandshake className="w-4 h-4 text-[#E07A5F]" />
                        <span>List / Donate a Book</span>
                      </Link>

                      <Link
                        to="/catalog"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF6EF] transition"
                      >
                        <BookOpen className="w-4 h-4 text-[#795238]" />
                        <span>Explore Catalog</span>
                      </Link>

                      <div className="border-t border-[#F3EBDD] my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#795238] hover:bg-[#F3EBDD] border border-[#795238]/30 transition shadow-xs"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#795238] hover:bg-[#603f29] transition shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="lg:hidden p-2 rounded-lg text-[#795238] hover:bg-[#F3EBDD] transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search books, authors, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-24 py-2.5 text-xs rounded-full bg-[#F3EBDD]/80 border-2 border-[#795238]/25 text-[#2D2D2D] focus:outline-none focus:bg-white transition"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#795238] hover:bg-[#603f29] active:scale-95 text-white rounded-full flex items-center gap-1 font-bold text-xs shadow-xs cursor-pointer"
                aria-label="Search books"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#F3EBDD] bg-[#FAF6EF] px-4 pt-3 pb-6 space-y-2">
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleBuyClick(e);
              }}
              className="w-full text-left block px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#795238] hover:bg-[#F3EBDD] cursor-pointer"
            >
              Buy Books
            </button>
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleSellClick(e);
              }}
              className="w-full text-left block px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#795238] hover:bg-[#F3EBDD] cursor-pointer"
            >
              Sell Books
            </button>
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleDonateClick(e);
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#E07A5F] hover:bg-[#F3EBDD] cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#E07A5F]" />
              <span>Donate Books</span>
            </button>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#795238] hover:bg-[#F3EBDD]"
            >
              About Us
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-[#365314] hover:bg-[#F3EBDD]"
              >
                Admin Dashboard
              </Link>
            )}

            {currentUser && (
              <>
                <Link
                  to="/buyer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-800 hover:bg-[#F3EBDD]"
                >
                  <Package className="w-4 h-4 text-[#795238]" />
                  <span>My Orders (Buyer Hub)</span>
                </Link>

                <Link
                  to="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-800 hover:bg-[#F3EBDD]"
                >
                  <BookMarked className="w-4 h-4 text-[#365314]" />
                  <span>Seller Central</span>
                </Link>
              </>
            )}

            {!currentUser ? (
              <div className="pt-4 border-t border-[#F3EBDD] flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#795238] text-[#795238] font-bold text-xs"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#795238] text-white font-bold text-xs"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#F3EBDD]">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out ({currentUser.name})
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
