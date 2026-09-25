import React from 'react';
import { BookOpen, Users, Recycle, Heart } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const METRIC_ICONS = [
  {
    icon: BookOpen,
    iconBg: 'bg-primary-brown/10 text-primary-brown',
  },
  {
    icon: Users,
    iconBg: 'bg-dark-green/10 text-dark-green',
  },
  {
    icon: Recycle,
    iconBg: 'bg-amber-600/10 text-amber-700',
  },
  {
    icon: Heart,
    iconBg: 'bg-accent-coral/10 text-accent-coral',
  },
];

export default function MetricsBar() {
  const { settings } = useSiteSettings();
  const rawMetrics = settings?.metrics || [];

  return (
    <section className="bg-cream-bg py-6 sm:py-12 border-y border-primary-brown/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {rawMetrics.map((item, index) => {
            const iconConfig = METRIC_ICONS[index % METRIC_ICONS.length];
            const IconComponent = iconConfig.icon;

            return (
              <div
                key={item.id || index}
                className="group relative bg-light-cream/70 hover:bg-light-cream border border-primary-brown/15 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110 ${iconConfig.iconBg}`}
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
