import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface UnitBannerProps {
  title: string;
  unitNumber: number;
  accentColor: string;
  locked?: boolean;
}

export default function UnitBanner({
  title,
  unitNumber,
  accentColor,
  locked = false,
}: UnitBannerProps) {
  const color = locked ? Colors.nodeLocked : accentColor;

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>Unit {unitNumber}</Text>
      </View>
      <Text style={[styles.title, locked && styles.titleLocked]}>{title}</Text>
      {locked && <Text style={styles.lockIcon}>🔒</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
  },
  badge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  titleLocked: {
    color: Colors.textMuted,
  },
  lockIcon: {
    fontSize: FontSize.base,
  },
});
