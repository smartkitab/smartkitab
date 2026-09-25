import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Gift,
  FileText,
  Edit3,
  RefreshCw,
  BookMarked,
  Truck,
  Quote,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FACILITY_ICONS = [FileText, Edit3, RefreshCw, BookMarked, Truck];

export default function BookCycleBanner({
  onJoinClick = () => {},
  onKnowMoreClick = () => {},
  onGiftClick = () => {},
}) {
  const { settings } = useSiteSettings();
  const bookCycle = settings?.bookCycle || {};
  const founder = bookCycle.founder || {};

  const facilities = bookCycle.facilities && bookCycle.facilities.length > 0
    ? bookCycle.facilities
    : [
        { title: 'Printed Notes', desc: 'Curriculum & syllabus guides' },
        { title: 'Handwritten Notes', desc: 'Topper study summaries' },
        { title: 'Free BookCycle', desc: 'Read & rotate indefinitely' },
        { title: 'Book Requests', desc: 'Sourced within 48 hours' },
        { title: 'Home Delivery', desc: 'Everywhere in Nepal' },
      ];

  const features = bookCycle.features && bookCycle.features.length > 0
    ? bookCycle.features
    : [
        'Unlimited BookCycle',
        'Free Delivery on exchanges',
        'Priority Requests for rare titles',
        'Exclusive Discounts on purchases',
      ];

  return (
    <section className="bg-cream-bg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-green bg-emerald-100/60 border border-emerald-300/60 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-dark-green" />
            <span>Circular Reading Community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-brown tracking-tight">
            Read Smarter with SMARTKITAB Programs
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Access unlimited rotating books, exclusive student facilities, and sustainable learning.
          </p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. LEFT COLUMN: BookCycle Membership Box */}
          <div className="lg:col-span-4 bg-gradient-to-br from-primary-brown via-[#6c4830] to-[#4e311f] text-cream-bg rounded-3xl p-7 shadow-xl flex flex-col justify-between relative overflow-hidden border-2 border-primary-brown">
            {/* Background ambient lighting */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-accent-coral/20 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 bg-accent-coral text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm mb-4">
                <RefreshCw className="w-3.5 h-3.5 animate-spin duration-3000" />
                <span>Unlimited Pass</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                BookCycle Membership
              </h3>
              <p className="text-amber-100/90 text-sm sm:text-base mt-1.5 leading-relaxed">
                {bookCycle.tagline ||
                  'Read as many books as you like without purchasing every title. Return and rotate whenever you finish.'}
              </p>

              {/* Pricing Display */}
              <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-xs text-amber-200/90 font-medium block">Subscription plan</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Rs. {bookCycle.membershipPrice ?? 200}
                  </span>
                  <span className="text-amber-200/80 text-sm font-semibold">
                    {bookCycle.membershipPeriod || '/ month'}
                  </span>
                </div>
              </div>

              {/* Feature Bullet List */}
              <ul className="mt-6 space-y-3 text-sm">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-amber-50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                onClick={onJoinClick}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-accent-coral hover:bg-[#d0694e] active:scale-[0.98] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join BookCycle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. MIDDLE COLUMN: Our Facilities & Smart Gifting */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            
            {/* Our Facilities List Card */}
            <div className="bg-light-cream/80 border border-primary-brown/15 rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-primary-brown tracking-tight">
                    Our Facilities
                  </h3>
                  <span className="text-xs font-bold text-dark-green bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    Student Perks
                  </span>
                </div>

                <div className="space-y-3">
                  {facilities.map((fac, idx) => {
                    const IconComponent = FACILITY_ICONS[idx % FACILITY_ICONS.length];
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-2.5 rounded-xl bg-white/70 hover:bg-white border border-primary-brown/10 transition duration-150 shadow-2xs"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-brown/10 text-primary-brown flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 leading-tight">
                            {fac.title}
                          </p>
                          <p className="text-xs text-stone-500">{fac.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Smart Gifting Promo Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-accent-coral text-white flex items-center justify-center shrink-0 shadow-md">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-accent-coral uppercase">Smart Gifting</span>
                    <span className="text-xs bg-rose-100 text-accent-coral px-2 py-0.5 rounded font-bold">New</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-stone-900 mt-0.5">
                    Gift a Book Bundle
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                    Delight fellow bookworms with customized packages.
                  </p>
                </div>
              </div>

              <button
                onClick={onGiftClick}
                className="shrink-0 text-xs font-bold text-primary-brown hover:text-accent-coral underline cursor-pointer"
              >
                Send Gift
              </button>
            </div>

          </div>

          {/* 3. RIGHT COLUMN: Meet the Founder Card */}
          <div className="lg:col-span-4 bg-white border border-primary-brown/15 rounded-3xl p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Our Mission & Story
                </span>
                <Quote className="w-6 h-6 text-primary-brown/25" />
              </div>

              {/* Founder Profile Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img
                    src={
                      founder.imageUrl ||
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80'
                    }
                    alt={`${founder.name || 'Shraddha'} - Founder of SMARTKITAB`}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-brown/20 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-dark-green text-white rounded-full flex items-center justify-center border-2 border-white text-xs">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-primary-brown">
                    {founder.name || 'Shraddha'}
                  </h4>
                  <p className="text-sm text-stone-500 font-medium">
                    {founder.role || 'Founder & Community Lead'}
                  </p>
                  <span className="text-xs text-accent-coral font-bold mt-0.5 inline-block">
                    SMARTKITAB Nepal
                  </span>
                </div>
              </div>

              {/* Bio Quote */}
              <div className="relative bg-light-cream/40 p-4 rounded-2xl border border-primary-brown/10 text-stone-700 text-sm sm:text-base italic leading-relaxed">
                &ldquo;{founder.quote ||
                  "Hi, I'm Shraddha! I founded SMARTKITAB because I watched countless fellow students spend a fortune on semester textbooks they only needed for a few months. Our mission is to make reading and education universally affordable across Nepal by giving every book a second home."}&rdquo;
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-light-cream">
              <button
                onClick={onKnowMoreClick}
                className="w-full py-2.5 px-4 rounded-xl border border-primary-brown text-primary-brown hover:bg-light-cream active:scale-[0.98] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
              >
                <span>Know More About Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
