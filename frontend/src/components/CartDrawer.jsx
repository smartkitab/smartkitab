import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function CartDrawer() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'success'
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address inputs
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.address?.phone || '',
    city: user?.address?.city || 'Kathmandu',
    address: user?.address?.street || '',
  });

  const { settings } = useSiteSettings();
  const freeDeliveryThreshold = settings?.commerce?.freeDeliveryThreshold ?? 500;
  const standardDeliveryFee = settings?.commerce?.standardDeliveryFee ?? 50;

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal >= freeDeliveryThreshold || cartTotal === 0 ? 0 : standardDeliveryFee;
  const finalTotal = cartTotal + deliveryFee;

  const handleStartCheckout = () => {
    if (!isAuthenticated) {
      closeCart();
      navigate('/login', {
        state: {
          openCartAfterLogin: true,
          message: 'Please log in to complete your checkout.',
        },
      });
      return;
    }

    // Pre-fill address if available
    setShippingAddress({
      name: user?.name || '',
      phone: user?.address?.phone || '',
      city: user?.address?.city || 'Kathmandu',
      address: user?.address?.street || '',
    });

    setCheckoutStep('address');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      setOrderError('Please provide complete recipient name, phone, address, and city.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          bookId: item._id || item.id,
          price: Number(item.sellingPrice ?? item.price ?? 0),
        })),
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
        },
        totalAmount: finalTotal,
      };

      const res = await axios.post('/api/orders', orderPayload);
      if (res.data?.success) {
        setPlacedOrder(res.data.order);
        clearCart();
        setCheckoutStep('success');
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleExploreCatalog = () => {
    closeCart();
    navigate('/catalog');
  };

  const handleViewBuyerDashboard = () => {
    closeCart();
    setCheckoutStep('cart');
    navigate('/buyer/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF6EF] shadow-2xl flex flex-col justify-between border-l border-[#795238]/15 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#F3EBDD] bg-white/70 backdrop-blur-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#795238] text-[#FAF6EF] flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#795238]">
                  {checkoutStep === 'address' ? 'Delivery Details' : checkoutStep === 'success' ? 'Order Confirmed' : 'Your Cart'}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {checkoutStep === 'address' ? 'Cash on Delivery (COD)' : `${cartCount} items selected`}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: SUCCESS VIEW */}
          {checkoutStep === 'success' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/90">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-stone-900">Order Placed Successfully!</h3>
              <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
                Thank you for ordering on SMARTKITAB! Your order has been registered and is pending seller dispatch.
              </p>

              {placedOrder && (
                <div className="mt-4 p-3.5 bg-[#FAF6EF] rounded-2xl border border-[#795238]/15 text-xs text-stone-700 w-full max-w-xs text-left space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[#795238]">
                    <span>Order ID:</span>
                    <span>#{placedOrder._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Total Amount:</span>
                    <span className="font-bold">Rs. {placedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Payment:</span>
                    <span className="font-bold text-amber-700">Cash on Delivery</span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
                <button
                  onClick={handleViewBuyerDashboard}
                  className="w-full py-3 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>View Order in Buyer Dashboard</span>
                </button>
                <button
                  onClick={handleExploreCatalog}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition cursor-pointer"
                >
                  Continue Browsing Books
                </button>
              </div>
            </div>
          ) : checkoutStep === 'address' ? (
            /* STEP 2: ADDRESS / CHECKOUT CONFIRMATION */
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-[#795238]/10 space-y-3">
                  <h4 className="text-xs font-bold text-[#795238] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Shipping Address</span>
                  </h4>

                  {orderError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      {orderError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Mobile Phone (for delivery coordination)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9841234567"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Kathmandu"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Payment Mode
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Cash on Delivery"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Detailed Street Address / Landmark
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. House #12, Old Baneshwor, near Kumari Bank"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#795238]/20 focus:border-[#795238] outline-none"
                    />
                  </div>
                </div>

                {/* Order Review List */}
                <div className="bg-white p-4 rounded-2xl border border-[#795238]/10 space-y-2">
                  <h4 className="text-xs font-bold text-[#795238] uppercase tracking-wider">
                    Order Items ({cartCount})
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto divide-y divide-stone-100 pr-1">
                    {cartItems.map((item) => (
                      <div key={item._id || item.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                        <span className="truncate max-w-[180px] font-medium text-stone-800">
                          {item.quantity}x {item.title}
                        </span>
                        <span className="font-bold text-stone-900">
                          Rs. {(item.sellingPrice ?? item.price ?? 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 0: CART CONTENT */
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#795238] mb-4">
                    <ShoppingBag className="w-10 h-10 opacity-60" />
                  </div>
                  <h3 className="text-lg font-black text-[#795238]">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                    Looks like you haven't added any books yet. Explore our verified collection at up to 70% off!
                  </p>
                  <button
                    onClick={handleExploreCatalog}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Browse Books</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemId = item._id || item.id;
                    const itemPrice = Number(item.sellingPrice ?? item.price ?? 0);
                    const coverImage =
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80';

                    return (
                      <div
                        key={itemId}
                        className="bg-white rounded-2xl p-3.5 border border-[#795238]/10 shadow-xs flex gap-3 items-center group transition hover:shadow-md"
                      >
                        {/* Book Thumbnail */}
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img
                            src={coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 truncate">by {item.author || 'Author'}</p>
                          {item.condition && (
                            <span className="inline-block mt-1 text-[11px] font-bold text-[#365314] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              {item.condition}
                            </span>
                          )}
                          <div className="mt-1.5 text-sm font-black text-[#795238]">
                            Rs. {itemPrice}
                          </div>
                        </div>

                        {/* Quantity & Delete Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                            title="Remove book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-1.5 bg-[#FAF6EF] rounded-lg border border-[#795238]/20 px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                              className="text-stone-600 hover:text-stone-900 p-0.5 cursor-pointer disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-800 min-w-[16px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                              className="text-stone-600 hover:text-stone-900 p-0.5 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Clear Cart link */}
                  <div className="pt-2 text-right">
                    <button
                      onClick={clearCart}
                      className="text-xs font-bold text-stone-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear entire cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Summary & Checkout Controls */}
          {cartItems.length > 0 && checkoutStep !== 'success' && (
            <div className="p-5 border-t border-[#F3EBDD] bg-white/90 backdrop-blur-xs space-y-3">
              {/* Delivery notice */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 bg-[#FAF6EF] p-2.5 rounded-xl border border-[#795238]/10">
                <Truck className="w-4 h-4 text-[#365314] shrink-0" />
                <span>
                  {deliveryFee === 0
                    ? '🎉 Free delivery unlocked!'
                    : `Add Rs. ${freeDeliveryThreshold - cartTotal} more for FREE delivery`}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#365314]">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex justify-between text-base font-black text-[#795238]">
                  <span>Total</span>
                  <span>Rs. {finalTotal}</span>
                </div>
              </div>

              {/* Action Buttons based on Step */}
              {checkoutStep === 'address' ? (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    disabled={submittingOrder}
                    className="py-3.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={submittingOrder}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingOrder ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Confirm Order (Rs. {finalTotal})</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Proceed to Checkout (Rs. {finalTotal})</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
