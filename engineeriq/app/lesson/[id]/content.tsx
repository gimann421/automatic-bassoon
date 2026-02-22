import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonById, getUnitById } from '../../../data/curriculum';
import useAppStore from '../../../store/useAppStore';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';
import TextPanel from '../../../components/Lesson/panels/TextPanel';
import ConceptCallout from '../../../components/Lesson/panels/ConceptCallout';
import VisualDiagram from '../../../components/Lesson/panels/VisualDiagram';
import ExamplePanel from '../../../components/Lesson/panels/ExamplePanel';

export default function LessonContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { markContentRead } = useAppStore();

  const lesson = getLessonById(id);
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;
  const accentColor = unit?.accentColor ?? Colors.unit1;

  const [currentPanel, setCurrentPanel] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  if (!lesson || !unit) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  const panels = lesson.panels;
  const totalPanels = panels.length;
  const panel = panels[currentPanel];
  const isLastPanel = currentPanel === totalPanels - 1;

  const animateToPanel = (nextIndex: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setCurrentPanel(nextIndex);
  };

  const handleNext = () => {
    if (currentPanel < totalPanels - 1) {
      animateToPanel(currentPanel + 1);
    }
  };

  const handleStartPractice = () => {
    markContentRead(lesson.id);
    router.push(`/lesson/${lesson.id}/practice`);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
        </View>

        {/* Panel dots indicator */}
        <View style={styles.dotsContainer}>
          {panels.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPanel && styles.dotActive,
                i < currentPanel && styles.dotCompleted,
                i === currentPanel && { backgroundColor: accentColor },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Progress label */}
      <View style={styles.progressLabel}>
        <Text style={styles.progressText}>
          {currentPanel + 1} of {totalPanels}
        </Text>
      </View>

      {/* Panel content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {panel.type === 'text' && (
            <TextPanel panel={panel} accentColor={accentColor} />
          )}
          {panel.type === 'conceptCallout' && (
            <ConceptCallout panel={panel} accentColor={accentColor} />
          )}
          {panel.type === 'visualDiagram' && (
            <VisualDiagram panel={panel} accentColor={accentColor} />
          )}
          {panel.type === 'example' && (
            <ExamplePanel panel={panel} accentColor={accentColor} />
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {!isLastPanel ? (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: accentColor }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.startPracticeButton, { backgroundColor: accentColor }]}
            onPress={handleStartPractice}
            activeOpacity={0.85}
          >
            <Text style={styles.startPracticeText}>Start Practice ✏️</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIcon: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cardBorder,
  },
  dotActive: {
    width: 20,
    borderRadius: 4,
  },
  dotCompleted: {
    backgroundColor: Colors.nodeCompleted,
  },
  progressLabel: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  progressText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  bottomBar: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  nextButton: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  startPracticeButton: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  startPracticeText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
});
