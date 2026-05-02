
import React, { useState } from 'react';
import { BrandDNA } from '../types';
import * as aiService from '../geminiService';
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
    const element = document.getElementById('brand-dna-report');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#020617' // Match brand-950
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
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
            Share Infographic
          </button>
          <button 
            onClick={onNext}
            className="px-8 py-3 bg-amber-600 text-white rounded-2xl font-black shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:bg-amber-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            {t.dna.generate} →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Identity Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 afro-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="relative z-10 space-y-10">
              {/* Palette */}
              <div className="space-y-6">
                <h3 className="text-xl font-black flex items-center gap-3 text-white">
                  <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                  {t.dna.palette}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {dna.colors.map((c, i) => (
                    <div key={i} className="space-y-3 group/color">
                      <div className="w-full aspect-square rounded-3xl shadow-2xl border-4 border-white/10 transition-transform group-hover/color:scale-105" style={{ backgroundColor: c }}></div>
                      <div className="text-center font-mono text-[10px] font-black text-slate-400 bg-white/5 py-1 rounded-full uppercase tracking-widest">{c}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Direction & Refiner */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black flex items-center gap-3 text-white">
                    <div className="w-2 h-8 bg-brand-500 rounded-full"></div>
                    {t.dna.image}
                  </h3>
                  <button 
                    onClick={() => setShowRefiner(!showRefiner)}
                    className="text-[10px] font-black text-brand-500 uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-500/30 hover:bg-brand-500/10 transition-colors"
                  >
                    {showRefiner ? 'Cancel' : 'Refine Direction'}
                  </button>
                </div>
                
                {showRefiner ? (
                  <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 space-y-4 animate-in zoom-in duration-300">
                    <textarea 
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all resize-none"
                      rows={3}
                      placeholder="e.g. 'Make it feel more like street fashion from Lagos' or 'Use more warm sunset lighting'"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                    ></textarea>
                    <button 
                      onClick={handleRefineStyle}
                      disabled={refiningStyle || !refinementInput.trim()}
                      className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50"
                    >
                      {refiningStyle ? 'Refining...' : 'Update Visual DNA'}
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-300 text-lg leading-relaxed font-medium italic border-l-2 border-white/10 pl-6 py-2">
                    "{imageStyle}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Influence Preview */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] px-4">DNA Influence Preview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                  <div className="w-full aspect-video rounded-2xl bg-slate-800 border border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 afro-pattern opacity-30"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-center space-y-2">
                            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full"></div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Story Template</div>
                         </div>
                      </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Visual style & Texture application</p>
               </div>
               <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                  <div className="w-full aspect-video rounded-2xl bg-slate-800 border border-white/10 relative flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-white font-black text-sm leading-tight mb-2" style={{ fontFamily: dna.fonts[0] }}>High-converting Headlines</p>
                      <p className="text-slate-400 text-[10px] italic">Copy tuned to: {dna.tone}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Tone & Typography pairing</p>
               </div>
               <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                  <div className="w-full aspect-video rounded-2xl bg-slate-800 border border-white/10 relative flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Campaign Concept</div>
                      <p className="text-white font-black text-sm leading-tight mb-2">"{dna.keywords[0]} {dna.localContext.split(' ')[0]} Special"</p>
                      <p className="text-slate-400 text-[10px] italic">Goal-driven strategy for {dna.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Strategic campaign alignment</p>
               </div>
            </div>
          </div>
        </div>

        {/* Brand Strategy Section */}
        <div className="space-y-8">
          {/* Keyword Management */}
          <div className="bg-amber-600 p-8 rounded-[3rem] shadow-2xl space-y-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[60px] pointer-events-none"></div>
             <h3 className="text-xl font-black flex items-center gap-3 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-4m0 0l4-4m4-4H3"></path></svg>
                Brand Keywords
             </h3>
             
             <div className="flex flex-wrap gap-2 relative z-10">
                {keywords.map((kw, i) => (
                  <span 
                    key={i} 
                    className="group px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="opacity-40 group-hover:opacity-100 hover:text-red-200">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </span>
                ))}
             </div>

             <form onSubmit={addKeyword} className="relative z-10 pt-4">
                <input 
                  type="text"
                  placeholder="Add custom keyword..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/40 text-white outline-none focus:bg-white/20 transition-all"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                />
             </form>
          </div>

          {/* Tone & Context */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                Brand Tone
              </h4>
              <p className="text-white font-medium text-lg leading-relaxed">"{dna.tone}"</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                Regional Strategy
              </h4>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                 <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-[11px] font-bold text-slate-200">{dna.localContext}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Selected Typography</h4>
                <div className="space-y-3">
                  {dna.fonts.map((f, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                       <span className="text-sm font-bold text-white transition-transform group-hover:translate-x-1" style={{ fontFamily: f }}>{f}</span>
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{i === 0 ? 'Primary' : 'Accent'}</span>
                    </div>
                  ))}
                </div>
            </div>

            {/* Strategic Insights */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Brand Insights for African SMEs
              </h4>
              <div className="space-y-3">
                {dna.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {dna.improvements.map((improvement, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0"></div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDNAView;
