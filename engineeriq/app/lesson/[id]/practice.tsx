import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getLessonById, getUnitById } from '../../../data/curriculum';
import useAppStore from '../../../store/useAppStore';
import ProgressBar from '../../../components/Lesson/ProgressBar';
import MultipleChoice from '../../../components/Lesson/MultipleChoice';
import TrueFalse from '../../../components/Lesson/TrueFalse';
import FillInBlank from '../../../components/Lesson/FillInBlank';
import FeedbackBanner from '../../../components/Lesson/FeedbackBanner';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';

export default function PracticeScreen() {
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const router = useRouter();
  const { completePractice } = useAppStore();

  const lesson = getLessonById(id);
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;
  const accentColor = unit?.accentColor ?? Colors.unit1;

  const isReview = review === 'true';
  const allProblems = lesson?.practiceProblems ?? [];
  const questions = isReview ? allProblems.slice(0, 3) : allProblems;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [wrongCountForQuestion, setWrongCountForQuestion] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [showSeeAnswer, setShowSeeAnswer] = useState(false);
  const [answerKey, setAnswerKey] = useState(0);
  const startTime = useRef(Date.now());

  if (!lesson || !unit) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = useCallback(
    async (correct: boolean) => {
      setLastCorrect(correct);
      setFeedbackVisible(true);

      if (correct) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setWrongCountForQuestion(0);
        setShowSeeAnswer(false);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        const newWrong = wrongCountForQuestion + 1;
        setWrongCountForQuestion(newWrong);
        setTotalWrong((c) => c + 1);
        // Show "See Answer" after 2 wrong attempts
        if (newWrong >= 2) {
          setShowSeeAnswer(true);
        }
      }
    },
    [wrongCountForQuestion]
  );

  const handleSeeAnswer = useCallback(() => {
    setLastCorrect(true); // treat as correct to move forward
    setFeedbackVisible(true);
    setShowSeeAnswer(false);
  }, []);

  const handleContinue = useCallback(() => {
    setFeedbackVisible(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      // Practice complete
      if (!isReview) {
        completePractice(lesson.id);
      }
      router.replace({
        pathname: `/lesson/${lesson.id}/practice-complete`,
        params: {
          lessonId: lesson.id,
          isReview: String(isReview),
          totalQuestions: String(totalQuestions),
          wrongCount: String(totalWrong),
        },
      });
    } else {
      setCurrentIndex(nextIndex);
      setAnswerKey((k) => k + 1);
      setWrongCountForQuestion(0);
      setShowSeeAnswer(false);
    }
  }, [currentIndex, totalQuestions, lastCorrect, totalWrong, lesson, isReview, completePractice, router]);

  const handleExit = () => {
    Alert.alert('Exit Practice?', 'Your progress on this practice will not be saved.', [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <ProgressBar
            current={currentIndex}
            total={totalQuestions}
            accentColor={accentColor}
          />
        </View>

        {/* No hearts in practice — show practice label instead */}
        <View style={styles.practiceBadge}>
          <Text style={styles.practiceBadgeText}>Practice</Text>
        </View>
      </View>

      {/* Question label */}
      <View style={styles.questionMeta}>
        <Text style={styles.questionCounter}>
          {isReview ? '🔁 Review · ' : '✏️ Practice · '}
          {currentIndex + 1} / {totalQuestions}
        </Text>
        <Text style={styles.lessonTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      {/* Question content */}
      <View style={styles.questionArea} key={answerKey}>
        {currentQuestion.type === 'multiple-choice' && (
          <MultipleChoice
            question={currentQuestion}
            onAnswer={(correct) => handleAnswer(correct)}
            disabled={feedbackVisible}
          />
        )}
        {currentQuestion.type === 'true-false' && (
          <TrueFalse
            question={currentQuestion}
            onAnswer={(correct) => handleAnswer(correct)}
            disabled={feedbackVisible}
          />
        )}
        {currentQuestion.type === 'fill-blank' && (
          <FillInBlank
            question={currentQuestion}
            onAnswer={(correct) => handleAnswer(correct)}
            disabled={feedbackVisible}
          />
        )}

        {/* See Answer button — shown after 2 wrong attempts */}
        {showSeeAnswer && !feedbackVisible && (
          <TouchableOpacity
            style={styles.seeAnswerButton}
            onPress={handleSeeAnswer}
            activeOpacity={0.8}
          >
            <Text style={styles.seeAnswerText}>See Answer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feedback banner */}
      <FeedbackBanner
        visible={feedbackVisible}
        correct={lastCorrect}
        feedback={currentQuestion.feedback}
        onContinue={handleContinue}
        continueLabel={currentIndex + 1 >= totalQuestions ? 'Finish' : 'Continue'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIcon: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  progressContainer: {
    flex: 1,
  },
  practiceBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  practiceBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.xpGold,
    fontWeight: '700',
  },
  questionMeta: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 2,
  },
  questionCounter: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  questionArea: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  seeAnswerButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.textMuted,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  seeAnswerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
});
