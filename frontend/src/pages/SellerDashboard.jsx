import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Edit3,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
  Save,
  Check,
  CreditCard,
  Phone,
  User,
  ShoppingBag,
  HeartHandshake,
  Tag,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'payouts', 'guidelines'
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalListed: 0,
    pendingCount: 0,
    approvedCount: 0,
    soldCount: 0,
    rejectedCount: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Book Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: '',
    originalPrice: '',
    sellerAskingPrice: '',
    condition: 'Like New',
    type: 'sale',
  });
  const [editSaving, setEditSaving] = useState(false);

  // Delete Book State
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Payout Settings State
  const [payoutForm, setPayoutForm] = useState({
    method: user?.payoutInfo?.method || 'eSewa',
    accountNumber: user?.payoutInfo?.accountNumber || '',
    accountName: user?.payoutInfo?.accountName || '',
    bankName: user?.payoutInfo?.bankName || '',
    phone: user?.address?.phone || '',
  });
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState(null);

  // Fetch seller's books and stats
  const fetchSellerListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/books/seller/my-listings');
      if (res.data?.success) {
        setBooks(res.data.books || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerListings();
  }, []);

  // Open Edit Modal
  const openEditModal = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Novels',
      originalPrice: book.originalPrice || '',
      sellerAskingPrice: book.sellerAskingPrice || book.sellingPrice || '',
      condition: book.condition || 'Like New',
      type: book.type || 'sale',
    });
  };

  // Submit Edit Listing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;
    setEditSaving(true);
    try {
      const res = await axios.put(`/api/books/seller/${editingBook._id}`, {
        title: editForm.title,
        author: editForm.author,
        category: editForm.category,
        originalPrice: Number(editForm.originalPrice),
        sellerAskingPrice: Number(editForm.sellerAskingPrice),
        condition: editForm.condition,
        type: editForm.type,
      });

      if (res.data?.success) {
        setBooks((prev) =>
          prev.map((b) => (b._id === editingBook._id ? res.data.book : b))
        );
        setEditingBook(null);
        fetchSellerListings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update book.');
    } finally {
      setEditSaving(false);
    }
  };

  // Delete Listing
  const handleDeleteBook = async (bookId) => {
    if (!bookId) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`/api/books/seller/${bookId}`);
      if (res.data?.success) {
        setBooks((prev) => prev.filter((b) => b._id !== bookId));
        setDeletingBookId(null);
        fetchSellerListings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Submit Payout Settings
  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    setPayoutSaving(true);
    setPayoutMessage(null);

    const result = await updateUserProfile({
      payoutInfo: {
        method: payoutForm.method,
        accountNumber: payoutForm.accountNumber,
        accountName: payoutForm.accountName,
        bankName: payoutForm.bankName,
      },
      address: {
        phone: payoutForm.phone,
      },
    });

    setPayoutSaving(false);
    if (result.success) {
      setPayoutMessage({ type: 'success', text: 'Payout preferences saved successfully!' });
      setTimeout(() => setPayoutMessage(null), 3500);
    } else {
      setPayoutMessage({ type: 'error', text: result.message || 'Failed to save payout settings.' });
    }
  };

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesStatus =
      statusFilter === 'all' ? true : book.status === statusFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      book.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      book.category?.toLowerCase()?.includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-8 sm:py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#795238]/15 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#365314] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#795238]">
                  Seller Central
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#365314] border border-[#365314]/20 uppercase">
                  Verified Seller
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Manage your book listings, adjust prices, and track your payout earnings.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/buyer/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#795238]/20 bg-[#F3EBDD]/50 hover:bg-[#F3EBDD] text-[#795238] font-bold text-xs sm:text-sm transition shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Switch to Buyer Hub</span>
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>List New Book</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Listed</span>
              <BookOpen className="w-5 h-5 text-[#795238]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">{stats.totalListed}</p>
            <p className="text-[11px] text-stone-400 mt-1">Submitted books</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Live in Store</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{stats.approvedCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Available for buyers</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Review</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{stats.pendingCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Awaiting admin check</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Sold</span>
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">{stats.soldCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Delivered to buyers</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Your Earnings</span>
              <TrendingUp className="w-5 h-5 text-[#E07A5F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#795238] mt-2">Rs. {stats.totalEarnings}</p>
            <p className="text-[11px] text-stone-400 mt-1">Payout balance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#795238]/20 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'listings'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Book Listings ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payout Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'guidelines'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#365314]" />
            <span>Seller Guide & FAQs</span>
          </button>
        </div>

        {/* TAB 1: MY BOOK LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-[#795238]/10 shadow-xs">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search books by title, author, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF6EF] border border-[#795238]/20 text-xs text-stone-800 focus:outline-none focus:bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {['all', 'pending', 'approved', 'sold', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      statusFilter === status
                        ? 'bg-[#795238] text-white shadow-xs'
                        : 'bg-[#FAF6EF] text-stone-600 hover:bg-[#F3EBDD]'
                    }`}
                  >
                    {status}
                  </button>
                ))}

                <button
                  onClick={fetchSellerListings}
                  title="Refresh listings"
                  className="p-2 rounded-xl bg-[#FAF6EF] text-stone-600 hover:bg-[#F3EBDD] transition cursor-pointer ml-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Listings Grid / Table */}
            {loading ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-[#795238]/10">
                <RefreshCw className="w-8 h-8 text-[#795238] animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-stone-600">Loading your listings...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#795238]/10">
                <div className="w-16 h-16 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#795238] mx-auto mb-4">
                  <BookOpen className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-[#795238]">No listings found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  {statusFilter !== 'all' || searchQuery
                    ? 'No books match the selected filter. Try changing your search query or filter.'
                    : 'You have not listed any books for sale yet. Turn your used books into cash!'}
                </p>
                <Link
                  to="/sell"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#795238] text-white font-bold text-xs hover:bg-[#603f29] transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your First Book</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => {
                  const coverImg =
                    book.images && book.images[0]
                      ? book.images[0]
                      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

                  const isPending = book.status === 'pending';
                  const isApproved = book.status === 'approved';
                  const isSold = book.status === 'sold';
                  const isRejected = book.status === 'rejected';

                  return (
                    <div
                      key={book._id}
                      className="bg-white rounded-3xl border border-[#795238]/15 shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md"
                    >
                      <div>
                        {/* Book Image & Status Pill */}
                        <div className="relative h-48 bg-stone-100 overflow-hidden">
                          <img
                            src={coverImg}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
                                isApproved
                                  ? 'bg-emerald-600 text-white'
                                  : isPending
                                  ? 'bg-amber-500 text-white'
                                  : isSold
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              <span>{book.status}</span>
                            </span>

                            {book.type === 'donation' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E07A5F] text-white shadow-xs">
                                Donation
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-xs font-bold">
                            {book.category}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-2">
                          <h3 className="font-extrabold text-base text-stone-900 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-stone-500 truncate">by {book.author}</p>
                          
                          <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                            <span className="text-stone-500">Condition</span>
                            <span className="font-bold text-[#365314] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {book.condition}
                            </span>
                          </div>

                          {/* Price Comparison */}
                          <div className="bg-[#FAF6EF] p-3 rounded-2xl border border-[#795238]/10 space-y-1 text-xs">
                            <div className="flex justify-between text-stone-600">
                              <span>Your Asking Price:</span>
                              <span className="font-bold text-stone-900">
                                Rs. {book.sellerAskingPrice || book.sellingPrice}
                              </span>
                            </div>
                            <div className="flex justify-between text-stone-500">
                              <span>Storefront Price:</span>
                              <span className="font-bold text-[#795238]">
                                Rs. {book.sellingPrice}
                              </span>
                            </div>
                            {book.originalPrice > 0 && (
                              <div className="flex justify-between text-[11px] text-stone-400">
                                <span>Original MRP:</span>
                                <span className="line-through">Rs. {book.originalPrice}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="flex-1 py-2 px-3 rounded-xl border border-stone-300 hover:bg-white text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#795238]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingBookId(book._id)}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-xs"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYOUT SETTINGS */}
        {activeTab === 'payouts' && (
          <div className="max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-[#795238]/15 shadow-sm">
            <div className="mb-6 border-b border-stone-100 pb-4">
              <h2 className="text-xl font-black text-[#795238]">Payout Preferences</h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure your preferred wallet or bank account where SMARTKITAB dispatches your earnings upon book sales.
              </p>
            </div>

            {payoutMessage && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
                  payoutMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {payoutMessage.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{payoutMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Payout Method
                </label>
                <select
                  value={payoutForm.method}
                  onChange={(e) => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none font-bold"
                >
                  <option value="eSewa">eSewa Wallet</option>
                  <option value="Khalti">Khalti Wallet</option>
                  <option value="Bank Transfer">Bank Transfer (Nepal Banks)</option>
                  <option value="Cash">Cash on Pickup / Store Visit</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {payoutForm.method === 'Bank Transfer'
                      ? 'Bank Account Number'
                      : `${payoutForm.method} Phone / Wallet ID`}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9841234567 or Account #"
                    value={payoutForm.accountNumber}
                    onChange={(e) =>
                      setPayoutForm({ ...payoutForm, accountNumber: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name registered on wallet/bank"
                    value={payoutForm.accountName}
                    onChange={(e) =>
                      setPayoutForm({ ...payoutForm, accountName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>
              </div>

              {payoutForm.method === 'Bank Transfer' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Bank Name & Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. Global IME Bank, New Baneshwor Branch"
                    value={payoutForm.bankName}
                    onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Phone for Payout Confirmation
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9841234567"
                  value={payoutForm.phone}
                  onChange={(e) => setPayoutForm({ ...payoutForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={payoutSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {payoutSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Payout Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SELLER GUIDELINES */}
        {activeTab === 'guidelines' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#795238]/15 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-[#795238]">How Selling on SMARTKITAB Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#795238]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#795238] text-white flex items-center justify-center font-black text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-stone-900">List Your Book</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Upload photos, choose category, mention book condition, and set your desired asking price.
                </p>
              </div>

              <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#795238]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#365314] text-white flex items-center justify-center font-black text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-stone-900">Admin Quality Review</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our catalog team verifies the photos and textbook edition before publishing it live to thousands of buyers.
                </p>
              </div>

              <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#795238]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center font-black text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-stone-900">Get Paid Instantly</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  When a buyer purchases your book, we arrange pickup and transfer your asking price directly to your eSewa or bank.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#795238] mb-1">Edit Book Listing</h3>
            <p className="text-xs text-stone-500 mb-6">Update your book details and price.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Book Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Author</label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  >
                    <option value="Novels">Novels</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="SEE Prep">SEE Prep</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Bachelor Courses">Bachelor Courses</option>
                    <option value="Pocket Books">Pocket Books</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Condition</label>
                  <select
                    value={editForm.condition}
                    onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Fair Condition">Fair Condition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Asking Price (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.sellerAskingPrice}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sellerAskingPrice: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Original Price / MRP (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={editSaving}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {editSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Listing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBookId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-center text-stone-900">Remove this listing?</h3>
            <p className="text-xs text-center text-stone-600 mt-2">
              Are you sure you want to withdraw this book from SMARTKITAB? It will no longer be visible in search or catalog.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingBookId(null)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Keep Listing
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBook(deletingBookId)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

