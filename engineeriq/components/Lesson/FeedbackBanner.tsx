import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface FeedbackBannerProps {
  visible: boolean;
  correct: boolean;
  feedback: string;
  onContinue: () => void;
  continueLabel?: string;
}

export default function FeedbackBanner({
  visible,
  correct,
  feedback,
  onContinue,
  continueLabel = 'Continue',
}: FeedbackBannerProps) {
  const translateY = useSharedValue(200);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 200, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bannerBg = correct ? Colors.correctLight : Colors.wrongLight;
  const bannerBorder = correct ? Colors.correct : Colors.wrong;
  const buttonBg = correct ? Colors.correct : Colors.wrong;
  const icon = correct ? '🎉' : '💡';
  const label = correct ? 'Correct!' : 'Not quite!';

  return (
    <Animated.View style={[styles.banner, { backgroundColor: bannerBg, borderTopColor: bannerBorder }, animStyle]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, { color: bannerBorder }]}>{label}</Text>
      </View>
      <Text style={styles.feedback}>{feedback}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBg }]}
        onPress={onContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{continueLabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    fontSize: FontSize.xl,
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  feedback: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  button: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
