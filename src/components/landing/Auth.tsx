
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Mail, Loader2 } from 'lucide-react';

interface AuthProps {
  onAuth: () => void;
  t: any;
}

const Auth: React.FC<AuthProps> = ({ onAuth, t }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
      onAuth();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-950 font-sans">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 afro-pattern opacity-30"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[180px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[150px] opacity-10"></div>
        
        <div className="relative z-10 text-white max-w-lg space-y-10">
            <h2 className="text-6xl font-bold tracking-tight leading-[1.1]">{t.landing.hero}</h2>
            <div className="space-y-6">
                {[
                  t.assets.hub,
                  "Cultural precision.",
                  "Market optimization."
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                      <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center shrink-0 group-hover:bg-brand-600/40 transition-colors">
                          <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">{item}</p>
                  </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:rounded-l-[3rem] relative shadow-2xl">
        <div className="max-w-md w-full space-y-10 animate-in slide-in-from-right duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.auth.login}</h2>
            <p className="text-slate-500 font-medium">{t.auth.subtitle}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                {t.auth.google}
            </button>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-slate-400 uppercase font-bold tracking-widest">or enter business email</span>
                </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@business.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-brand-500 transition-all font-semibold"
                />
              </div>
              <button 
                  className="w-full py-4 bg-brand-950 text-white rounded-2xl font-bold hover:bg-brand-900 transition-all shadow-lg shadow-brand-900/10"
              >
                  {t.auth.cta}
              </button>
            </div>
          </div>
          
          <p className="text-center text-slate-500 text-sm font-medium">
            New here? <span className="text-brand-600 cursor-pointer hover:underline">Get started for free</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
