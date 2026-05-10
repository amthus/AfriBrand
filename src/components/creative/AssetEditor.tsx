
import React, { useState } from 'react';
import { Asset, BrandDNA, Role, SocialPlatform } from '../../types';
import * as aiService from '../../services/geminiService';
import SocialPreview from './SocialPreview';

interface AssetEditorProps {
  asset: Asset;
  dna: BrandDNA;
  onSave: (asset: Asset) => void;
  onBack: () => void;
  userRole: Role;
  t: any;
}

const AssetEditor: React.FC<AssetEditorProps> = ({ asset, dna, onSave, onBack, userRole, t }) => {
  const [command, setCommand] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform | null>(null);

  const handleEdit = async () => {
    if (!command.trim() || userRole === 'Viewer') return;
    setIsUpdating(true);
    try {
      const updatedAsset = await aiService.editAssetWithNL(asset, command, dna);
      onSave(updatedAsset);
      setCommand('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadAsset = () => {
    const link = document.createElement('a');
    link.href = asset.type === 'video' ? (asset.videoUrl || '') : (asset.imageUrl || '');
    link.download = `afribrand_asset_${asset.id}.${asset.type === 'video' ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 animate-in slide-in-from-right duration-300 h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-900">{t.assets.edit}</h2>
        {userRole === 'Viewer' && (
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase">Read Only</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-[12px] border-white group">
            {asset.type === 'video' ? (
               <video src={asset.videoUrl} className="w-full h-full object-cover" controls autoPlay loop muted />
            ) : (
               <img src={asset.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            )}
            <div className="absolute top-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-black drop-shadow-lg leading-none" style={{ fontFamily: dna.fonts[0] }}>{asset.headline}</h3>
            </div>
            {isUpdating && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
             <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.assets.caption}</label>
                <p className="text-sm text-slate-700 leading-relaxed">{asset.caption}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div className={`p-8 rounded-[2rem] text-white space-y-6 shadow-xl shadow-amber-600/20 ${userRole === 'Viewer' ? 'bg-slate-400' : 'bg-amber-600'}`}>
            <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {t.assets.natural}
            </h3>
            <p className={`${userRole === 'Viewer' ? 'text-slate-200' : 'text-amber-100'} text-sm`}>{t.loading.generic}</p>
            
            <div className="relative">
                <textarea 
                    rows={4}
                    placeholder={userRole === 'Viewer' ? "Editing is disabled in viewer mode." : 'Try: "Translate the caption to Wolof", "Make the headline more urgent", "Add more emojis", "Make it friendly for the Benin market"'}
                    className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 placeholder-white/50 text-white outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none"
                    value={command}
                    disabled={userRole === 'Viewer'}
                    onChange={(e) => setCommand(e.target.value)}
                />
                <button 
                    onClick={handleEdit}
                    disabled={isUpdating || !command.trim() || userRole === 'Viewer'}
                    className="absolute bottom-4 right-4 bg-white text-amber-600 px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    Apply
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {['Make it punchier', 'Engaging for Lagos', 'Translate to Wolof', 'Add CTA', 'More informal'].map((tag) => (
                    <button 
                        key={tag} 
                        onClick={() => userRole !== 'Viewer' && setCommand(tag)}
                        disabled={userRole === 'Viewer'}
                        className="text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-800 px-2">Quick Tools</h4>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setPreviewPlatform('instagram')}
                    className="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    <span className="text-xs font-semibold">Preview IG</span>
                </button>
                <button 
                    onClick={() => setPreviewPlatform('facebook')}
                    className="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                    <span className="text-xs font-semibold">Preview FB</span>
                </button>
                <button 
                    onClick={() => setPreviewPlatform('linkedin')}
                    className="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z"></path></svg>
                    <span className="text-xs font-semibold">Preview LI</span>
                </button>
                <button 
                    onClick={() => setPreviewPlatform('whatsapp')}
                    className="flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <span className="text-xs font-semibold">Preview WA</span>
                </button>
                <button 
                  onClick={downloadAsset}
                  className="col-span-2 flex flex-col items-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors text-amber-600 bg-amber-50 border-amber-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span className="text-xs font-semibold">Export Asset</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      {previewPlatform && (
        <SocialPreview 
            platform={previewPlatform} 
            asset={asset} 
            onClose={() => setPreviewPlatform(null)} 
            t={t}
        />
      )}
    </div>
  );
};

export default AssetEditor;
