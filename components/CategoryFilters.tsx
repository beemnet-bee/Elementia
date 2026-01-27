import React from 'react';
import { CATEGORY_ACCENT_COLORS } from '../constants';

interface CategoryFiltersProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = Object.keys(CATEGORY_ACCENT_COLORS);
  
  return (
    <div className="w-full flex justify-center py-2">
      <div className="flex flex-wrap justify-center gap-3 p-1">
        <button 
          onClick={() => onCategoryChange(null)} 
          className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-all duration-300 ${
            activeCategory === null
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-lg'
              : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const accent = CATEGORY_ACCENT_COLORS[category];
          
          return (
            <button 
              key={category} 
              onClick={() => onCategoryChange(category)} 
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-all duration-300 ${
                isActive
                  ? `${accent.bg} ${accent.text} ${accent.border} ${accent.glow}`
                  : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {category.split(',')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};