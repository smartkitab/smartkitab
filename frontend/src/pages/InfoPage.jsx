import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  HelpCircle,
  Truck,
  ShieldCheck,
  FileText,
  Lock,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  HeartHandshake,
  Users,
  Award,
  Sparkles,
  Search,
  DollarSign,
  Package,
} from 'lucide-react';

const TABS = [
  { id: 'about', label: 'About Us', icon: Users },
  { id: 'how-it-works', label: 'How It Works', icon: Sparkles },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'delivery-returns', label: 'Delivery & Returns', icon: Truck },
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', icon: Lock },
];

export default function InfoPage({ initialTab = 'about' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on pathname or initialTab
  const getTabFromPath = () => {
    const path = location.pathname.replace('/', '');
    const found = TABS.find((t) => t.id === path);
    return found ? found.id : initialTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [expandedFaq, setExpandedFaq] = useState(0);

  useEffect(() => {
    setActiveTab(getTabFromPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-14 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#365314] bg-emerald-100/60 border border-emerald-300 px-3.5 py-1 rounded-full">
            SMARTKITAB Information & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#795238] mt-3 tracking-tight">
            {TABS.find((t) => t.id === activeTab)?.label || 'Information'}
          </h1>
          <p className="text-stone-600 text-sm mt-2">
            Everything you need to know about buying, selling, delivering, and circular reading on SMARTKITAB.
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 scrollbar-none border-b border-[#F3EBDD]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'bg-white/80 hover:bg-[#F3EBDD] text-stone-700 border border-[#795238]/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#795238]/15 shadow-xl">
          
          {/* ================= 1. ABOUT US ================= */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Our Story & Mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  Smart books. Smarter savings.
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-3">
                  Founded in Kathmandu, <strong>SMARTKITAB</strong> was born out of a simple, urgent reality: academic textbooks and quality literature in Nepal are increasingly expensive, while thousands of perfectly readable books sit unused on graduates&apos; shelves.
                </p>
                <p className="text-stone-600 text-sm leading-relaxed mt-2">
                  We are building Nepal&apos;s most reliable circular marketplace where students and readers can buy verified second-hand books at up to 70% discount, earn cash by listing books they&apos;ve completed, or donate them to empower disadvantaged students.
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#795238] text-white flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-stone-900">Student Affordability</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Save up to 70% compared to bookstore MRP across Engineering, Medical, SEE, and +2 curricula.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#365314] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-stone-900">Verified Condition</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Every listing is moderated for complete pages, readable condition, and verified seller details.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-stone-900">Green & Circular</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Every book reused saves paper, reduces deforestation, and keeps quality literature in active circulation.
                  </p>
                </div>
              </div>

              {/* Founder Note */}
              <div className="p-6 rounded-2xl bg-[#F3EBDD]/60 border border-[#795238]/20 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Founder Shraddha"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#795238]">Hi, I&apos;m Shraddha!</h4>
                  <p className="text-xs font-bold text-stone-500">Founder & Student Advocate</p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed italic">
                    &ldquo;During college in Kathmandu, buying medical and engineering books took half my monthly budget. SMARTKITAB exists so that no student in Nepal ever has to compromise on learning due to book costs.&rdquo;
                  </p>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
                <p className="text-xs text-stone-500 font-medium">Ready to explore our verified shelf?</p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to="/catalog"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white text-xs font-bold shadow-md text-center"
                  >
                    Browse Catalog
                  </Link>
                  <Link
                    to="/sell"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white border border-[#795238] text-[#795238] hover:bg-[#F3EBDD] text-xs font-bold text-center"
                  >
                    Sell a Book
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. HOW IT WORKS ================= */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Simple & Transparent
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  How SMARTKITAB Works
                </h2>
                <p className="text-stone-600 text-sm mt-2">
                  Whether you are looking to buy affordable coursebooks or convert finished books into cash, here is the seamless step-by-step workflow.
                </p>
              </div>

              {/* For Buyers */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-[#795238] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#795238] text-white text-xs flex items-center justify-center">1</span>
                  <span>For Book Buyers</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#795238]">Step 1</span>
                    <h4 className="text-xs font-black text-stone-900">Find Your Book</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Search by course, title, or ISBN. Check condition ratings (Like New, Good, Fair) and transparent pricing.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#795238]">Step 2</span>
                    <h4 className="text-xs font-black text-stone-900">Add to Cart or Chat</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Add to your cart for direct delivery or click &ldquo;Chat on WhatsApp&rdquo; to query the seller instantly.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#795238]">Step 3</span>
                    <h4 className="text-xs font-black text-stone-900">Doorstep Delivery</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Receive your verified book in 1-2 days with Cash on Delivery and a 7-day money-back guarantee.
                    </p>
                  </div>
                </div>
              </div>

              {/* For Sellers */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="text-base font-black text-[#E07A5F] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E07A5F] text-white text-xs flex items-center justify-center">2</span>
                  <span>For Book Sellers & Donors</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#E07A5F]">Step 1</span>
                    <h4 className="text-xs font-black text-stone-900">List in 60 Seconds</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Take 1-3 photos of your book, choose your condition rating, and set your selling price or choose donation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#E07A5F]">Step 2</span>
                    <h4 className="text-xs font-black text-stone-900">Admin Verification</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Our moderation team approves your listing within 24 hours to ensure fair pricing and genuine photos.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/10 space-y-2">
                    <span className="text-xs font-extrabold text-[#E07A5F]">Step 3</span>
                    <h4 className="text-xs font-black text-stone-900">Get Paid Instantly</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      When a student orders your book, our courier picks it up and transfers your funds directly to eSewa/Khalti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. FAQS ================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Got Questions?
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  Frequently Asked Questions
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Here are common answers about our quality check, delivery, payments, and book returns.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How do you verify the quality of second-hand books?',
                    a: 'Every book listed on SMARTKITAB goes through moderator inspection. We enforce strict condition tags: "Like New" (pristine condition, zero markings), "Good Condition" (intact binding, minor highlights), and "Fair Condition" (readable with visible shelf wear). Listings with missing pages or torn text are rejected.',
                  },
                  {
                    q: 'How long does delivery take inside and outside Kathmandu Valley?',
                    a: 'Orders inside Kathmandu, Lalitpur, and Bhaktapur are typically delivered within 24 to 48 hours. Nationwide delivery across major cities in Nepal (Pokhara, Chitwan, Butwal, Biratnagar, etc.) takes 2 to 4 business days.',
                  },
                  {
                    q: 'What payment methods do you accept?',
                    a: 'We support Cash on Delivery (COD), eSewa, Khalti, and direct mobile banking transfer upon checkout.',
                  },
                  {
                    q: 'Can I return a book if I am unsatisfied?',
                    a: 'Yes! We offer a 7-day hassle-free replacement or 100% money-back guarantee if the delivered book has missing pages or significantly differs from the condition specified by the seller.',
                  },
                  {
                    q: 'How do sellers receive payments for sold books?',
                    a: 'Once your book is picked up and delivered to the buyer, earnings are transferred directly to your registered eSewa, Khalti ID, or bank account within 24 hours.',
                  },
                  {
                    q: 'What is the BookCycle Membership?',
                    a: 'BookCycle is our student subscription for Rs. 200/month that gives you unlimited book exchanges, free doorstep delivery, and priority request access so you can keep rotating your semester reads freely.',
                  },
                ].map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#795238]/15 rounded-2xl overflow-hidden bg-[#FAF6EF]/50 transition"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F3EBDD]/50 transition"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#795238] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#795238]/10 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 4. DELIVERY & RETURNS ================= */}
          {activeTab === 'delivery-returns' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Fast & Safe
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  Delivery & Return Policy
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  We partner with top local couriers to bring verified books directly to your doorstep.
                </p>
              </div>

              {/* Delivery Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#795238]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#795238]">Kathmandu Valley</h3>
                    <span className="text-xs font-extrabold text-[#365314] bg-emerald-100 px-2 py-0.5 rounded-full">
                      Fast 24-48h
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Standard delivery charge is <strong>Rs. 50</strong>. Orders of <strong>Rs. 500 or more qualify for FREE delivery</strong>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#795238]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#795238]">Nationwide (Outside Valley)</h3>
                    <span className="text-xs font-extrabold text-[#795238] bg-[#F3EBDD] px-2 py-0.5 rounded-full">
                      2-4 Days
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Flat delivery fee of <strong>Rs. 100</strong> across Pokhara, Chitwan, Butwal, Biratnagar, Dharan, and other major hubs.
                  </p>
                </div>
              </div>

              {/* 7-Day Guarantee */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800 font-black text-sm">
                  <RotateCcw className="w-5 h-5 text-emerald-700" />
                  <span>7-Day Return & Full Money-Back Guarantee</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  If the book you receive has missing pages, unreadable water damage, or differs materially from the seller&apos;s described condition, simply contact our support within 7 days of delivery. We will schedule a free return pickup and issue an immediate 100% refund or replacement.
                </p>
              </div>
            </div>
          )}

          {/* ================= 5. TERMS OF SERVICE ================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Legal & Conduct
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  Terms of Service
                </h2>
                <p className="text-xs text-stone-500 mt-1">Last revised: March 2026</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">1. Acceptance of Terms</h3>
                  <p>
                    By accessing or using SMARTKITAB, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">2. Seller Responsibilities</h3>
                  <p>
                    Sellers must only list authentic books with accurate descriptions and genuine photographs. Selling photocopied, unauthorized pirated editions or misrepresented materials is strictly prohibited and results in immediate account termination.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">3. Pricing & Platform Moderation</h3>
                  <p>
                    SMARTKITAB is a student-centric platform promoting honest discounts. Selling prices must not exceed the original MRP of the book. We reserve the right to review, reject, or modify listings that violate our community standards.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">4. Orders & Cancellation</h3>
                  <p>
                    Buyers may cancel an order before it has been dispatched by our logistics courier. Once shipped, standard delivery and return guidelines apply.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. PRIVACY POLICY ================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                  Your Trust & Security
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238] mt-1">
                  Privacy Policy
                </h2>
                <p className="text-xs text-stone-500 mt-1">Last revised: March 2026</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">1. Information We Collect</h3>
                  <p>
                    We collect personal information necessary to facilitate transactions, including your name, email address, contact phone number, and delivery address. Passwords are cryptographically salted and hashed using bcrypt.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">2. How We Use Your Data</h3>
                  <p>
                    Your contact information is strictly used for order processing, logistics coordination with courier partners, and order status updates via SMS or WhatsApp.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">3. Data Sharing & Security</h3>
                  <p>
                    We do NOT sell, rent, or trade your personal information to third-party advertisers. All communications with our backend API are encrypted over HTTPS and authenticated via secure JSON Web Tokens (JWT).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">4. Contacting Data Support</h3>
                  <p>
                    If you have questions regarding your account data or wish to request data removal, please contact our privacy desk at{' '}
                    <a href="mailto:support@smartkitab.com" className="text-[#795238] font-bold underline">
                      support@smartkitab.com
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

