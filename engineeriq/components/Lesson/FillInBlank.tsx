import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../../constants/theme';
import { FillBlankQuestion } from '../../data/curriculum';

interface FillInBlankProps {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

export default function FillInBlank({ question, onAnswer, disabled = false }: FillInBlankProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (chip: string) => {
    if (disabled || selected !== null) return;
    setSelected(chip);
    onAnswer(chip === question.correctChip);
  };

  const isCorrect = selected === question.correctChip;

  return (
    <View style={styles.container}>
      {/* Sentence with blank */}
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>{question.promptBefore} </Text>
        <View
          style={[
            styles.blank,
            selected !== null && (isCorrect ? styles.blankCorrect : styles.blankWrong),
          ]}
        >
          {selected ? (
            <Text
              style={[
                styles.blankText,
                isCorrect ? styles.blankTextCorrect : styles.blankTextWrong,
              ]}
            >
              {selected}
            </Text>
          ) : (
            <Text style={styles.blankPlaceholder}>________</Text>
          )}
        </View>
        <Text style={styles.sentenceText}> {question.promptAfter}</Text>
      </View>

      {/* Word chips */}
      <View style={styles.chips}>
        {question.chips.map((chip) => {
          const isCorrectChip = selected !== null && chip === question.correctChip;
          const isWrongChip = selected !== null && chip === selected && chip !== question.correctChip;
          const isDimmed = selected !== null && !isCorrectChip && !isWrongChip;

          return (
            <View key={chip} style={isDimmed ? styles.chipDimmed : undefined}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  isCorrectChip && styles.chipCorrect,
                  isWrongChip && styles.chipWrong,
                ]}
                onPress={() => handleSelect(chip)}
                activeOpacity={0.75}
                disabled={selected !== null || disabled}
              >
                <Text
                  style={[
                    styles.chipText,
                    isCorrectChip && { color: Colors.correct },
                    isWrongChip && { color: Colors.wrong },
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    gap: 4,
  },
  sentenceText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  blank: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.cardBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  blankCorrect: {
    borderBottomColor: Colors.correct,
    backgroundColor: Colors.correctLight,
    borderRadius: Radius.sm,
  },
  blankWrong: {
    borderBottomColor: Colors.wrong,
    backgroundColor: Colors.wrongLight,
    borderRadius: Radius.sm,
  },
  blankText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  blankTextCorrect: {
    color: Colors.correct,
  },
  blankTextWrong: {
    color: Colors.wrong,
  },
  blankPlaceholder: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    ...Shadow.card,
  },
  chipCorrect: {
    borderColor: Colors.correct,
    backgroundColor: Colors.correctLight,
  },
  chipWrong: {
    borderColor: Colors.wrong,
    backgroundColor: Colors.wrongLight,
  },
  chipText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipDimmed: {
    opacity: 0.4,
  },
});
