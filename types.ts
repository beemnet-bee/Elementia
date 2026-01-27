
export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  atomic_mass: number | string;
  category: string;
  row: number;
  col: number;
  discovered_by?: string;
  summary: string;
  year_discovered?: number | string;
  image_url?: string;
  electron_configuration: string;
  protons: number;
  neutrons: number;
  electrons: number;
  // Physical & Chemical Properties
  melting_point?: number | string; // in Kelvin
  boiling_point?: number | string; // in Kelvin
  density?: number | string;      // in g/cm³ or g/L
  electronegativity?: number | string; // Pauling scale
  ionization_energy?: number | string; // in kJ/mol
  electron_affinity?: number | string; // in kJ/mol
}

export type QuizType = 'symbol_to_name' | 'name_to_symbol' | 'atomic_number' | 'flashcards' | 'spaced_repetition';

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface UserProgress {
  masteredElements: number[];
  quizStats: {
    correct: number;
    total: number;
    streak: number; // Current session streak
    dayStreak: number; // Consecutive days streak
    lastActivityDate?: string; // YYYY-MM-DD
  };
  activityHistory: DailyActivity[];
}
