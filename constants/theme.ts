// Professional Design System for Stryde SG

export const Colors = {
  // Primary Brand Colors
  primary: '#4F46E5', // Indigo - main brand color
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  primaryGradient: ['#6366F1', '#8B5CF6'], // Indigo to Purple gradient
  
  // Secondary Colors
  secondary: '#10B981', // Emerald - success, health
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  secondaryGradient: ['#10B981', '#14B8A6'], // Emerald to Teal
  
  // Accent Colors
  accent: '#F59E0B', // Amber - highlights, achievements
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  accentGradient: ['#F59E0B', '#EF4444'], // Amber to Red
  
  // Functional Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral Palette
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background Gradients
  backgroundGradient: ['#F9FAFB', '#FFFFFF'],
  cardGradient: ['#FFFFFF', '#F9FAFB'],
  heroGradient: ['#4F46E5', '#7C3AED', '#EC4899'], // Indigo to Purple to Pink
  
  // Category Colors (for different content types)
  nutrition: '#10B981', // Emerald
  exercise: '#F59E0B', // Amber
  sleep: '#8B5CF6', // Purple
  mental: '#3B82F6', // Blue
  social: '#EC4899', // Pink
  
  // Tab Colors
  tabActive: '#4F46E5',
  tabInactive: '#9CA3AF',
  tabBackground: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowStrong: 'rgba(0, 0, 0, 0.25)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
  
  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  
  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Icons = {
  // Feature Icons (emoji-based for now, can be replaced with icon libraries)
  learn: '📚',
  track: '📊',
  connect: '🤝',
  reflect: '✍️',
  aicoach: '🤖',
  achievement: '🏆',
  nutrition: '🥗',
  exercise: '💪',
  sleep: '😴',
  water: '💧',
  energy: '⚡',
  mood: '😊',
  stress: '🧘',
  fire: '🔥',
  star: '⭐',
  heart: '❤️',
  brain: '🧠',
  muscle: '💪',
  check: '✅',
  warning: '⚠️',
  info: 'ℹ️',
  settings: '⚙️',
  profile: '👤',
  bookmark: '🔖',
  trophy: '🏆',
  medal: '🥇',
  target: '🎯',
  calendar: '📅',
  clock: '⏰',
  location: '📍',
  chart: '📈',
  food: '🍽️',
  apple: '🍎',
  salad: '🥗',
  running: '🏃',
  dumbbell: '🏋️',
  yoga: '🧘',
  basketball: '🏀',
  soccer: '⚽',
  swimming: '🏊',
  cycling: '🚴',
  team: '👥',
  message: '💬',
  camera: '📷',
  search: '🔍',
  filter: '🔽',
  plus: '➕',
  edit: '✏️',
  delete: '🗑️',
  refresh: '🔄',
  lock: '🔒',
  unlock: '🔓',
  eye: '👁️',
  eyeSlash: '🙈',
  arrowRight: '→',
  arrowLeft: '←',
  arrowUp: '↑',
  arrowDown: '↓',
  chevronRight: '›',
  chevronLeft: '‹',
  chevronUp: '⌃',
  chevronDown: '⌄',
};

// Gradient presets for LinearGradient
export const Gradients = {
  primary: {
    colors: Colors.primaryGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  secondary: {
    colors: Colors.secondaryGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  accent: {
    colors: Colors.accentGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  hero: {
    colors: Colors.heroGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  card: {
    colors: Colors.cardGradient,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  background: {
    colors: Colors.backgroundGradient,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  success: {
    colors: ['#10B981', '#14B8A6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  warning: {
    colors: ['#F59E0B', '#EF4444'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  info: {
    colors: ['#3B82F6', '#8B5CF6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

// Animation Durations
export const Animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Component Styles
export const ComponentStyles = {
  button: {
    primary: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      ...Shadows.md,
    },
    secondary: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    small: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
  },
  card: {
    default: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      ...Shadows.md,
    },
    elevated: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      ...Shadows.lg,
    },
    flat: {
      backgroundColor: Colors.gray50,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
    },
  },
  input: {
    default: {
      borderWidth: 1,
      borderColor: Colors.gray300,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: Typography.md,
      backgroundColor: Colors.white,
    },
    focused: {
      borderColor: Colors.primary,
      borderWidth: 2,
    },
  },
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  Icons,
  Gradients,
  Animations,
  ComponentStyles,
};
