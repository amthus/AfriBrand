
import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  ChevronRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStep } from '../../types';

interface SidebarProps {
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
  onLogout: () => void;
  user: any;
  t: any;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onNavigate, onLogout, user, t, isCollapsed, onToggle }) => {
  const menuItems = [
    { id: 'dna', label: t.nav?.dna || 'Brand DNA', icon: LayoutDashboard },
    { id: 'studio', label: t.nav?.studio || 'Creative Studio', icon: Sparkles },
    { id: 'ideation', label: t.nav?.ideation || 'Campaign Planner', icon: Calendar },
    { id: 'analytics', label: t.nav?.analytics || 'Analytics', icon: BarChart3 },
    { id: 'settings', label: t.nav?.settings || 'Settings', icon: Settings },
  ];

  return (
    <motion.aside 
      id="main-sidebar" 
      initial={false}
      animate={{ 
        width: isCollapsed ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 80) : 256,
        x: isCollapsed && (typeof window !== 'undefined' && window.innerWidth < 1024) ? -256 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-slate-950 border-r border-white/5 flex flex-col z-50 lg:overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-10 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div 
                key="full-logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 shrink-0"
              >
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                  <Globe className="text-white w-5 h-5" />
                </div>
                <span className="font-black tracking-tighter text-xl text-white truncate">AFRIBRAND<span className="text-brand-500">AI</span></span>
              </motion.div>
            ) : (
              <motion.div 
                key="collapsed-logo"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="w-full flex justify-center"
              >
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                  <Globe className="w-6 h-6" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppStep)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                currentStep === item.id 
                  ? 'bg-brand-600/10 text-brand-500' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="font-bold text-sm truncate animate-in fade-in duration-300">{item.label}</span>
              )}
              {isCollapsed && currentStep === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-brand-500 rounded-l-full" />
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-2xl">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <div className={`bg-white/5 rounded-2xl transition-all ${isCollapsed ? 'p-2' : 'p-4'} mb-4`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full bg-brand-600/20 flex items-center justify-center overflow-hidden shrink-0 transition-all ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <User className="text-brand-500 w-5 h-5" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                <span className="text-sm font-bold text-white truncate">{user?.displayName || t.auth?.user || 'Owner'}</span>
                <span className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-widest">{user?.email?.split('@')[1] || 'Enterprise'}</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={onLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in duration-500"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.auth?.logout || 'Logout'}
            </button>
          )}
        </div>

        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 text-slate-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
              Collapse
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
