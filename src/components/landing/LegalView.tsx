
import React from 'react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
  t: any;
}

const LegalView: React.FC<LegalViewProps> = ({ type, onBack, t }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-in slide-in-from-bottom duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        {t.nav.back}
      </button>

      <div className="bg-white dark:bg-brand-900/40 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 space-y-10 text-slate-800 dark:text-slate-200">
        <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {type === 'privacy' ? t.landing.privacy : t.landing.terms}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Last updated: February 14, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 font-medium leading-relaxed">
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">1. Overview</h2>
                <p>
                    AfriBrand AI respecte votre vie privée. Cette politique décrit comment nous collectons, utilisons et protégeons vos données de marque et vos informations personnelles au sein de notre écosystème SaaS.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">2. Data Sovereignty</h2>
                <p>
                    Toutes les données générées par AfriBrand AI restent la propriété exclusive de l'utilisateur. Nous n'utilisons pas vos assets privés pour entraîner nos modèles sans votre consentement explicite.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">3. Cultural Integrity</h2>
                <p>
                    Nous nous engageons à respecter les sensibilités culturelles, religieuses et sociales africaines. Nos algorithmes sont monitorés pour éviter tout biais ou contenu offensant.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">4. Payments & Security</h2>
                <p>
                    Les transactions via Mobile Money sont sécurisées par nos partenaires (CinetPay/Wave/Orange). AfriBrand AI ne stocke pas directement vos coordonnées bancaires.
                </p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
