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
  Clock,
  BookOpen,
  Award,
  Heart,
  Shield,
  User,
  Crown,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FACILITY_ICONS_MAP = {
  FileText,
  Edit3,
  RefreshCw,
  BookMarked,
  Truck,
  Clock,
  BookOpen,
  Sparkles,
  Award,
  Heart,
  Shield,
};

export default function BookCycleBanner({
  onJoinClick = () => {},
  onKnowMoreClick = () => {},
  onGiftClick = () => {},
}) {
  const { settings } = useSiteSettings();
  const bookCycle = settings?.bookCycle || {};

  const rawFacilities =
    bookCycle.facilities && bookCycle.facilities.length > 0
      ? bookCycle.facilities
      : [
          { id: 'fac_1', title: 'Printed Notes', desc: 'Curriculum & syllabus guides', icon: 'FileText', isVisible: true, displayOrder: 1 },
          { id: 'fac_2', title: 'Handwritten Notes', desc: 'Topper study summaries', icon: 'Sparkles', isVisible: true, displayOrder: 2 },
          { id: 'fac_3', title: 'Free BookCycle', desc: 'Read & rotate indefinitely', icon: 'RefreshCw', isVisible: true, displayOrder: 3 },
          { id: 'fac_4', title: 'Book Requests', desc: 'Sourced within 48 hours', icon: 'Clock', isVisible: true, displayOrder: 4 },
          { id: 'fac_5', title: 'Home Delivery', desc: 'Everywhere in Nepal', icon: 'Truck', isVisible: true, displayOrder: 5 },
        ];

  const displayFacilities = rawFacilities
    .filter((f) => f.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const features =
    bookCycle.features && bookCycle.features.length > 0
      ? bookCycle.features
      : [
          'Unlimited BookCycle',
          'Free Delivery on exchanges',
          'Priority Requests for rare titles',
          'Exclusive Discounts on purchases',
        ];

  // Founders & Co-Founders list
  const defaultFounder = {
    id: 'fnd_1',
    name: 'Shraddha',
    role: 'Founder & Community Lead',
    quote:
      "Hi, I'm Shraddha! I founded SMARTKITAB because I watched countless fellow students spend a fortune on semester textbooks they only needed for a few months. Our mission is to make reading and education universally affordable across Nepal by giving every book a second home.",
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80',
    showImage: true,
    isVisible: true,
    displayOrder: 1,
  };

  const rawFounders =
    bookCycle.founders && bookCycle.founders.length > 0
      ? bookCycle.founders
      : bookCycle.founder
      ? [{ ...bookCycle.founder, id: 'fnd_1', isVisible: true, displayOrder: 1 }]
      : [defaultFounder];

  const displayFounders = rawFounders
    .filter((f) => f.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

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
                  {displayFacilities.map((fac, idx) => {
                    const IconComponent = FACILITY_ICONS_MAP[fac.icon] || FileText;
                    return (
                      <div
                        key={fac.id || idx}
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

          {/* 3. RIGHT COLUMN: Meet the Founders / Mission & Story Card */}
          <div className="lg:col-span-4 bg-white border border-primary-brown/15 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    {bookCycle.missionTitle || 'Our Mission & Story'}
                  </span>
                  {bookCycle.missionSubtitle && (
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      {bookCycle.missionSubtitle}
                    </span>
                  )}
                </div>
                <Quote className="w-6 h-6 text-primary-brown/25 shrink-0" />
              </div>

              {/* Founders List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {displayFounders.map((fnd, idx) => {
                  const showPhoto = fnd.showImage !== false && fnd.imageUrl && fnd.imageUrl.trim().length > 0;
                  const initials = (fnd.name || 'F')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={fnd.id || idx}
                      className="p-4 rounded-2xl bg-light-cream/40 border border-primary-brown/10 space-y-3 shadow-2xs hover:bg-light-cream/60 transition"
                    >
                      {/* Founder Profile Avatar / Badge */}
                      <div className="flex items-center gap-3.5">
                        {showPhoto ? (
                          <div className="relative shrink-0">
                            <img
                              src={fnd.imageUrl}
                              alt={`${fnd.name || 'Founder'} - SMARTKITAB`}
                              className="w-13 h-13 rounded-2xl object-cover border-2 border-primary-brown/20 shadow-md"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-dark-green text-white rounded-full flex items-center justify-center border border-white text-[9px] font-bold">
                              ✓
                            </div>
                          </div>
                        ) : null}

                        <div
                          className={`w-13 h-13 rounded-2xl bg-gradient-to-br from-primary-brown to-stone-800 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-primary-brown/20 shrink-0 ${
                            showPhoto ? 'hidden' : 'flex'
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm sm:text-base font-black text-primary-brown truncate">
                              {fnd.name || 'Founder'}
                            </h4>
                            <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          </div>
                          <p className="text-xs text-stone-500 font-medium truncate">
                            {fnd.role || 'Co-Founder'}
                          </p>
                          <span className="text-[10px] text-accent-coral font-bold inline-block">
                            SMARTKITAB Nepal
                          </span>
                        </div>
                      </div>

                      {/* Bio Quote */}
                      {fnd.quote && (
                        <p className="text-stone-700 text-xs sm:text-[13px] italic leading-relaxed">
                          &ldquo;{fnd.quote}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-light-cream">
              <button
                onClick={onKnowMoreClick}
                className="w-full py-2.5 px-4 rounded-xl border border-primary-brown text-primary-brown hover:bg-light-cream active:scale-[0.98] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
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
