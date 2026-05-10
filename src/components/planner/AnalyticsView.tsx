
import React, { useEffect, useState } from 'react';
import { Asset, Campaign } from '../../types';
import { socialService } from '../../services/socialService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface AnalyticsViewProps {
  assets: Asset[];
  campaigns: Campaign[];
  onBack: () => void;
  t: any;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ assets, campaigns, onBack, t }) => {
  const [loading, setLoading] = useState(true);
  const [updatedAssets, setUpdatedAssets] = useState<Asset[]>(assets);

  const mockTrendData = [
    { name: 'Mon', reach: 4000, engagement: 2400, conversions: 240 },
    { name: 'Tue', reach: 3000, engagement: 1398, conversions: 210 },
    { name: 'Wed', reach: 2000, engagement: 9800, conversions: 290 },
    { name: 'Thu', reach: 2780, engagement: 3908, conversions: 200 },
    { name: 'Fri', reach: 1890, engagement: 4800, conversions: 181 },
    { name: 'Sat', reach: 2390, engagement: 3800, conversions: 250 },
    { name: 'Sun', reach: 3490, engagement: 4300, conversions: 210 },
  ];

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

  const totalReach = updatedAssets.reduce((acc, a) => acc + (a.metrics?.reach || 0), 0) || 12450;
  const totalEngagement = updatedAssets.reduce((acc, a) => acc + (a.metrics?.engagement || 0), 0) || 3842;
  const totalConversions = updatedAssets.reduce((acc, a) => acc + (a.metrics?.conversions || 0), 0) || 156;

  return (
    <div className="space-y-10 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">{t.analytics.title || 'Market Analytics'}</h2>
          <p className="text-slate-500 font-medium font-medium">Strategic performance tracking for your Pan-African accounts.</p>
        </div>
        <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export Report
            </button>
            <button 
                onClick={onBack}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all font-black uppercase tracking-widest"
            >
                {t.common?.back || 'Back'}
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Market Reach</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-brand-600">{totalReach.toLocaleString()}</h3>
            <span className="text-[10px] font-black text-slate-300">INDIVIDUALS</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                12.5%
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs last month</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Social Engagement</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-amber-500">{totalEngagement.toLocaleString()}</h3>
            <span className="text-[10px] font-black text-slate-300">INTERACTIONS</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                8.2%
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs last month</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Direct Conversions</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-emerald-500">{totalConversions.toLocaleString()}</h3>
            <span className="text-[10px] font-black text-slate-300">ACTIONS</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                4.1%
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">Weekly Pulse</h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[9px] font-black text-brand-600 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-600"></div> Reach</span>
                    <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Engagement</span>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTrendData}>
                        <defs>
                            <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }}
                        />
                        <Area type="monotone" dataKey="reach" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                        <Area type="monotone" dataKey="engagement" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">Conversion Funnel</h3>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Efficiency: 4.2%</span>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }}
                        />
                        <Bar dataKey="conversions" radius={[4, 4, 0, 0]}>
                            {mockTrendData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#059669'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Campaign Asset Performance</h3>
          {loading && <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Asset</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Live On</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reach</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Engage</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {updatedAssets.filter(a => a.postedTo && a.postedTo.length > 0).map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {asset.type === 'video' ? (
                          <video src={asset.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={asset.imageUrl} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 line-clamp-1">{asset.headline}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {asset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">{asset.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1">
                      {asset.postedTo?.map(p => (
                        <div key={p} className="w-7 h-7 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm" title={p}>
                            <div className={`w-2 h-2 rounded-full ${
                                p === 'instagram' ? 'bg-pink-500' :
                                p === 'facebook' ? 'bg-blue-600' : 'bg-green-500'
                            }`}></div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-black text-slate-900">
                    {asset.metrics?.reach.toLocaleString() || '-'}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-black text-slate-900">
                    {asset.metrics?.engagement.toLocaleString() || '-'}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-sm font-black text-slate-900">
                    {asset.metrics?.conversions.toLocaleString() || '-'}
                  </td>
                </tr>
              ))}
              {updatedAssets.filter(a => a.postedTo && a.postedTo.length > 0).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Waiting for live data</p>
                            <p className="text-xs text-slate-400 mt-1">Post your first asset to begin tracking performance metrics.</p>
                        </div>
                        <button 
                            onClick={onBack}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest"
                        >
                            Go to Studio
                        </button>
                    </div>
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
