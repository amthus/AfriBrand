
import React, { useState, useEffect } from 'react';
import { AppStep, UserInput, BrandDNA, Campaign, Asset, GenerationStyle, AspectRatio, SocialAccount, SocialPlatform, Product, Role } from './types';
import * as aiService from './geminiService';
import { socialService } from './socialService';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import AnalysisTransition from './components/AnalysisTransition';
import BrandDNAView from './components/BrandDNAView';
import CampaignPlanner from './components/CampaignPlanner';
import AssetGenerator from './components/AssetGenerator';
import AssetEditor from './components/AssetEditor';
import CreativeStudio from './components/CreativeStudio';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import BrandSettings from './components/BrandSettings';
import LegalView from './components/LegalView';
import SupportView from './components/SupportView';
import { translations, Language } from './i18n';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [prevStep, setPrevStep] = useState<AppStep>('landing');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [lang, setLang] = useState<Language>('fr');
  const [userRole, setUserRole] = useState<Role>('Admin');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [userInput, setUserInput] = useState<UserInput>({
    businessName: '',
    url: '',
    description: '',
    country: 'Senegal',
    targetAudience: 'Middle-class urban professionals',
    campaignGoal: 'Brand awareness and engagement',
    preferredLanguages: ['French', 'Wolof'],
    currency: 'FCFA',
    defaultStyle: 'natural'
  });
  const [dna, setDna] = useState<BrandDNA | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'instagram', connected: false },
    { platform: 'facebook', connected: false },
    { platform: 'whatsapp', connected: false }
  ]);

  const t = translations[lang];
  const isLight = theme === 'light';

  const startAnalysis = async (input: UserInput) => {
    setUserInput(input);
    setStep('analysis');
    try {
      const result = await aiService.analyzeBrandDNA(input);
      setDna(result);
      // Let the analysis animation play for at least 3 seconds
      setTimeout(() => setStep('dna'), 3500);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Check your API key.");
      setStep('welcome');
    }
  };

  const generateIdeas = async () => {
    if (!dna) return;
    setLoading(true);
    setLoadingMessage(t.loading.curating);
    try {
      const results = await aiService.generateCampaigns(dna, userInput);
      setCampaigns(results);
      setStep('ideation');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateMoreIdeas = async () => {
    if (!dna) return;
    setLoading(true);
    setLoadingMessage("AI is exploring more cultural hooks for your brand...");
    try {
      const results = await aiService.generateCampaigns(dna, userInput);
      // Avoid duplicates if possible, or just append
      setCampaigns(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNew = results.filter(c => !existingIds.has(c.id));
        // If all are duplicates (unlikely with AI), just append with new IDs
        if (uniqueNew.length === 0) {
          return [...prev, ...results.map(c => ({ ...c, id: Math.random().toString(36).substr(2, 5) }))];
        }
        return [...prev, ...uniqueNew];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomCampaign = async (prompt: string) => {
    if (!dna) return;
    setLoading(true);
    setLoadingMessage("AI is crafting your custom campaign strategy...");
    try {
      const result = await aiService.generateCustomCampaign(dna, userInput, prompt);
      setCampaigns(prev => [result, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCampaignAssets = async (campaign: Campaign, styleOverride?: GenerationStyle, ratio: AspectRatio = '1:1', product?: Product) => {
    if (!dna) return;
    setSelectedCampaign(campaign);
    setLoading(true);
    setLoadingMessage(t.loading.visuals);
    try {
      const style = styleOverride || userInput.defaultStyle || 'natural';
      const imageUrl = await aiService.generateAssetVisual(campaign, dna, 'post', style, ratio, product);
      
      const newAssetsPromises = userInput.preferredLanguages.map(async (language) => {
        const content = await aiService.generateAssetContent(campaign, dna, language, product);
        return {
          id: Math.random().toString(36).substr(2, 9),
          campaignId: campaign.id,
          type: ratio === '9:16' ? 'story' : 'post' as any,
          imageUrl,
          headline: content.headline,
          caption: content.caption,
          language: language,
          style,
          aspectRatio: ratio
        } as Asset;
      });

      const newAssets = await Promise.all(newAssetsPromises);
      setAssets(prev => [...prev, ...newAssets]);
      setStep('assets');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async (ratio: AspectRatio = '9:16', mode: 'fast' | 'high-quality' = 'fast') => {
    if (!dna || !selectedCampaign) return;
    
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setLoading(true);
    setLoadingMessage(t.loading.video);
    try {
      const videoUrl = await aiService.generateVideoAd(selectedCampaign, dna, ratio, mode);
      const newVideoAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        campaignId: selectedCampaign.id,
        type: 'video',
        videoUrl,
        headline: selectedCampaign.title,
        caption: `Exclusive promo for ${selectedCampaign.title}`,
        language: userInput.preferredLanguages[0],
        style: 'natural',
        aspectRatio: ratio
      };
      setAssets(prev => [...prev, newVideoAsset]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateMagicAsset = async (prompt: string, style: GenerationStyle, ratio: AspectRatio) => {
    if (!dna || !selectedCampaign) return;
    setLoading(true);
    setLoadingMessage("AI is crafting your custom asset...");
    try {
      const result = await aiService.generateMagicAsset(prompt, selectedCampaign, dna, style, ratio);
      const newAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        campaignId: selectedCampaign.id,
        type: ratio === '9:16' ? 'story' : 'post' as any,
        imageUrl: result.imageUrl,
        headline: result.headline,
        caption: result.caption,
        language: userInput.preferredLanguages[0],
        style,
        aspectRatio: ratio
      };
      setAssets(prev => [...prev, newAsset]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCarousel = async (ratio: AspectRatio = '1:1') => {
    if (!dna || !selectedCampaign) return;
    setLoading(true);
    setLoadingMessage("Generating Carousel Storyboard...");
    try {
      const content = await aiService.generateCarouselContent(selectedCampaign, dna, userInput.preferredLanguages[0]);
      const imageUrl = await aiService.generateAssetVisual(selectedCampaign, dna, 'carousel', userInput.defaultStyle, ratio);
      
      const newCarouselAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        campaignId: selectedCampaign.id,
        type: 'carousel',
        imageUrl, // Main preview image
        carouselImages: [imageUrl, imageUrl, imageUrl], // In a real app, generate distinct ones
        headline: content.slides[0].headline,
        caption: content.slides.map((s, i) => `Slide ${i+1}: ${s.caption}`).join('\n\n'),
        language: userInput.preferredLanguages[0],
        style: userInput.defaultStyle || 'natural',
        aspectRatio: ratio
      };
      setAssets(prev => [...prev, newCarouselAsset]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateGif = async (ratio: AspectRatio = '1:1') => {
    if (!dna || !selectedCampaign) return;
    setLoading(true);
    setLoadingMessage("Creating Animated GIF...");
    try {
      // Simulate GIF by generating a short video clip
      const videoUrl = await aiService.generateVideoAd(selectedCampaign, dna, ratio, 'fast');
      const newGifAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        campaignId: selectedCampaign.id,
        type: 'gif',
        videoUrl, // Use video as source for GIF preview
        headline: `Animated: ${selectedCampaign.title}`,
        caption: `Dynamic motion asset for ${selectedCampaign.title}`,
        language: userInput.preferredLanguages[0],
        style: userInput.defaultStyle || 'natural',
        aspectRatio: ratio
      };
      setAssets(prev => [...prev, newGifAsset]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (platform: SocialPlatform) => {
    try {
      const success = await socialService.connectAccount(platform);
      if (success) {
        setSocialAccounts(prev => prev.map(acc => 
          acc.platform === platform ? { ...acc, connected: true } : acc
        ));
      }
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  const handleDisconnectAccount = async (platform: SocialPlatform) => {
    try {
      const success = await socialService.disconnectAccount(platform);
      if (success) {
        setSocialAccounts(prev => prev.map(acc => 
          acc.platform === platform ? { ...acc, connected: false } : acc
        ));
      }
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    }
  };

  const handlePostAsset = async (platform: SocialPlatform, assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return false;

    try {
      const success = await socialService.postAsset(platform, assetId, {
        imageUrl: asset.imageUrl,
        videoUrl: asset.videoUrl,
        caption: asset.caption,
        headline: asset.headline
      });

      if (success) {
        setAssets(prev => prev.map(a => {
          if (a.id === assetId) {
            const postedTo = a.postedTo || [];
            if (!postedTo.includes(platform)) {
              return { ...a, postedTo: [...postedTo, platform] };
            }
          }
          return a;
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to post to ${platform}:`, error);
      return false;
    }
  };

  const navigateToLegal = (type: 'privacy' | 'terms') => {
    if (step !== 'legal' && step !== 'support') setPrevStep(step);
    setLegalType(type);
    setStep('legal');
  };

  const navigateToSupport = () => {
    if (step !== 'legal' && step !== 'support') setPrevStep(step);
    setStep('support');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isLight ? 'bg-slate-50 text-slate-900 light-theme' : 'bg-brand-950 text-slate-50'}`}>
      
      <div className="fixed inset-0 pointer-events-none z-0 afro-pattern opacity-100"></div>
      
      {step !== 'landing' && step !== 'auth' && step !== 'analysis' && (
        <header className={`sticky top-0 z-50 border-b transition-all ${isLight ? 'bg-white/80 border-slate-200/60 backdrop-blur-xl' : 'glass-panel border-white/5'}`}>
          <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center py-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('welcome')}>
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/20 group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <span className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>AfriBrand<span className="text-brand-600">.AI</span></span>
                <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest leading-none">Enterprise</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className={`flex rounded-full p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'en' ? (isLight ? 'bg-white shadow-sm text-brand-900' : 'bg-brand-600 text-white shadow-lg shadow-brand-600/20') : 'opacity-50 hover:opacity-100'}`}>EN</button>
                  <button onClick={() => setLang('fr')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'fr' ? (isLight ? 'bg-white shadow-sm text-brand-900' : 'bg-brand-600 text-white shadow-lg shadow-brand-600/20') : 'opacity-50 hover:opacity-100'}`}>FR</button>
               </div>

               <div className={`h-8 w-px ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}></div>

                <div className="flex items-center gap-3">
                  {step !== 'welcome' && step !== 'landing' && step !== 'auth' && (
                    <>
                      <button 
                        onClick={() => setStep('studio')}
                        className={`p-2.5 rounded-full transition-all group ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                        title="Creative Studio"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                      </button>
                      <button 
                        onClick={() => setStep('calendar')}
                        className={`p-2.5 rounded-full transition-all group ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                        title="Calendar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </button>
                      <button 
                        onClick={() => setStep('settings')}
                        className={`p-2.5 rounded-full transition-all group ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                        title="Settings"
                      >
                          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </button>
                    </>
                  )}
               </div>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 relative z-10 ${step === 'landing' || step === 'auth' || step === 'analysis' ? '' : 'max-w-7xl mx-auto w-full px-6 py-10'}`}>
        {loading && (
          <div className="fixed inset-0 z-[100] bg-brand-950/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 transition-opacity duration-300">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-2 border-white/5 rounded-full absolute inset-0"></div>
                <div className="w-24 h-24 border-t-2 border-brand-500 rounded-full animate-spin absolute inset-0"></div>
                <div className="w-16 h-16 border-b-2 border-amber-500 rounded-full animate-spin absolute inset-4 direction-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white animate-pulse">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   </div>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{loadingMessage}</h3>
            <p className="text-slate-400 max-w-sm text-sm font-medium">{t.loading.generic}</p>
          </div>
        )}

        {step === 'landing' && (
          <Landing 
            onStart={() => setStep('auth')} 
            onNavigate={(s, t) => {
              if (s === 'legal' && t) navigateToLegal(t);
              else if (s === 'support') navigateToSupport();
            }} 
          />
        )}
        {step === 'auth' && <Auth onAuth={() => setStep('welcome')} />}
        {step === 'welcome' && <Welcome onStart={startAnalysis} t={t} />}
        {step === 'analysis' && <AnalysisTransition input={userInput} t={t} />}
        {step === 'settings' && <BrandSettings socialAccounts={socialAccounts} onConnectAccount={handleConnectAccount} onDisconnectAccount={handleDisconnectAccount} onBack={() => setStep('welcome')} userRole={userRole} onSwitchRole={setUserRole} />}
        {step === 'dna' && dna && <BrandDNAView dna={dna} onNext={generateIdeas} t={t} />}
        {step === 'ideation' && <CampaignPlanner campaigns={campaigns} assets={assets} onSelect={(c) => generateCampaignAssets(c)} onViewAnalytics={() => setStep('analytics')} onGenerateMore={generateMoreIdeas} onGenerateCustom={generateCustomCampaign} t={t} country={userInput.country} userRole={userRole} />}
        {step === 'assets' && (
          <AssetGenerator 
            assets={assets} 
            dna={dna!}
            onEdit={(a) => { setSelectedAsset(a); setStep('editor'); }} 
            campaign={selectedCampaign!} 
            onGenerateVideo={generateVideo}
            onGenerateCarousel={generateCarousel}
            onGenerateGif={generateGif}
            onGenerateMagic={generateMagicAsset}
            onOpenStudio={() => setStep('studio')}
            onRegenerate={(style, ratio, product) => generateCampaignAssets(selectedCampaign!, style, ratio, product)}
            t={t}
            socialAccounts={socialAccounts}
            onConnectAccount={handleConnectAccount}
            onPostAsset={handlePostAsset}
            userRole={userRole}
          />
        )}
        {step === 'editor' && selectedAsset && dna && (
          <AssetEditor 
            asset={selectedAsset} 
            dna={dna} 
            onSave={(a) => { setAssets(prev => prev.map(old => old.id === a.id ? a : old)); setSelectedAsset(a); }} 
            onBack={() => setStep('assets')}
            userRole={userRole}
          />
        )}
        {step === 'studio' && dna && (
          <CreativeStudio 
            dna={dna} 
            campaigns={campaigns} 
            onAssetGenerated={(a) => setAssets(prev => {
              const exists = prev.find(x => x.id === a.id);
              if (exists) return prev.map(x => x.id === a.id ? a : x);
              return [...prev, a];
            })}
            userRole={userRole}
            t={t}
          />
        )}
        {step === 'calendar' && <CalendarView campaigns={campaigns} onBack={() => setStep('assets')} />}
        {step === 'analytics' && <AnalyticsView assets={assets} campaigns={campaigns} onBack={() => setStep('ideation')} t={t} />}
        {step === 'legal' && <LegalView type={legalType} onBack={() => setStep(prevStep)} />}
        {step === 'support' && <SupportView onBack={() => setStep(prevStep)} />}
      </main>

      {step !== 'landing' && step !== 'analysis' && (
        <footer className={`py-8 text-center border-t backdrop-blur-sm ${isLight ? 'bg-white/50 border-slate-200/60 text-slate-500' : 'bg-brand-900/30 border-white/5 text-slate-500'}`}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold uppercase tracking-wider">
             <p>© 2025 AfriBrand AI • Propriété de Malthus AMETEPE</p>
             <div className="flex gap-6 items-center">
                <button onClick={navigateToSupport} className="hover:text-brand-600 transition-colors">Support</button>
                <button onClick={() => navigateToLegal('privacy')} className="hover:text-brand-600 transition-colors">Privacy</button>
                <button onClick={() => navigateToLegal('terms')} className="hover:text-brand-600 transition-colors">Terms</button>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
