
import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';

interface WelcomeProps {
  onStart: (input: UserInput) => void;
  t: any;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, t }) => {
  const [formData, setFormData] = useState<UserInput>({
    businessName: '',
    url: '',
    description: '',
    country: 'Senegal',
    targetAudience: 'Middle-class urban professionals',
    campaignGoal: 'Brand awareness and engagement',
    demographics: {
      ageRange: '18-35',
      specificLocations: [],
      interests: []
    },
    preferredLanguages: ['French'],
    currency: 'FCFA'
  });
  const [hasVeoKey, setHasVeoKey] = useState(false);

  useEffect(() => {
    // @ts-ignore
    window.aistudio?.hasSelectedApiKey().then(setHasVeoKey);
  }, []);

  const countries = [
    { name: 'Algeria', cur: 'DZD' }, { name: 'Angola', cur: 'AOA' }, { name: 'Benin', cur: 'XOF' }, 
    { name: 'Botswana', cur: 'BWP' }, { name: 'Burkina Faso', cur: 'XOF' }, { name: 'Burundi', cur: 'BIF' }, 
    { name: 'Cabo Verde', cur: 'CVE' }, { name: 'Cameroon', cur: 'XAF' }, { name: 'Central African Republic', cur: 'XAF' }, 
    { name: 'Chad', cur: 'XAF' }, { name: 'Comoros', cur: 'KMF' }, { name: 'DR Congo', cur: 'CDF' }, 
    { name: 'Republic of Congo', cur: 'XAF' }, { name: 'Côte d\'Ivoire', cur: 'XOF' }, { name: 'Djibouti', cur: 'DJF' }, 
    { name: 'Egypt', cur: 'EGP' }, { name: 'Equatorial Guinea', cur: 'XAF' }, { name: 'Eritrea', cur: 'ERN' }, 
    { name: 'Eswatini', cur: 'SZL' }, { name: 'Ethiopia', cur: 'ETB' }, { name: 'Gabon', cur: 'XAF' }, 
    { name: 'Gambia', cur: 'GMD' }, { name: 'Ghana', cur: 'GHS' }, { name: 'Guinea', cur: 'GNF' }, 
    { name: 'Guinea-Bissau', cur: 'XOF' }, { name: 'Kenya', cur: 'KES' }, { name: 'Lesotho', cur: 'LSL' }, 
    { name: 'Liberia', cur: 'LRD' }, { name: 'Libya', cur: 'LYD' }, { name: 'Madagascar', cur: 'MGA' }, 
    { name: 'Malawi', cur: 'MWK' }, { name: 'Mali', cur: 'XOF' }, { name: 'Mauritania', cur: 'MRU' }, 
    { name: 'Mauritius', cur: 'MUR' }, { name: 'Morocco', cur: 'MAD' }, { name: 'Mozambique', cur: 'MZN' }, 
    { name: 'Namibia', cur: 'NAD' }, { name: 'Niger', cur: 'XOF' }, { name: 'Nigeria', cur: 'NGN' }, 
    { name: 'Rwanda', cur: 'RWF' }, { name: 'Sao Tome and Principe', cur: 'STN' }, { name: 'Senegal', cur: 'XOF' }, 
    { name: 'Seychelles', cur: 'SCR' }, { name: 'Sierra Leone', cur: 'SLL' }, { name: 'Somalia', cur: 'SOS' }, 
    { name: 'South Africa', cur: 'ZAR' }, { name: 'South Sudan', cur: 'SSP' }, { name: 'Sudan', cur: 'SDG' }, 
    { name: 'Tanzania', cur: 'TZS' }, { name: 'Togo', cur: 'XOF' }, { name: 'Tunisia', cur: 'TND' }, 
    { name: 'Uganda', cur: 'UGX' }, { name: 'Zambia', cur: 'ZMW' }, { name: 'Zimbabwe', cur: 'ZWL' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const availableLanguages = ['English', 'French', 'Portuguese', 'Arabic', 'Swahili', 'Wolof', 'Hausa', 'Yoruba'];

  const toggleLanguage = (lang: string) => {
    setFormData(prev => {
      if (prev.preferredLanguages.includes(lang)) {
        return { ...prev, preferredLanguages: prev.preferredLanguages.filter(l => l !== lang) };
      } else {
        return { ...prev, preferredLanguages: [...prev.preferredLanguages, lang] };
      }
    });
  };

  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
          {t.welcome.title} <br/> <span className="gradient-text-brand">{t.welcome.subtitle}</span>
        </h2>
        <p className="max-w-xl mx-auto text-lg leading-relaxed opacity-60">
          {t.welcome.desc}
        </p>
      </div>

      <div className="bg-white dark:bg-brand-900/40 dark:backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-12 border border-slate-100 dark:border-white/5">
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">{t.welcome.inputBrand}</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Cotonou Chic"
                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">{t.welcome.inputUrl}</label>
                    <input 
                        type="url" 
                        placeholder="Instagram or Website"
                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">{t.welcome.inputVision}</label>
                <textarea 
                    rows={4}
                    placeholder="Describe your products, your vibe, and who you sell to..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 resize-none text-slate-900 dark:text-white"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">Campaign Goal</label>
                <input 
                    type="text" 
                    placeholder="e.g. Increase sales for the new collection"
                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
                    value={formData.campaignGoal}
                    onChange={(e) => setFormData({...formData, campaignGoal: e.target.value})}
                />
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Target Demographics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">Age Range</label>
                        <select 
                            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 outline-none font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
                            value={formData.demographics?.ageRange}
                            onChange={(e) => setFormData({
                                ...formData, 
                                demographics: { ...formData.demographics!, ageRange: e.target.value }
                            })}
                        >
                            <option value="13-17">13-17</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55+">55+</option>
                            <option value="All Ages">All Ages</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">Locations (comma separated)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Dakar, Plateau, Almadies"
                            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
                            value={formData.demographics?.specificLocations.join(', ')}
                            onChange={(e) => setFormData({
                                ...formData, 
                                demographics: { ...formData.demographics!, specificLocations: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                            })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">Interests (comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Fashion, Streetwear, Local Art"
                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-brand-950 focus:ring-4 focus:ring-brand-600/10 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
                        value={formData.demographics?.interests.join(', ')}
                        onChange={(e) => setFormData({
                            ...formData, 
                            demographics: { ...formData.demographics!, interests: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                        })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">{t.welcome.inputContext}</label>
                    <div className="relative">
                        <select 
                            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-900 dark:bg-white/5 dark:border-transparent focus:border-brand-600 outline-none font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
                            value={formData.country}
                            onChange={(e) => {
                                const country = countries.find(c => c.name === e.target.value);
                                setFormData({...formData, country: e.target.value, currency: country?.cur});
                            }}
                        >
                            {countries.map(c => <option key={c.name} value={c.name} className="text-slate-900">{c.name}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900 dark:text-white">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-widest ml-1">{t.welcome.inputLang}</label>
                    <div className="flex flex-wrap gap-2">
                      {availableLanguages.map(lang => (
                        <button
                          key={lang}
                          onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                            formData.preferredLanguages.includes(lang) 
                            ? 'bg-brand-950 border-brand-950 text-white shadow-lg' 
                            : 'bg-white border-slate-200 text-slate-500 dark:bg-transparent dark:border-white/10 dark:text-slate-300 hover:border-brand-950 hover:text-brand-950 dark:hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Feature Panel */}
        <div className="lg:col-span-1 bg-brand-950 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 afro-pattern opacity-30"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                     <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h3 className="text-xl font-bold">Brand DNA Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Our Cultural Intelligence engine extracts your brand essence to generate 30 days of high-end localized content.
                </p>
            </div>
            
            <div className="relative z-10 space-y-4 mt-8">
                {!hasVeoKey && (
                    <button 
                        // @ts-ignore
                        onClick={() => window.aistudio.openSelectKey().then(() => setHasVeoKey(true))}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        {t.welcome.unlockVideo}
                    </button>
                )}
                
                <button 
                    onClick={() => onStart(formData)}
                    disabled={!formData.businessName || formData.preferredLanguages.length === 0}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    {t.welcome.start} 
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
