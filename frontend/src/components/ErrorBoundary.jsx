import React from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-6 text-stone-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#795238]/20 p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-[#795238]">Something went wrong</h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                An unexpected interface error occurred. We've captured the diagnostics. You can reload the page or return home.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-stone-100 rounded-xl text-[11px] font-mono text-stone-700 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleHome}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EF] border border-[#795238]/20 text-xs font-bold text-stone-700 flex items-center gap-2 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

