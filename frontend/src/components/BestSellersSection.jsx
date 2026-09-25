import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import BookCard from './BookCard';

const fallbackBestSellers = [
  {
    _id: 'bs-1',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 320,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    _id: 'bs-2',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 260,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    _id: 'bs-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Novels',
    originalPrice: 650,
    sellingPrice: 350,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    _id: 'bs-4',
    title: 'Psychology of Money',
    author: 'Morgan Housel',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 300,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

export default function BestSellersSection({ onAddToCart = () => {} }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get('/api/books?bestseller=true');
        if (response.data?.books && response.data.books.length > 0) {
          if (isMounted) setBooks(response.data.books);
        } else {
          if (isMounted) setBooks(fallbackBestSellers);
        }
      } catch (err) {
        console.warn('Could not load best sellers from API, using fallback data:', err.message);
        if (isMounted) setBooks(fallbackBestSellers);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSlide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-cream-bg py-10 sm:py-14 border-t border-primary-brown/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-coral uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 fill-accent-coral text-accent-coral" />
              <span>High Demand</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-brown tracking-tight">
              Best Sellers
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Popular books students and book lovers are buying right now.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Slider Controls */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => handleSlide('left')}
                aria-label="Slide left"
                className="w-9 h-9 rounded-full bg-light-cream hover:bg-primary-brown hover:text-white border border-primary-brown/20 text-primary-brown flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSlide('right')}
                aria-label="Slide right"
                className="w-9 h-9 rounded-full bg-light-cream hover:bg-primary-brown hover:text-white border border-primary-brown/20 text-primary-brown flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View All Link */}
            <a
              href="/catalog?filter=bestseller"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-brown hover:text-accent-coral transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Horizontal Slider Container */}
        {loading ? (
          <div className="flex gap-3.5 sm:gap-5 overflow-hidden py-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-[190px] sm:w-[250px] h-[350px] sm:h-[380px] shrink-0 bg-light-cream/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-3.5 sm:gap-5 overflow-x-auto scroll-smooth py-2 px-1 -mx-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.map((book) => (
              <div
                key={book._id}
                className="w-[190px] sm:w-[250px] shrink-0 snap-start"
              >
                <BookCard book={book} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

