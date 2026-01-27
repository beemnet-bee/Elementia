
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProgress, DailyActivity } from '../types';

interface MasteryContextType {
  progress: UserProgress;
  toggleMastery: (num: number) => void;
  updateStats: (correct: boolean) => void;
  isMastered: (num: number) => boolean;
}

const MasteryContext = createContext<MasteryContextType | undefined>(undefined);

export const MasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('user_progress');
    const defaultProgress: UserProgress = {
      masteredElements: [],
      quizStats: { correct: 0, total: 0, streak: 0, dayStreak: 0 },
      activityHistory: []
    };
    
    if (!saved) return defaultProgress;
    
    try {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist for legacy migrations
      return {
        ...defaultProgress,
        ...parsed,
        quizStats: { ...defaultProgress.quizStats, ...parsed.quizStats },
        activityHistory: parsed.activityHistory || []
      };
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem('user_progress', JSON.stringify(progress));
  }, [progress]);

  // Handle Day Streak logic on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.quizStats.lastActivityDate;

    if (lastDate && lastDate !== today) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffTime = Math.abs(curr.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Streak broken
        setProgress(prev => ({
          ...prev,
          quizStats: { ...prev.quizStats, dayStreak: 0 }
        }));
      }
    }
  }, []);

  const toggleMastery = (num: number) => {
    setProgress(prev => {
      const isMastered = prev.masteredElements.includes(num);
      return {
        ...prev,
        masteredElements: isMastered 
          ? prev.masteredElements.filter(n => n !== num)
          : [...prev.masteredElements, num]
      };
    });
  };

  const updateStats = (correct: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    setProgress(prev => {
      const lastDate = prev.quizStats.lastActivityDate;
      let newDayStreak = prev.quizStats.dayStreak;

      // Update Day Streak
      if (!lastDate) {
        newDayStreak = 1;
      } else if (lastDate !== today) {
        const last = new Date(lastDate);
        const curr = new Date(today);
        const diffDays = Math.ceil(Math.abs(curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newDayStreak += 1;
        } else {
          newDayStreak = 1;
        }
      }

      // Update Activity History
      const history = [...prev.activityHistory];
      const todayIndex = history.findIndex(h => h.date === today);
      if (todayIndex > -1) {
        history[todayIndex].count += 1;
      } else {
        history.push({ date: today, count: 1 });
        // Keep only last 14 days
        if (history.length > 14) history.shift();
      }

      return {
        ...prev,
        quizStats: {
          ...prev.quizStats,
          total: prev.quizStats.total + 1,
          correct: prev.quizStats.correct + (correct ? 1 : 0),
          streak: correct ? prev.quizStats.streak + 1 : 0,
          dayStreak: newDayStreak,
          lastActivityDate: today
        },
        activityHistory: history
      };
    });
  };

  const isMastered = (num: number) => progress.masteredElements.includes(num);

  return (
    <MasteryContext.Provider value={{ progress, toggleMastery, updateStats, isMastered }}>
      {children}
    </MasteryContext.Provider>
  );
};

export const useMastery = () => {
  const context = useContext(MasteryContext);
  if (!context) throw new Error('useMastery must be used within a MasteryProvider');
  return context;
};
