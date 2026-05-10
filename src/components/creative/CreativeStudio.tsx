
import React, { useState } from 'react';
import { BrandDNA, Asset, Campaign, GenerationStyle, AspectRatio, Role } from '../../types';
import * as aiService from '../../services/geminiService';

interface CreativeStudioProps {
  dna: BrandDNA;
  campaigns: Campaign[];
  onAssetGenerated: (asset: Asset) => void;
  userRole: Role;
  t: any;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ dna, campaigns, onAssetGenerated, userRole, t }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [style, setStyle] = useState<GenerationStyle>('natural');
  const [ratio, setRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [refinementCommand, setRefinementCommand] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleGenerate = async (type: 'image' | 'gif' = 'image') => {
    if (!prompt.trim() || !selectedCampaignId) return;
    setIsGenerating(true);
    try {
      const campaign = campaigns.find(c => c.id === selectedCampaignId)!;
      let newAsset: Asset;

      if (type === 'gif') {
        // Simulate GIF by generating a short video clip (placeholder API behavior)
        const videoUrl = await aiService.generateVideoAd(campaign, dna, ratio, 'fast');
        newAsset = {
          id: Math.random().toString(36).substr(2, 9),
          campaignId: selectedCampaignId,
          type: 'gif',
          videoUrl,
          headline: `Animated: ${campaign.title}`,
          caption: prompt,
          language: 'English',
          style,
          aspectRatio: ratio
        };
      } else {
        const result = await aiService.generateMagicAsset(prompt, campaign, dna, style, ratio);
        newAsset = {
          id: Math.random().toString(36).substr(2, 9),
          campaignId: selectedCampaignId,
          type: ratio === '9:16' ? 'story' : 'post',
          imageUrl: result.imageUrl,
          headline: result.headline,
          caption: result.caption,
          language: 'English', 
          style,
          aspectRatio: ratio
        };
      }
      
      setPreviewAsset(newAsset);
      onAssetGenerated(newAsset);
    } catch (error) {
      console.error(error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!previewAsset || !refinementCommand.trim()) return;
    setIsRefining(true);
    try {
      const updatedAsset = await aiService.editAssetWithNL(previewAsset, refinementCommand, dna);
      setPreviewAsset(updatedAsset);
      onAssetGenerated(updatedAsset);
      setRefinementCommand('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-10 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></div>
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">AI Creative Studio</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">On-Brand Asset Creator</h2>
          <p className="text-slate-500 font-medium max-w-xl">Generate custom social media assets that perfectly align with your African brand identity using natural language.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.ideation.customPrompt}</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                rows={4}
                placeholder="e.g. 'A vibrant Instagram post for our new jollof rice seasoning launch, featuring a modern kitchen setting with warm lighting...'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.campaign.schedule}</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.assets.visualStyle}</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                >
                  <option value="natural">Natural Photography</option>
                  <option value="professional">Studio Professional</option>
                  <option value="3d-render">3D Render</option>
                  <option value="illustration">Illustration</option>
                  <option value="anime">Anime Style</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.assets.formatRatio}</label>
              <div className="flex gap-2">
                {(['1:1', '9:16', '16:9', '4:5'] as AspectRatio[]).map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${ratio === r ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleGenerate('image')}
                disabled={isGenerating || !prompt.trim() || userRole === 'Viewer'}
                className="flex-[2] py-4 bg-brand-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-600/20 hover:bg-brand-500 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                )}
                {isGenerating ? 'AI is Crafting...' : 'Generate Image'}
              </button>
              <button 
                onClick={() => handleGenerate('gif')}
                disabled={isGenerating || !prompt.trim() || userRole === 'Viewer'}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z"></path></svg>
                   <span>GIF</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex gap-4">
             <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <div className="space-y-1">
                <p className="text-xs font-black text-amber-900 uppercase tracking-wider">Brand DNA Locked</p>
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">The AI is automatically applying your colors ({dna.colors.join(', ')}), tone ({dna.tone}), and cultural context ({dna.localContext}) to this generation.</p>
             </div>
          </div>
        </div>

        {/* Preview & Refinement */}
        <div className="lg:col-span-7 space-y-6">
          {previewAsset ? (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100"
                  style={{ aspectRatio: ratio.replace(':', '/') }}
                >
                  {previewAsset.type === 'gif' || previewAsset.type === 'video' ? (
                    <video 
                      src={previewAsset.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img src={previewAsset.imageUrl} alt="AI Generated" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-widest">
                    {previewAsset.type === 'gif' ? 'Animated GIF' : 'Static Image'}
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headline</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">{previewAsset.headline}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caption</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{previewAsset.caption}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Natural Language Editing</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. 'Make it more humorous' or 'Add more local slang'..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 outline-none focus:border-brand-500 transition-all"
                        value={refinementCommand}
                        onChange={(e) => setRefinementCommand(e.target.value)}
                      />
                      <button 
                        onClick={handleRefine}
                        disabled={isRefining || !refinementCommand.trim()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        {isRefining ? 'Refining...' : 'Refine'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-10 space-y-4">
               <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               </div>
               <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">Your Creative Canvas</p>
                  <p className="text-sm text-slate-500 font-medium max-w-xs">Describe your vision on the left, and AfriBrand AI will bring it to life with your brand's unique DNA.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;
