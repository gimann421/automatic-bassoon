import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import useAppStore from '../../store/useAppStore';
import { Lesson } from '../../data/curriculum';
import SkillTreeComponent from '../../components/SkillTree/SkillTree';
import LessonDetailSheet from '../../components/LessonDetailSheet';
import XPBadge from '../../components/common/XPBadge';
import StreakBadge from '../../components/common/StreakBadge';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { xp, streak, lessonProgress, getDueReviews, loadFromStorage, checkAndUpdateStreak } =
    useAppStore();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string>(Colors.unit1);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    loadFromStorage().then(() => {
      checkAndUpdateStreak();
    });
  }, []);

  const dueReviews = getDueReviews();

  const handleLessonPress = useCallback((lesson: Lesson, accentColor: string) => {
    setSelectedLesson(lesson);
    setSelectedAccent(accentColor);
    setSheetVisible(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const handleStartLesson = useCallback((lessonId: string) => {
    setSheetVisible(false);
    setTimeout(() => {
      router.push(`/lesson/${lessonId}`);
    }, 300);
  }, [router]);

  const handleReviewPress = () => {
    // Navigate to first due review
    if (dueReviews.length > 0) {
      router.push(`/lesson/${dueReviews[0]}?review=true`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>⚡</Text>
          <Text style={styles.logoText}>EngineerIQ</Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge streak={streak} />
          <XPBadge xp={xp} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Review banner */}
        {dueReviews.length > 0 && (
          <TouchableOpacity
            style={styles.reviewBanner}
            onPress={handleReviewPress}
            activeOpacity={0.85}
          >
            <Text style={styles.reviewIcon}>🔁</Text>
            <View style={styles.reviewTextContainer}>
              <Text style={styles.reviewTitle}>Review Due</Text>
              <Text style={styles.reviewSubtitle}>
                {dueReviews.length} lesson{dueReviews.length !== 1 ? 's' : ''} to revisit
              </Text>
            </View>
            <Text style={styles.reviewChevron}>›</Text>
          </TouchableOpacity>
        )}

        {/* Skill Tree */}
        <SkillTreeComponent
          lessonProgress={lessonProgress}
          dueReviews={dueReviews}
          onLessonPress={handleLessonPress}
        />
      </ScrollView>

      {/* Lesson Detail Sheet */}
      <LessonDetailSheet
        lesson={selectedLesson}
        status={selectedLesson ? (lessonProgress[selectedLesson.id] ?? 'locked') : 'locked'}
        accentColor={selectedAccent}
        visible={sheetVisible}
        onClose={handleCloseSheet}
        onStart={handleStartLesson}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    fontSize: FontSize.xl,
  },
  logoText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.reviewBannerBg,
    borderWidth: 1,
    borderColor: Colors.reviewBanner,
    borderRadius: Radius.lg,
    margin: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  reviewIcon: {
    fontSize: FontSize.xl,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.reviewBanner,
  },
  reviewSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  reviewChevron: {
    fontSize: FontSize.xl,
    color: Colors.reviewBanner,
    fontWeight: '700',
  },
});
