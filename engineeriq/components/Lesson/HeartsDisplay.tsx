import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontSize, Spacing } from '../../constants/theme';

interface HeartsDisplayProps {
  hearts: number;
  max?: number;
}

export default function HeartsDisplay({ hearts, max = 3 }: HeartsDisplayProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[styles.heart, i >= hearts && styles.empty]}>
          {i < hearts ? '❤️' : '🖤'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  heart: {
    fontSize: FontSize.md,
  },
  empty: {
    opacity: 0.35,
  },
});
