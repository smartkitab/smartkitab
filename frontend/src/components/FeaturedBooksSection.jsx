import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import BookCard from './BookCard';

const fallbackBooks = [
  {
    _id: 'fb-1',
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
    _id: 'fb-2',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Novels',
    originalPrice: 500,
    sellingPrice: 250,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    _id: 'fb-3',
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
  {
    _id: 'fb-4',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 280,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

export default function FeaturedBooksSection({ onAddToCart = () => {} }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get('/api/books?featured=true');
        if (response.data?.books && response.data.books.length > 0) {
          if (isMounted) setBooks(response.data.books);
        } else {
          if (isMounted) setBooks(fallbackBooks);
        }
      } catch (err) {
        console.warn('Could not load featured books from API, using fallback data:', err.message);
        if (isMounted) setBooks(fallbackBooks);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-cream-bg py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-coral uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-brown tracking-tight">
              Featured Books
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Verified second-hand books in top condition, ready to ship.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full bg-light-cream hover:bg-primary-brown hover:text-white border border-primary-brown/20 text-primary-brown flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full bg-light-cream hover:bg-primary-brown hover:text-white border border-primary-brown/20 text-primary-brown flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View All Link */}
            <a
              href="/catalog?filter=featured"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-brown hover:text-accent-coral transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
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
            ref={scrollRef}
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

