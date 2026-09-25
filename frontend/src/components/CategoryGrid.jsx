import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Compass,
  Stethoscope,
  GraduationCap,
  Languages,
  School,
  Library,
  Layers,
  BookMarked,
  Sparkles,
  Flame,
  Award,
  Globe,
  Cpu,
  Calculator,
  Lightbulb,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICON_MAP = {
  BookOpen,
  Bookmark,
  Compass,
  Stethoscope,
  GraduationCap,
  Languages,
  School,
  Library,
  Layers,
  BookMarked,
  Sparkles,
  Flame,
  Award,
  Globe,
  Cpu,
  Calculator,
  Lightbulb,
};

const fallbackCategories = [
  { name: 'Novels', icon: 'BookOpen', description: 'Fiction & Literature' },
  { name: 'Pocket Books', icon: 'Bookmark', description: 'Quick Reads' },
  { name: 'Engineering', icon: 'Compass', description: 'IOE & Technical' },
  { name: 'Medical', icon: 'Stethoscope', description: 'MBBS & Nursing' },
  { name: 'SEE Prep', icon: 'GraduationCap', description: 'Class 10 Board' },
  { name: 'IELTS & Language', icon: 'Languages', description: 'Test Prep' },
  { name: 'Grade 10', icon: 'School', description: 'Secondary School' },
  { name: 'Grade 11', icon: 'Library', description: 'Higher Secondary' },
  { name: 'Grade 12', icon: 'Layers', description: 'Board Exams' },
  { name: 'Bachelor Courses', icon: 'BookMarked', description: 'University' },
];

export default function CategoryGrid({ onSelectCategory }) {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const rawCategories = settings?.categories && settings.categories.length > 0
    ? settings.categories
    : fallbackCategories;

  const displayCategories = rawCategories
    .filter((c) => c.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleCategoryClick = (categoryName, e) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="bg-cream-bg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-coral bg-rose-50 border border-accent-coral/20 px-3 py-1 rounded-full">
            Browse by Subject
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-brown mt-3 tracking-tight">
            Explore Popular Categories
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Find the exact syllabus textbooks, entrance prep guides, and beloved fiction.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-4">
          {displayCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || BookOpen;
            const targetUrl = `/catalog?category=${encodeURIComponent(cat.name)}`;

            return (
              <a
                key={cat.name}
                href={targetUrl}
                onClick={(e) => handleCategoryClick(cat.name, e)}
                className="group flex flex-col items-center text-center p-1.5 sm:p-2 rounded-2xl hover:bg-light-cream/50 transition-all duration-200 cursor-pointer"
              >
                {/* Circular Icon Container */}
                <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-light-cream border-2 border-primary-brown/20 flex items-center justify-center text-primary-brown shadow-xs group-hover:scale-105 group-hover:bg-primary-brown group-hover:text-[#FAF6EF] group-hover:border-primary-brown group-hover:shadow-md transition-all duration-300">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Category Label */}
                <span className="mt-2 text-xs sm:text-sm font-bold text-stone-800 group-hover:text-accent-coral transition-colors leading-snug line-clamp-2">
                  {cat.name}
                </span>

                {/* Subtle Subtitle */}
                <span className="hidden sm:block text-[11px] text-stone-500 line-clamp-1 mt-0.5 opacity-80 group-hover:opacity-100">
                  {cat.description}
                </span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}

