import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GoogleAuthButton({ role = 'buyer', onSuccessRedirect, text = 'signin_with' }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google Sign-In was cancelled or failed.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await loginWithGoogle(credentialResponse.credential, role);
    setLoading(false);

    if (res.success) {
      if (onSuccessRedirect) {
        onSuccessRedirect(res.user);
      }
    } else {
      setError(res.message || 'Failed to sign in with Google');
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In popup was closed or encounter an error.');
  };

  if (!googleClientId || googleClientId.includes('your-google-client-id')) {
    // If client ID is not configured yet, provide a helpful demo fallback
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => {
            setError('Google Client ID is not configured in frontend/.env yet (VITE_GOOGLE_CLIENT_ID).');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
        {error && (
          <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-xs font-bold flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#795238]" />
          <span>Signing in with Google...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            shape="pill"
            theme="outline"
            size="large"
            width="100%"
            text={text}
          />
        </div>
      )}

      {error && (
        <div className="mt-2 w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
