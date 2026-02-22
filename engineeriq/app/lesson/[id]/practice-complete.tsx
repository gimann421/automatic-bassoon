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
import { getLessonById, getUnitById } from '../../../data/curriculum';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';

const PRACTICE_XP = 10;

export default function PracticeCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lessonId: string;
    isReview: string;
    totalQuestions: string;
    wrongCount: string;
  }>();

  const lesson = getLessonById(params.lessonId ?? '');
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;
  const accentColor = unit?.accentColor ?? Colors.unit1;

  const isReview = params.isReview === 'true';
  const totalQuestions = parseInt(params.totalQuestions ?? '5', 10);
  const wrongCount = parseInt(params.wrongCount ?? '0', 10);
  const correctCount = totalQuestions - wrongCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    if (!isReview) {
      Animated.timing(xpAnim, {
        toValue: PRACTICE_XP,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  const handleBackToPath = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        {/* Icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconCircle, { borderColor: accentColor }]}>
            <Text style={styles.iconEmoji}>✏️</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Text style={styles.headline}>Practice Complete!</Text>
        {lesson && (
          <Text style={styles.lessonName}>{lesson.title}</Text>
        )}

        {/* XP badge — only for non-review */}
        {!isReview && (
          <View style={[styles.xpBadge, { borderColor: accentColor }]}>
            <Animated.Text style={[styles.xpText, { color: accentColor }]}>
              {`+${PRACTICE_XP} XP`}
            </Animated.Text>
            <Text style={styles.xpSub}>Practice reward</Text>
          </View>
        )}

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
        </View>

        {/* Back to Path */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: accentColor }]}
          onPress={handleBackToPath}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Back to Path</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 48,
  },
  headline: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  lessonName: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -Spacing.md,
  },
  xpBadge: {
    borderWidth: 2,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    gap: 4,
  },
  xpText: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
  },
  xpSub: {
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
