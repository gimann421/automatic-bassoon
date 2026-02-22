import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../constants/theme';
import { Lesson } from '../data/curriculum';
import { LessonStatus } from '../store/useAppStore';

interface LessonDetailSheetProps {
  lesson: Lesson | null;
  status: LessonStatus;
  accentColor: string;
  visible: boolean;
  onClose: () => void;
  onStartContent: (lessonId: string) => void;
  onRedoPractice: (lessonId: string) => void;
}

export default function LessonDetailSheet({
  lesson,
  status,
  accentColor,
  visible,
  onClose,
  onStartContent,
  onRedoPractice,
}: LessonDetailSheetProps) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!lesson) return null;

  const isCompleted = status === 'completed';

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Status badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: isCompleted ? Colors.correctLight : 'rgba(59,130,246,0.15)' },
        ]}>
          <Text style={[styles.statusText, { color: isCompleted ? Colors.correct : accentColor }]}>
            {isCompleted ? '✓ Completed' : '▶ Available'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{lesson.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{lesson.description}</Text>

        {/* Meta info */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⭐</Text>
            <Text style={styles.metaText}>10 XP practice</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>~{lesson.estimatedMinutes} min</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📝</Text>
            <Text style={styles.metaText}>{lesson.practiceProblems.length} practice</Text>
          </View>
        </View>

        {/* CTAs */}
        {isCompleted ? (
          // Completed — show two options
          <View style={styles.twoButtonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: accentColor }]}
              onPress={() => onStartContent(lesson.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.secondaryButtonText, { color: accentColor }]}>
                📖 Review Lesson
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: accentColor }]}
              onPress={() => onRedoPractice(lesson.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>✏️ Redo Practice</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Available — start lesson content
          <>
            <View style={styles.bonusHint}>
              <Text style={styles.bonusText}>
                📖 Read the lesson first, then practice to earn 10 XP
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: accentColor }]}
              onPress={() => onStartContent(lesson.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Start Lesson</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
    ...Shadow.card,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.cardBorder,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: FontSize.base,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.cardBorder,
  },
  bonusHint: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  bonusText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  twoButtonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  ctaButton: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ctaText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
});
