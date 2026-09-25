import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Mail,
  ArrowRight,
  RefreshCw,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Edit3,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BuyerDashboard() {
  const { user, updateUserProfile, refreshUser } = useAuth();
  const { openCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'bookcycle'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancelling order state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.address?.phone || '',
    city: user?.address?.city || '',
    street: user?.address?.street || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Sync user profile when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.address?.phone || '',
        city: user.address?.city || '',
        street: user.address?.street || '',
      });
    }
  }, [user]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const res = await axios.get('/api/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.warn('Failed to fetch buyer orders:', err);
      setErrorOrders(err.response?.data?.message || 'Could not load your orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
    setCancelLoading(true);
    try {
      const res = await axios.patch(`/api/orders/${orderId}/cancel`);
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: 'cancelled' } : ord))
        );
        setCancellingOrderId(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    const result = await updateUserProfile({
      name: profileForm.name,
      address: {
        street: profileForm.street,
        city: profileForm.city,
        phone: profileForm.phone,
      },
    });

    setProfileSaving(false);
    if (result.success) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage(null), 3500);
    } else {
      setProfileMessage({ type: 'error', text: result.message || 'Failed to update profile.' });
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      orderStatusFilter === 'all' ? true : order.orderStatus === orderStatusFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item) =>
        item.bookId?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  // Calculate high-level stats
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'shipped'].includes(o.orderStatus)
  ).length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const totalSpent = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Helper for tracking steps
  const getStepState = (currentStatus, stepName) => {
    const sequence = ['pending', 'processing', 'shipped', 'delivered'];
    if (currentStatus === 'cancelled') return 'cancelled';

    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepName);

    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-8 sm:py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#795238]/15 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#795238] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#795238]">
                  {user?.name || 'Buyer Dashboard'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF6EF] text-[#365314] border border-[#365314]/20 uppercase">
                  Buyer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#795238]/20 bg-[#F3EBDD]/50 hover:bg-[#F3EBDD] text-[#795238] font-bold text-xs sm:text-sm transition shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Switch to Seller Hub</span>
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Books</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Orders</span>
              <Package className="w-5 h-5 text-[#795238]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">{totalOrdersCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Lifetime purchases</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Deliveries</span>
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{activeOrdersCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Pending / Shipped</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Delivered</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{completedOrdersCount}</p>
            <p className="text-[11px] text-stone-400 mt-1">Completed orders</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#795238]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Value</span>
              <Sparkles className="w-5 h-5 text-[#E07A5F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#795238] mt-2">Rs. {totalSpent}</p>
            <p className="text-[11px] text-stone-400 mt-1">Verified books saved</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#795238]/20 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Shipping Address</span>
          </button>

          <button
            onClick={() => setActiveTab('bookcycle')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'bookcycle'
                ? 'border-[#795238] text-[#795238] bg-white/60 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E07A5F]" />
            <span>BookCycle Club</span>
          </button>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search & Status Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-[#795238]/10 shadow-xs">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search orders by title or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF6EF] border border-[#795238]/20 text-xs text-stone-800 focus:outline-none focus:bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      orderStatusFilter === status
                        ? 'bg-[#795238] text-white shadow-xs'
                        : 'bg-[#FAF6EF] text-stone-600 hover:bg-[#F3EBDD]'
                    }`}
                  >
                    {status}
                  </button>
                ))}

                <button
                  onClick={fetchOrders}
                  title="Refresh orders"
                  className="p-2 rounded-xl bg-[#FAF6EF] text-stone-600 hover:bg-[#F3EBDD] transition cursor-pointer ml-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Orders List / Loading / Empty State */}
            {loadingOrders ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-[#795238]/10">
                <RefreshCw className="w-8 h-8 text-[#795238] animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-stone-600">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#795238]/10">
                <div className="w-16 h-16 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#795238] mx-auto mb-4">
                  <Package className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-[#795238]">No orders found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  {orderStatusFilter !== 'all' || searchQuery
                    ? 'No orders match your current filters. Try changing filter options.'
                    : 'You haven’t placed any orders yet. Explore our verified collection!'}
                </p>
                <Link
                  to="/catalog"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#795238] text-white font-bold text-xs hover:bg-[#603f29] transition shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const isPending = order.orderStatus === 'pending';
                  const isCancelled = order.orderStatus === 'cancelled';

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-3xl border border-[#795238]/15 shadow-sm overflow-hidden transition hover:shadow-md"
                    >
                      {/* Order Card Top Header */}
                      <div className="p-5 bg-[#FAF6EF]/60 border-b border-[#795238]/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-[#795238]/10">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span className="text-xs text-stone-500 font-medium">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              order.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.orderStatus === 'processing'
                                ? 'bg-amber-100 text-amber-800'
                                : order.orderStatus === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-stone-100 text-stone-800'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{order.orderStatus}</span>
                          </span>

                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF6EF] text-stone-600 border border-stone-200">
                            Payment: {order.paymentStatus === 'completed' ? 'Paid' : 'COD / Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Order Tracking Stepper (If not cancelled) */}
                      {!isCancelled && (
                        <div className="px-6 py-5 bg-stone-50/50 border-b border-stone-100">
                          <div className="max-w-2xl mx-auto">
                            <div className="relative flex items-center justify-between">
                              {/* Background connection bar */}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 -z-0"></div>

                              {/* Progress bar fill */}
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#795238] transition-all duration-500 -z-0"
                                style={{
                                  width:
                                    order.orderStatus === 'delivered'
                                      ? '100%'
                                      : order.orderStatus === 'shipped'
                                      ? '66%'
                                      : order.orderStatus === 'processing'
                                      ? '33%'
                                      : '0%',
                                }}
                              ></div>

                              {/* Steps */}
                              {[
                                { id: 'pending', label: 'Order Placed', icon: Clock },
                                { id: 'processing', label: 'Processing', icon: Package },
                                { id: 'shipped', label: 'Dispatched', icon: Truck },
                                { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
                              ].map((step, idx) => {
                                const stepState = getStepState(order.orderStatus, step.id);
                                const isDone = stepState === 'completed';
                                const IconComponent = step.icon;

                                return (
                                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <div
                                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        isDone
                                          ? 'bg-[#795238] text-white shadow-md'
                                          : 'bg-white border-2 border-stone-300 text-stone-400'
                                      }`}
                                    >
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <span
                                      className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                                        isDone ? 'text-[#795238]' : 'text-stone-400'
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Ordered Items Breakdown */}
                      <div className="p-6 divide-y divide-stone-100">
                        <div className="space-y-4 pb-4">
                          {order.items?.map((item, index) => {
                            const book = item.bookId || {};
                            const coverImg =
                              book.images && book.images[0]
                                ? book.images[0]
                                : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80';

                            return (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-14 h-18 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                  <img
                                    src={coverImg}
                                    alt={book.title || 'Book'}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-stone-900 truncate">
                                    {book.title || 'Book Title'}
                                  </h4>
                                  <p className="text-xs text-stone-500 truncate">
                                    by {book.author || 'Author'}
                                  </p>
                                  {book.condition && (
                                    <span className="inline-block mt-1 text-[11px] font-bold text-[#365314] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                      {book.condition}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black text-[#795238]">
                                    Rs. {item.price || book.sellingPrice || 0}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Details & Summary Footer */}
                        <div className="pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                          {/* Shipping address info */}
                          <div className="text-stone-600 space-y-1">
                            <p className="font-bold text-stone-800 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#795238]" />
                              <span>Delivery Address</span>
                            </p>
                            <p>
                              {order.shippingAddress?.name} ({order.shippingAddress?.phone})
                            </p>
                            <p className="text-stone-500">
                              {order.shippingAddress?.address}, {order.shippingAddress?.city}
                            </p>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                              <span className="text-stone-500 text-[11px]">Total Paid/Due</span>
                              <p className="text-lg font-black text-[#795238]">
                                Rs. {order.totalAmount}
                              </p>
                            </div>

                            {/* Cancel Button if pending */}
                            {isPending && (
                              <button
                                onClick={() => setCancellingOrderId(order._id)}
                                className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-[#795238]/15 shadow-sm">
            <div className="mb-6 border-b border-stone-100 pb-4">
              <h2 className="text-xl font-black text-[#795238]">Profile & Shipping Address</h2>
              <p className="text-xs text-stone-500 mt-1">
                Manage your personal contact info and default delivery address for faster checkout.
              </p>
            </div>

            {profileMessage && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9841234567"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Delivery City</label>
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu, Lalitpur, Pokhara"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Street Address / Landmark</label>
                <textarea
                  rows={3}
                  placeholder="e.g. House #14, Baneshwor Height, near Civil Hospital"
                  value={profileForm.street}
                  onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {profileSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BOOKCYCLE CLUB */}
        {activeTab === 'bookcycle' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#795238]/15 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="space-y-3 max-w-xl">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E07A5F]/15 text-[#E07A5F] inline-block">
                  Sustainability & Literacy
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#795238]">
                  SMARTKITAB BookCycle Membership
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Join our circular reading community! When you finish reading books purchased on SMARTKITAB, return them to receive up to 60% cashback in store credit, or donate them directly to underserved students in rural Nepal.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#365314]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free doorstep pickup</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#365314]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant cashback credit</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF6EF] p-6 rounded-3xl border border-[#795238]/15 text-center w-full md:w-80">
                <Sparkles className="w-10 h-10 text-[#E07A5F] mx-auto mb-2" />
                <h3 className="text-base font-bold text-[#795238]">Ready to recycle books?</h3>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  List your used books in 60 seconds and start earning immediately.
                </p>
                <Link
                  to="/sell"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs inline-block shadow-md transition"
                >
                  List a Book for Sale / Donation
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-center text-stone-900">Cancel this order?</h3>
            <p className="text-xs text-center text-stone-600 mt-2">
              Are you sure you want to cancel order #{cancellingOrderId.slice(-8).toUpperCase()}? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={() => handleCancelOrder(cancellingOrderId)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

