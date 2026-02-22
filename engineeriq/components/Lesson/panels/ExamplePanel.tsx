import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';
import { ContentPanel } from '../../../data/curriculum';

interface ExamplePanelProps {
  panel: ContentPanel;
  accentColor: string;
}

export default function ExamplePanel({ panel, accentColor }: ExamplePanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bulbIcon}>💡</Text>
        <Text style={[styles.label, { color: accentColor }]}>REAL-WORLD ANALOGY</Text>
      </View>
      <Text style={styles.body}>"{panel.body}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bulbIcon: {
    fontSize: FontSize.md,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  body: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },
});
