import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle2, Bookmark, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookCard({ book, onAddToCart = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!book) return null;

  const {
    _id,
    title = 'Untitled Book',
    author = 'Unknown Author',
    category = 'Novels',
    originalPrice,
    sellingPrice = 0,
    condition = 'Good Condition',
    images = [],
  } = book;

  const coverImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const discountPercent =
    originalPrice && originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const getConditionStyle = (cond) => {
    switch (cond) {
      case 'Like New':
        return 'bg-emerald-50 text-dark-green border-emerald-300';
      case 'Good Condition':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Fair Condition':
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-primary-brown/15 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Top Image Section */}
      <Link
        to={`/book/${_id || 'sample-detail-1'}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-light-cream/50 flex items-center justify-center block"
      >
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Condition Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${getConditionStyle(
              condition
            )}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {condition}
          </span>
        </div>

        {/* Discount Badge (Top Right) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-accent-coral text-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          </div>
        )}
      </Link>

      {/* Book Details Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-dark-green/80 mb-0.5 sm:mb-1 inline-block truncate max-w-full">
            {category}
          </span>

          {/* Title */}
          <h3
            title={title}
            className="font-bold text-stone-900 text-sm sm:text-lg leading-snug line-clamp-2 group-hover:text-primary-brown transition-colors"
          >
            <Link to={`/book/${_id || 'sample-detail-1'}`} className="hover:underline">
              {title}
            </Link>
          </h3>

          {/* Author */}
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1 line-clamp-1">
            by {author}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2.5 sm:pt-4 mt-1.5 sm:mt-2 border-t border-light-cream/80">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-base sm:text-xl font-black text-primary-brown">
              Rs. {sellingPrice}
            </span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-xs sm:text-sm text-stone-400 line-through truncate">
                Rs. {originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAuthenticated) {
                navigate('/login', {
                  state: {
                    from: location,
                    message: `Please log in first to buy "${title}".`,
                  },
                });
                return;
              }
              onAddToCart(book);
            }}
            className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-primary-brown hover:bg-[#603f29] active:scale-[0.98] text-cream-bg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

