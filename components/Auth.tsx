
import React, { useState } from 'react';

interface AuthProps {
  onAuth: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex bg-brand-950 font-sans">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 afro-pattern opacity-30"></div>
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[180px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[150px] opacity-10"></div>
        
        <div className="relative z-10 text-white max-w-lg space-y-10">
            <h2 className="text-6xl font-bold tracking-tight leading-[1.1]">Scale your brand with <br/><span className="gradient-text-brand">Cultural Intelligence.</span></h2>
            <div className="space-y-6">
                {[
                  "Generate assets in seconds.",
                  "Speak your customer's language.",
                  "Optimize for local algorithms."
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access the HQ.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-semibold placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-6">
            <button 
                onClick={onAuth}
                className="w-full py-4 bg-brand-950 hover:bg-brand-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-900/10 transition-all transform active:scale-[0.98]"
            >
                {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-slate-400 uppercase font-bold tracking-widest">Or</span>
                </div>
            </div>

            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all text-sm"
            >
                {isLogin ? "Create an account" : "Sign in to existing account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
