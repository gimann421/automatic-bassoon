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

interface LessonNodeProps {
  status: LessonStatus;
  accentColor: string;
  glowColor: string;
  lessonNumber: number;
  reviewDue?: boolean;
  onPress: () => void;
  onLockedPress: () => void;
}

export default function LessonNode({
  status,
  accentColor,
  glowColor,
  lessonNumber,
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

  const nodeBackground = isLocked
    ? Colors.nodeLocked
    : isCompleted
    ? Colors.nodeCompleted
    : accentColor;

  const nodeBorder = isLocked
    ? Colors.nodeLockedBorder
    : isCompleted
    ? Colors.nodeCompletedBorder
    : accentColor;

  const glowStyle = !isLocked
    ? {
        shadowColor: isCompleted ? Colors.nodeCompleted : accentColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isAvailable ? 0.7 : 0.4,
        shadowRadius: isAvailable ? 14 : 8,
        elevation: isAvailable ? 10 : 6,
      }
    : {};

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={[
            styles.node,
            {
              backgroundColor: nodeBackground,
              borderColor: nodeBorder,
            },
            glowStyle,
          ]}
        >
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : isLocked ? (
            <Text style={styles.icon}>🔒</Text>
          ) : (
            <Text style={styles.number}>{lessonNumber}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Review due indicator */}
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
