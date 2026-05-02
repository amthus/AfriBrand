
import React, { useEffect, useState } from 'react';
import { Asset, Campaign } from '../types';
import { socialService } from '../socialService';

interface AnalyticsViewProps {
  assets: Asset[];
  campaigns: Campaign[];
  onBack: () => void;
  t: any;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ assets, campaigns, onBack, t }) => {
  const [loading, setLoading] = useState(true);
  const [updatedAssets, setUpdatedAssets] = useState<Asset[]>(assets);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const postedAssets = assets.filter(a => a.postedTo && a.postedTo.length > 0);
      
      const updated = await Promise.all(assets.map(async (asset) => {
        if (asset.postedTo && asset.postedTo.length > 0) {
          const metrics = await socialService.getAssetMetrics(asset.id);
          return { ...asset, metrics };
        }
        return asset;
      }));
      
      setUpdatedAssets(updated);
      setLoading(false);
    };

    fetchMetrics();
  }, [assets]);

  const totalReach = updatedAssets.reduce((acc, a) => acc + (a.metrics?.reach || 0), 0);
  const totalEngagement = updatedAssets.reduce((acc, a) => acc + (a.metrics?.engagement || 0), 0);
  const totalConversions = updatedAssets.reduce((acc, a) => acc + (a.metrics?.conversions || 0), 0);

  return (
    <div className="space-y-10 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Campaign Analytics</h2>
          <p className="text-slate-500">Real-time performance tracking for your African market campaigns.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all"
        >
          Back to Planner
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Reach</p>
          <h3 className="text-4xl font-black text-brand-600">{totalReach.toLocaleString()}</h3>
          <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            +12.5% vs last week
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Engagement</p>
          <h3 className="text-4xl font-black text-amber-500">{totalEngagement.toLocaleString()}</h3>
          <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            +8.2% vs last week
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Conversions</p>
          <h3 className="text-4xl font-black text-emerald-500">{totalConversions.toLocaleString()}</h3>
          <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            +4.1% vs last week
          </p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Asset Performance</h3>
          {loading && <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platforms</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reach</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Engagement</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {updatedAssets.filter(a => a.postedTo && a.postedTo.length > 0).map((asset) => (
                <tr key={asset.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                        {asset.type === 'video' ? (
                          <video src={asset.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={asset.imageUrl} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{asset.headline}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {asset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-[10px] font-bold uppercase text-slate-500 dark:text-slate-300">{asset.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1">
                      {asset.postedTo?.map(p => (
                        <span key={p} className="w-6 h-6 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black uppercase text-slate-500 dark:text-slate-300" title={p}>
                          {p[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {asset.metrics?.reach.toLocaleString() || '-'}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {asset.metrics?.engagement.toLocaleString() || '-'}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {asset.metrics?.conversions.toLocaleString() || '-'}
                  </td>
                </tr>
              ))}
              {updatedAssets.filter(a => a.postedTo && a.postedTo.length > 0).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">
                    No assets posted yet. Post assets to see performance data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
