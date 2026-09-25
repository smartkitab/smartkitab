import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Send,
  HeartHandshake,
  Check,
} from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleBuyClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/catalog' },
          message: 'Please log in first to browse and buy books.',
        },
      });
    } else {
      navigate('/catalog');
    }
  };

  const handleSellClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/sell' },
          message: 'Please log in first to list your books for sale.',
        },
      });
    } else {
      navigate('/sell');
    }
  };

  const handleDonateClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/sell', search: '?type=donation' },
          message: 'Please log in first to donate books to students.',
        },
      });
    } else {
      navigate('/sell?type=donation');
    }
  };

  const { settings } = useSiteSettings();
  const contact = settings?.contact || {};

  return (
    <footer className="bg-[#F3EBDD]/60 border-t border-[#795238]/20 text-stone-800">
      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10">
          
          {/* 1. Bio & Brand (Full on mobile) */}
          <div className="col-span-2 lg:col-span-4 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.jpg"
                alt="SMARTKITAB Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-2xl shadow-xs border border-[#795238]/15 bg-white group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#795238] leading-none">
                  SMART<span className="text-[#E07A5F]">KITAB</span>
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider text-[#365314] font-bold mt-0.5">
                  पुराना किताब, नयाँ ज्ञान
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              {contact.bio ||
                "Nepal's circular second-hand book marketplace. We empower students and book enthusiasts to buy, sell, and donate verified curriculum and literary books at honest, student-friendly prices."}
            </p>

            <div className="pt-1 sm:pt-2 flex items-center gap-2 text-xs font-semibold text-[#365314]">
              <span className="w-2 h-2 rounded-full bg-[#365314] animate-pulse"></span>
              <span>{contact.tagline || 'Read More. Pay Less. • Saving Trees, Saving Money'}</span>
            </div>
          </div>

          {/* 2. Quick Links (1 col on mobile) */}
          <div className="col-span-1 lg:col-span-2 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-[#795238] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button
                  type="button"
                  onClick={handleBuyClick}
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors cursor-pointer text-left"
                >
                  Buy Books
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleSellClick}
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors cursor-pointer text-left"
                >
                  Sell Books
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleDonateClick}
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#E07A5F] transition-colors cursor-pointer text-left"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Donate</span>
                </button>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Help & Support (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-[#795238] uppercase tracking-wider">
              Help & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faqs"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-returns"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  Delivery & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-stone-600 hover:text-[#E07A5F] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Details & Newsletter (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-[#795238] uppercase tracking-wider">
              Get in Touch
            </h4>
            
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#795238] shrink-0" />
                <a
                  href={`mailto:${contact.email || 'support@smartkitab.com'}`}
                  className="hover:text-[#E07A5F] transition"
                >
                  {contact.email || 'support@smartkitab.com'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#795238] shrink-0" />
                <a
                  href={`tel:${(contact.phone || '+9779800000000').replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#E07A5F] transition"
                >
                  {contact.phone || '+977-9800000000'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#795238] shrink-0" />
                <span>{contact.address || 'Putalisadak, Kathmandu, Nepal'}</span>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-bold text-[#795238] mb-1.5">
                Subscribe for Book Drops & Discounts
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-white border border-[#795238]/20 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#795238] focus:border-[#795238] transition shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 w-8 h-8 rounded-lg bg-[#795238] text-white flex items-center justify-center hover:bg-[#603f29] transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="border-t border-[#795238]/15 bg-[#FAF6EF]/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          
          <p>{contact.copyright || '© 2026 SMARTKITAB Nepal. All rights reserved.'}</p>

          {/* Social Icons dynamically rendered based on CMS settings */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            {settings?.socialLinks?.facebook?.enabled !== false && settings?.socialLinks?.facebook?.url && (
              <a
                href={settings.socialLinks.facebook.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#F3EBDD] border border-[#795238]/20 text-[#795238] hover:text-white hover:bg-[#795238] flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}

            {/* Instagram */}
            {settings?.socialLinks?.instagram?.enabled !== false && settings?.socialLinks?.instagram?.url && (
              <a
                href={settings.socialLinks.instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#F3EBDD] border border-[#795238]/20 text-[#795238] hover:text-white hover:bg-[#795238] flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}

            {/* TikTok */}
            {settings?.socialLinks?.tiktok?.enabled !== false && settings?.socialLinks?.tiktok?.url && (
              <a
                href={settings.socialLinks.tiktok.url}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-[#F3EBDD] border border-[#795238]/20 text-[#795238] hover:text-white hover:bg-[#795238] flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}

            {/* YouTube */}
            {settings?.socialLinks?.youtube?.enabled !== false && settings?.socialLinks?.youtube?.url && (
              <a
                href={settings.socialLinks.youtube.url}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#F3EBDD] border border-[#795238]/20 text-[#795238] hover:text-white hover:bg-[#795238] flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {/* WhatsApp */}
            {settings?.socialLinks?.whatsapp?.enabled !== false && (settings?.socialLinks?.whatsapp?.url || settings?.socialLinks?.whatsapp?.phoneNumber) && (
              <a
                href={
                  settings.socialLinks.whatsapp.url ||
                  `https://wa.me/${settings.socialLinks.whatsapp.phoneNumber.replace(/[^0-9]/g, '')}`
                }
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-[#F3EBDD] border border-[#795238]/20 text-[#795238] hover:text-white hover:bg-[#795238] flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}
