export type FitnessGoal = 'fat-loss' | 'clean-bulk' | 'overall-health' | 'strength' | 'endurance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentAccess = 'full-gym' | 'dumbbells' | 'bodyweight' | 'bands';

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: FitnessGoal;
  level: FitnessLevel;
  equipment: EquipmentAccess;
  dailyStreak: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  points: number;
  unlockedItems: string[];
  bodyType?: string;
  onboarded?: boolean;
  selectedTheme?: string;
  selectedBadge?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  completedSets?: boolean[]; // Track individual set completions
}

export interface WorkoutPlan {
  title: string;
  targetFocus: string;
  estimatedDuration: number;
  estimatedCaloriesBurned: number;
  exercises: WorkoutExercise[];
}

export interface LoggedWorkout {
  id: string;
  title: string;
  targetFocus: string;
  durationMinutes: number;
  caloriesBurned: number;
  dateTime: string;
  exerciseCount: number;
}

export interface CoachMessage {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

export interface LibraryExercise {
  name: string;
  category: string;
  equipment: string;
  difficulty: string;
  instructions: string[];
  tips: string;
}

export interface MealItem {
  type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  preparation: string;
  eaten?: boolean;
}

export interface MealPlan {
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  meals: MealItem[];
  coachNutritionTip: string;
}
