import React from 'react';
import {
  BookOpen,
  Users,
  Recycle,
  Heart,
  DollarSign,
  TrendingUp,
  Sparkles,
  Award,
  Shield,
  Star,
  GraduationCap,
  Package,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICON_COMPONENTS = {
  BookOpen,
  Users,
  Recycle,
  Heart,
  DollarSign,
  TrendingUp,
  Sparkles,
  Award,
  Shield,
  Star,
  GraduationCap,
  Package,
};

const COLOR_STYLES = [
  'bg-primary-brown/10 text-primary-brown',
  'bg-dark-green/10 text-dark-green',
  'bg-amber-600/10 text-amber-700',
  'bg-accent-coral/10 text-accent-coral',
  'bg-blue-600/10 text-blue-700',
  'bg-purple-600/10 text-purple-700',
];

export default function MetricsBar() {
  const { settings } = useSiteSettings();

  if (settings?.sections?.showMetricsBar === false) {
    return null;
  }

  const rawMetrics = settings?.metrics || [];
  const displayMetrics = rawMetrics.filter((m) => m.isVisible !== false);

  if (displayMetrics.length === 0) {
    return null;
  }

  return (
    <section className="bg-cream-bg py-6 sm:py-12 border-y border-primary-brown/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className={`grid gap-3 sm:gap-6 ${
            displayMetrics.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : displayMetrics.length === 2
              ? 'grid-cols-2 max-w-2xl mx-auto'
              : displayMetrics.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {displayMetrics.map((item, index) => {
            const IconComponent = ICON_COMPONENTS[item.icon] || BookOpen;
            const colorStyle = COLOR_STYLES[index % COLOR_STYLES.length];

            return (
              <div
                key={item.id || index}
                className="group relative bg-light-cream/70 hover:bg-light-cream border border-primary-brown/15 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110 ${colorStyle}`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-brown/20 group-hover:bg-primary-brown transition-colors"></span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-primary-brown">
                      {item.value}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-stone-900 mt-0.5 sm:mt-1 truncate">
                    {item.label}
                  </h3>
                  <p className="text-[11px] sm:text-xs lg:text-sm text-stone-600 mt-1 leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-none">
                    {item.subtext || item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
