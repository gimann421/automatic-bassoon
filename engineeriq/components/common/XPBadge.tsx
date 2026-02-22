import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function XPBadge({ xp, size = 'md' }: XPBadgeProps) {
  const fontSize = size === 'sm' ? FontSize.sm : size === 'lg' ? FontSize.lg : FontSize.base;
  const iconSize = size === 'sm' ? FontSize.sm : size === 'lg' ? FontSize.lg : FontSize.base;

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize: iconSize }]}>⭐</Text>
      <Text style={[styles.text, { fontSize }]}>{xp.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  icon: {
    lineHeight: undefined,
  },
  text: {
    color: Colors.xpGold,
    fontWeight: '700',
  },
});
