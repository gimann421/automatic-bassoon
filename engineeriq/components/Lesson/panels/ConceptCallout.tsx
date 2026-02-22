import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';
import { ContentPanel } from '../../../data/curriculum';

interface ConceptCalloutProps {
  panel: ContentPanel;
  accentColor: string;
}

export default function ConceptCallout({ panel, accentColor }: ConceptCalloutProps) {
  return (
    <View style={[styles.container, { borderLeftColor: accentColor }]}>
      <View style={[styles.labelRow]}>
        <View style={[styles.labelDot, { backgroundColor: accentColor }]} />
        <Text style={[styles.label, { color: accentColor }]}>KEY CONCEPT</Text>
      </View>
      <Text style={styles.body}>{panel.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderLeftWidth: 4,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  body: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
});
