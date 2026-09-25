import React from 'react';
import { Star, Quote, MessageSquareHeart, CheckCircle2, User } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function TestimonialsSection() {
  const { settings } = useSiteSettings();

  if (settings?.sections?.showTestimonials === false) {
    return null;
  }

  const rawTestimonials = settings?.testimonials || [];
  const displayTestimonials = rawTestimonials
    .filter((t) => t.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (displayTestimonials.length === 0) {
    return null;
  }

  // Get initials for avatar placeholder
  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const AVATAR_COLORS = [
    'from-amber-600 to-primary-brown',
    'from-emerald-600 to-dark-green',
    'from-rose-500 to-accent-coral',
    'from-blue-600 to-indigo-700',
    'from-purple-600 to-fuchsia-700',
  ];

  return (
    <section className="bg-[#FAF6EF]/60 py-14 sm:py-20 border-t border-primary-brown/10 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-brown/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-dark-green/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#365314] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-brown tracking-tight">
            What Readers & Students Say
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Real stories from verified buyers, sellers, and BookCycle subscribers across Nepal.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayTestimonials.map((item, idx) => {
            const hasValidPhoto = item.showPhoto !== false && item.photoUrl && item.photoUrl.trim().length > 0;
            const gradientColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-primary-brown/15 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Quote Icon Badge */}
                <div className="absolute top-5 right-5 text-primary-brown/15 group-hover:text-primary-brown/30 transition-colors">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>

                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, sIdx) => {
                      const ratingVal = item.rating || 5;
                      return (
                        <Star
                          key={sIdx}
                          className={`w-4 h-4 ${
                            sIdx < ratingVal
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-200'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Quote Content */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-primary-brown/10">
                  {hasValidPhoto ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-primary-brown/20 shadow-2xs shrink-0"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}

                  {/* Fallback Initials Avatar (shown if showPhoto=false or image missing) */}
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradientColor} text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0 ${
                      hasValidPhoto ? 'hidden' : 'flex'
                    }`}
                  >
                    {getInitials(item.name) || <User className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Reader" />
                    </div>
                    <p className="text-[11px] font-semibold text-primary-brown truncate">
                      {item.role || 'Student'}
                    </p>
                    {item.universityOrCity && (
                      <p className="text-[10px] text-stone-500 truncate mt-0.5">
                        {item.universityOrCity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
