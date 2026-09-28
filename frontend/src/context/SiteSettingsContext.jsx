import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SiteSettingsContext = createContext(null);

export const DEFAULT_SITE_SETTINGS = {
  announcement: {
    enabled: true,
    badge: 'Offer',
    text: 'Read More. Pay Less. • Save up to 70% on curriculum & literature books!',
    rightNotice: 'Verified Book Quality Guarantee • Kathmandu Valley & Nationwide Delivery',
  },
  hero: {
    pillText: 'Sustainable Student Book Marketplace',
    titlePrefix: 'Smart books.',
    titleHighlight: 'Smarter savings.',
    subtitle:
      "Buy verified second-hand books, sell the ones you've finished, or donate to help another student.",
    trustBadges: ['Verified Quality', 'Fast Shipping', 'Fair Resale'],
  },
  metrics: [
    {
      id: 'books_count',
      value: '20,000+',
      label: 'Books Available',
      subtext: 'Curriculum & fiction in stock',
    },
    {
      id: 'students_served',
      value: '12,000+',
      label: 'Students Served',
      subtext: 'Across universities & schools',
    },
    {
      id: 'money_saved',
      value: 'Rs. 15 Lakhs+',
      label: 'Saved on Books',
      subtext: 'Versus new bookstore MRP',
    },
    {
      id: 'delivery_hubs',
      value: '50+',
      label: 'Campus Delivery Hubs',
      subtext: 'Fast dropoff across Nepal',
    },
  ],
  bookCycle: {
    missionTitle: 'Our Mission & Story',
    missionSubtitle: 'Making education & reading universally accessible across Nepal.',
    membershipPrice: 200,
    membershipPeriod: '/ month',
    tagline:
      'Read as many books as you like without purchasing every title. Return and rotate whenever you finish.',
    features: [
      'Unlimited BookCycle',
      'Free Delivery on exchanges',
      'Priority Requests for rare titles',
      'Exclusive Discounts on purchases',
    ],
    facilities: [
      { id: 'fac_1', title: 'Printed Notes', desc: 'Curriculum & syllabus guides', icon: 'FileText', isVisible: true, displayOrder: 1 },
      { id: 'fac_2', title: 'Handwritten Notes', desc: 'Topper study summaries', icon: 'Sparkles', isVisible: true, displayOrder: 2 },
      { id: 'fac_3', title: 'Free BookCycle', desc: 'Read & rotate indefinitely', icon: 'RefreshCw', isVisible: true, displayOrder: 3 },
      { id: 'fac_4', title: 'Book Requests', desc: 'Sourced within 48 hours', icon: 'Clock', isVisible: true, displayOrder: 4 },
      { id: 'fac_5', title: 'Home Delivery', desc: 'Everywhere in Nepal', icon: 'Truck', isVisible: true, displayOrder: 5 },
    ],
    founder: {
      name: 'Shraddha',
      role: 'Founder & Community Lead',
      quote:
        "Hi, I'm Shraddha! I founded SMARTKITAB because I watched countless fellow students spend a fortune on semester textbooks they only needed for a few months. Our mission is to make reading and education universally affordable across Nepal by giving every book a second home.",
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80',
      showImage: true,
    },
  },
  contact: {
    email: 'support@smartkitab.com',
    phone: '+977 9800000000',
    address: 'Putalisadak, Kathmandu, Nepal',
    tagline: 'Read More. Pay Less. • Saving Trees, Saving Money',
    bio: "Nepal's circular second-hand book marketplace. We empower students and book enthusiasts to buy, sell, and donate verified curriculum and literary books at honest, student-friendly prices.",
    copyright: '© 2026 SMARTKITAB Nepal. All rights reserved.',
  },
  commerce: {
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 50,
  },
  sections: {
    showAnnouncement: true,
    showHero: true,
    showMetricsBar: true,
    showCategoryGrid: true,
    showFeaturedBooks: true,
    showBestSellers: true,
    showBookCycle: true,
    showTestimonials: true,
  },
  categories: [
    { id: 'novels', name: 'Novels', description: 'Fiction & Literature', icon: 'BookOpen', isVisible: true, displayOrder: 1 },
    { id: 'pocket_books', name: 'Pocket Books', description: 'Quick Reads', icon: 'Bookmark', isVisible: true, displayOrder: 2 },
    { id: 'engineering', name: 'Engineering', description: 'IOE & Technical', icon: 'Compass', isVisible: true, displayOrder: 3 },
    { id: 'medical', name: 'Medical', description: 'MBBS & Nursing', icon: 'Stethoscope', isVisible: true, displayOrder: 4 },
    { id: 'see_prep', name: 'SEE Prep', description: 'Class 10 Board', icon: 'GraduationCap', isVisible: true, displayOrder: 5 },
    { id: 'ielts_language', name: 'IELTS & Language', description: 'Test Prep', icon: 'Languages', isVisible: true, displayOrder: 6 },
    { id: 'grade_10', name: 'Grade 10', description: 'Secondary School', icon: 'School', isVisible: true, displayOrder: 7 },
    { id: 'grade_11', name: 'Grade 11', description: 'Higher Secondary', icon: 'Library', isVisible: true, displayOrder: 8 },
    { id: 'grade_12', name: 'Grade 12', description: 'Board Exams', icon: 'Layers', isVisible: true, displayOrder: 9 },
    { id: 'bachelor_courses', name: 'Bachelor Courses', description: 'University', icon: 'BookMarked', isVisible: true, displayOrder: 10 },
  ],
  testimonials: [
    {
      id: 'test_1',
      name: 'Aarav Sharma',
      role: 'Engineering Student',
      universityOrCity: 'IOE Pulchowk Campus',
      quote:
        'SMARTKITAB saved me over Rs. 8,000 in my 3rd semester textbooks alone! The condition was clean and delivery arrived in 24 hours.',
      rating: 5,
      showPhoto: true,
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
      isVisible: true,
      displayOrder: 1,
    },
    {
      id: 'test_2',
      name: 'Sneha Shrestha',
      role: 'Medical Student',
      universityOrCity: 'Kathmandu University (KUMS)',
      quote:
        'Buying new MBBS reference books every year was crushing my budget. BookCycle and verified second-hand listings make study affordable.',
      rating: 5,
      showPhoto: true,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      isVisible: true,
      displayOrder: 2,
    },
    {
      id: 'test_3',
      name: 'Bibek Adhikari',
      role: 'BBA Graduate',
      universityOrCity: 'Pokhara University',
      quote:
        'I listed 6 books from my previous semester on SMARTKITAB and sold 4 of them in under a week. Quick payout and super seamless process!',
      rating: 5,
      showPhoto: false,
      photoUrl: '',
      isVisible: true,
      displayOrder: 3,
    },
    {
      id: 'test_4',
      name: 'Pooja K.C.',
      role: 'High School Student',
      universityOrCity: "St. Xavier's College, Maitighar",
      quote:
        'The book condition verification is 100% accurate. My Grade 12 physics and chemistry books had zero torn pages and clean highlights.',
      rating: 5,
      showPhoto: true,
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      isVisible: true,
      displayOrder: 4,
    },
  ],
  socialLinks: {
    facebook: { enabled: true, url: 'https://facebook.com/smartkitab' },
    instagram: { enabled: true, url: 'https://instagram.com/smartkitab' },
    tiktok: { enabled: true, url: 'https://tiktok.com/@smartkitab' },
    youtube: { enabled: true, url: 'https://youtube.com/@smartkitab' },
    whatsapp: { enabled: true, url: 'https://wa.me/9779800000000', phoneNumber: '+977 9800000000' },
  },
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get('/api/site-settings');
      if (res.data?.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
          announcement: { ...prev.announcement, ...(res.data.settings.announcement || {}) },
          hero: { ...prev.hero, ...(res.data.settings.hero || {}) },
          metrics:
            Array.isArray(res.data.settings.metrics) && res.data.settings.metrics.length > 0
              ? res.data.settings.metrics
              : prev.metrics,
          bookCycle: {
            ...prev.bookCycle,
            ...(res.data.settings.bookCycle || {}),
            facilities:
              Array.isArray(res.data.settings.bookCycle?.facilities) &&
              res.data.settings.bookCycle.facilities.length > 0
                ? res.data.settings.bookCycle.facilities
                : prev.bookCycle.facilities,
            founder: {
              ...prev.bookCycle.founder,
              ...(res.data.settings.bookCycle?.founder || {}),
            },
          },
          contact: { ...prev.contact, ...(res.data.settings.contact || {}) },
          commerce: { ...prev.commerce, ...(res.data.settings.commerce || {}) },
          sections: { ...prev.sections, ...(res.data.settings.sections || {}) },
          categories:
            Array.isArray(res.data.settings.categories) && res.data.settings.categories.length > 0
              ? res.data.settings.categories
              : prev.categories,
          testimonials:
            Array.isArray(res.data.settings.testimonials) && res.data.settings.testimonials.length > 0
              ? res.data.settings.testimonials
              : prev.testimonials,
          socialLinks: {
            ...prev.socialLinks,
            ...(res.data.settings.socialLinks || {}),
          },
        }));
      }
    } catch (err) {
      console.warn('Using default site settings:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Admin update handler
  const updateSettings = async (updatedFields) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/admin/site-settings', updatedFields, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
        }));
      }
      return { success: true, message: 'Settings updated successfully!' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update settings';
      return { success: false, message };
    }
  };

  // Admin reset handler
  const resetSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/admin/site-settings/reset',
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.settings) {
        setSettings(res.data.settings);
      } else {
        setSettings(DEFAULT_SITE_SETTINGS);
      }
      return { success: true, message: 'Settings restored to factory defaults!' };
    } catch (err) {
      setSettings(DEFAULT_SITE_SETTINGS);
      return { success: true, message: 'Settings restored to defaults (local)!' };
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    resetSettings,
    refreshSettings: fetchSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    // Return safe default object if used outside provider
    return {
      settings: DEFAULT_SITE_SETTINGS,
      loading: false,
      updateSettings: async () => ({ success: false, message: 'Context not mounted' }),
      resetSettings: async () => ({ success: false, message: 'Context not mounted' }),
      refreshSettings: () => {},
    };
  }
  return context;
}

export default SiteSettingsContext;

