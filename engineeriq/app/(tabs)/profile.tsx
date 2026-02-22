import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import useAppStore from '../../store/useAppStore';
import { ALL_LESSONS, UNITS } from '../../data/curriculum';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../../constants/theme';

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color + '44' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { xp, streak, lessonProgress, lessonLastCompleted, streakFreezeAvailable, weeklyXP } =
    useAppStore();

  const stats = useMemo(() => {
    const totalLessons = ALL_LESSONS.length;
    const completedLessons = ALL_LESSONS.filter(
      (l) => lessonProgress[l.id] === 'completed'
    ).length;
    const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const totalUnits = UNITS.length;
    const completedUnits = UNITS.filter((u) =>
      u.lessons.every((l) => lessonProgress[l.id] === 'completed')
    ).length;

    return { totalLessons, completedLessons, progressPct, totalUnits, completedUnits };
  }, [lessonProgress]);

  const unitProgress = useMemo(() => {
    return UNITS.map((unit) => {
      const total = unit.lessons.length;
      const completed = unit.lessons.filter(
        (l) => lessonProgress[l.id] === 'completed'
      ).length;
      const pct = total > 0 ? completed / total : 0;
      return { unit, total, completed, pct };
    });
  }, [lessonProgress]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PM</Text>
          </View>
          <Text style={styles.username}>You</Text>
          <Text style={styles.tagline}>Aspiring Technical PM</Text>
        </View>

        {/* Overall progress bar */}
        <View style={styles.overallCard}>
          <View style={styles.overallHeader}>
            <Text style={styles.overallTitle}>Overall Progress</Text>
            <Text style={styles.overallPct}>{stats.progressPct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${stats.progressPct}%` },
              ]}
            />
          </View>
          <Text style={styles.overallSub}>
            {stats.completedLessons} of {stats.totalLessons} lessons complete ·{' '}
            {stats.completedUnits} of {stats.totalUnits} units
          </Text>
        </View>

        {/* Stat cards */}
        <View style={styles.statsGrid}>
          <StatCard icon="⭐" value={xp.toLocaleString()} label="Total XP" color={Colors.xpGold} />
          <StatCard icon="🔥" value={streak} label="Day Streak" color={Colors.streakOrange} />
          <StatCard icon="📚" value={stats.completedLessons} label="Lessons Done" color={Colors.unit1} />
          <StatCard icon="🏆" value={weeklyXP} label="This Week XP" color={Colors.unit2} />
        </View>

        {/* Streak freeze */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak Protection</Text>
          <View style={[styles.freezeCard, !streakFreezeAvailable && styles.freezeCardUsed]}>
            <Text style={styles.freezeIcon}>🧊</Text>
            <View style={styles.freezeText}>
              <Text style={styles.freezeTitle}>
                {streakFreezeAvailable ? 'Streak Freeze Available' : 'Streak Freeze Used'}
              </Text>
              <Text style={styles.freezeSubtitle}>
                {streakFreezeAvailable
                  ? 'Protects your streak if you miss a day. Resets each week.'
                  : 'Used this week. Resets next Sunday.'}
              </Text>
            </View>
            <View
              style={[
                styles.freezeBadge,
                { backgroundColor: streakFreezeAvailable ? Colors.unit2 : Colors.nodeLocked },
              ]}
            >
              <Text style={styles.freezeBadgeText}>
                {streakFreezeAvailable ? '1x' : '0x'}
              </Text>
            </View>
          </View>
        </View>

        {/* Unit progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Progress</Text>
          {unitProgress.map(({ unit, total, completed, pct }) => (
            <View key={unit.id} style={styles.unitProgressCard}>
              <View style={styles.unitProgressHeader}>
                <View style={[styles.unitDot, { backgroundColor: unit.accentColor }]} />
                <Text style={styles.unitProgressTitle}>{unit.title}</Text>
                <Text style={[styles.unitProgressCount, { color: unit.accentColor }]}>
                  {completed}/{total}
                </Text>
              </View>
              <View style={styles.unitTrack}>
                <View
                  style={[
                    styles.unitFill,
                    { width: `${pct * 100}%`, backgroundColor: unit.accentColor },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.unit1 + '33',
    borderWidth: 3,
    borderColor: Colors.unit1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.unit1,
  },
  username: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  overallCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  overallPct: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.unit1,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.unit1,
    borderRadius: Radius.full,
  },
  overallSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    gap: 4,
  },
  statIcon: {
    fontSize: FontSize.xl,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  freezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.unit2 + '44',
  },
  freezeCardUsed: {
    borderColor: Colors.cardBorder,
    opacity: 0.7,
  },
  freezeIcon: {
    fontSize: FontSize.xxl,
  },
  freezeText: {
    flex: 1,
    gap: 2,
  },
  freezeTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  freezeSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  freezeBadge: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  freezeBadgeText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.base,
  },
  unitProgressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  unitProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  unitDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  unitProgressTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitProgressCount: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  unitTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  unitFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
