import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import useAppStore from '../../store/useAppStore';
import { FAKE_USERS, LeaderboardUser } from '../../data/curriculum';
import { Colors, FontSize, Spacing, Radius, Shadow } from '../../constants/theme';

const MEDAL_COLORS = ['#F59E0B', '#94A3B8', '#CD7C2F'];
const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

function AvatarCircle({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '33', borderColor: color },
      ]}
    >
      <Text style={[styles.avatarText, { color, fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const AVATAR_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

export default function LeaderboardScreen() {
  const { weeklyXP } = useAppStore();

  const allUsers: LeaderboardUser[] = useMemo(() => {
    const me: LeaderboardUser = {
      id: 'me',
      name: 'You',
      initials: 'ME',
      weeklyXP,
      isCurrentUser: true,
    };

    const combined = [...FAKE_USERS.map((u) => ({ ...u, isCurrentUser: false })), me];
    return combined.sort((a, b) => b.weeklyXP - a.weeklyXP);
  }, [weeklyXP]);

  const myRank = allUsers.findIndex((u) => u.isCurrentUser) + 1;

  // Reset day: next Sunday
  const nextSunday = (() => {
    const d = new Date();
    const daysUntilSunday = (7 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + daysUntilSunday);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Weekly XP · Resets {nextSunday}</Text>
      </View>

      {/* My rank summary */}
      <View style={styles.myRankCard}>
        <View>
          <Text style={styles.myRankLabel}>Your rank</Text>
          <Text style={styles.myRankValue}>#{myRank} of {allUsers.length}</Text>
        </View>
        <View style={styles.myXPContainer}>
          <Text style={styles.myXPLabel}>This week</Text>
          <Text style={styles.myXPValue}>⭐ {weeklyXP} XP</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {allUsers.map((user, index) => {
          const rank = index + 1;
          const isMe = user.isCurrentUser;
          const avatarColor = isMe ? Colors.unit1 : AVATAR_COLORS[index % AVATAR_COLORS.length];
          const hasMedal = rank <= 3;

          return (
            <View
              key={user.id}
              style={[
                styles.row,
                isMe && styles.rowHighlighted,
              ]}
            >
              {/* Rank */}
              <View style={styles.rankContainer}>
                {hasMedal ? (
                  <Text style={styles.medalIcon}>{MEDAL_ICONS[rank - 1]}</Text>
                ) : (
                  <Text style={[styles.rankText, isMe && styles.rankTextHighlighted]}>
                    {rank}
                  </Text>
                )}
              </View>

              {/* Avatar */}
              <AvatarCircle
                initials={user.initials}
                color={avatarColor}
                size={40}
              />

              {/* Name */}
              <Text style={[styles.name, isMe && styles.nameHighlighted]} numberOfLines={1}>
                {user.name}
              </Text>

              {/* XP */}
              <View style={[styles.xpBadge, hasMedal && { backgroundColor: MEDAL_COLORS[rank - 1] + '22' }]}>
                <Text style={[styles.xpText, hasMedal && { color: MEDAL_COLORS[rank - 1] }]}>
                  ⭐ {user.weeklyXP}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  myRankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: Spacing.lg,
    backgroundColor: Colors.leaderboardHighlight,
    borderWidth: 1,
    borderColor: Colors.leaderboardHighlightBorder,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  myRankLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  myRankValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.unit1,
  },
  myXPContainer: {
    alignItems: 'flex-end',
  },
  myXPLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  myXPValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.xpGold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  rowHighlighted: {
    backgroundColor: Colors.leaderboardHighlight,
    borderColor: Colors.leaderboardHighlightBorder,
    ...Shadow.card,
  },
  rankContainer: {
    width: 28,
    alignItems: 'center',
  },
  rankText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  rankTextHighlighted: {
    color: Colors.unit1,
  },
  medalIcon: {
    fontSize: FontSize.lg,
  },
  avatar: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '800',
  },
  name: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nameHighlighted: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  xpBadge: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  xpText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.xpGold,
  },
});
