import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../../constants/theme';
import { TrueFalseQuestion } from '../../data/curriculum';

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

export default function TrueFalse({ question, onAnswer, disabled = false }: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    if (disabled || selected !== null) return;
    setSelected(value);
    onAnswer(value === question.correctAnswer);
  };

  const getCardStyle = (value: boolean) => {
    if (selected === null) return styles.card;
    if (value === question.correctAnswer) return { ...styles.card, ...styles.cardCorrect };
    if (value === selected && value !== question.correctAnswer)
      return { ...styles.card, ...styles.cardWrong };
    return { ...styles.card, ...styles.cardDimmed };
  };

  const getTextStyle = (value: boolean) => {
    if (selected === null) return styles.optionText;
    if (value === question.correctAnswer)
      return { ...styles.optionText, color: Colors.correct };
    if (value === selected && value !== question.correctAnswer)
      return { ...styles.optionText, color: Colors.wrong };
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.options}>
        {[true, false].map((value) => (
          <TouchableOpacity
            key={String(value)}
            style={getCardStyle(value)}
            onPress={() => handleSelect(value)}
            activeOpacity={0.75}
            disabled={selected !== null || disabled}
          >
            <Text style={styles.emoji}>{value ? '✅' : '❌'}</Text>
            <Text style={getTextStyle(value)}>{value ? 'True' : 'False'}</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    gap: Spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
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
  emoji: {
    fontSize: FontSize.xxl,
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
