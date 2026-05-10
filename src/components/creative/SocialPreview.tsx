
import React from 'react';
import { Asset, SocialPlatform } from '../../types';

interface SocialPreviewProps {
  platform: SocialPlatform;
  asset: Asset;
  onClose: () => void;
  t: any;
}

const SocialPreview: React.FC<SocialPreviewProps> = ({ platform, asset, onClose, t }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                    platform === 'instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' :
                    platform === 'facebook' ? 'bg-blue-600' : 
                    platform === 'linkedin' ? 'bg-blue-700' : 'bg-green-500'
                }`}>
                    <span className="text-xs font-black">{platform.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-slate-900 capitalize">{platform} Preview</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        {/* Content Preview */}
        <div className="p-8 bg-slate-50">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                {/* Mock Platform Header */}
                <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">Your Brand Name</p>
                        <p className="text-[10px] text-slate-500">
                          {platform === 'linkedin' ? 'Promoted • 1st' : 'Sponsored • Just now'}
                        </p>
                    </div>
                    {platform === 'linkedin' && <div className="text-blue-700 font-bold text-xs">+ Follow</div>}
                </div>

                {/* Media */}
                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                    {asset.type === 'video' ? (
                         <video src={asset.videoUrl} className="w-full h-full object-cover" autoPlay loop muted />
                    ) : (
                         <img src={asset.imageUrl} alt="Asset" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Platform Specific CTA Bar */}
                {(platform === 'facebook' || platform === 'linkedin') && (
                    <div className="px-4 py-3 bg-slate-50 border-y border-slate-100 flex justify-between items-center">
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight truncate">afribrand.ai</p>
                            <p className="text-xs font-bold text-slate-900 truncate">{asset.headline}</p>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-300 rounded text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                            Learn More
                        </button>
                    </div>
                )}

                {/* Action Bar */}
                <div className="p-4 space-y-3">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                          <span className="text-[10px] font-bold text-slate-400">Like</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded"></div>
                          <span className="text-[10px] font-bold text-slate-400">Comment</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-sm"></div>
                          <span className="text-[10px] font-bold text-slate-400">Share</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 line-clamp-3 font-medium">
                          {platform === 'linkedin' || platform === 'facebook' ? asset.caption : (
                            <>
                              <span className="font-bold mr-2">yourbrand</span>
                              {asset.caption}
                            </>
                          )}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-6 bg-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.dna.context}</p>
        </div>
      </div>
    </div>
  );
};

export default SocialPreview;
