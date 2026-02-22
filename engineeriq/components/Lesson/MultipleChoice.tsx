import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../../constants/theme';
import { MultipleChoiceQuestion } from '../../data/curriculum';

interface OptionCardProps {
  text: string;
  index: number;
  selectedIndex: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
  disabled: boolean;
}

function OptionCard({
  text,
  index,
  selectedIndex,
  correctIndex,
  onSelect,
  disabled,
}: OptionCardProps) {
  const shakeValue = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
  }));

  const handlePress = () => {
    if (disabled || selectedIndex !== null) return;
    const isCorrect = index === correctIndex;
    if (!isCorrect) {
      shakeValue.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
    onSelect(index);
  };

  const isSelected = selectedIndex !== null;
  const isCorrectCard = isSelected && index === correctIndex;
  const isWrongCard = isSelected && index === selectedIndex && index !== correctIndex;
  const isDimmed = isSelected && !isCorrectCard && !isWrongCard;

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          isCorrectCard && styles.cardCorrect,
          isWrongCard && styles.cardWrong,
          isDimmed && styles.cardDimmed,
        ]}
        onPress={handlePress}
        activeOpacity={0.75}
        disabled={selectedIndex !== null || disabled}
      >
        <Text
          style={[
            styles.optionText,
            isCorrectCard && { color: Colors.correct },
            isWrongCard && { color: Colors.wrong },
          ]}
        >
          {text}
        </Text>
        {isCorrectCard && <Text style={styles.checkmark}>✓</Text>}
        {isWrongCard && <Text style={styles.cross}>✗</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, selectedIndex: number) => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  question,
  onAnswer,
  disabled = false,
}: MultipleChoiceProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const isCorrect = index === question.correctIndex;
    onAnswer(isCorrect, index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.options}>
        {question.options.map((opt, i) => (
          <OptionCard
            key={i}
            text={opt}
            index={i}
            selectedIndex={selectedIndex}
            correctIndex={question.correctIndex}
            onSelect={handleSelect}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    lineHeight: 28,
  },
  options: {
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.card,
  },
  cardCorrect: {
    borderColor: Colors.correct,
    backgroundColor: Colors.correctLight,
  },
  cardWrong: {
    borderColor: Colors.wrong,
    backgroundColor: Colors.wrongLight,
  },
  cardDimmed: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  checkmark: {
    color: Colors.correct,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  cross: {
    color: Colors.wrong,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
});
