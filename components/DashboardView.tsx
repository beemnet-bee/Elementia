
import React, { useState, useMemo, useEffect } from 'react';
import { ELEMENTS, CATEGORY_ACCENT_COLORS } from '../constants';
import { ElementData, QuizType } from '../types';
import { useMastery } from '../contexts/MasteryContext';

interface DashboardViewProps {
  onBack: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onBack }) => {
  const { progress, updateStats } = useMastery();
  const [activeMode, setActiveMode] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ElementData | null>(null);
  const [options, setOptions] = useState<ElementData[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Flashcard specific state
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<ElementData[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);

  const startMode = (type: QuizType, filterCategory?: string) => {
    setActiveMode(type);
    setIsFlipped(false);
    
    let sourceElements = filterCategory 
      ? ELEMENTS.filter(e => e.category === filterCategory) 
      : ELEMENTS;

    if (type === 'flashcards' || type === 'spaced_repetition') {
      // In spaced repetition mode, we prioritize elements with lower mastery or random selection
      const shuffled = [...sourceElements].sort(() => 0.5 - Math.random());
      setDeck(shuffled.slice(0, 20));
      setDeckIndex(0);
      setCurrentQuestion(shuffled[0]);
    } else {
      generateQuestion(filterCategory);
    }
  };

  const generateQuestion = (filterCategory?: string) => {
    const source = filterCategory ? ELEMENTS.filter(e => e.category === filterCategory) : ELEMENTS;
    const randomEl = source[Math.floor(Math.random() * source.length)];
    const others = ELEMENTS
      .filter(e => e.number !== randomEl.number)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setCurrentQuestion(randomEl);
    setOptions([...others, randomEl].sort(() => 0.5 - Math.random()));
    setFeedback(null);
  };

  const handleAnswer = (el: ElementData) => {
    const isCorrect = el.number === currentQuestion?.number;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    updateStats(isCorrect);
    setTimeout(() => generateQuestion(), 1200);
  };

  const nextFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const nextIdx = (deckIndex + 1) % deck.length;
      setDeckIndex(nextIdx);
      setCurrentQuestion(deck[nextIdx]);
    }, 150);
  };

  const masteryPercent = Math.round((progress.masteredElements.length / ELEMENTS.length) * 100);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; mastered: number }> = {};
    ELEMENTS.forEach(el => {
      if (!stats[el.category]) stats[el.category] = { total: 0, mastered: 0 };
      stats[el.category].total++;
      if (progress.masteredElements.includes(el.number)) stats[el.category].mastered++;
    });
    return Object.entries(stats).sort((a, b) => b[1].mastered - a[1].mastered);
  }, [progress.masteredElements]);

  const accuracy = progress.quizStats.total === 0 ? 0 : Math.round((progress.quizStats.correct / progress.quizStats.total) * 100);

  const chartData = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = progress.activityHistory.find(h => h.date === dateStr);
      result.push({
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        count: entry ? entry.count : 0
      });
    }
    return result;
  }, [progress.activityHistory]);

  const maxActivity = Math.max(...chartData.map(d => d.count), 5);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-reveal relative z-10 pb-40">
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[10px] font-black tracking-widest uppercase">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
             <span>Neural Interface Protocol Active</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white font-ubuntu">
            QUANTUM HUB
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-light max-w-xl leading-relaxed">
            Personalized elemental synthesis engine. Track retention, calibrate knowledge, and achieve chemical mastery.
          </p>
        </div>
        
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-black uppercase tracking-widest hover:border-cyan-500 transition-all flex items-center space-x-3 shadow-xl dark:shadow-none active:scale-95 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>System Grid</span>
        </button>
      </div>

      {!activeMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            {/* High Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Mastery progress */}
              <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Registry Mastery</h3>
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                       <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="url(#masteryGrad)" 
                          strokeWidth="8" 
                          strokeLinecap="round"
                          strokeDasharray="282.7"
                          strokeDashoffset={282.7 - (282.7 * masteryPercent / 100)}
                          className="transition-all duration-1000 ease-out"
                       />
                       <defs>
                          <linearGradient id="masteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#06b6d4" />
                             <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                       </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black text-slate-900 dark:text-white">{masteryPercent}%</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{progress.masteredElements.length} / 127</span>
                    </div>
                 </div>
              </div>

              {/* Streak Card */}
              <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl relative group hover:border-amber-500/30 transition-colors">
                 <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -ml-16 -mt-16"></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Neural Consistency</h3>
                 <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                       <div className="text-7xl font-black text-slate-900 dark:text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                          {progress.quizStats.dayStreak}
                       </div>
                       <div className="absolute -top-4 -right-8 text-3xl animate-bounce">🔥</div>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Consecutive Days Synthesis</span>
                    <div className="flex space-x-2 mt-4">
                       {[...Array(7)].map((_, i) => {
                         const d = new Date();
                         d.setDate(d.getDate() - (6 - i));
                         const isActive = progress.activityHistory.some(h => h.date === d.toISOString().split('T')[0]);
                         return <div key={i} className={`w-3 h-3 rounded-full ${isActive ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-200 dark:bg-slate-800'}`}></div>;
                       })}
                    </div>
                 </div>
              </div>
            </div>

            {/* Activity Area */}
            <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10">
               <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synthesis Velocity (Last 7 Days)</h3>
                  <div className="flex items-center space-x-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Probes</span>
                  </div>
               </div>
               <div className="h-64 w-full relative group">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 200">
                     <path 
                        d={`M ${chartData.map((d, i) => `${i * 116},${200 - (d.count / maxActivity) * 180}`).join(' L ')}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_10px_#06b6d4]"
                     />
                     <path 
                        d={`M 0,200 ${chartData.map((d, i) => `L ${i * 116},${200 - (d.count / maxActivity) * 180}`).join(' ')} L 696,200 Z`}
                        fill="url(#areaGrad)"
                        opacity="0.1"
                     />
                     <defs>
                        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                     </defs>
                     {chartData.map((d, i) => (
                        <circle key={i} cx={i * 116} cy={200 - (d.count / maxActivity) * 180} r="6" fill="#06b6d4" className="hover:r-8 transition-all" />
                     ))}
                  </svg>
                  <div className="flex justify-between mt-6 px-1">
                     {chartData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center"><span className="text-[10px] font-black text-slate-400">{d.label}</span></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Training Modes Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <FeatureCard 
                  title="Unit Flashcards" 
                  desc="High-speed sensory training. Visual recognition and property verification." 
                  icon="🎴" 
                  color="cyan"
                  onClick={() => startMode('flashcards')}
               />
               <FeatureCard 
                  title="Atomic Mapping" 
                  desc="Identify element symbols and names through high-speed neural recall." 
                  icon="El" 
                  color="indigo"
                  onClick={() => startMode('symbol_to_name')}
               />
               <FeatureCard 
                  title="Spaced Repetition" 
                  desc="Priority drills for elements with low retention scores." 
                  icon="🧠" 
                  color="rose"
                  onClick={() => startMode('spaced_repetition')}
               />
               <FeatureCard 
                  title="Numerical Drills" 
                  desc="Correlate atomic numbers with their elemental counterparts." 
                  icon="102" 
                  color="amber"
                  onClick={() => startMode('atomic_number')}
               />
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white dark:bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                   Knowledge Density
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   {categoryStats.map(([cat, stats]) => {
                      const percent = Math.round((stats.mastered / stats.total) * 100);
                      const accent = CATEGORY_ACCENT_COLORS[cat] || { bg: 'bg-slate-500' };
                      return (
                         <div key={cat} className="space-y-2 group cursor-pointer" onClick={() => startMode('symbol_to_name', cat)}>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">
                               <span className="truncate group-hover:text-cyan-500 transition-colors">{cat}</span>
                               <span className="font-black text-slate-400 group-hover:text-cyan-400">{percent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                               <div className={`h-full ${accent.bg} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-10 rounded-[3rem] border border-cyan-500/20 shadow-2xl space-y-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600 dark:text-cyan-400 mb-2">Efficiency Matrix</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500">Global Accuracy</span>
                       <span className="text-2xl font-black text-indigo-500">{accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500">Total Probes</span>
                       <span className="text-2xl font-black text-slate-900 dark:text-white">{progress.quizStats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500">Sync Rank</span>
                       <span className="text-xs px-3 py-1 bg-cyan-500 text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20">
                          {masteryPercent > 90 ? 'Alpha' : masteryPercent > 50 ? 'Gamma' : 'Omega'}
                       </span>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      ) : activeMode === 'flashcards' || activeMode === 'spaced_repetition' ? (
        // Flashcard Mode UI
        <div className="max-w-3xl mx-auto space-y-16 py-12 animate-reveal-up flex flex-col items-center">
           <button 
              onClick={() => setActiveMode(null)} 
              className="group inline-flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all active:scale-95"
           >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span>Terminate Deck</span>
           </button>

           <div className="w-full h-96 [perspective:1000px] group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                 {/* Front Side */}
                 <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center [backface-visibility:hidden] shadow-2xl">
                    <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.5em] mb-8">Atomic Unit Identifier</div>
                    <div className="text-9xl font-black text-slate-900 dark:text-white font-ubuntu drop-shadow-2xl">{currentQuestion?.symbol}</div>
                    <div className="mt-12 text-[10px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">Tap to Reveal Matrix</div>
                 </div>
                 {/* Back Side */}
                 <div className="absolute inset-0 w-full h-full bg-slate-950 text-white rounded-[4rem] flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_50px_rgba(34,211,238,0.2)] p-12 text-center">
                    <div className="text-4xl font-black mb-2">{currentQuestion?.name}</div>
                    <div className="text-xs font-black uppercase text-cyan-500 tracking-[0.3em] mb-6">Atomic No. {currentQuestion?.number}</div>
                    <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md italic">{currentQuestion?.summary}</p>
                    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/10"><span className="block text-[8px] text-slate-500 uppercase font-black">Mass</span><span className="font-mono">{currentQuestion?.atomic_mass}</span></div>
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/10"><span className="block text-[8px] text-slate-500 uppercase font-black">Config</span><span className="text-[10px] font-mono">{currentQuestion?.electron_configuration}</span></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex items-center space-x-12">
              <div className="flex flex-col items-center space-y-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deck Progress</span>
                 <div className="flex space-x-1">
                    {deck.map((_, i) => (
                       <div key={i} className={`w-1.5 h-6 rounded-full transition-all ${i === deckIndex ? 'bg-cyan-500 scale-y-125 shadow-[0_0_10px_#06b6d4]' : i < deckIndex ? 'bg-indigo-500/40' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                 </div>
              </div>
              <button 
                 onClick={(e) => { e.stopPropagation(); nextFlashcard(); }}
                 className="p-8 bg-cyan-500 text-white rounded-full hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/40 active:scale-95 group"
              >
                 <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>
        </div>
      ) : (
        // Quiz Mode UI
        <div className="max-w-3xl mx-auto space-y-16 py-12 animate-reveal-up bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl p-16 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center">
          <div className="text-center space-y-8 w-full">
            <button 
               onClick={() => setActiveMode(null)} 
               className="group inline-flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-500 transition-all active:scale-95"
            >
               <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               <span>Abort Drill</span>
            </button>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-500">
                {activeMode === 'symbol_to_name' ? 'IDENTIFY UNIT NAME' : 'CALCULATE ATOMIC INDEX'}
              </h3>
              <div className="text-9xl font-black text-slate-900 dark:text-white font-ubuntu tracking-tighter drop-shadow-2xl">
                {activeMode === 'symbol_to_name' ? currentQuestion?.symbol : currentQuestion?.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {options.map((opt, i) => (
              <button
                key={opt.number}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                style={{ animationDelay: `${i * 0.1}s` }}
                className={`p-10 rounded-[2.5rem] border-2 font-black text-2xl tracking-tight transition-all transform active:scale-95 animate-reveal-up ${
                  feedback === null 
                    ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-cyan-500 hover:bg-white dark:hover:bg-slate-900 shadow-sm' 
                    : opt.number === currentQuestion?.number 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105'
                      : 'border-slate-100 dark:border-slate-800 opacity-30 grayscale'
                }`}
              >
                {activeMode === 'symbol_to_name' ? opt.name : opt.number}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-10 font-black uppercase tracking-[0.4em] text-sm animate-bounce ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
               {feedback === 'correct' ? 'POSITRON SYNC CONFIRMED' : 'WAVEFUNCTION COLLAPSE: ERROR'}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal-up { animation: reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 180, 216, 0.2); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, color, onClick }: any) => {
  const colorClasses: any = {
    cyan: 'bg-cyan-500 text-white shadow-cyan-500/20 ring-cyan-500/10 hover:ring-cyan-500/30',
    indigo: 'bg-indigo-500 text-white shadow-indigo-500/20 ring-indigo-500/10 hover:ring-indigo-500/30',
    rose: 'bg-rose-500 text-white shadow-rose-500/20 ring-rose-500/10 hover:ring-rose-500/30',
    amber: 'bg-amber-500 text-white shadow-amber-500/20 ring-amber-500/10 hover:ring-amber-500/30'
  };

  return (
    <button 
      onClick={onClick}
      className="relative flex flex-col items-start p-10 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all group text-left shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-800/40 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
      <div className={`relative w-16 h-16 rounded-[1.5rem] ${colorClasses[color]} flex items-center justify-center font-black text-3xl mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="relative space-y-3">
         <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{title}</h4>
         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>
      <div className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-cyan-500">
         <span>Initialize Simulation</span>
         <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </button>
  );
};
