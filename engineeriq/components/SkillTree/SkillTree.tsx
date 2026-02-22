import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { UNITS, Lesson, Unit } from '../../data/curriculum';
import { LessonStatus } from '../../store/useAppStore';
import UnitBanner from './UnitBanner';
import LessonNode from './LessonNode';

interface SkillTreeProps {
  lessonProgress: Record<string, LessonStatus>;
  dueReviews: string[];
  quizUnlocked: Record<string, boolean>;
  quizPassed: Record<string, boolean>;
  onLessonPress: (lesson: Lesson, unitAccentColor: string) => void;
  onQuizPress: (unit: Unit) => void;
}

const NODE_POSITIONS: Array<'left' | 'center' | 'right'> = [
  'center',
  'right',
  'center',
  'left',
  'center',
  'right',
];

export default function SkillTree({
  lessonProgress,
  dueReviews,
  quizUnlocked,
  quizPassed,
  onLessonPress,
  onQuizPress,
}: SkillTreeProps) {
  return (
    <View style={styles.container}>
      {UNITS.map((unit, unitIndex) => {
        const isUnitLocked = unit.lessons.every(
          (l) => lessonProgress[l.id] === 'locked'
        );
        const isQuizUnlocked = quizUnlocked[unit.id] ?? false;
        const isQuizPassed = quizPassed[unit.id] ?? false;
        const quizStatus: LessonStatus = isQuizPassed
          ? 'completed'
          : isQuizUnlocked
          ? 'available'
          : 'locked';

        const allNodes = [...unit.lessons.map((l, i) => ({ type: 'lesson' as const, lesson: l, index: i }))];

        return (
          <View key={unit.id} style={styles.unit}>
            {/* Unit banner */}
            <UnitBanner
              title={unit.title}
              unitNumber={unitIndex + 1}
              accentColor={unit.accentColor}
              locked={isUnitLocked}
            />

            {/* Connector between banner and first node */}
            <View style={styles.connector} />

            {/* Lesson nodes */}
            {unit.lessons.map((lesson, lessonIndex) => {
              const status = lessonProgress[lesson.id] ?? 'locked';
              const position = NODE_POSITIONS[lessonIndex % NODE_POSITIONS.length];
              const isDue = dueReviews.includes(lesson.id);

              // Has connector to next node (lesson or quiz)
              const hasConnector = lessonIndex < unit.lessons.length - 1 || true; // always has connector to quiz

              return (
                <View
                  key={lesson.id}
                  style={[styles.nodeRow, styles.nodeRowWithConnector]}
                >
                  <View style={[styles.nodeSpacer, position === 'right' && styles.nodeSpacerFull]} />

                  <LessonNode
                    status={status}
                    accentColor={unit.accentColor}
                    glowColor={unit.glowColor}
                    lessonNumber={lessonIndex + 1}
                    nodeType="lesson"
                    reviewDue={isDue}
                    onPress={() => onLessonPress(lesson, unit.accentColor)}
                    onLockedPress={() =>
                      Alert.alert(
                        'Locked',
                        'Complete the previous lesson to unlock this one.',
                        [{ text: 'OK' }]
                      )
                    }
                  />

                  <View style={[styles.nodeSpacer, position === 'left' && styles.nodeSpacerFull]} />

                  {/* Connector to next node */}
                  <View
                    style={[
                      styles.verticalConnector,
                      {
                        backgroundColor:
                          isUnitLocked || status === 'locked'
                            ? Colors.nodeLocked
                            : unit.accentColor,
                      },
                      position === 'left' && styles.connectorLeft,
                      position === 'right' && styles.connectorRight,
                    ]}
                  />
                </View>
              );
            })}

            {/* Unit Quiz node — always centered, after all lessons */}
            <View style={[styles.nodeRow]}>
              <View style={styles.nodeSpacer} />

              <LessonNode
                status={quizStatus}
                accentColor={unit.accentColor}
                glowColor={unit.glowColor}
                lessonNumber={unit.lessons.length + 1}
                nodeType="quiz"
                onPress={() => onQuizPress(unit)}
                onLockedPress={() =>
                  Alert.alert(
                    '🔒 Quiz Locked',
                    'Complete all lessons in this unit to unlock the quiz.',
                    [{ text: 'OK' }]
                  )
                }
              />

              <View style={styles.nodeSpacer} />
            </View>

            {/* Connector between units */}
            {unitIndex < UNITS.length - 1 && <View style={styles.unitConnector} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
  },
  unit: {
    alignItems: 'center',
  },
  connector: {
    width: 3,
    height: 24,
    backgroundColor: Colors.cardBorder,
    marginVertical: 0,
  },
  unitConnector: {
    width: 3,
    height: 32,
    backgroundColor: Colors.cardBorder,
    marginTop: Spacing.lg,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  nodeRowWithConnector: {
    marginBottom: 32,
  },
  nodeSpacer: {
    flex: 0.5,
  },
  nodeSpacerFull: {
    flex: 1,
  },
  verticalConnector: {
    position: 'absolute',
    bottom: -32,
    width: 3,
    height: 32,
    left: '50%',
    marginLeft: -1.5,
    opacity: 0.6,
  },
  connectorLeft: {
    left: '25%',
  },
  connectorRight: {
    left: '75%',
  },
});
