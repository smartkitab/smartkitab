import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function AuthPage({ initialMode = 'login' }) {
  const { login, register, resendVerification, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register'
  const isRegisterRoute = location.pathname === '/register' || initialMode === 'register';
  const [mode, setMode] = useState(isRegisterRoute ? 'register' : 'login');

  useEffect(() => {
    setMode(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  const getRedirectDestination = (userRole) => {
    if (location.state?.from?.pathname) {
      return `${location.state.from.pathname}${location.state.from.search || ''}`;
    }
    if (userRole === 'admin' || userRole === 'superadmin') return '/admin';
    if (userRole === 'seller') return '/seller/dashboard';
    return '/';
  };

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectDestination(user.role);
      navigate(redirectPath, {
        replace: true,
        state: location.state?.openCartAfterLogin ? { openCartAfterLogin: true } : undefined,
      });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    city: 'Kathmandu',
    phone: '',
    street: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Email verification states
  const [verificationPending, setVerificationPending] = useState(null); // { email: string, verificationUrl?: string }
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
    if (unverifiedEmail) setUnverifiedEmail(null);
  };

  const handleQuickFill = (roleEmail, defaultRole = 'buyer') => {
    setMode('login');
    setVerificationPending(null);
    setUnverifiedEmail(null);
    setFormData((prev) => ({
      ...prev,
      email: roleEmail,
      password: 'password123',
      role: defaultRole,
    }));
    setError(null);
  };

  const handleResendLink = async (targetEmail) => {
    const emailToUse = targetEmail || formData.email;
    if (!emailToUse) {
      setError('Please provide your email address to resend the activation link.');
      return;
    }

    setResending(true);
    setResendNotice(null);
    const res = await resendVerification(emailToUse.trim());
    setResending(false);

    if (res.success) {
      setResendNotice(res.message || 'Activation link sent to your email!');
      if (res.verificationUrl && verificationPending) {
        setVerificationPending((prev) => ({ ...prev, verificationUrl: res.verificationUrl }));
      }
    } else {
      setError(res.message || 'Failed to resend activation email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendNotice(null);
    setUnverifiedEmail(null);

    if (mode === 'login') {
      const res = await login(formData.email.trim(), formData.password);
      setLoading(false);

      if (!res.success) {
        if (res.isUnverified) {
          setUnverifiedEmail(formData.email.trim());
        }
        setError(res.message);
      } else {
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => {
          const destination = getRedirectDestination(res.user.role);
          navigate(destination, {
            replace: true,
            state: location.state?.openCartAfterLogin ? { openCartAfterLogin: true } : undefined,
          });
        }, 600);
      }
    } else {
      // Register
      if (!formData.name.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        address: {
          city: formData.city,
          street: formData.street,
          phone: formData.phone,
        },
      };

      const res = await register(payload);
      setLoading(false);

      if (!res.success) {
        setError(res.message);
      } else if (res.requiresVerification) {
        // Show activation link screen
        setVerificationPending({
          email: res.email || formData.email.trim(),
          verificationUrl: res.verificationUrl,
        });
      } else {
        setSuccessMsg('Account created successfully! Welcome to SMARTKITAB.');
        setTimeout(() => {
          navigate(res.user.role === 'admin' ? '/admin' : '/', { replace: true });
        }, 600);
      }
    }
  };

  const handleGoogleSuccessRedirect = (authUser) => {
    setSuccessMsg('Signed in with Google! Redirecting...');
    setTimeout(() => {
      const destination = getRedirectDestination(authUser.role);
      navigate(destination, {
        replace: true,
        state: location.state?.openCartAfterLogin ? { openCartAfterLogin: true } : undefined,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <img
            src="/logo.jpg"
            alt="SMARTKITAB Logo"
            className="w-14 h-14 object-contain rounded-2xl shadow-md border border-[#795238]/15 bg-[#FAF6EF] group-hover:scale-105 transition-transform duration-200"
          />
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-[#795238] leading-none block">
              SMART<span className="text-[#E07A5F]">KITAB</span>
            </span>
            <span className="text-[10px] tracking-wider text-[#365314] font-bold mt-0.5 block">
              पुराना किताब, नयाँ ज्ञान
            </span>
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
          {verificationPending
            ? 'Verify Your Email'
            : mode === 'login'
            ? 'Welcome Back!'
            : 'Create Your Account'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          {verificationPending
            ? 'We have sent an activation link to your email to complete registration.'
            : mode === 'login'
            ? 'Sign in to access your listings, cart, and exclusive book deals.'
            : 'Join thousands of students buying, selling, and reusing books across Nepal.'}
        </p>
      </div>

      {/* Main Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#795238]/15">
          
          {/* ================= ACTIVATION PENDING SCREEN ================= */}
          {verificationPending ? (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 shadow-sm">
                <Mail className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  Activation Link Sent
                </span>
                <h3 className="text-xl font-black text-stone-900">Check Your Gmail Inbox</h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  We've sent a verification link to:
                  <br />
                  <strong className="text-stone-900 font-bold">{verificationPending.email}</strong>
                </p>
                <p className="text-[11px] text-stone-500 mt-2">
                  Please click the link in your email to activate your account and start using SMARTKITAB.
                </p>
              </div>

              {/* Dev Simulation Helper */}
              {verificationPending.verificationUrl && (
                <div className="p-3 bg-[#FAF6EF] rounded-2xl border border-[#795238]/20 text-left space-y-1.5">
                  <span className="text-[11px] font-bold text-[#795238] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Dev Mode Quick Activation:
                  </span>
                  <a
                    href={verificationPending.verificationUrl}
                    className="text-xs text-[#795238] font-bold underline flex items-center gap-1 hover:text-stone-900 break-all"
                  >
                    <span>Click here to activate account directly</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {resendNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {resendNotice}
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  disabled={resending}
                  onClick={() => handleResendLink(verificationPending.email)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resend Activation Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationPending(null);
                    setMode('login');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Contextual Action Notice */}
              {location.state?.message && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-2xs animate-in fade-in slide-in-from-top-2">
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-black text-sm">
                    🔒
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900">Sign in to continue</p>
                    <p className="text-stone-600 text-xs mt-0.5">{location.state.message}</p>
                  </div>
                </div>
              )}

              {/* Mode Switcher Tabs */}
              <div className="flex bg-[#F3EBDD]/70 p-1 rounded-xl mb-6 border border-[#795238]/10">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setUnverifiedEmail(null);
                    navigate('/login');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#795238] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setUnverifiedEmail(null);
                    navigate('/register');
                  }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#795238] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Direct Sign-In with Google */}
              <div className="mb-5 space-y-3">
                <GoogleAuthButton
                  role={formData.role}
                  onSuccessRedirect={handleGoogleSuccessRedirect}
                  text={mode === 'login' ? 'signin_with' : 'signup_with'}
                />

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Or with email
                  </span>
                  <div className="border-t border-stone-200 w-full" />
                </div>
              </div>

              {/* Quick Credential Test Helpers */}
              {mode === 'login' && (
                <div className="mb-6 p-3 bg-[#FAF6EF] rounded-2xl border border-[#795238]/15 space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-600 block">
                    ⚡ Quick Fill Test Accounts:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('admin@smartkitab.com', 'admin')}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#795238]/20 hover:border-[#795238] hover:bg-[#F3EBDD] text-[10px] font-extrabold text-[#795238] transition cursor-pointer text-center"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('seller@smartkitab.com', 'seller')}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#795238]/20 hover:border-[#795238] hover:bg-[#F3EBDD] text-[10px] font-extrabold text-[#795238] transition cursor-pointer text-center"
                    >
                      Seller
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('buyer@smartkitab.com', 'buyer')}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#795238]/20 hover:border-[#795238] hover:bg-[#F3EBDD] text-[10px] font-extrabold text-[#795238] transition cursor-pointer text-center"
                    >
                      Buyer
                    </button>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span>{error}</span>
                    {unverifiedEmail && (
                      <div className="mt-2 pt-2 border-t border-rose-200">
                        <button
                          type="button"
                          disabled={resending}
                          onClick={() => handleResendLink(unverifiedEmail)}
                          className="font-bold underline text-rose-800 hover:text-rose-950 flex items-center gap-1.5 cursor-pointer"
                        >
                          {resending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          <span>Resend Activation Link to {unverifiedEmail}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resend Notice */}
              {resendNotice && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 text-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{resendNotice}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 text-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Register only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Aaditya Sharma"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#795238] focus:bg-white transition"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (Gmail) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#795238] focus:bg-white transition"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#795238] focus:bg-white transition"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Registration Extra Fields */}
                {mode === 'register' && (
                  <>
                    {/* Account Type / Role */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        I want to primarily:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, role: 'buyer' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            formData.role === 'buyer'
                              ? 'border-[#795238] bg-[#F3EBDD] text-[#795238]'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          Buy Books (Buyer)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, role: 'seller' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            formData.role === 'seller'
                              ? 'border-[#795238] bg-[#F3EBDD] text-[#795238]'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          Sell Books (Seller)
                        </button>
                      </div>
                    </div>

                    {/* City & Phone */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          City
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Kathmandu"
                            className="w-full pl-7 pr-2 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#795238] transition"
                          />
                          <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="98XXXXXXXX"
                            className="w-full pl-7 pr-2 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#795238] transition"
                          />
                          <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === 'login' ? 'Sign In to SMARTKITAB' : 'Create Account & Send Verification'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Switch Prompt */}
              <div className="mt-6 text-center text-xs text-stone-600">
                {mode === 'login' ? (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setError(null);
                        setUnverifiedEmail(null);
                        navigate('/register');
                      }}
                      className="font-extrabold text-[#795238] hover:underline cursor-pointer"
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                        setUnverifiedEmail(null);
                        navigate('/login');
                      }}
                      className="font-extrabold text-[#795238] hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
