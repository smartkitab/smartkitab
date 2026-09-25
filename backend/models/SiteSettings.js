import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    // 1. Top Announcement Bar
    announcement: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: 'Offer' },
      text: {
        type: String,
        default: 'Read More. Pay Less. • Save up to 70% on curriculum & literature books!',
      },
      rightNotice: {
        type: String,
        default: 'Verified Book Quality Guarantee • Kathmandu Valley & Nationwide Delivery',
      },
    },

    // 2. Hero Section Copy & Badges
    hero: {
      pillText: {
        type: String,
        default: 'Sustainable Student Book Marketplace',
      },
      titlePrefix: {
        type: String,
        default: 'Smart books.',
      },
      titleHighlight: {
        type: String,
        default: 'Smarter savings.',
      },
      subtitle: {
        type: String,
        default:
          "Buy verified second-hand books, sell the ones you've finished, or donate to help another student.",
      },
      trustBadges: {
        type: [String],
        default: ['Verified Quality', 'Fast Shipping', 'Fair Resale'],
      },
    },

    // 3. Platform Impact Metrics (e.g. 20k books, 12k students served, etc.)
    metrics: {
      type: [
        {
          id: { type: String, required: true },
          value: { type: String, required: true },
          label: { type: String, required: true },
          subtext: { type: String, required: true },
        },
      ],
      default: [
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
    },

    // 4. BookCycle & Founder Story
    bookCycle: {
      membershipPrice: { type: Number, default: 200 },
      membershipPeriod: { type: String, default: '/ month' },
      tagline: { type: String, default: 'Read as many books as you like without purchasing every title. Return and rotate whenever you finish.' },
      features: {
        type: [String],
        default: [
          'Unlimited BookCycle',
          'Free Delivery on exchanges',
          'Priority Requests for rare titles',
          'Exclusive Discounts on purchases',
        ],
      },
      facilities: {
        type: [
          {
            title: { type: String, required: true },
            desc: { type: String, required: true },
          },
        ],
        default: [
          { title: 'Printed Notes', desc: 'Curriculum & syllabus guides' },
          { title: 'Handwritten Notes', desc: 'Topper study summaries' },
          { title: 'Free BookCycle', desc: 'Read & rotate indefinitely' },
          { title: 'Book Requests', desc: 'Sourced within 48 hours' },
          { title: 'Home Delivery', desc: 'Everywhere in Nepal' },
        ],
      },
      founder: {
        name: { type: String, default: 'Shraddha' },
        role: { type: String, default: 'Founder & Community Lead' },
        quote: {
          type: String,
          default:
            "Hi, I'm Shraddha! I founded SMARTKITAB because I watched countless fellow students spend a fortune on semester textbooks they only needed for a few months. Our mission is to make reading and education universally affordable across Nepal by giving every book a second home.",
        },
        imageUrl: {
          type: String,
          default:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80',
        },
      },
    },

    // 5. Contact & Footer Details
    contact: {
      email: { type: String, default: 'support@smartkitab.com' },
      phone: { type: String, default: '+977 9800000000' },
      address: { type: String, default: 'Putalisadak, Kathmandu, Nepal' },
      tagline: {
        type: String,
        default: 'Read More. Pay Less. • Saving Trees, Saving Money',
      },
      bio: {
        type: String,
        default:
          "Nepal's circular second-hand book marketplace. We empower students and book enthusiasts to buy, sell, and donate verified curriculum and literary books at honest, student-friendly prices.",
      },
      copyright: {
        type: String,
        default: '© 2026 SMARTKITAB Nepal. All rights reserved.',
      },
    },

    // 6. Commerce & Delivery Rules
    commerce: {
      freeDeliveryThreshold: { type: Number, default: 500 },
      standardDeliveryFee: { type: Number, default: 50 },
    },

    // 7. Homepage Section Visibility Controls
    sections: {
      showAnnouncement: { type: Boolean, default: true },
      showHero: { type: Boolean, default: true },
      showMetricsBar: { type: Boolean, default: true },
      showCategoryGrid: { type: Boolean, default: true },
      showFeaturedBooks: { type: Boolean, default: true },
      showBestSellers: { type: Boolean, default: true },
      showBookCycle: { type: Boolean, default: true },
    },

    // 8. Dynamic Categories (manageable via CMS)
    categories: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          description: { type: String, default: '' },
          icon: { type: String, default: 'BookOpen' },
          isVisible: { type: Boolean, default: true },
          displayOrder: { type: Number, default: 0 },
        },
      ],
      default: [
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
    },
  },
  { timestamps: true }
);

// Helper method to retrieve or initialize singleton settings document
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;

