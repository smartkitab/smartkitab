import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isAuthenticated, user } = useAuth();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(null);
  const [resendError, setResendError] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the link. Please check your email link or request a new one.');
      return;
    }

    let isMounted = true;

    const performVerification = async () => {
      setStatus('verifying');
      const res = await verifyEmail(token);
      if (!isMounted) return;

      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Your email address has been successfully verified! Your account is now active.');
      } else {
        setStatus('error');
        setMessage(res.message || 'This verification link is invalid or has expired.');
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendError('Please enter your email address');
      return;
    }

    setResending(true);
    setResendError(null);
    setResendSuccess(null);

    const res = await resendVerification(resendEmail.trim());
    setResending(false);

    if (res.success) {
      setResendSuccess(res.message || 'A fresh activation link has been sent to your Gmail/email.');
    } else {
      setResendError(res.message || 'Failed to resend verification email.');
    }
  };

  const handleProceed = () => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      navigate('/admin', { replace: true });
    } else if (user?.role === 'seller') {
      navigate('/seller/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
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
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#795238]/15 text-center">
          
          {/* 1. VERIFYING STATE */}
          {status === 'verifying' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF6EF] border border-[#795238]/20 flex items-center justify-center mx-auto text-[#795238]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-stone-900">
                  Activating Your Account
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2">
                  Please wait while we verify your email address with SMARTKITAB...
                </p>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === 'success' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  Account Verified
                </span>
                <h2 className="text-2xl font-black text-stone-900">
                  Welcome to SMARTKITAB!
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2">
                  {message}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {user?.role === 'seller'
                      ? 'Go to Seller Dashboard'
                      : 'Start Exploring Books'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/"
                  className="block text-xs font-bold text-stone-500 hover:text-stone-800 transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

          {/* 3. ERROR / EXPIRED STATE */}
          {status === 'error' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-sm">
                <XCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  Activation Failed
                </span>
                <h2 className="text-2xl font-black text-stone-900">
                  Link Expired or Invalid
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2">
                  {message}
                </p>
              </div>

              {/* Resend Form */}
              <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/15 text-left space-y-3">
                <span className="text-xs font-extrabold text-[#795238] block">
                  Request a New Activation Link
                </span>

                {resendSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {resendSuccess}
                  </div>
                )}

                {resendError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {resendError}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#795238]"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#795238] hover:bg-[#603f29] disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resend Activation Email</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-1">
                <Link
                  to="/login"
                  className="text-xs font-extrabold text-[#795238] hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
