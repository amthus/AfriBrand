
import React, { useState } from 'react';
import { Campaign, Role } from '../types';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, List, Download, ChevronLeft, ChevronRight, Share2, FileText, CalendarDays } from 'lucide-react';

interface CalendarViewProps {
  campaigns: Campaign[];
  onBack: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ campaigns, onBack }) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const exportToCSV = () => {
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
    link.setAttribute("download", "afribrand_campaign_calendar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AfriBrand AI//Campaign Calendar//EN\n";
    
    campaigns.forEach(c => {
      if (c.scheduledDate) {
        const date = c.scheduledDate.replace(/-/g, '');
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${c.title}\n`;
        icsContent += `DTSTART;VALUE=DATE:${date}\n`;
        icsContent += `DTEND;VALUE=DATE:${date}\n`;
        icsContent += `DESCRIPTION:${c.concept.replace(/\n/g, '\\n')} - Hook: ${c.culturalHook.replace(/\n/g, '\\n')}\n`;
        icsContent += "END:VEVENT\n";
      }
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "afribrand_campaign_calendar.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const getCampaignsForDay = (day: number) => {
    const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return campaigns.filter(c => c.scheduledDate === dateStr);
  };

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Campaign <span className="text-brand-600">Calendar</span></h2>
            <p className="text-slate-500 font-medium">Manage and export your regional marketing schedule.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-brand-600 text-brand-950 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white dark:bg-brand-600 text-brand-950 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>

          <button 
            onClick={exportToCSV}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button 
            onClick={exportToICS}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20"
          >
            <CalendarDays className="w-4 h-4" />
            ICS (Apple/Google)
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white dark:bg-brand-900/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black">{monthName} {year}</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {blanks.map(i => (
              <div key={`blank-${i}`} className="min-h-[140px] border-r border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/10"></div>
            ))}
            {days.map(day => {
              const dayCampaigns = getCampaignsForDay(day);
              return (
                <div key={day} className="min-h-[140px] border-r border-b border-slate-100 dark:border-white/5 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <span className="text-sm font-bold text-slate-400 group-hover:text-brand-600 transition-colors">{day}</span>
                  <div className="mt-2 space-y-2">
                    {dayCampaigns.map(c => (
                      <div key={c.id} className="p-2 bg-brand-600/10 border border-brand-600/20 rounded-lg text-[10px] font-bold text-brand-600 line-clamp-2">
                        {c.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || '')).map((c) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-900/40 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="w-24 h-24 bg-brand-600/10 rounded-2xl flex flex-col items-center justify-center text-brand-600 shrink-0 border border-brand-600/20">
                <span className="text-[10px] font-black uppercase tracking-widest">{c.scheduledDate ? new Date(c.scheduledDate).toLocaleString('default', { month: 'short' }) : 'TBD'}</span>
                <span className="text-3xl font-black">{c.scheduledDate ? new Date(c.scheduledDate).getDate() : '?'}</span>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black">{c.title}</h4>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-[8px] font-black uppercase tracking-widest text-slate-500">{c.goal}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium line-clamp-2">{c.concept}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {c.suggestedPlatforms.map(p => (
                    <span key={p} className="px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-all">
                  Edit
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 bg-brand-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all">
                  View Assets
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
