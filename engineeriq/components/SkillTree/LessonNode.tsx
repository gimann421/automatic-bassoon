import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, FontSize, Radius } from '../../constants/theme';
import { LessonStatus } from '../../store/useAppStore';

const NODE_SIZE = 64;

export type NodeType = 'lesson' | 'practice' | 'quiz' | 'review';

interface LessonNodeProps {
  status: LessonStatus;
  accentColor: string;
  glowColor: string;
  lessonNumber: number;
  nodeType?: NodeType;
  reviewDue?: boolean;
  onPress: () => void;
  onLockedPress: () => void;
}

function nodeIcon(nodeType: NodeType, status: LessonStatus, lessonNumber: number): string {
  if (status === 'locked') return '🔒';
  if (status === 'completed') return '✓';
  switch (nodeType) {
    case 'quiz': return '🏆';
    case 'practice': return '✏️';
    case 'review': return '🔁';
    default: return String(lessonNumber);
  }
}

export default function LessonNode({
  status,
  accentColor,
  glowColor,
  lessonNumber,
  nodeType = 'lesson',
  reviewDue = false,
  onPress,
  onLockedPress,
}: LessonNodeProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    if (status === 'locked') {
      onLockedPress();
    } else {
      onPress();
    }
  };

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';

  const quizAvailableColor = '#F59E0B';
  const resolvedAccentColor = nodeType === 'quiz' && !isLocked ? quizAvailableColor : accentColor;

  const nodeBackground = isLocked
    ? Colors.nodeLocked
    : isCompleted
    ? nodeType === 'quiz' ? '#D97706' : Colors.nodeCompleted
    : resolvedAccentColor;

  const nodeBorder = isLocked
    ? Colors.nodeLockedBorder
    : isCompleted
    ? nodeType === 'quiz' ? '#B45309' : Colors.nodeCompletedBorder
    : resolvedAccentColor;

  const shadowColor =
    nodeType === 'quiz'
      ? quizAvailableColor
      : isCompleted
      ? Colors.nodeCompleted
      : accentColor;

  const glowStyle = !isLocked
    ? {
        shadowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isAvailable ? 0.7 : 0.4,
        shadowRadius: isAvailable ? 14 : 8,
        elevation: isAvailable ? 10 : 6,
      }
    : {};

  const icon = nodeIcon(nodeType, status, lessonNumber);
  const showNumberText = !isCompleted && !isLocked && nodeType === 'lesson';

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={[
            styles.node,
            nodeType === 'quiz' && styles.quizNode,
            { backgroundColor: nodeBackground, borderColor: nodeBorder },
            glowStyle,
          ]}
        >
          {showNumberText ? (
            <Text style={styles.number}>{lessonNumber}</Text>
          ) : (
            <Text style={isCompleted ? styles.checkmark : styles.icon}>{icon}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {reviewDue && !isLocked && (
        <View style={styles.reviewBadge}>
          <Text style={styles.reviewIcon}>🔁</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: Radius.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizNode: {
    width: NODE_SIZE + 8,
    height: NODE_SIZE + 8,
    borderWidth: 4,
  },
  checkmark: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  icon: {
    fontSize: FontSize.lg,
  },
  number: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  reviewBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.reviewBanner,
    borderRadius: Radius.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIcon: {
    fontSize: 11,
  },
});
