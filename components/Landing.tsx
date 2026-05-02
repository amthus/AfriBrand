
import React from 'react';

interface LandingProps {
  onStart: () => void;
  onNavigate: (step: 'legal' | 'support', type?: 'privacy' | 'terms') => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, onNavigate }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => scrollToSection('pricing');

  return (
    <div className="bg-brand-950 text-white min-h-screen font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden">
      
      {/* Background Decor - Abstract Orbs */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-600 rounded-full blur-[150px] opacity-10 animate-pulse-slow pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500 rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-panel border-b-0 border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 </div>
                 <span className="font-bold text-xl tracking-tight">AfriBrand<span className="text-brand-600">.AI</span></span>
              </div>
              <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-300">
                  <button onClick={() => scrollToSection('why')} className="hover:text-white transition-colors">Why Us</button>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
              </div>
              <button onClick={onStart} className="px-6 py-2.5 bg-white text-brand-950 rounded-full font-bold text-sm hover:bg-slate-200 transition-all shadow-lg transform hover:-translate-y-0.5">
                  Launch App
              </button>
          </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-in slide-in-from-top duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-300">Next-Gen African Marketing Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] text-white">
            Digital presence, <br/>
            <span className="gradient-text-brand">
                Culturally Amplified.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed font-light">
            Analysez votre marque, générez des campagnes à fort impact local et créez des assets visuels premium avec l'intelligence culturelle de Gemini 3.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Start Creating
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
            <button 
              onClick={scrollToPricing}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Why AfriBrand AI Section */}
      <section id="why" className="py-32 bg-slate-50 text-brand-950 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-100/50 skew-x-12"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-10">
                      <div className="space-y-4">
                        <span className="text-brand-600 font-bold uppercase tracking-widest text-xs">The Vision</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Speak your customer's <br/><span className="text-brand-600">cultural language.</span></h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            La plupart des outils d'IA sont entraînés sur des données occidentales. AfriBrand AI comprend les nuances du marché africain : de l'argot local aux festivals régionaux.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                          {[
                              { title: "Intelligence Culturelle", desc: "Slang local (Nouchi, Pidgin, Wolof), fêtes nationales et nuances de marché intégrées." },
                              { title: "DNA de Marque Premium", desc: "Analyse automatique de votre identité pour des contenus toujours 'on-brand'." },
                              { title: "Formats Multi-Plateformes", desc: "Un clic pour générer vos posts Instagram, TikTok, WhatsApp et LinkedIn." }
                          ].map((item, i) => (
                              <div key={i} className="flex gap-5 group">
                                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 shadow-sm group-hover:border-brand-500 transition-colors">
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                                      <p className="text-slate-500 text-sm leading-relaxed mt-1">{item.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="relative">
                      <div className="absolute -inset-4 bg-brand-600/10 rounded-[3rem] blur-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop" 
                        alt="AI Marketing Interface" 
                        className="relative rounded-[2.5rem] shadow-2xl border-8 border-white object-cover aspect-[4/3]"
                      />
                  </div>
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to <br/> scale your SME.</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">Une suite complète d'outils marketing pilotés par l'IA la plus avancée au monde.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      {
                        title: "Brand DNA Engine",
                        desc: "Analyse votre site ou description pour extraire couleurs, ton et style visuel.",
                        icon: "M13 10V3L4 14h7v7l9-11h-7z"
                      },
                      {
                        title: "Campaign Planner",
                        desc: "Générez 30 jours de stratégie avec des 'hooks' culturels locaux.",
                        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      },
                      {
                        title: "Asset Generator",
                        desc: "Créez des images et vidéos haute définition adaptées à chaque réseau.",
                        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      },
                      {
                        title: "Natural Editor",
                        desc: "Modifiez vos visuels et textes par simple commande vocale ou textuelle.",
                        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      },
                      {
                        title: "Regional Intelligence",
                        desc: "Horaires de publication optimaux basés sur les données de votre région.",
                        icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      },
                      {
                        title: "Video Ads (Veo)",
                        desc: "Générez des publicités vidéo cinématiques ultra-réalistes en quelques minutes.",
                        icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      }
                  ].map((feat, i) => (
                      <div key={i} className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6 hover:border-brand-500/30 transition-all group">
                          <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center text-brand-500 group-hover:bg-brand-600 group-hover:text-white transition-all">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feat.icon}></path></svg>
                          </div>
                          <div className="space-y-2">
                              <h3 className="font-bold text-xl">{feat.title}</h3>
                              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-white text-brand-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center space-y-4 mb-20">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple Pricing, <br/>Local Currency.</h2>
                  <p className="text-slate-500 font-medium">Pas de carte bancaire internationale requise. Payez via Mobile Money.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Basic Plan */}
                  <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 space-y-8 flex flex-col hover:shadow-xl transition-shadow">
                      <div className="space-y-2">
                          <h3 className="font-bold text-xl">Afri-Lite</h3>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black">5 000</span>
                              <span className="text-sm font-bold text-slate-500">FCFA / mois</span>
                          </div>
                      </div>
                      <ul className="space-y-4 flex-1">
                          {['Génération d\'images illimitée', 'DNA de Marque standard', 'Planning 7 jours', 'Export CSV', 'Support Email'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                  {item}
                              </li>
                          ))}
                      </ul>
                      <button onClick={onStart} className="w-full py-4 bg-slate-200 hover:bg-slate-300 rounded-2xl font-bold transition-all">Get Started</button>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-brand-950 text-white rounded-[2.5rem] p-10 space-y-8 flex flex-col relative shadow-2xl scale-105 border border-brand-600/30">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>
                      <div className="space-y-2">
                          <h3 className="font-bold text-xl">Afri-Pro</h3>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-brand-500">15 000</span>
                              <span className="text-sm font-bold text-slate-400">FCFA / mois</span>
                          </div>
                      </div>
                      <ul className="space-y-4 flex-1">
                          {['Génération Vidéo Veo (Ad)', 'DNA de Marque Avancé', 'Planning 30 jours', 'Éditeur Langage Naturel', 'Intelligence Régionale', 'Support Prioritaire 24/7'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                  <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                  {item}
                              </li>
                          ))}
                      </ul>
                      <button onClick={onStart} className="w-full py-4 bg-brand-600 hover:bg-brand-500 rounded-2xl font-bold shadow-xl shadow-brand-600/20 transition-all">Go Pro Now</button>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 space-y-8 flex flex-col hover:shadow-xl transition-shadow">
                      <div className="space-y-2">
                          <h3 className="font-bold text-xl">Agency</h3>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black">Custom</span>
                          </div>
                      </div>
                      <ul className="space-y-4 flex-1">
                          {['Multi-comptes clients', 'Accès API complet', 'Formation équipe', 'Intégration CRM locale', 'Account Manager dédié'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                  {item}
                              </li>
                          ))}
                      </ul>
                      <button onClick={() => onNavigate('support')} className="w-full py-4 border-2 border-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Contact Us</button>
                  </div>
              </div>
          </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-t border-white/5 text-center">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Trusted by Brands across Africa</h4>
              <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  {/* Logos simulés */}
                  <div className="text-2xl font-bold">DAKAR FASHION</div>
                  <div className="text-2xl font-bold">LAGOS TECH</div>
                  <div className="text-2xl font-bold">ABIDJAN HUB</div>
                  <div className="text-2xl font-bold">NAIROBI GROW</div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white border-t border-white/5 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="space-y-4 text-center md:text-left">
                 <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight">AfriBrand<span className="text-brand-600">.AI</span></span>
                 </div>
                 <p className="text-slate-500 max-w-xs text-sm">Le futur du marketing africain, piloté par l'intelligence artificielle culturelle.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
                  <div className="space-y-4">
                      <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Product</h5>
                      <ul className="space-y-2 text-slate-500">
                          <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button></li>
                          <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white">Pricing</button></li>
                          <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Veo Video</button></li>
                      </ul>
                  </div>
                  <div className="space-y-4">
                      <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Company</h5>
                      <ul className="space-y-2 text-slate-500">
                          <li><button onClick={() => scrollToSection('why')} className="hover:text-white">About Us</button></li>
                          <li><button onClick={() => onNavigate('support')} className="hover:text-white">Support</button></li>
                          <li><button onClick={() => onNavigate('legal', 'privacy')} className="hover:text-white">Privacy</button></li>
                          <li><button onClick={() => onNavigate('legal', 'terms')} className="hover:text-white">Terms</button></li>
                      </ul>
                  </div>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
               <p>PROPRIÉTÉ DE MALTHUS AMETEPE — TOUS DROITS RÉSERVÉS © 2025</p>
          </div>
      </footer>
    </div>
  );
};

export default Landing;
