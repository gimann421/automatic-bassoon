export const Colors = {
  // Backgrounds
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#253349',
  cardBorder: '#334155',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Accent — Unit 1: Electric Blue
  unit1: '#3B82F6',
  unit1Glow: 'rgba(59,130,246,0.35)',

  // Accent — Unit 2: Emerald Green
  unit2: '#10B981',
  unit2Glow: 'rgba(16,185,129,0.35)',

  // Skill tree node states
  nodeLocked: '#374151',
  nodeLockedBorder: '#4B5563',
  nodeCompleted: '#22C55E',
  nodeCompletedBorder: '#16A34A',

  // Feedback
  correct: '#22C55E',
  correctLight: 'rgba(34,197,94,0.15)',
  wrong: '#EF4444',
  wrongLight: 'rgba(239,68,68,0.15)',

  // Hearts / lives
  heartRed: '#EF4444',
  heartEmpty: '#374151',

  // XP / streak
  xpGold: '#F59E0B',
  streakOrange: '#F97316',

  // Leaderboard highlight
  leaderboardHighlight: 'rgba(59,130,246,0.2)',
  leaderboardHighlightBorder: '#3B82F6',

  // Tab bar
  tabBarBackground: '#0F172A',
  tabBarBorder: '#1E293B',
  tabActive: '#3B82F6',
  tabInactive: '#64748B',

  // Review banner
  reviewBanner: '#F59E0B',
  reviewBannerBg: 'rgba(245,158,11,0.15)',

  // White / generic
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  node: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
};
