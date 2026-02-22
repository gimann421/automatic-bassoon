import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUnitById } from '../../data/curriculum';
import useAppStore from '../../store/useAppStore';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const QUIZ_GOLD = '#F59E0B';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function xpForScore(score: number, outOf: number, isRetake: boolean): number {
  const ratio = score / outOf;
  if (isRetake) return ratio >= 0.5 ? 50 : 0;
  if (ratio === 1 || (outOf === 10 && score >= 8)) return 100;
  if (ratio >= 0.7) return 75;
  if (ratio >= 0.5) return 50;
  return 0;
}

function isPerfect(score: number, outOf: number): boolean {
  return score === outOf || (outOf === 10 && score >= 8);
}

// Simple confetti particle animation
function ConfettiParticle({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];
  const color = colors[index % colors.length];
  const startX = (index / 20) * SCREEN_WIDTH - SCREEN_WIDTH / 2;
  const delay = (index % 5) * 120;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 600,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: startX + (Math.random() * 80 - 40),
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 800, delay: 1000, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        confettiStyles.particle,
        {
          backgroundColor: color,
          transform: [{ translateY }, { translateX }, { rotate: `${(index * 37) % 360}deg` }],
          opacity,
          left: SCREEN_WIDTH / 2 + (index % 3 === 0 ? -10 : index % 3 === 1 ? 0 : 10),
        },
      ]}
    />
  );
}

const confettiStyles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

export default function QuizCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    unitId: string;
    score: string;
    outOf: string;
  }>();

  const { unitQuizProgress } = useAppStore();

  const unit = getUnitById(params.unitId ?? '');
  const score = parseInt(params.score ?? '0', 10);
  const outOf = parseInt(params.outOf ?? '10', 10);

  const existingProgress = unitQuizProgress[params.unitId ?? ''];
  const isRetake = existingProgress
    ? existingProgress.lastAttemptDate !== new Date().toISOString().split('T')[0]
    : false;

  const xpEarned = xpForScore(score, outOf, isRetake);
  const perfect = isPerfect(score, outOf);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.timing(xpCountAnim, {
      toValue: xpEarned,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const accentColor = unit?.accentColor ?? QUIZ_GOLD;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Confetti particles */}
      <View style={styles.confettiContainer} pointerEvents="none">
        {Array.from({ length: 20 }, (_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        {/* Trophy badge */}
        <Animated.View style={[styles.badgeContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.badge, { borderColor: QUIZ_GOLD, shadowColor: QUIZ_GOLD }]}>
            <Text style={styles.badgeEmoji}>🏆</Text>
          </View>
          {perfect && (
            <View style={styles.perfectBadge}>
              <Text style={styles.perfectBadgeText}>PERFECT</Text>
            </View>
          )}
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Unit Complete! 🏆</Text>
        {unit && <Text style={styles.unitName}>{unit.title}</Text>}

        {/* Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>{score}/{outOf} correct</Text>
          <Text style={styles.scorePercent}>
            {Math.round((score / outOf) * 100)}% accuracy
          </Text>
        </View>

        {/* XP */}
        <View style={[styles.xpCard, { borderColor: QUIZ_GOLD }]}>
          <Animated.Text style={styles.xpValue}>
            {xpEarned > 0 ? `+${xpEarned} XP` : 'No XP'}
          </Animated.Text>
          {perfect && <Text style={styles.xpBonus}>⚡ Perfect score bonus!</Text>}
          {isRetake && <Text style={styles.xpSub}>Retake reward (capped at 50 XP)</Text>}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: QUIZ_GOLD }]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xl,
    zIndex: 2,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 14,
  },
  badgeEmoji: {
    fontSize: 64,
  },
  perfectBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: QUIZ_GOLD,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  perfectBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  unitName: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -Spacing.md,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    width: '100%',
    gap: 4,
  },
  scoreText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scorePercent: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  xpCard: {
    borderWidth: 2,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    gap: 4,
  },
  xpValue: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: QUIZ_GOLD,
  },
  xpBonus: {
    fontSize: FontSize.sm,
    color: Colors.xpGold,
    fontWeight: '700',
  },
  xpSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  ctaButton: {
    width: '100%',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  ctaText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
});
