import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  UserCheck,
} from 'lucide-react';

const fallbackBook = {
  _id: 'sample-detail-1',
  title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
  author: 'James Clear',
  category: 'Novels',
  originalPrice: 650,
  sellingPrice: 350,
  condition: 'Good Condition',
  type: 'sale',
  images: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  ],
  description:
    'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. This second-hand copy is in clean, readable condition with intact binding and minor cover wear.',
  sellerId: {
    _id: 'seller-1',
    name: 'Sample Seller',
    email: 'seller@smartkitab.com',
    address: {
      city: 'Kathmandu',
      phone: '9800000002',
    },
  },
};

export default function ProductDetailPage({ onAddToCart = () => {} }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/books/${id}`);
        if (isMounted) {
          if (res.data?.book) {
            setBook(res.data.book);
          } else {
            setBook(fallbackBook);
          }
        }
      } catch (err) {
        console.warn('Could not fetch book details from API, using fallback:', err.message);
        if (isMounted) setBook(fallbackBook);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    } else {
      setBook(fallbackBook);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-cream-bg flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brown"></div>
      </div>
    );
  }

  const currentBook = book || fallbackBook;
  const images =
    currentBook.images && currentBook.images.length > 0
      ? currentBook.images
      : fallbackBook.images;

  const discountAmount =
    currentBook.originalPrice && currentBook.originalPrice > currentBook.sellingPrice
      ? currentBook.originalPrice - currentBook.sellingPrice
      : 0;

  const discountPercent =
    currentBook.originalPrice && currentBook.originalPrice > currentBook.sellingPrice
      ? Math.round((discountAmount / currentBook.originalPrice) * 100)
      : 0;

  const sellerPhone =
    currentBook.sellerId?.address?.phone ||
    currentBook.sellerId?.phone ||
    '9800000000';

  const whatsappMessage = encodeURIComponent(
    `Hi! I am interested in buying your book "${currentBook.title}" listed on SMARTKITAB for Rs. ${currentBook.sellingPrice}. Is it still available?`
  );

  const whatsappUrl = `https://wa.me/977${sellerPhone}?text=${whatsappMessage}`;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: `Please log in first to add "${currentBook.title}" to your cart.`,
        },
      });
      return;
    }
    onAddToCart(currentBook);
    setToastMessage(`Added "${currentBook.title}" to your cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: `Please log in first to buy "${currentBook.title}".`,
        },
      });
      return;
    }
    onAddToCart(currentBook);
    alert('Proceeding to checkout with ' + currentBook.title);
  };

  return (
    <div className="bg-cream-bg min-h-screen py-8 sm:py-12">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-brown text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 text-xs sm:text-sm text-stone-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 font-bold text-primary-brown hover:text-accent-coral transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:underline">Catalog</Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold truncate max-w-xs">{currentBook.category}</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: Image Gallery ================= */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Preview Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-primary-brown/15 shadow-xl flex items-center justify-center group">
              <img
                src={images[selectedImage] || images[0]}
                alt={currentBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-dark-green text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {currentBook.condition}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-accent-coral text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? 'border-primary-brown ring-2 ring-primary-brown/30 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-light-cream/70 border border-primary-brown/15 text-center text-xs text-stone-700">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-dark-green" />
                <span className="font-bold">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-dark-green" />
                <span className="font-bold">Nepal Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-dark-green" />
                <span className="font-bold">Easy Exchange</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Details & Actions ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Status */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-coral bg-rose-50 border border-accent-coral/20 px-3 py-1 rounded-full">
                {currentBook.category}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Listing ID: {currentBook._id.slice(-6)}
              </span>
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {currentBook.title}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 mt-2">
                Written by <strong className="text-primary-brown font-bold">{currentBook.author}</strong>
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-white border border-primary-brown/15 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-primary-brown">
                  Rs. {currentBook.sellingPrice}
                </span>
                {currentBook.originalPrice && currentBook.originalPrice > currentBook.sellingPrice && (
                  <span className="text-base text-stone-400 line-through">
                    Rs. {currentBook.originalPrice}
                  </span>
                )}
              </div>

              {discountAmount > 0 && (
                <p className="text-xs text-emerald-700 font-bold">
                  You save Rs. {discountAmount} ({discountPercent}% discount compared to bookstore MRP)
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                Book Condition & Summary
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-white/60 p-4 rounded-2xl border border-light-cream">
                {currentBook.description ||
                  'Verified second-hand copy inspected for page completeness and clean binding. Great for exam preparation and personal reading.'}
              </p>
            </div>

            {/* Seller Profile Snippet */}
            <div className="p-4 rounded-2xl bg-light-cream/60 border border-primary-brown/15 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-brown text-cream-bg flex items-center justify-center font-bold text-lg shadow-sm">
                  {currentBook.sellerId?.name ? currentBook.sellerId.name[0] : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900">
                      {currentBook.sellerId?.name || 'SMARTKITAB Verified Seller'}
                    </span>
                    <UserCheck className="w-4 h-4 text-dark-green" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{currentBook.sellerId?.address?.city || 'Kathmandu, Nepal'}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-dark-green bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full">
                Active Student Seller
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-xl font-extrabold text-sm text-primary-brown bg-light-cream hover:bg-[#e9decd] border-2 border-primary-brown shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-primary-brown hover:bg-[#603f29] shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct WhatsApp Chat with Seller Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-[#25D366] hover:bg-[#1EBE5D] shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Chat with Seller on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

