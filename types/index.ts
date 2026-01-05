// Core Types for Stryde SG

export interface OnboardingData {
  age: number;
  activityLevel: 'Low' | 'Medium' | 'High';
  sleepHours: number;
  stressLevel: number;
  primaryGoal: 'Energy & mood' | 'Fitness & performance' | 'Healthier habits' | 'Healthy weight management';
  dietaryPreference: 'None' | 'Halal' | 'Vegetarian' | 'Other';
  height?: number;
  weight?: number;
  sex?: 'Male' | 'Female' | 'Other';
  onboardingComplete: boolean;
  tutorialComplete: boolean;
}

export interface LearnModule {
  id: string;
  title: string;
  category: 'beginner' | 'advanced';
  content: ModuleContent[];
  quiz?: Quiz;
  completed: boolean;
  bestScore?: number;
  lastAttempt?: string;
}

export interface ModuleContent {
  type: 'heading' | 'text' | 'bullet' | 'example';
  content: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AdvancedTopic {
  id: string;
  title: string;
  category: string;
  popularity: number;
  lastUpdated: string;
  bookmarked: boolean;
  content: {
    explanation: string;
    keyFindings: string[];
    evidence: StudyEntry[];
    teenApplication: string;
  };
}

export interface StudyEntry {
  title: string;
  keyStats: string;
  limitations: string;
  link: string;
}

export interface DailyLog {
  date: string;
  nutrition: {
    caloriesIn?: number;
    caloriesOut?: number;
    protein?: number;
    fibre?: number;
    addedSugar?: number;
    sodium?: number;
    fruitVegServings?: number;
    caffeine?: number;
    water?: number;
  };
  activity: {
    steps?: number;
    activeMinutes?: number;
    workouts?: Workout[];
  };
  recovery: {
    sleepDuration?: number;
    sleepQuality?: number;
    stress?: number;
    energyLevel?: number;
    restingHR?: number;
    soreness?: number;
    sedentaryTime?: number;
    injuryIllness?: boolean;
  };
  bodyMetric: {
    weight?: number;
  };
  tags?: string[];
}

export interface Workout {
  type: 'Strength' | 'Cardio' | 'Sport' | 'CCA' | 'Other';
  duration: number;
  intensity: 'Easy' | 'Med' | 'Hard';
  rpe?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: string;
  difficulty: 'Easy' | 'Standard' | 'Stretch';
  target: number;
  progress: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdDate: string;
  streak: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: 'captain' | 'motivator' | 'member';
  personalTasks: Quest[];
}

export interface SGEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  free: boolean;
  description: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  mode: '1 min' | '5 min' | '10 min' | 'free';
  content: string;
  tags?: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserTargets {
  dailyCalories?: number;
  dailyProtein?: number;
  dailyFibre?: number;
  dailyWater?: number;
  dailySteps?: number;
  weeklyWorkouts?: number;
  sleepHours?: number;
}
