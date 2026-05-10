
import React, { useState } from 'react';
import { SocialAccount, SocialPlatform, TeamMember, ActivityLog, Role, Product, BrandDNA } from '../../types';
import { socialService } from '../../services/socialService';

interface BrandSettingsProps {
  dna: BrandDNA | null;
  onUpdateDNA: (dna: BrandDNA) => void;
  socialAccounts: SocialAccount[];
  onConnectAccount: (platform: SocialPlatform) => void;
  onDisconnectAccount: (platform: SocialPlatform) => void;
  onBack: () => void;
  userRole: Role;
  onSwitchRole: (role: Role) => void;
  user: any;
  t: any;
}

const BrandSettings: React.FC<BrandSettingsProps> = ({ dna, onUpdateDNA, socialAccounts, onConnectAccount, onDisconnectAccount, onBack, userRole, onSwitchRole, user, t }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'integrations' | 'guidelines' | 'billing' | 'help'>('profile');
  const [members, setMembers] = useState<TeamMember[]>(socialService.getTeamMembers());
  const [activities, setActivities] = useState<ActivityLog[]>(socialService.getActivities());
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Editor');
  const [catalogSynced, setCatalogSynced] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [products, setProducts] = useState<Product[]>(socialService.getMockCatalog());

  const [timezone, setTimezone] = useState('Lagos (GMT+1)');
  const [locale, setLocale] = useState('English (Pan-African)');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1000);
  };

  const isEditor = userRole === 'Editor' || userRole === 'Admin';
  const isAdmin = userRole === 'Admin';

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !inviteEmail) return;
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.substring(0, 2).toUpperCase()
    };
    setMembers([...members, newMember]);
    setActivities([
        { id: Math.random().toString(), user: 'Me', action: `Invited ${inviteEmail} as ${inviteRole}`, timestamp: 'Just now', type: 'creation' },
        ...activities
    ]);
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    setMembers(members.filter(m => m.id !== id));
    setActivities([
        { id: Math.random().toString(), user: 'Me', action: `Removed ${member.name} from the team`, timestamp: 'Just now', type: 'edit' },
        ...activities
    ]);
  };

  const handleUpdateRole = (id: string, role: Role) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    setActivities([
        { id: Math.random().toString(), user: 'Me', action: `Updated ${member.name}'s role to ${role}`, timestamp: 'Just now', type: 'edit' },
        ...activities
    ]);
  };

  const handleSyncCatalog = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setCatalogSynced(true);
        setIsSyncing(false);
        setActivities([
            { id: Math.random().toString(), user: 'You', action: 'Synced WhatsApp Catalog', timestamp: 'Just now', type: 'connection' },
            ...activities
        ]);
    }, 2000);
  };

  return (
    <div className="space-y-8 py-8 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h2 className="text-3xl font-black text-slate-900">{t.settings.profile} Settings</h2>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">View As:</span>
            <div className="flex gap-1">
                {(['Admin', 'Editor', 'Viewer'] as Role[]).map((r) => (
                    <button
                        key={r}
                        onClick={() => onSwitchRole(r)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${userRole === r ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { id: 'team', label: t.settings.team, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
          { id: 'guidelines', label: 'Guidelines', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0112.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
          { id: 'integrations', label: t.settings.integrations, icon: 'M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2h3a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2V4z' },
          { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
          { id: 'help', label: 'Support', icon: 'M8.228 9.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z' }
        ].map((tab) => (
          <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
              {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-brand-600/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <span className="text-3xl font-black text-brand-600">{user?.displayName?.substring(0, 1) || user?.email?.substring(0,1).toUpperCase() || 'B'}</span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-brand-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900">{user?.displayName || 'Business Owner'}</h3>
                        <p className="text-slate-400 font-medium">{user?.email}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {userRole} Account
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input type="text" readOnly value={user?.displayName || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <input type="email" readOnly value={user?.email || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Timezone</label>
                        <select 
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-amber-500"
                        >
                            <option>Lagos (GMT+1)</option>
                            <option>Nairobi (GMT+3)</option>
                            <option>Johannesburg (GMT+2)</option>
                            <option>Casablanca (GMT+1)</option>
                            <option>Accra (GMT+0)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preferred Locale</label>
                        <select 
                          value={locale}
                          onChange={(e) => setLocale(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-amber-500"
                        >
                            <option>French (West Africa)</option>
                            <option>English (Pan-African)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {showSavedToast && (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Profile updated successfully
                      </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{t.settings.team}</h3>
                    <div className="space-y-4">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {userRole === 'Admin' ? (
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={member.role}
                                                onChange={(e) => handleUpdateRole(member.id, e.target.value as Role)}
                                                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold outline-none focus:border-amber-500"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Viewer">Viewer</option>
                                            </select>
                                            <button 
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Remove Member"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : member.role === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {member.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

              {userRole === 'Admin' ? (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">{t.settings.invite}</h4>
                  <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder="colleague@agency.com" 
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as Role)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                      {t.settings.invite}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-400 font-medium italic">{t.settings.adminOnly}</p>
                </div>
              )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Activity Log</h3>
                    <div className="space-y-6 relative before:absolute before:left-4 before:top-8 before:bottom-0 before:w-0.5 before:bg-slate-100">
                        {activities.map((log) => (
                            <div key={log.id} className="relative pl-10">
                                <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                    log.type === 'creation' ? 'bg-green-500' : 
                                    log.type === 'connection' ? 'bg-blue-500' :
                                    log.type === 'edit' ? 'bg-red-500' :
                                    log.type === 'export' ? 'bg-amber-500' : 'bg-slate-400'
                                }`}></div>
                                <p className="text-xs text-slate-500 mb-1">{log.timestamp}</p>
                                <p className="text-sm font-medium text-slate-900">{log.action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'guidelines' && dna && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">Brand Identity Assets</h3>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.settings.logo}</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center overflow-hidden">
                    {dna.logoUrl ? (
                      <img src={dna.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      id="logo-upload" 
                      className="hidden" 
                      disabled={userRole !== 'Admin'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            onUpdateDNA({ ...dna, logoUrl: re.target?.result as string });
                            setActivities([{ id: Math.random().toString(), user: 'You', action: 'Uploaded new brand logo', timestamp: 'Just now', type: 'edit' }, ...activities]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label 
                      htmlFor="logo-upload" 
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${userRole !== 'Admin' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                      onClick={(e) => userRole !== 'Admin' && e.preventDefault()}
                    >
                      Change Logo
                    </label>
                    <p className="text-[10px] text-slate-400">SVG, PNG or JPG (max 2MB) {userRole !== 'Admin' && '- Admin only'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.settings.colors}</label>
                <div className="flex flex-wrap gap-4">
                  {dna.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <input 
                        type="color" 
                        value={color} 
                        disabled={userRole !== 'Admin'}
                        onChange={(e) => {
                          const newColors = [...dna.colors];
                          newColors[i] = e.target.value;
                          onUpdateDNA({ ...dna, colors: newColors });
                        }}
                        className={`w-12 h-12 rounded-xl cursor-pointer border-4 border-white shadow-md ${userRole !== 'Admin' ? 'opacity-50 grayscale' : ''}`}
                      />
                      <span className="text-[10px] font-mono font-bold text-slate-400">{color.toUpperCase()}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => userRole === 'Admin' && onUpdateDNA({ ...dna, colors: [...dna.colors, '#000000'] })}
                    disabled={userRole !== 'Admin'}
                    className={`w-12 h-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 transition-all ${userRole === 'Admin' ? 'hover:text-brand-500 hover:border-brand-500' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.settings.fonts}</label>
                <div className="space-y-2">
                  {dna.fonts.map((font, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        type="text" 
                        value={font} 
                        disabled={userRole !== 'Admin'}
                        onChange={(e) => {
                          const newFonts = [...dna.fonts];
                          newFonts[i] = e.target.value;
                          onUpdateDNA({ ...dna, fonts: newFonts });
                        }}
                        className={`flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold ${userRole !== 'Admin' ? 'opacity-50' : ''}`}
                      />
                      <button 
                        onClick={() => userRole === 'Admin' && onUpdateDNA({ ...dna, fonts: dna.fonts.filter((_, idx) => idx !== i) })}
                        disabled={userRole !== 'Admin'}
                        className={`p-2 text-slate-300 hover:text-red-500 ${userRole !== 'Admin' ? 'opacity-0' : ''}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  {userRole === 'Admin' && (
                    <button 
                        onClick={() => onUpdateDNA({ ...dna, fonts: [...dna.fonts, 'Inter'] })}
                        className="text-[11px] font-bold text-brand-600 uppercase tracking-widest px-1"
                    >
                        + Add Font Family
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">Brand DNA & Tone</h3>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.settings.voice}</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium leading-relaxed outline-none focus:border-brand-500 transition-all disabled:opacity-50"
                    rows={3}
                    value={dna.tone}
                    disabled={userRole === 'Viewer'}
                    onChange={(e) => onUpdateDNA({ ...dna, tone: e.target.value })}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.settings.vision}</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium leading-relaxed outline-none focus:border-brand-500 transition-all disabled:opacity-50"
                    rows={3}
                    value={dna.imageStyle}
                    disabled={userRole === 'Viewer'}
                    onChange={(e) => onUpdateDNA({ ...dna, imageStyle: e.target.value })}
                  />
               </div>
               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                    <strong>Note:</strong> Changes to brand guidelines are applied globally. All future assets generated will reflect these updated rules.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Social Accounts</h3>
                {socialAccounts.map(account => (
                    <div key={account.platform} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                                account.platform === 'instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' :
                                account.platform === 'facebook' ? 'bg-blue-600' : 'bg-green-500'
                            }`}>
                                <span>{account.platform.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 capitalize">{account.platform}</h4>
                                <p className="text-xs text-slate-500">{account.connected ? 'Connected' : 'Not Connected'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => account.connected ? onDisconnectAccount(account.platform) : onConnectAccount(account.platform)}
                            disabled={userRole === 'Viewer'}
                            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                                userRole === 'Viewer' ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50' :
                                account.connected ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-brand-600 border-brand-600 text-white hover:bg-brand-700 shadow-sm'
                            }`}
                        >
                            {account.connected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Commerce & Catalog</h3>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">WhatsApp Catalog</h4>
                            <p className="text-xs text-slate-500">{catalogSynced ? `Synced: ${products.length} Products` : 'Sync Required'}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSyncCatalog}
                        disabled={isSyncing || userRole === 'Viewer'}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mb-6"
                    >
                        {isSyncing ? 'Syncing...' : userRole === 'Viewer' ? 'Sync Unavailable' : 'Sync Catalog Now'}
                    </button>

                    <div className="space-y-3">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Preview</h5>
                        {products.slice(0, 3).map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-slate-900">{p.name}</p>
                                    <p className="text-[10px] text-slate-500">{p.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-8">
            <div className="bg-brand-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <span className="px-3 py-1 bg-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                        <h3 className="text-4xl font-black tracking-tight">Afri-Pro <span className="text-brand-500">Plan</span></h3>
                        <p className="text-slate-400 font-medium">Next renewal: March 12, 2025 • 15 000 FCFA</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-brand-950 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-100 transition-all">Manage Subscription</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Images Generated', value: '42 / 150', progress: 28 },
                    { label: 'Video Ads (Veo)', value: '3 / 10', progress: 30 },
                    { label: 'DNA Refinements', value: 'Unlimited', progress: 100 }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-600" style={{ width: `${stat.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="font-black text-slate-900">Recent Invoices</h4>
                    <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest">View All</button>
                </div>
                <div className="divide-y divide-slate-50">
                    {[
                        { date: 'Feb 12, 2025', id: 'INV-9021', amount: '15 000 FCFA', status: 'Paid' },
                        { date: 'Jan 12, 2025', id: 'INV-8812', amount: '15 000 FCFA', status: 'Paid' }
                    ].map((inv, i) => (
                        <div key={i} className="px-8 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{inv.id}</p>
                                    <p className="text-xs text-slate-500">{inv.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">{inv.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Help Center</h3>
                <div className="space-y-4">
                    {[
                        { q: "Comment fonctionne l'IA culturelle ?", a: "AfriBrand AI utilise des modèles Gemini entraînés sur des lexiques locaux (Nouchi, Wolof, etc.) pour garantir que vos textes sonnent authentiquement." },
                        { q: "Puis-je changer mon ADN de marque ?", a: "Oui, à tout moment dans l'onglet 'DNA'. Vos futurs contenus s'adapteront instantanément à la nouvelle identité." },
                        { q: "Quels sont les délais de génération vidéo ?", a: "Le mode 'Fast' prend environ 1 à 2 minutes. Le mode 'High-Quality' peut prendre jusqu'à 5 minutes." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
                            <h4 className="font-bold text-slate-900 text-sm">{item.q}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Contact Support</h3>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <p className="text-sm text-slate-500 font-medium">Besoin d'aide personnalisée ? Nos experts marketing sont là pour vous.</p>
                    <div className="space-y-4">
                        <button className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Live WhatsApp Chat
                        </button>
                        <button className="w-full py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
                            Submit a Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BrandSettings;
