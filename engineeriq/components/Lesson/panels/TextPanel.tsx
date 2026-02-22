import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';
import { ContentPanel } from '../../../data/curriculum';

interface TextPanelProps {
  panel: ContentPanel;
  accentColor: string;
}

export default function TextPanel({ panel, accentColor }: TextPanelProps) {
  return (
    <View style={styles.container}>
      {panel.headline && (
        <Text style={[styles.headline, { color: accentColor }]}>{panel.headline}</Text>
      )}
      <Text style={styles.body}>{panel.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  headline: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
});
