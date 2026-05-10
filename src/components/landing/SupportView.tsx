
import React, { useState } from 'react';

interface SupportViewProps {
  onBack: () => void;
  t: any;
}

const SupportView: React.FC<SupportViewProps> = ({ onBack, t }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-in slide-in-from-bottom duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        {t.nav.back}
      </button>

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10 text-slate-800">
        <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support & Help Center</h1>
            <p className="text-slate-500 text-sm font-medium">How can we help you scale your brand today?</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
            <h3 className="text-xl font-bold text-emerald-900">Message Sent!</h3>
            <p className="text-emerald-700">Our team will get back to you within 24 hours.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-emerald-600 font-bold text-sm uppercase tracking-widest hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Quick Contact</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Whether you're having trouble with an asset generation or need advice on your brand DNA, we're here to help.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-slate-900">support@afribrand.ai</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold text-slate-900">+221 77 000 00 00</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 text-sm"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 text-sm"
                  placeholder="Describe your issue..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportView;
