
import React, { useState, useMemo } from 'react';
import { ELEMENTS } from '../constants';
import { ElementData, QuizType } from '../types';
import { useMastery } from '../contexts/MasteryContext';

export const MemorizationDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { progress, updateStats } = useMastery();
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ElementData | null>(null);
  const [options, setOptions] = useState<ElementData[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startQuiz = (type: QuizType) => {
    setActiveQuiz(type);
    generateQuestion();
  };

  const generateQuestion = () => {
    const randomEl = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
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
    setTimeout(generateQuestion, 1200);
  };

  const masteryPercent = Math.round((progress.masteredElements.length / ELEMENTS.length) * 100);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-xl animate-fade-in overflow-hidden">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] relative">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500">Atomic Mastery Hub</h2>
            <p className="text-xl font-bold text-slate-800 dark:text-white">Memorization Lab</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Mastery</span>
              <div className="flex items-end space-x-2 mt-2">
                <span className="text-4xl font-black text-cyan-500">{masteryPercent}%</span>
                <span className="text-xs font-bold text-slate-500 mb-1">{progress.masteredElements.length}/127</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${masteryPercent}%` }}></div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recall Accuracy</span>
              <div className="flex items-end space-x-2 mt-2">
                <span className="text-4xl font-black text-indigo-500">
                  {progress.quizStats.total === 0 ? 0 : Math.round((progress.quizStats.correct / progress.quizStats.total) * 100)}%
                </span>
                <span className="text-xs font-bold text-slate-500 mb-1">{progress.quizStats.total} total</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Streak</span>
              <div className="flex items-end space-x-2 mt-2">
                <span className="text-4xl font-black text-amber-500">{progress.quizStats.streak}</span>
                <span className="text-xs font-bold text-slate-500 mb-1">🔥 in a row</span>
              </div>
            </div>
          </div>

          {!activeQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <QuizCard 
                title="Chemical Symbols" 
                desc="Identify the element name given its chemical symbol." 
                icon="S"
                onClick={() => startQuiz('symbol_to_name')}
              />
              <QuizCard 
                title="Atomic Mapping" 
                desc="Match the element name to its correct atomic number." 
                icon="#"
                onClick={() => startQuiz('atomic_number')}
              />
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-10 py-6 animate-reveal">
              <div className="text-center space-y-4">
                <button onClick={() => setActiveQuiz(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-cyan-500 transition-colors">← Back to Dashboard</button>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">
                  {activeQuiz === 'symbol_to_name' ? 'IDENTIFY ELEMENT NAME' : 'LOCATE ATOMIC NUMBER'}
                </h3>
                <div className="text-7xl font-black text-slate-900 dark:text-white font-ubuntu">
                  {activeQuiz === 'symbol_to_name' ? currentQuestion?.symbol : currentQuestion?.name}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map(opt => (
                  <button
                    key={opt.number}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                    className={`p-6 rounded-3xl border-2 font-bold text-sm transition-all transform active:scale-95 ${
                      feedback === null 
                        ? 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-cyan-500' 
                        : opt.number === currentQuestion?.number 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : 'border-slate-100 dark:border-slate-800 opacity-50'
                    }`}
                  >
                    {activeQuiz === 'symbol_to_name' ? opt.name : opt.number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizCard = ({ title, desc, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-8 bg-slate-50 dark:bg-slate-950/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all group text-left"
  >
    <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black text-lg mb-6 shadow-lg group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
  </button>
);
