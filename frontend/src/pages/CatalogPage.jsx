import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ChevronDown,
  BookOpen,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import BookCard from '../components/BookCard';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_CATEGORIES = [
  'Novels',
  'Pocket Books',
  'Engineering',
  'Medical',
  'SEE Prep',
  'IELTS & Language',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Bachelor Courses',
];

const CONDITIONS = ['Like New', 'Good Condition', 'Fair Condition'];

const fallbackBooks = [
  {
    _id: 'cat-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Novels',
    originalPrice: 650,
    sellingPrice: 350,
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-2',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Novels',
    originalPrice: 500,
    sellingPrice: 250,
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-3',
    title: 'Psychology of Money',
    author: 'Morgan Housel',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 300,
    condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-4',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 280,
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-5',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 320,
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-6',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 260,
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date().toISOString(),
  },
];

export default function CatalogPage({ onAddToCart = () => {} }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSiteSettings();

  const dynamicCategories = useMemo(() => {
    if (settings?.categories && settings.categories.length > 0) {
      return settings.categories
        .filter((c) => c.isVisible !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((c) => c.name);
    }
    return DEFAULT_CATEGORIES;
  }, [settings?.categories]);

  // State from query parameters
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-low' | 'price-high'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize when URL search parameters change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && !selectedCategories.includes(cat)) {
      setSelectedCategories([cat]);
    }
  }, [searchParams]);

  // Fetch Books from Backend
  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategories.length === 1) {
          params.append('category', selectedCategories[0]);
        }
        if (selectedCondition) {
          params.append('condition', selectedCondition);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        if (maxPrice < 2000) {
          params.append('maxPrice', maxPrice);
        }

        const res = await axios.get(`/api/books?${params.toString()}`);
        if (isMounted) {
          if (res.data?.books && res.data.books.length > 0) {
            setBooks(res.data.books);
          } else {
            // If backend has no matching entries or empty seed, use fallback
            setBooks(fallbackBooks);
          }
        }
      } catch (err) {
        console.warn('Failed to load books from backend, using fallback data:', err.message);
        if (isMounted) setBooks(fallbackBooks);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [selectedCategories, selectedCondition, searchQuery, maxPrice]);

  // Category Checkbox Toggle
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Reset Filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCondition('');
    setMaxPrice(2000);
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter & Sort Logic (Client-side refinement)
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Category filtering
    if (selectedCategories.length > 0) {
      result = result.filter((b) => selectedCategories.includes(b.category));
    }

    // Condition filtering
    if (selectedCondition) {
      result = result.filter((b) => b.condition === selectedCondition);
    }

    // Price filtering
    result = result.filter((b) => (b.sellingPrice || 0) <= maxPrice);

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.sellingPrice - b.sellingPrice;
      }
      if (sortBy === 'price-high') {
        return b.sellingPrice - a.sellingPrice;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [books, selectedCategories, selectedCondition, maxPrice, searchQuery, sortBy]);

  return (
    <div className="bg-cream-bg min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-primary-brown tracking-tight">
            Book Catalog
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Browse verified second-hand textbooks, exam prep notes, and novels across Nepal.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR FILTERS (Desktop) ================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-light-cream/70 border border-primary-brown/15 rounded-3xl p-6 shadow-xs sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-primary-brown/10">
              <div className="flex items-center gap-2 font-bold text-primary-brown">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-accent-coral hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Categories
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dynamicCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800 hover:text-primary-brown cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded text-primary-brown focus:ring-primary-brown border-primary-brown/30 accent-primary-brown"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Condition Filter */}
            <div className="pt-4 border-t border-primary-brown/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Condition
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === ''}
                    onChange={() => setSelectedCondition('')}
                    className="accent-primary-brown"
                  />
                  <span>All Conditions</span>
                </label>
                {CONDITIONS.map((cond) => (
                  <label
                    key={cond}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === cond}
                      onChange={() => setSelectedCondition(cond)}
                      className="accent-primary-brown"
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Price Range Slider */}
            <div className="pt-4 border-t border-primary-brown/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Max Price
                </h3>
                <span className="text-sm font-black text-primary-brown">
                  Rs. {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-brown cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                <span>Rs. 100</span>
                <span>Rs. 2,000+</span>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN SECTION ================= */}
          <section className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar: Search, Results Count, Sorting */}
            <div className="bg-white border border-primary-brown/15 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search in catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-light-cream/50 border border-primary-brown/20 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-primary-brown focus:border-primary-brown transition"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary-brown/60" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Controls Group */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-light-cream border border-primary-brown/20 text-xs font-bold text-primary-brown cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <span className="text-xs font-medium text-stone-500">
                  Showing <strong className="text-stone-800">{filteredAndSortedBooks.length}</strong> books
                </span>

                {/* Sorting Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-xs font-bold text-primary-brown bg-light-cream/60 hover:bg-light-cream border border-primary-brown/20 rounded-xl focus:outline-none focus:border-primary-brown cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-primary-brown absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter badges */}
            {(selectedCategories.length > 0 || selectedCondition || searchQuery || maxPrice < 2000) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-stone-500 font-semibold">Active:</span>
                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 bg-light-cream border border-primary-brown/20 text-primary-brown text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {c}
                    <button onClick={() => toggleCategory(c)} className="hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedCondition && (
                  <span className="inline-flex items-center gap-1 bg-light-cream border border-primary-brown/20 text-primary-brown text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {selectedCondition}
                    <button onClick={() => setSelectedCondition('')} className="hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {maxPrice < 2000 && (
                  <span className="inline-flex items-center gap-1 bg-light-cream border border-primary-brown/20 text-primary-brown text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Up to Rs. {maxPrice}
                    <button onClick={() => setMaxPrice(2000)} className="hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-accent-coral underline font-bold ml-1 hover:text-[#c45f45]"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ================= BOOK CARD GRID ================= */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-72 sm:h-80 bg-light-cream/60 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredAndSortedBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {filteredAndSortedBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-primary-brown/15 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-light-cream text-primary-brown mx-auto flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary-brown">
                  No books found
                </h3>
                <p className="text-sm text-stone-600 max-w-sm mx-auto">
                  Try adjusting your category filter, resetting price limits, or searching with another keyword.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-primary-brown text-white text-sm font-bold shadow hover:bg-[#603f29] transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </section>

        </div>

      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-cream-bg h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-primary-brown/20">
                <span className="font-extrabold text-primary-brown text-lg">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-light-cream"
                >
                  <X className="w-6 h-6 text-stone-600" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Categories
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {dynamicCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm text-stone-800">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-primary-brown"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="pt-4 border-t border-primary-brown/15">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Condition
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-stone-800">
                    <input
                      type="radio"
                      name="m-condition"
                      checked={selectedCondition === ''}
                      onChange={() => setSelectedCondition('')}
                      className="accent-primary-brown"
                    />
                    <span>All Conditions</span>
                  </label>
                  {CONDITIONS.map((cond) => (
                    <label key={cond} className="flex items-center gap-2 text-sm text-stone-800">
                      <input
                        type="radio"
                        name="m-condition"
                        checked={selectedCondition === cond}
                        onChange={() => setSelectedCondition(cond)}
                        className="accent-primary-brown"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-primary-brown/15">
                <div className="flex justify-between text-xs font-bold text-stone-800 mb-2">
                  <span>Max Price</span>
                  <span className="text-primary-brown">Rs. {maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-brown"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-primary-brown/15 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl border border-primary-brown text-primary-brown font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary-brown text-white font-bold text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

