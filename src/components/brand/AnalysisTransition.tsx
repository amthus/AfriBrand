
import React, { useState, useEffect } from 'react';
import { UserInput } from '../../types';

interface AnalysisTransitionProps {
  input: UserInput;
  t: any;
}

const AnalysisTransition: React.FC<AnalysisTransitionProps> = ({ input, t }) => {
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('Initializing Analysis Engine...');

  const actions = [
    { threshold: 0, text: 'Scanning Brand Digital Footprint...' },
    { threshold: 15, text: 'Extracting Color Palette & Visual Markers...' },
    { threshold: 30, text: 'Identifying Local Cultural Slang & Hooks...' },
    { threshold: 45, text: 'Analyzing Regional Market Sentiment...' },
    { threshold: 60, text: 'Generating Editorial Voice & Tone...' },
    { threshold: 75, text: 'Curating Bespoke Visual Guidelines...' },
    { threshold: 90, text: 'Finalizing Brand DNA Profile...' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        const action = actions.find(a => next >= a.threshold && next < (actions[actions.indexOf(a) + 1]?.threshold || 101));
        if (action) setCurrentAction(action.text);
        return next > 100 ? 100 : next;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-brand-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 afro-pattern opacity-20"></div>
      
      <div className="max-w-2xl w-full space-y-12 relative z-10 text-center">
        <div className="relative inline-block">
            <div className="w-32 h-32 border-4 border-white/5 rounded-[2rem] animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-600/40 animate-bounce">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 </div>
            </div>
            {/* Orbital rings */}
            <div className="absolute inset-[-20px] border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-[-40px] border border-brand-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>

        <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight">{t.dna.analyzing} <span className="text-brand-500">{input.businessName}</span></h2>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] h-4">{currentAction}</p>
        </div>

        <div className="space-y-6">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-amber-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>0% Initiated</span>
                <span>{progress}% Optimized</span>
                <span>100% {input.country} DNA</span>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40">
            {['Strategy', 'Visuals', 'Copy', 'Culture'].map((tag) => (
                <div key={tag} className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest bg-white/5">
                    {tag} Loaded
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTransition;
