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
import { getLessonById, getUnitById } from '../../data/curriculum';
import useAppStore from '../../store/useAppStore';
import ProgressBar from '../../components/Lesson/ProgressBar';
import HeartsDisplay from '../../components/Lesson/HeartsDisplay';
import MultipleChoice from '../../components/Lesson/MultipleChoice';
import TrueFalse from '../../components/Lesson/TrueFalse';
import FillInBlank from '../../components/Lesson/FillInBlank';
import FeedbackBanner from '../../components/Lesson/FeedbackBanner';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function LessonScreen() {
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const router = useRouter();
  const { hearts, loseHeart, resetHearts, completeLesson } = useAppStore();

  const lesson = getLessonById(id);
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;
  const accentColor = unit?.accentColor ?? Colors.unit1;

  // For review mode, use only first 3 questions
  const isReview = review === 'true';
  const questions = isReview ? (lesson?.questions.slice(0, 3) ?? []) : (lesson?.questions ?? []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [answerKey, setAnswerKey] = useState(0); // force re-mount question components
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
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        loseHeart();
        setWrongCount((c) => c + 1);

        // Check if out of hearts
        const newHearts = hearts - 1;
        if (newHearts <= 0) {
          // Will be handled in handleContinue after banner shows
        }
      }
    },
    [hearts, loseHeart]
  );

  const handleContinue = useCallback(() => {
    setFeedbackVisible(false);

    const currentHearts = useAppStore.getState().hearts;

    // Out of hearts — restart lesson
    if (!lastCorrect && currentHearts <= 0) {
      Alert.alert(
        '💔 Out of Hearts',
        "You've run out of hearts. Let's try again!",
        [
          {
            text: 'Restart',
            onPress: () => {
              resetHearts();
              setCurrentIndex(0);
              setWrongCount(0);
              setAnswerKey((k) => k + 1);
              startTime.current = Date.now();
            },
          },
          {
            text: 'Exit',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      // Lesson complete
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const perfect = wrongCount === 0;
      const xpEarned = perfect ? 30 : 20;

      if (!isReview) {
        completeLesson(lesson.id, perfect);
      } else {
        resetHearts();
      }

      router.replace({
        pathname: '/lesson-complete',
        params: {
          lessonId: lesson.id,
          xpEarned: String(xpEarned),
          perfect: String(perfect),
          totalQuestions: String(totalQuestions),
          wrongCount: String(wrongCount),
          elapsed: String(elapsed),
        },
      });
    } else {
      setCurrentIndex(nextIndex);
      setAnswerKey((k) => k + 1);
    }
  }, [
    currentIndex,
    totalQuestions,
    lastCorrect,
    wrongCount,
    lesson,
    isReview,
    completeLesson,
    resetHearts,
    router,
  ]);

  const handleExit = () => {
    Alert.alert('Exit Lesson?', 'Your progress on this lesson will not be saved.', [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          resetHearts();
          router.back();
        },
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

        <HeartsDisplay hearts={useAppStore.getState().hearts} />
      </View>

      {/* Question label */}
      <View style={styles.questionMeta}>
        <Text style={styles.questionCounter}>
          {isReview ? '🔁 Review · ' : ''}
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
      </View>

      {/* Feedback banner */}
      <FeedbackBanner
        visible={feedbackVisible}
        correct={lastCorrect}
        feedback={currentQuestion.feedback}
        onContinue={handleContinue}
        continueLabel={
          currentIndex + 1 >= totalQuestions ? 'Finish' : 'Continue'
        }
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
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
});
