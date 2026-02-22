import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const fontSize = size === 'sm' ? FontSize.sm : size === 'lg' ? FontSize.lg : FontSize.base;

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize }]}>🔥</Text>
      <Text style={[styles.text, { fontSize }]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249,115,22,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  icon: {
    lineHeight: undefined,
  },
  text: {
    color: Colors.streakOrange,
    fontWeight: '700',
  },
});
