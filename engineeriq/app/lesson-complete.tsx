import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonById, getUnitById } from '../data/curriculum';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

export default function LessonCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lessonId: string;
    xpEarned: string;
    perfect: string;
    totalQuestions: string;
    wrongCount: string;
    elapsed: string;
  }>();

  const lesson = getLessonById(params.lessonId ?? '');
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;
  const accentColor = unit?.accentColor ?? Colors.unit1;

  const xpEarned = parseInt(params.xpEarned ?? '20', 10);
  const perfect = params.perfect === 'true';
  const totalQuestions = parseInt(params.totalQuestions ?? '5', 10);
  const wrongCount = parseInt(params.wrongCount ?? '0', 10);
  const correctCount = totalQuestions - wrongCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const elapsedSecs = parseInt(params.elapsed ?? '0', 10);
  const elapsedStr =
    elapsedSecs >= 60
      ? `${Math.floor(elapsedSecs / 60)}m ${elapsedSecs % 60}s`
      : `${elapsedSecs}s`;

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // XP counter
    Animated.timing(xpCountAnim, {
      toValue: xpEarned,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Stars pop in sequence
    starsAnim.forEach((anim, i) => {
      setTimeout(() => {
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }).start();
      }, 300 + i * 150);
    });
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const starsCount = perfect ? 3 : accuracy >= 60 ? 2 : 1;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle1, { backgroundColor: accentColor }]} />
      <View style={[styles.decorCircle2, { backgroundColor: accentColor }]} />

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        {/* Trophy / badge */}
        <Animated.View
          style={[styles.badgeContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={[styles.badge, { borderColor: accentColor, shadowColor: accentColor }]}>
            <Text style={styles.badgeEmoji}>🏆</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Lesson Complete!</Text>
        {perfect && <Text style={styles.perfectLabel}>⚡ Perfect Score!</Text>}

        {/* Stars */}
        <View style={styles.stars}>
          {[0, 1, 2].map((i) => (
            <Animated.Text
              key={i}
              style={[
                styles.star,
                {
                  transform: [{ scale: starsAnim[i] }],
                  opacity: i < starsCount ? 1 : 0.25,
                },
              ]}
            >
              ⭐
            </Animated.Text>
          ))}
        </View>

        {/* XP reward */}
        <View style={[styles.xpCard, { borderColor: accentColor }]}>
          <Text style={styles.xpValue}>{`+${xpEarned} XP`}</Text>
          {perfect && (
            <Text style={styles.xpBonus}>Includes +10 perfect bonus!</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{correctCount}/{totalQuestions}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{elapsedStr}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: accentColor }]}
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
  decorCircle1: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.08,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.06,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  badgeContainer: {
    marginBottom: Spacing.sm,
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  badgeEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  perfectLabel: {
    fontSize: FontSize.md,
    color: Colors.xpGold,
    fontWeight: '700',
    marginTop: -Spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  star: {
    fontSize: 36,
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
    color: Colors.xpGold,
  },
  xpBonus: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.cardBorder,
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
