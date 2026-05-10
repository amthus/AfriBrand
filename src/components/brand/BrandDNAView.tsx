
import React, { useState } from 'react';
import { BrandDNA } from '../../types';
import * as aiService from '../../services/geminiService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BrandDNAViewProps {
  dna: BrandDNA;
  onNext: () => void;
  t: any;
}

const BrandDNAView: React.FC<BrandDNAViewProps> = ({ dna, onNext, t }) => {
  const [keywords, setKeywords] = useState<string[]>(dna.keywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [imageStyle, setImageStyle] = useState(dna.imageStyle);
  const [refiningStyle, setRefiningStyle] = useState(false);
  const [refinementInput, setRefinementInput] = useState('');
  const [showRefiner, setShowRefiner] = useState(false);

  const exportDNA = () => {
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ ...dna, keywords, imageStyle }, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `brand_dna_${dna.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInfographic = () => {
    window.print(); // Infographic is achieved via a dedicated @media print stylesheet in global or just clean layout
  };

  const exportPDF = async () => {
    const element = document.getElementById('brand-dna-report-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#020617',
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`brand_dna_${dna.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleRefineStyle = async () => {
    if (!refinementInput.trim()) return;
    setRefiningStyle(true);
    try {
      const refined = await aiService.refineImageStyle(imageStyle, refinementInput, dna);
      setImageStyle(refined);
      setRefinementInput('');
      setShowRefiner(false);
    } catch (err) {
      console.error(err);
    } finally {
      setRefiningStyle(false);
    }
  };

  return (
    <div id="brand-dna-report" className="space-y-12 py-8 animate-in slide-in-from-bottom duration-700 bg-brand-950">
      {/* Header with Export Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl" data-html2canvas-ignore="true">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Identity Report</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">{t.dna.title}</h2>
          <p className="text-slate-400 font-medium">{t.dna.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={exportDNA}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold shadow-sm hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            JSON
          </button>
          <button 
            onClick={exportPDF}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold shadow-sm hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            PDF
          </button>
          <button 
            onClick={exportInfographic}
            className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Share
          </button>
          <button 
            onClick={onNext}
            className="px-8 py-3 bg-amber-600 text-white rounded-2xl font-black shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:bg-amber-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            {t.dna.generate} →
          </button>
        </div>
      </div>

      <div id="brand-dna-report-content" className="space-y-12 bg-brand-950 p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 afro-pattern opacity-10 pointer-events-none"></div>
        
        {/* Branding PDF Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-12 relative z-10">
           <div className="space-y-4">
               <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-600/20">
                       {dna.name.charAt(0)}
                   </div>
                   <div>
                       <h2 className="text-4xl font-black text-white tracking-tight">{dna.name}</h2>
                       <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em]">Official Brand DNA Report</p>
                   </div>
               </div>
               <p className="text-slate-400 max-w-md font-medium leading-relaxed">This identity system was meticulously synthesized by AfriBrand AI, combining modern strategic principles with deep African cultural resonance.</p>
           </div>
           <div className="text-right space-y-2">
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Generation ID</p>
               <p className="text-white font-mono text-xs">{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest pt-2">Date</p>
               <p className="text-white font-mono text-xs">{new Date().toLocaleDateString()}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Visual Identity Section */}
        <div className="lg:col-span-2 space-y-12 text-white">
          <div className="space-y-10">
              {/* Palette */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[2px] bg-amber-500"></div>
                  <h3 className="text-xl font-black uppercase tracking-widest">{t.dna.palette}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {dna.colors.map((c, i) => (
                    <div key={i} className="space-y-4">
                      <div className="w-full aspect-square rounded-[2rem] shadow-2xl border-2 border-white/10" style={{ backgroundColor: c }}></div>
                      <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Primary {i + 1}</p>
                          <div className="font-mono text-xs font-black text-white bg-white/5 py-2 px-4 rounded-xl text-center">{c}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[2px] bg-brand-500"></div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Typography System</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {dna.fonts.map((f, i) => (
                        <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{i === 0 ? 'Primary Display' : 'Accent Typeface'}</p>
                            <h4 className="text-3xl font-black text-white" style={{ fontFamily: f }}>Aa Bb Cc 123</h4>
                            <p className="text-slate-400 text-sm font-bold">{f}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">Selected for its {i === 0 ? 'authoritative and modern' : 'complementary and elegant'} visual weight in the African context.</p>
                        </div>
                    ))}
                </div>
              </div>

              {/* Image Direction */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[2px] bg-emerald-500"></div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Visual Universe</h3>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-transparent p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px]"></div>
                    <p className="text-2xl font-medium italic text-slate-200 leading-relaxed relative z-10">"{imageStyle}"</p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-4 relative z-10">
                        {dna.keywords.map((kw, i) => (
                             <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">{kw}</span>
                        ))}
                    </div>
                </div>
              </div>
          </div>
        </div>

        {/* Brand Strategy Section */}
        <div className="space-y-12">
          {/* Strategic Context */}
          <div className="bg-amber-600 p-10 rounded-[3rem] shadow-2xl space-y-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[60px]"></div>
             <h3 className="text-xl font-black flex items-center gap-3 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Identity Core
             </h3>
             <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-amber-200 uppercase tracking-[0.2em]">Strategic Tone</p>
                    <p className="text-lg font-bold leading-tight">"{dna.tone}"</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-amber-200 uppercase tracking-[0.2em]">Market Alignment</p>
                    <p className="text-sm font-medium leading-relaxed opacity-90">{dna.localContext}</p>
                </div>
             </div>
          </div>

          {/* Strategic Insights */}
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Market Intelligence
              </h4>
              <div className="space-y-4">
                {dna.insights.map((insight, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-1 w-5 h-5 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <span className="text-[10px] font-black text-emerald-500">{i+1}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                Optimization Path
              </h4>
              <div className="space-y-4">
                {dna.improvements.map((improvement, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-5 h-5 bg-rose-500/10 rounded-lg flex items-center justify-center shrink-0 border border-rose-500/20">
                        <span className="text-[10px] font-black text-rose-500">{i+1}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-brand-900 rounded-[2.5rem] border border-white/5 text-center">
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.5em] mb-2">Authenticated By</p>
              <h5 className="text-lg font-black text-white">AfriBrand AI</h5>
              <p className="text-[9px] text-slate-500 mt-4 tracking-widest italic">Confidential High-Impact Brand Strategy Document</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BrandDNAView;
