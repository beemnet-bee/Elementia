
import React, { useState, useMemo } from 'react';
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
        count: entry ? entry.count : 0,
        date: dateStr
      });
    }
    return result;
  }, [progress.activityHistory]);

  const heatmapData = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = progress.activityHistory.find(h => h.date === dateStr);
      result.push({
        date: d,
        count: entry ? entry.count : 0
      });
    }
    return result;
  }, [progress.activityHistory]);

  const affinityData = useMemo(() => {
    return ELEMENTS
      .filter(e => typeof e.electron_affinity === 'number' && e.electron_affinity > 0)
      .sort((a, b) => (b.electron_affinity as number) - (a.electron_affinity as number))
      .slice(0, 15);
  }, []);

  const maxActivity = Math.max(...chartData.map(d => d.count), 5);
  const maxAffinity = Math.max(...affinityData.map(d => d.electron_affinity as number), 1);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-reveal relative z-10 pb-40">
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[9px] font-black tracking-widest uppercase">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
             <span>Neural Interface Protocol</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white font-ubuntu">
            QUANTUM HUB
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-light max-w-lg leading-snug">
            Personalized elemental synthesis engine. Achieve chemical mastery.
          </p>
        </div>
        
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-cyan-500 transition-all flex items-center space-x-2 shadow-lg dark:shadow-none active:scale-95 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>System Grid</span>
        </button>
      </div>

      {!activeMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mastery progress */}
              <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Registry Mastery</h3>
                 <div className="relative w-36 h-36 flex items-center justify-center">
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
                       <span className="text-3xl font-black text-slate-900 dark:text-white">{masteryPercent}%</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{progress.masteredElements.length} / 127</span>
                    </div>
                 </div>
              </div>

              {/* Streak Card */}
              <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col shadow-xl relative group hover:border-amber-500/30 transition-colors">
                 <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -ml-12 -mt-12"></div>
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Neural Consistency</h3>
                 <div className="flex-grow flex flex-col items-center justify-center space-y-2">
                    <div className="relative">
                       <div className="text-6xl font-black text-slate-900 dark:text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                          {progress.quizStats.dayStreak}
                       </div>
                       <div className="absolute -top-3 -right-6 text-2xl animate-bounce">🔥</div>
                    </div>
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">Day Streak Active</span>
                    <div className="flex space-x-1.5 mt-3">
                       {[...Array(7)].map((_, i) => {
                         const d = new Date();
                         d.setDate(d.getDate() - (6 - i));
                         const isActive = progress.activityHistory.some(h => h.date === d.toISOString().split('T')[0]);
                         return <div key={i} className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-200 dark:bg-slate-800'}`}></div>;
                       })}
                    </div>
                 </div>
              </div>
            </div>

            {/* Activity Area */}
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Synthesis Velocity</h3>
                  <div className="flex items-center space-x-2">
                     <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Probes</span>
                  </div>
               </div>
               <div className="h-48 w-full relative group">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 200">
                     <path 
                        d={`M ${chartData.map((d, i) => `${i * 116},${200 - (d.count / maxActivity) * 180}`).join(' L ')}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_#06b6d4]"
                     />
                     <path 
                        d={`M 0,200 ${chartData.map((d, i) => `L ${i * 116},${200 - (d.count / maxActivity) * 180}`).join(' ')} L 696,200 Z`}
                        fill="url(#areaGrad)"
                        opacity="0.08"
                     />
                     <defs>
                        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                     </defs>
                     {chartData.map((d, i) => (
                        <circle key={i} cx={i * 116} cy={200 - (d.count / maxActivity) * 180} r="5" fill="#06b6d4" className="hover:r-7 transition-all" />
                     ))}
                  </svg>
                  <div className="flex justify-between mt-4 px-1">
                     {chartData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center"><span className="text-[9px] font-black text-slate-400">{d.label}</span></div>
                     ))}
                  </div>
               </div>

               {/* Historical Streak Heatmap */}
               <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                     <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Historical Temporal Map</h4>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">28-Day Log</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                     {heatmapData.map((day, i) => {
                        const intensity = day.count === 0 ? 0 : day.count < 5 ? 1 : day.count < 15 ? 2 : 3;
                        const colors = [
                           'bg-slate-100 dark:bg-slate-800/40',
                           'bg-cyan-500/20',
                           'bg-cyan-500/50',
                           'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        ];
                        return (
                           <div 
                              key={i} 
                              className={`aspect-square rounded-md ${colors[intensity]} transition-all hover:scale-110 cursor-help relative group/tip`}
                              title={`${day.date.toDateString()}: ${day.count} probes`}
                           >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[8px] text-white rounded opacity-0 group-hover/tip:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                 {day.count} Probes • {day.date.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Electron Affinity Bar Chart */}
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 overflow-hidden">
               <div className="flex justify-between items-center">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Electron Affinity Spectrum</h3>
                  <div className="flex items-center space-x-2">
                     <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Top 15 Valence States</span>
                  </div>
               </div>
               <div className="space-y-3">
                  {affinityData.map((el, i) => (
                     <div key={el.number} className="flex items-center space-x-4 group">
                        <div className="w-8 text-[9px] font-black text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">{el.symbol}</div>
                        <div className="flex-grow h-3 bg-slate-50 dark:bg-slate-800/40 rounded-full overflow-hidden relative">
                           <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2"
                              style={{ width: `${((el.electron_affinity as number) / maxAffinity) * 100}%`, transitionDelay: `${i * 50}ms` }}
                           >
                              <span className="text-[7px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">{el.electron_affinity} kJ/mol</span>
                           </div>
                        </div>
                        <div className="w-12 text-right text-[9px] font-mono text-slate-500">{el.electron_affinity}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Training Modes Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <FeatureCard 
                  title="Flashcards" 
                  desc="Visual recognition training." 
                  icon="🎴" 
                  color="cyan"
                  onClick={() => startMode('flashcards')}
               />
               <FeatureCard 
                  title="Atomic Map" 
                  desc="Neural recall drills." 
                  icon="El" 
                  color="indigo"
                  onClick={() => startMode('symbol_to_name')}
               />
               <FeatureCard 
                  title="Priority" 
                  desc="Spaced repetition drills." 
                  icon="🧠" 
                  color="rose"
                  onClick={() => startMode('spaced_repetition')}
               />
               <FeatureCard 
                  title="Numerical" 
                  desc="Index correlation drills." 
                  icon="102" 
                  color="amber"
                  onClick={() => startMode('atomic_number')}
               />
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white dark:bg-slate-900/60 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                   Knowledge Density
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {categoryStats.map(([cat, stats]) => {
                      const percent = Math.round((stats.mastered / stats.total) * 100);
                      const accent = CATEGORY_ACCENT_COLORS[cat] || { bg: 'bg-slate-500' };
                      return (
                         <div key={cat} className="space-y-1.5 group cursor-pointer" onClick={() => startMode('symbol_to_name', cat)}>
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">
                               <span className="truncate group-hover:text-cyan-500 transition-colors">{cat.split(',')[0]}</span>
                               <span className="font-black text-slate-400 group-hover:text-cyan-400">{percent}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                               <div className={`h-full ${accent.bg} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 p-8 rounded-[1.5rem] border border-cyan-500/10 shadow-xl space-y-6">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-600 dark:text-cyan-400 mb-2">Efficiency Matrix</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500">Global Accuracy</span>
                       <span className="text-xl font-black text-indigo-500">{accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500">Total Probes</span>
                       <span className="text-xl font-black text-slate-900 dark:text-white">{progress.quizStats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500">Sync Rank</span>
                       <span className="text-[10px] px-2 py-0.5 bg-cyan-500 text-white rounded-full font-black uppercase tracking-widest">
                          {masteryPercent > 90 ? 'Alpha' : masteryPercent > 50 ? 'Gamma' : 'Omega'}
                       </span>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      ) : activeMode === 'flashcards' || activeMode === 'spaced_repetition' ? (
        <div className="max-w-2xl mx-auto space-y-12 py-8 animate-reveal-up flex flex-col items-center">
           <button 
              onClick={() => setActiveMode(null)} 
              className="group inline-flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all active:scale-95"
           >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span>Terminate Deck</span>
           </button>

           <div className="w-full h-80 [perspective:1000px] group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                 <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center [backface-visibility:hidden] shadow-xl">
                    <div className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-6">Unit Identifier</div>
                    <div className="text-8xl font-black text-slate-900 dark:text-white font-ubuntu drop-shadow-lg">{currentQuestion?.symbol}</div>
                    <div className="mt-8 text-[9px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">Tap to Reveal</div>
                 </div>
                 <div className="absolute inset-0 w-full h-full bg-slate-950 text-white rounded-[3rem] flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl p-10 text-center">
                    <div className="text-3xl font-black mb-2">{currentQuestion?.name}</div>
                    <div className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.2em] mb-4">No. {currentQuestion?.number}</div>
                    <p className="text-slate-400 text-base font-light leading-relaxed max-w-sm italic line-clamp-3">{currentQuestion?.summary}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center space-y-1">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                 <div className="flex space-x-1">
                    {deck.map((_, i) => (
                       <div key={i} className={`w-1 h-5 rounded-full transition-all ${i === deckIndex ? 'bg-cyan-500 scale-y-110' : i < deckIndex ? 'bg-indigo-500/40' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                 </div>
              </div>
              <button 
                 onClick={(e) => { e.stopPropagation(); nextFlashcard(); }}
                 className="p-6 bg-cyan-500 text-white rounded-full hover:bg-cyan-400 transition-all shadow-xl active:scale-95 group"
              >
                 <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-12 py-8 animate-reveal-up bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="text-center space-y-6 w-full">
            <button onClick={() => setActiveMode(null)} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-500 transition-colors">Abort Drill</button>
            <div className="space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500">
                {activeMode === 'symbol_to_name' ? 'IDENTIFY UNIT NAME' : 'CALCULATE ATOMIC INDEX'}
              </h3>
              <div className="text-8xl font-black text-slate-900 dark:text-white font-ubuntu tracking-tighter drop-shadow-lg">
                {activeMode === 'symbol_to_name' ? currentQuestion?.symbol : currentQuestion?.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {options.map((opt, i) => (
              <button
                key={opt.number}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                style={{ animationDelay: `${i * 0.1}s` }}
                className={`p-8 rounded-[1.5rem] border-2 font-black text-xl tracking-tight transition-all transform active:scale-95 animate-reveal-up ${
                  feedback === null 
                    ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-cyan-500 hover:bg-white dark:hover:bg-slate-900 shadow-sm' 
                    : opt.number === currentQuestion?.number 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : 'border-slate-100 dark:border-slate-800 opacity-30'
                }`}
              >
                {activeMode === 'symbol_to_name' ? opt.name : opt.number}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-6 font-black uppercase tracking-[0.4em] text-[10px] animate-bounce ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
               {feedback === 'correct' ? 'POSITRON SYNC CONFIRMED' : 'WAVEFUNCTION ERROR'}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal-up { animation: reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, color, onClick }: any) => {
  const colorClasses: any = {
    cyan: 'bg-cyan-500 text-white shadow-cyan-500/20 ring-cyan-500/10',
    indigo: 'bg-indigo-500 text-white shadow-indigo-500/20 ring-indigo-500/10',
    rose: 'bg-rose-500 text-white shadow-rose-500/20 ring-rose-500/10',
    amber: 'bg-amber-500 text-white shadow-amber-500/20 ring-amber-500/10'
  };

  return (
    <button 
      onClick={onClick}
      className="relative flex flex-col items-start p-8 bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all group text-left shadow-lg overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 dark:bg-slate-800/40 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
      <div className={`relative w-12 h-12 rounded-2xl ${colorClasses[color]} flex items-center justify-center font-black text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="relative space-y-1">
         <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{title}</h4>
         <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug font-medium line-clamp-2">{desc}</p>
      </div>
      <div className="mt-6 flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-500">
         <span>Initialize</span>
         <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </button>
  );
};
