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
import { getUnitById } from '../../data/curriculum';
import useAppStore from '../../store/useAppStore';
import ProgressBar from '../../components/Lesson/ProgressBar';
import HeartsDisplay from '../../components/Lesson/HeartsDisplay';
import MultipleChoice from '../../components/Lesson/MultipleChoice';
import TrueFalse from '../../components/Lesson/TrueFalse';
import FeedbackBanner from '../../components/Lesson/FeedbackBanner';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const QUIZ_GOLD = '#F59E0B';

export default function UnitQuizScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const router = useRouter();
  const { hearts, loseHeart, resetHearts, completeUnitQuiz, canRetakeQuizToday, unitQuizProgress } =
    useAppStore();

  const unit = getUnitById(unitId);
  const accentColor = QUIZ_GOLD;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerKey, setAnswerKey] = useState(0);

  if (!unit) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Quiz not found</Text>
      </SafeAreaView>
    );
  }

  const quizProgress = unitQuizProgress[unitId];
  const alreadyPassed = quizProgress?.passed === true;
  const canRetake = canRetakeQuizToday(unitId);

  // If already passed and can't retake today, show a locked message
  if (alreadyPassed && !canRetake) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.lockedContent}>
          <Text style={styles.lockedEmoji}>🏆</Text>
          <Text style={styles.lockedTitle}>Already Completed!</Text>
          <Text style={styles.lockedBody}>
            You've already passed this unit quiz today. Come back tomorrow to earn more XP.
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: accentColor }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.ctaText}>Back to Path</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const questions = unit.quiz.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    async (correct: boolean) => {
      setLastCorrect(correct);
      setFeedbackVisible(true);

      if (correct) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCorrectCount((c) => c + 1);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        loseHeart();
        setWrongCount((c) => c + 1);
      }
    },
    [loseHeart]
  );

  const handleContinue = useCallback(() => {
    setFeedbackVisible(false);

    const currentHearts = useAppStore.getState().hearts;

    // Out of hearts — quiz failed
    if (!lastCorrect && currentHearts <= 0) {
      Alert.alert(
        '💔 Quiz Failed',
        "You've run out of hearts. Keep practicing and try again!",
        [
          {
            text: 'Try Again',
            onPress: () => {
              resetHearts();
              setCurrentIndex(0);
              setCorrectCount(0);
              setWrongCount(0);
              setAnswerKey((k) => k + 1);
            },
          },
          {
            text: 'Exit',
            onPress: () => {
              resetHearts();
              router.replace('/(tabs)');
            },
            style: 'cancel',
          },
        ]
      );
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      // Quiz complete
      const finalCorrect = correctCount + (lastCorrect ? 1 : 0);
      completeUnitQuiz(unitId, finalCorrect, totalQuestions);

      const passed = finalCorrect / totalQuestions >= 0.5;
      if (passed) {
        router.replace({
          pathname: '/quiz/quiz-complete',
          params: {
            unitId,
            score: String(finalCorrect),
            outOf: String(totalQuestions),
          },
        });
      } else {
        Alert.alert(
          'Quiz Failed',
          `You scored ${finalCorrect}/${totalQuestions}. You need at least ${Math.ceil(totalQuestions * 0.5)} correct to pass.`,
          [
            {
              text: 'Try Again',
              onPress: () => {
                resetHearts();
                setCurrentIndex(0);
                setCorrectCount(0);
                setWrongCount(0);
                setAnswerKey((k) => k + 1);
              },
            },
            {
              text: 'Exit',
              onPress: () => {
                resetHearts();
                router.replace('/(tabs)');
              },
              style: 'cancel',
            },
          ]
        );
      }
    } else {
      setCurrentIndex(nextIndex);
      setAnswerKey((k) => k + 1);
    }
  }, [
    currentIndex,
    totalQuestions,
    lastCorrect,
    correctCount,
    unitId,
    completeUnitQuiz,
    resetHearts,
    router,
  ]);

  const handleExit = () => {
    Alert.alert('Exit Quiz?', 'Your quiz progress will not be saved.', [
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

      {/* Quiz label */}
      <View style={styles.questionMeta}>
        <View style={styles.quizBadgeRow}>
          <Text style={styles.quizBadgeEmoji}>🏆</Text>
          <Text style={styles.quizBadgeText}>Unit Quiz</Text>
        </View>
        <Text style={styles.unitTitle} numberOfLines={1}>
          {unit.title}
        </Text>
        <Text style={styles.questionCounter}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>
      </View>

      {/* Question content — quiz only uses MC and T/F */}
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
  questionMeta: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  quizBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quizBadgeEmoji: {
    fontSize: FontSize.sm,
  },
  quizBadgeText: {
    fontSize: FontSize.sm,
    color: QUIZ_GOLD,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  unitTitle: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  questionCounter: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  questionArea: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  lockedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  lockedEmoji: {
    fontSize: 64,
  },
  lockedTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  lockedBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaButton: {
    width: '100%',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  ctaText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
});
