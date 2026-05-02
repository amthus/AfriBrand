
import React, { useState } from 'react';
import { Campaign, Asset, Role } from '../types';
import { socialService } from '../socialService';

interface CampaignPlannerProps {
  campaigns: Campaign[];
  assets: Asset[]; // Receive assets to include in export
  onSelect: (campaign: Campaign) => void;
  onViewAnalytics: () => void;
  onGenerateMore: () => void;
  onGenerateCustom: (prompt: string) => Promise<void>;
  t: any;
  country?: string;
  userRole: Role;
}

const CampaignPlanner: React.FC<CampaignPlannerProps> = ({ campaigns, assets = [], onSelect, onViewAnalytics, onGenerateMore, onGenerateCustom, t, country, userRole }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const scheduleRecommendation = socialService.getRegionSchedule(country || 'Senegal');

  const exportToCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    const headers = ["Campaign Title", "Concept", "Cultural Hook", "Suggested Platforms", "Scheduled Date"];
    const rows = campaigns.map(c => [
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.concept.replace(/"/g, '""')}"`,
      `"${c.culturalHook.replace(/"/g, '""')}"`,
      `"${c.suggestedPlatforms.join(", ")}"`,
      `"${c.scheduledDate || ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "afribrand_campaign_ideas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCampaignJSON = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    const relatedAssets = assets.filter(a => a.campaignId === campaign.id);
    const campaignData = {
        title: campaign.title,
        concept: campaign.concept,
        culturalHook: campaign.culturalHook,
        suggestedPlatforms: campaign.suggestedPlatforms,
        videoScript: campaign.videoScript,
        scheduledDate: campaign.scheduledDate,
        generatedAssets: relatedAssets.map(a => ({
            type: a.type,
            style: a.style,
            headline: a.headline,
            caption: a.caption,
            language: a.language,
            imageUrl: a.imageUrl,
            videoUrl: a.videoUrl
        }))
    };

    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaignData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `campaign_${campaign.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareCampaign = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    
    // Simulate a unique deep link
    const uniqueUrl = `${window.location.origin}/campaign/${campaign.id}`;
    
    const shareData = {
      title: campaign.title,
      text: `🚀 Campaign Idea: ${campaign.title}\n\n💡 Concept: ${campaign.concept}\n🌍 Hook: ${campaign.culturalHook}\n📅 Date: ${campaign.scheduledDate}\n\nView details: ${uniqueUrl}`,
      url: uniqueUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert("Campaign details & link copied to clipboard!");
      } catch (err) {
        alert("Could not copy to clipboard");
      }
    }
  };

  const isOptimalDay = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return scheduleRecommendation.bestDays.includes(dayName);
  };

  return (
    <div className="space-y-10 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{t.planner.smartSchedule}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t.planner.title}</h2>
          <p className="text-slate-500">{t.planner.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onViewAnalytics}
            className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-brand-500 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            View Analytics
          </button>
          <button 
            onClick={exportToCSV}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            {t.planner.export}
          </button>
          <button 
            onClick={async () => {
              setIsGenerating(true);
              try {
                await onGenerateMore();
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={userRole === 'Viewer' || isGenerating}
            className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-amber-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            )}
            {isGenerating ? 'Exploring...' : 'Generate More Ideas'}
          </button>
        </div>
      </div>

      {/* Custom Campaign Generator */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-brand-600/10 rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </div>
          <div className="flex-1 space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Custom Campaign Generator</h4>
              <p className="text-sm text-slate-500 font-medium">Describe a specific event or goal, and AI will craft a culturally relevant campaign for you.</p>
          </div>
          <div className="flex-1 w-full md:w-auto flex gap-3">
              <input 
                type="text" 
                placeholder="e.g. 'Independence Day flash sale' or 'New store opening in Dakar'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-all"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <button 
                onClick={async () => {
                  if (!customPrompt.trim()) return;
                  setIsGeneratingCustom(true);
                  try {
                    await onGenerateCustom(customPrompt);
                    setCustomPrompt('');
                  } finally {
                    setIsGeneratingCustom(false);
                  }
                }}
                disabled={!customPrompt.trim() || isGeneratingCustom || userRole === 'Viewer'}
                className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-500 transition-all disabled:opacity-50"
              >
                {isGeneratingCustom ? 'Creating...' : 'Generate'}
              </button>
          </div>
      </div>

      {/* Strategic Intelligence Dashboard */}
      <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-brand-950 text-white">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-600 rounded-full blur-[100px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         
         <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner text-amber-400">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Regional Intelligence</h3>
                        <p className="text-slate-400 font-medium">Market Data: <span className="text-white font-bold">{scheduleRecommendation.region}</span></p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/5">High Engagement Zone</span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20 animate-pulse">Live Insights</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Best Times Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4 text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Peak Hours</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {scheduleRecommendation.bestTimes.map(time => (
                            <span key={time} className="px-3 py-1.5 bg-white text-brand-950 rounded-lg text-sm font-bold shadow-sm">{time}</span>
                        ))}
                    </div>
                </div>

                {/* Best Days Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4 text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Power Days</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {scheduleRecommendation.bestDays.map(day => (
                            <span key={day} className="px-3 py-1.5 bg-brand-800 text-white border border-brand-700 rounded-lg text-sm font-bold">{day}</span>
                        ))}
                    </div>
                </div>

                {/* Platform Specifics */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm md:col-span-1">
                     <div className="flex items-center gap-2 mb-4 text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Platform Spikes</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div> Instagram</span>
                            <span className="font-bold">{scheduleRecommendation.platformSpecifics.instagram}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> TikTok</span>
                            <span className="font-bold">{scheduleRecommendation.platformSpecifics.tiktok}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> WhatsApp</span>
                            <span className="font-bold">{scheduleRecommendation.platformSpecifics.whatsapp}</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {campaigns.map((camp) => (
          <div 
            key={camp.id}
            className="group relative bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-amber-100 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => userRole !== 'Viewer' ? onSelect(camp) : null}
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg className="w-24 h-24 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <button 
                  onClick={(e) => exportCampaignJSON(e, camp)}
                  className="p-2 bg-white border border-slate-100 shadow-lg hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-700"
                  title="Download Campaign Package (JSON)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
                <button 
                  onClick={(e) => shareCampaign(e, camp)}
                  className="p-2 bg-white border border-slate-100 shadow-lg hover:bg-amber-50 rounded-full transition-colors text-slate-400 hover:text-amber-600"
                  title={t.planner.share}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-md">#{camp.id}</span>
                {isOptimalDay(camp.scheduledDate) && (
                   <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg border border-green-200">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Optimal Day
                   </span>
                )}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors">{camp.title}</h3>
            <p className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Goal: {camp.goal}
            </p>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 font-medium">{camp.concept}</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100/50">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.planner.hook}</p>
                </div>
                <p className="text-xs text-slate-700 font-bold">{camp.culturalHook}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {camp.suggestedPlatforms.map((p, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-wider bg-white">{p}</span>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">
                    Scheduled: <span className="text-slate-900 font-bold">{camp.scheduledDate}</span>
                </div>
                <div className={`flex items-center font-bold text-xs ${userRole === 'Viewer' ? 'text-slate-300 cursor-not-allowed' : 'text-amber-600 group-hover:translate-x-1 transition-transform'}`}>
                    {userRole === 'Viewer' ? 'View Only' : t.planner.generate} {userRole !== 'Viewer' && <span className="ml-1">→</span>}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignPlanner;
