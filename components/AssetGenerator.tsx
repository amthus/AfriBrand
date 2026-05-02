
import React, { useState } from 'react';
import { Asset, Campaign, PreviewPlatform, GenerationStyle, BrandDNA, AspectRatio, VideoQualityMode, Product, SocialAccount, SocialPlatform, Role } from '../types';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { socialService } from '../socialService';

interface AssetGeneratorProps {
  assets: Asset[];
  campaign: Campaign;
  dna: BrandDNA;
  onEdit: (asset: Asset) => void;
  onGenerateVideo: (ratio: AspectRatio, mode: VideoQualityMode) => void;
  onGenerateCarousel: (ratio: AspectRatio) => void;
  onGenerateGif: (ratio: AspectRatio) => void;
  onGenerateMagic: (prompt: string, style: GenerationStyle, ratio: AspectRatio) => void;
  onOpenStudio?: () => void;
  onRegenerate: (style: GenerationStyle, ratio: AspectRatio, product?: Product) => void;
  t: any;
  socialAccounts: SocialAccount[];
  onConnectAccount: (platform: SocialPlatform) => void;
  onPostAsset: (platform: SocialPlatform, assetId: string) => Promise<boolean>;
  userRole: Role;
}

const AssetGenerator: React.FC<AssetGeneratorProps> = ({ 
  assets, campaign, dna, onEdit, onGenerateVideo, onGenerateCarousel, onGenerateGif, onGenerateMagic, onOpenStudio, onRegenerate, t, socialAccounts, onConnectAccount, onPostAsset, userRole 
}) => {
  const [platform, setPlatform] = useState<PreviewPlatform>('instagram');
  const [currentStyle, setCurrentStyle] = useState<GenerationStyle>('natural');
  const [currentRatio, setCurrentRatio] = useState<AspectRatio>('1:1');
  const [videoMode, setVideoMode] = useState<VideoQualityMode>('fast');
  const [exporting, setExporting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [postingStates, setPostingStates] = useState<Record<string, boolean>>({});
  
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGeneratingMagic, setIsGeneratingMagic] = useState(false);
  
  // Mock Catalog Data
  const catalog = socialService.getMockCatalog();

  const platforms: { id: PreviewPlatform; icon: React.ReactNode; label: string; ratios: AspectRatio[] }[] = [
    { 
      id: 'instagram', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>, 
      label: 'Instagram', 
      ratios: ['1:1', '4:5', '9:16'] 
    },
    { 
      id: 'tiktok', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v3M9 10a9 9 0 019 9"></path></svg>, 
      label: 'TikTok', 
      ratios: ['9:16'] 
    },
    { 
      id: 'facebook', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>, 
      label: 'Facebook', 
      ratios: ['1:1', '9:16'] 
    },
    { 
      id: 'whatsapp', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>, 
      label: 'WhatsApp', 
      ratios: ['9:16'] 
    },
    { 
      id: 'linkedin', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>, 
      label: 'LinkedIn', 
      ratios: ['1.91:1', '1:1', '4:5'] 
    },
    { 
      id: 'youtube-shorts', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
      label: 'Shorts', 
      ratios: ['9:16'] 
    },
    { 
      id: 'youtube', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>, 
      label: 'YouTube', 
      ratios: ['16:9'] 
    },
    { 
      id: 'print', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>, 
      label: 'Print', 
      ratios: ['2:3', '3:4', '1:1'] 
    }
  ];

  // Fix: Derive selectedPlatformData from the platforms array using the current platform state
  const selectedPlatformData = platforms.find(p => p.id === platform);

  const styles: { id: GenerationStyle; label: string; icon: React.ReactNode }[] = [
    { id: 'natural', label: 'Natural', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
    { id: 'professional', label: 'Pro Studio', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
    { id: 'anime', label: 'Anime', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> },
    { id: 'manga', label: 'Manga', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> },
    { id: '3d-render', label: '3D Render', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> },
    { id: 'illustration', label: 'Illustration', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg> },
  ];

  const handleRatioChange = (ratio: AspectRatio) => {
    setCurrentRatio(ratio);
    onRegenerate(currentStyle, ratio, selectedProduct || undefined);
  };

  const handleStyleChange = (style: GenerationStyle) => {
    setCurrentStyle(style);
    onRegenerate(style, currentRatio, selectedProduct || undefined);
  };

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement('a');
    link.href = asset.type === 'video' ? (asset.videoUrl || '') : (asset.imageUrl || '');
    link.download = `afribrand_${campaign.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${asset.id}.${asset.type === 'video' ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async (asset: Asset) => {
    if (!asset.imageUrl) return;
    const pdf = new jsPDF({
      orientation: asset.aspectRatio === '9:16' || asset.aspectRatio === '2:3' || asset.aspectRatio === '3:4' ? 'p' : 'l',
      unit: 'px',
      format: [800, 800 * (asset.aspectRatio === '9:16' ? 1.77 : asset.aspectRatio === '16:9' ? 0.56 : 1)]
    });
    
    const img = new Image();
    img.src = asset.imageUrl;
    await new Promise(resolve => img.onload = resolve);
    
    pdf.addImage(img, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    pdf.save(`${campaign.title}_${asset.type}_${asset.id}.pdf`);
  };

  const exportAllAssets = async (format: 'zip' | 'pdf' = 'zip') => {
    if (assets.length === 0) return;
    setExporting(true);
    
    try {
      const safeTitle = campaign.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'campaign';
      
      if (format === 'zip') {
        const zip = new JSZip();
        const folder = zip.folder(safeTitle);

        const promises = assets.map(async (asset, index) => {
          const safeStyle = asset.style.toLowerCase();
          const safeRatio = asset.aspectRatio.replace(':', '-');
          let fileName = `${safeTitle}_${safeStyle}_${safeRatio}_${asset.language}_${index}`;
          
          if (asset.type === 'video' && asset.videoUrl) {
             const response = await fetch(asset.videoUrl);
             const blob = await response.blob();
             folder?.file(`${fileName}.mp4`, blob);
          } else if (asset.imageUrl) {
             const parts = asset.imageUrl.split(',');
             if (parts.length === 2) {
                 folder?.file(`${fileName}.png`, parts[1], {base64: true});
             }
          }
        });

        await Promise.all(promises);
        const content = await zip.generateAsync({type: "blob"});
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `afribrand_${safeTitle}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pdf = new jsPDF();
        for (let i = 0; i < assets.length; i++) {
          const asset = assets[i];
          if (asset.imageUrl) {
            const img = new Image();
            img.src = asset.imageUrl;
            await new Promise(resolve => img.onload = resolve);
            if (i > 0) pdf.addPage();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(img, 'PNG', 10, 10, pdfWidth - 20, (pdfWidth - 20) * (asset.aspectRatio === '9:16' ? 1.77 : 1));
          }
        }
        pdf.save(`afribrand_${safeTitle}_all.pdf`);
      }
    } catch (e) {
      console.error(e);
      alert("Could not export assets.");
    } finally {
      setExporting(false);
    }
  };

  const getOverlayForPlatform = (asset: Asset) => {
     const handle = `@${dna.name.replace(/\s/g, '').toLowerCase()}`;
     
     if (platform === 'linkedin') {
         return (
             <div className="absolute inset-0 flex flex-col pointer-events-none">
                 {/* LinkedIn Header */}
                 <div className="bg-white p-3 border-b border-slate-100 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-800 text-[10px] font-bold">{dna.name.charAt(0)}</div>
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 leading-none">{dna.name}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">Brand Identity • Just now • 🌐</span>
                     </div>
                 </div>
                 
                 {/* Content Spacer */}
                 <div className="flex-1"></div>

                 {/* LinkedIn Footer */}
                 <div className="bg-white p-3 border-t border-slate-100">
                     <div className="flex items-center justify-between text-slate-500 mb-3 text-[10px]">
                         <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center text-[6px] text-white">👍</div>
                            <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center text-[6px] text-white">👏</div>
                            <span className="ml-1">48</span>
                         </div>
                         <div>5 comments • 1 repost</div>
                     </div>
                     <div className="flex justify-between border-t border-slate-200 pt-3">
                         {['Like', 'Comment', 'Repost', 'Send'].map(action => (
                            <div key={action} className="flex items-center gap-1 text-slate-500">
                                <span className="text-[10px] font-semibold">{action}</span>
                            </div>
                         ))}
                     </div>
                 </div>
             </div>
         )
     }

     if (platform === 'tiktok') {
        return (
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none text-white bg-gradient-to-b from-black/20 via-transparent to-black/60">
                <div className="self-center mt-8 text-sm font-bold drop-shadow-md flex gap-4 opacity-90">
                    <span className="opacity-70">Following</span>
                    <span className="border-b-2 border-white pb-1">For You</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-end justify-between">
                        <div className="space-y-2 mb-4 w-3/4">
                            <p className="font-bold text-sm shadow-black drop-shadow-md">{handle}</p>
                            <p className="text-xs opacity-90 line-clamp-2 drop-shadow-md leading-relaxed">{asset.caption}</p>
                            <div className="flex items-center gap-2 text-[10px] opacity-80">
                                <svg className="w-3 h-3 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v3M9 10a9 9 0 019 9"></path></svg>
                                <span>Original Sound - {dna.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-5 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200 border border-white flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg">
                                {dna.name.charAt(0)}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-md"><svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
                                <span className="text-[10px] font-bold shadow-black drop-shadow-md">8.5k</span>
                            </div>
                             <div className="flex flex-col items-center gap-1">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-md"><svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg></div>
                                <span className="text-[10px] font-bold shadow-black drop-shadow-md">402</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
     }

     if (platform === 'instagram') {
         if (asset.aspectRatio === '9:16') {
             return (
                 <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none text-white bg-gradient-to-b from-black/30 via-transparent to-black/60">
                     <div className="flex items-center gap-2 mt-4">
                         <div className="w-8 h-8 rounded-full bg-slate-200 border border-white/50 flex items-center justify-center text-slate-900 font-bold text-xs">{dna.name.charAt(0)}</div>
                         <span className="text-xs font-bold drop-shadow-md">{dna.name}</span>
                         <span className="text-xs opacity-70 ml-auto bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-md">12h</span>
                     </div>
                     <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="w-full flex justify-between items-end px-2">
                             <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-xs font-bold border border-white/20 flex items-center gap-2">
                                Send Message <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                             </div>
                        </div>
                     </div>
                 </div>
             )
         } else {
             return (
                 <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">1/3</div>
                     <div className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full text-white backdrop-blur-sm">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                     </div>
                 </div>
             )
         }
     }

     return <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none bg-black/40 text-white text-xs"><p>@{dna.name}</p></div>
  };

  const handlePostClick = async (platform: SocialPlatform, assetId: string) => {
      const key = `${assetId}-${platform}`;
      setPostingStates(prev => ({ ...prev, [key]: true }));
      try {
          await onPostAsset(platform, assetId);
      } finally {
          setPostingStates(prev => ({ ...prev, [key]: false }));
      }
  };

  return (
    <div className="space-y-12 py-12 animate-in zoom-in duration-500">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-10 h-[2px] bg-amber-600"></span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">{t.assets.hub}</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">{campaign.title}</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">{campaign.concept}</p>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-auto">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-1 overflow-x-auto">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlatform(p.id);
                  if (!p.ratios.includes(currentRatio)) {
                    handleRatioChange(p.ratios[0]);
                  }
                }}
                className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center min-w-[70px] flex-1 ${
                  platform === p.id ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div className="mb-1">{p.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
               <div className="flex gap-2">
                    <button onClick={() => setVideoMode('fast')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${videoMode === 'fast' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>Fast</button>
                    <button onClick={() => setVideoMode('high-quality')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${videoMode === 'high-quality' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>High</button>
               </div>
               <button 
                onClick={() => userRole !== 'Viewer' ? onGenerateVideo(currentRatio, videoMode) : null}
                disabled={userRole === 'Viewer'}
                className={`p-3 rounded-xl shadow-lg transition-all ${userRole !== 'Viewer' ? 'bg-amber-600 text-white shadow-amber-600/20 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                title="Generate Video"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               </button>
               <button 
                onClick={() => userRole !== 'Viewer' ? onGenerateCarousel(currentRatio) : null}
                disabled={userRole === 'Viewer'}
                className={`p-3 rounded-xl shadow-lg transition-all ${userRole !== 'Viewer' ? 'bg-brand-600 text-white shadow-brand-600/20 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                title="Generate Carousel"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
               </button>
               <button 
                onClick={() => userRole !== 'Viewer' ? onGenerateGif(currentRatio) : null}
                disabled={userRole === 'Viewer'}
                className={`p-3 rounded-xl shadow-lg transition-all ${userRole !== 'Viewer' ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                title="Generate GIF"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={onOpenStudio}
              className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              AI Creative Studio
            </button>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-brand-600/10 rounded-xl flex items-center justify-center text-brand-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Magic Prompt: 'Create a post about a new sale...'"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  value={magicPrompt}
                  onChange={(e) => setMagicPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && magicPrompt.trim() && userRole !== 'Viewer') {
                      onGenerateMagic(magicPrompt, currentStyle, currentRatio);
                      setMagicPrompt('');
                    }
                  }}
                />
                <button 
                  onClick={async () => {
                    if (magicPrompt.trim() && userRole !== 'Viewer') {
                      setIsGeneratingMagic(true);
                      try {
                        await onGenerateMagic(magicPrompt, currentStyle, currentRatio);
                        setMagicPrompt('');
                      } finally {
                        setIsGeneratingMagic(false);
                      }
                    }
                  }}
                  disabled={!magicPrompt.trim() || userRole === 'Viewer' || isGeneratingMagic}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-500 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGeneratingMagic ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : null}
                  {isGeneratingMagic ? 'Generating...' : 'Generate'}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.assets.visualStyle}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleStyleChange(s.id)}
                      disabled={userRole === 'Viewer'}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${currentStyle === s.id ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 shadow-sm' : 'bg-slate-50 border-slate-100'} ${userRole === 'Viewer' ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-200'}`}
                    >
                      <div className="text-slate-600">{s.icon}</div>
                      <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.assets.formatRatio}</h4>
                <div className="flex flex-col gap-2">
                  {selectedPlatformData?.ratios.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => handleRatioChange(ratio)}
                      disabled={userRole === 'Viewer'}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex justify-between items-center transition-all ${currentRatio === ratio ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                    >
                      <span>{ratio}</span>
                    </button>
                  ))}
                </div>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Power Actions</h4>
              <button 
                  onClick={() => onRegenerate('natural', '1:1')}
                  disabled={userRole === 'Viewer'}
                  className="w-full py-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl font-black text-[11px] shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <span>Lagos engagement (1:1 Natural)</span>
              </button>
              <button 
                  onClick={() => onGenerateVideo('9:16', 'fast')}
                  disabled={userRole === 'Viewer'}
                  className="w-full py-4 bg-gradient-to-br from-pink-600 to-rose-700 text-white rounded-2xl font-black text-[11px] shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>Anime TikTok Ad (9:16)</span>
              </button>
           </div>
           
           <div className="space-y-3 pt-4 border-t border-slate-100">
             <button onClick={() => exportAllAssets('zip')} disabled={exporting || assets.length === 0} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                {exporting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Export ZIP</span>}
             </button>
             <button onClick={() => exportAllAssets('pdf')} disabled={exporting || assets.length === 0} className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                <span>Export PDF</span>
             </button>
           </div>
        </div>

        <div className="lg:col-span-3">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {assets.map((asset) => (
              <div key={asset.id} className="group flex flex-col space-y-6">
                <div 
                    className={`relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 ring-1 ring-slate-100 transition-all duration-500 mx-auto w-full`} 
                    style={{ aspectRatio: asset.aspectRatio.replace(':', '/') }}
                >
                  {asset.type === 'video' ? (
                    <video src={asset.videoUrl} className="w-full h-full object-cover" controls autoPlay loop muted />
                  ) : (
                    <img src={asset.imageUrl} alt="Asset" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  )}
                  {getOverlayForPlatform(asset)}
                  <div className="absolute top-4 right-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-md z-20">{asset.language}</div>
                  {userRole !== 'Viewer' && asset.type !== 'video' && (
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8 backdrop-blur-md z-10">
                        <button onClick={() => onEdit(asset)} className="w-full px-6 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">{t.assets.refine}</button>
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 relative group-hover:shadow-amber-100 transition-all">
                  <h4 className="text-xl font-black text-slate-900 mb-3 truncate mt-2">{asset.headline}</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3 font-medium">{asset.caption}</p>
                  
                  {asset.metrics && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Reach</p>
                        <p className="text-xs font-bold text-slate-900">{asset.metrics.reach.toLocaleString()}</p>
                      </div>
                      <div className="text-center border-x border-slate-200">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Eng.</p>
                        <p className="text-xs font-bold text-slate-900">{asset.metrics.engagement.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Conv.</p>
                        <p className="text-xs font-bold text-slate-900">{asset.metrics.conversions.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-50 pt-5 gap-3">
                     <div className="flex gap-2">
                     {['instagram', 'facebook', 'whatsapp'].map(p => {
                         const account = socialAccounts.find(a => a.platform === p);
                         const isPosted = asset.postedTo?.includes(p as SocialPlatform);
                         const isPosting = postingStates[`${asset.id}-${p}`];
                         return (
                            <button key={p} onClick={() => !isPosted && account?.connected && handlePostClick(p as SocialPlatform, asset.id)} disabled={userRole === 'Viewer' || isPosting || isPosted} className={`p-2 rounded-full border transition-all ${isPosted ? 'bg-green-100 text-green-600 border-green-200' : account?.connected ? 'bg-white text-slate-400 hover:text-amber-600 border-slate-100' : 'bg-slate-50 text-slate-300 border-transparent'} ${userRole === 'Viewer' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {isPosting ? <div className="w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div> : <span>{p.charAt(0).toUpperCase()}</span>}
                            </button>
                         );
                     })}
                     </div>
                     <div className="flex gap-2 ml-auto">
                        <button onClick={() => exportToPDF(asset)} className="p-2 rounded-full border bg-white text-slate-400 hover:text-brand-600 border-slate-100 transition-colors" title="Download PDF">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </button>
                        <button onClick={() => downloadAsset(asset)} className="p-2 px-4 rounded-full border transition-colors flex items-center gap-2 font-bold text-xs bg-slate-50 text-slate-400 hover:bg-slate-100">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                           <span>{asset.type === 'video' ? 'MP4' : 'PNG'}</span>
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetGenerator;
