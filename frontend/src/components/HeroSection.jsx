import React from 'react';
import {
  ShoppingBag,
  Tag,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookMarked,
  Star,
} from 'lucide-react';

import { useSiteSettings } from '../context/SiteSettingsContext';

export default function HeroSection({
  onBuyClick = () => {},
  onSellClick = () => {},
  onDonateClick = () => {},
}) {
  const { settings } = useSiteSettings();
  const hero = settings?.hero || {};
  const trustBadges = hero.trustBadges || ['Verified Quality', 'Fast Shipping', 'Fair Resale'];

  return (
    <section className="relative overflow-hidden bg-cream-bg pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-light-cream/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-light-cream border border-primary-brown/15 text-primary-brown text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-accent-coral" />
              <span>{hero.pillText || 'Sustainable Student Book Marketplace'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary-brown tracking-tight leading-[1.18] sm:leading-[1.15]">
              {hero.titlePrefix || 'Smart books.'}{' '}
              <span className="block text-accent-coral underline decoration-light-cream underline-offset-8">
                {hero.titleHighlight || 'Smarter savings.'}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg lg:text-xl text-stone-700 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {hero.subtitle ||
                "Buy verified second-hand books, sell the ones you've finished, or donate to help another student."}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              {/* Buy Books - Primary Brown */}
              <button
                onClick={onBuyClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-white bg-primary-brown hover:bg-[#603f29] shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Buy Books</span>
              </button>

              {/* Sell Books - Accent Coral */}
              <button
                onClick={onSellClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-white bg-accent-coral hover:bg-[#d0694e] shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sell Books</span>
              </button>

              {/* Donate Books - Light Outline */}
              <button
                onClick={onDonateClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-primary-brown border-2 border-primary-brown hover:bg-light-cream shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-accent-coral" />
                <span>Donate Books</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center sm:text-left border-t border-primary-brown/10">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-dark-green shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold text-stone-700">
                  {trustBadges[0] || 'Verified Quality'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-dark-green shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold text-stone-700">
                  {trustBadges[1] || 'Fast Shipping'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-dark-green shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold text-stone-700">
                  {trustBadges[2] || 'Fair Resale'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Book Graphics Widget */}
          <div className="lg:col-span-5 flex justify-center overflow-hidden sm:overflow-visible py-4 sm:py-0">
            <div className="relative w-full max-w-[300px] sm:max-w-[420px] aspect-[4/5] sm:aspect-square flex items-center justify-center">
              
              {/* Back Stacked Book Card (Tilted left) */}
              <div className="absolute w-[72%] h-[80%] bg-gradient-to-br from-[#8C6246] to-[#5C3B24] rounded-2xl shadow-xl -rotate-6 sm:-rotate-10 -translate-x-3 sm:-translate-x-6 -translate-y-3 sm:-translate-y-4 border-2 border-amber-900/40 p-4 flex flex-col justify-between text-amber-100/70 select-none">
                <div className="w-12 h-1 bg-amber-200/40 rounded"></div>
                <div className="text-center font-serif text-xs italic">Classic Edition</div>
              </div>

              {/* Middle Stacked Book Card (Tilted right) */}
              <div className="absolute w-[74%] h-[82%] bg-gradient-to-br from-dark-green to-[#23370D] rounded-2xl shadow-2xl rotate-3 sm:rotate-6 translate-x-3 sm:translate-x-6 -translate-y-1 sm:-translate-y-2 border-2 border-emerald-950/40 p-4 sm:p-5 flex flex-col justify-between text-emerald-100 select-none">
                <div className="flex justify-between items-center text-xs opacity-75 font-mono">
                  <span>CURRICULUM</span>
                  <span>GRADE 11-12</span>
                </div>
                <div className="text-center">
                  <p className="font-serif font-bold text-base tracking-wide">Physics & Mechanics</p>
                  <p className="text-xs opacity-80 mt-1">Verified Academic Copy</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-white/20 px-2 py-0.5 rounded">Rs. 450</span>
                  <span className="line-through opacity-60">Rs. 950</span>
                </div>
              </div>

              {/* Foreground Featured Book Card */}
              <div className="relative w-[76%] h-[84%] bg-white rounded-2xl shadow-2xl border border-primary-brown/15 p-5 flex flex-col justify-between text-stone-800 z-10 transition-transform duration-300 hover:scale-[1.02]">
                {/* Book header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-dark-green bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Like New
                  </span>
                  <div className="flex items-center text-amber-500 text-sm font-bold gap-0.5">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Book Cover Mock Illustration */}
                <div className="my-2 py-6 px-4 bg-gradient-to-b from-light-cream/70 to-light-cream rounded-xl border border-primary-brown/10 text-center flex flex-col items-center justify-center">
                  <BookMarked className="w-10 h-10 text-primary-brown mb-2" />
                  <h3 className="font-serif font-extrabold text-xl text-primary-brown leading-tight">
                    Atomic Habits
                  </h3>
                  <p className="text-sm text-stone-600 mt-0.5">by James Clear</p>
                  <div className="mt-3 inline-block bg-primary-brown/10 text-primary-brown text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Category: Novels
                  </div>
                </div>

                {/* Book Pricing & CTA */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-sm text-stone-400 block line-through">NPR 650</span>
                    <span className="text-2xl font-black text-primary-brown">NPR 350</span>
                  </div>
                  <span className="text-sm font-bold text-accent-coral bg-rose-50 px-2.5 py-1 rounded-lg border border-accent-coral/20">
                    46% OFF
                  </span>
                </div>
              </div>

              {/* Floating Badge: "Read more, pay less." */}
              <div className="absolute -bottom-4 sm:-bottom-6 left-4 sm:left-2 z-20 bg-primary-brown text-cream-bg py-2 px-4 rounded-xl shadow-xl border-2 border-white flex items-center gap-2 animate-bounce duration-1000">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  Read more, pay less.
                </span>
              </div>

              {/* Floating Pill: Verified Student Exchange */}
              <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-sm text-dark-green py-1.5 px-3 rounded-full shadow-lg border border-dark-green/20 flex items-center gap-1.5 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-dark-green" />
                <span>Verified Quality</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

