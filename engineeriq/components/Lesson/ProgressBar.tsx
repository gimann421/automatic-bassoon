import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius } from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  accentColor?: string;
}

export default function ProgressBar({
  current,
  total,
  accentColor = Colors.unit1,
}: ProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: accentColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
