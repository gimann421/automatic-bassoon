# EngineerIQ — Product Requirements Document

**Version:** 1.0
**Date:** March 8, 2026
**Status:** Draft
**Platform:** React Native (iOS & Android via Expo)

---

## 1. Overview

### 1.1 Product Summary

EngineerIQ is a mobile learning application that teaches Product Managers (PMs) technical engineering concepts through a gamified, bite-sized lesson format modeled after Duolingo. The goal is to make PMs more effective partners to engineering teams by giving them fluency in the language, processes, and mental models engineers use daily.

### 1.2 Problem Statement

Product Managers frequently struggle to communicate effectively with engineering teams because they lack foundational technical literacy. This leads to:

- Poorly scoped tickets and requirements
- Unrealistic timelines and effort estimates
- Friction in sprint planning, standups, and design reviews
- Reduced credibility and trust with engineering counterparts
- Missed tradeoff decisions due to not understanding technical constraints

There is no existing product that combines structured technical PM education with the proven retention mechanics of gamified daily learning.

### 1.3 Target Users

| Persona | Description |
|---|---|
| **Aspiring Technical PM** | Associate / junior PM with limited technical background, actively trying to level up |
| **Mid-Level PM** | Experienced PM moving into more technically complex products (infra, platform, AI) |
| **Career Switcher** | Someone transitioning into PM from a non-technical background |
| **PM Manager** | Director / VP who wants their team upskilled; potential team license buyer |

### 1.4 Design Principles

1. **Bite-sized over comprehensive** — Lessons take 3–5 minutes. Daily habits beat one-time deep dives.
2. **PM-first framing** — Content is always framed around how it's relevant to a PM's job, not engineering theory.
3. **Gamification as motivation, not gimmick** — XP, streaks, and leaderboards create real habit loops.
4. **Immediate feedback** — Every answer surfaces feedback that teaches, not just whether you're right or wrong.
5. **Progressive disclosure** — Lessons unlock sequentially; you earn access to harder content.

---

## 2. Core Requirements

These are the non-negotiable features that define the MVP. The product does not ship without these.

### 2.1 Curriculum Engine

**REQ-C01** The app shall organize content into **Units** (thematic groups) and **Lessons** (individual learning sessions).

**REQ-C02** Each lesson shall contain 5 questions by default. Review sessions shall contain 3 questions.

**REQ-C03** The app shall support three question types:
- **Multiple Choice** — 4 options, one correct answer
- **True / False** — binary correct/incorrect
- **Fill in the Blank** — word-chip selection to complete a sentence

**REQ-C04** Each question shall have a `feedback` field that is shown after every answer (correct or incorrect) to reinforce the concept.

**REQ-C05** Lessons shall unlock sequentially: the first lesson of a unit unlocks when the previous unit is fully complete; subsequent lessons within a unit unlock when the preceding lesson is complete.

### 2.2 Lesson Session

**REQ-L01** Each lesson session shall begin with 3 hearts. Hearts represent allowed wrong answers.

**REQ-L02** An incorrect answer shall deduct one heart and trigger haptic error feedback.

**REQ-L03** A correct answer shall trigger haptic success feedback.

**REQ-L04** After every answer (correct or incorrect), a **feedback banner** shall appear with the contextual explanation and a "Continue" button.

**REQ-L05** When hearts reach zero, the user shall be prompted to restart the lesson or exit. Progress within the session is not saved on restart.

**REQ-L06** A progress bar shall be visible at all times during a lesson, showing advancement through questions.

**REQ-L07** The user can exit a lesson at any time via an exit button with a confirmation dialog. Exiting does not save progress.

**REQ-L08** When all questions are answered, the session is complete and the app navigates to the Lesson Complete screen.

### 2.3 XP & Scoring

**REQ-X01** Completing a lesson earns **20 XP**.

**REQ-X02** Completing a lesson with zero wrong answers (perfect score) earns **30 XP** (+10 bonus).

**REQ-X03** XP accumulates permanently as a total lifetime score.

**REQ-X04** Weekly XP resets every Sunday and is used exclusively for leaderboard ranking.

**REQ-X05** XP is awarded on lesson completion, not on individual correct answers.

### 2.4 Streak System

**REQ-S01** A streak increments by 1 each calendar day the user completes at least one lesson.

**REQ-S02** If the user misses exactly one day and has a streak freeze available, the streak is preserved and the freeze is consumed.

**REQ-S03** Missing two or more consecutive days resets the streak to 1 on the next active day.

**REQ-S04** One **Streak Freeze** is granted per week (resets each Sunday). Only one freeze can be held at a time.

**REQ-S05** Streak freeze usage is tracked per week; a new freeze becomes available each Sunday.

### 2.5 Review System

**REQ-R01** Completed lessons become eligible for review 3 days after they were last completed.

**REQ-R02** When reviews are due, a banner shall appear on the Home screen indicating the number of lessons due.

**REQ-R03** Review sessions present 3 questions from the original lesson.

**REQ-R04** Completing a review does not re-award XP or update lesson completion date (prevents gaming).

### 2.6 Leaderboard

**REQ-LB01** The Leaderboard screen shall display all users ranked by weekly XP, descending.

**REQ-LB02** The current user's row shall be visually highlighted and always visible.

**REQ-LB03** The top 3 users shall display gold, silver, and bronze medal icons in place of numeric rank.

**REQ-LB04** The leaderboard shall show the reset date (next Sunday).

**REQ-LB05** The user's rank and weekly XP shall be displayed in a summary card above the list.

### 2.7 Profile

**REQ-P01** The Profile screen shall display: total XP, current streak, lessons completed, this-week XP.

**REQ-P02** The Profile screen shall show an overall progress bar (% of all lessons completed).

**REQ-P03** Per-unit progress shall be shown with individual progress bars and a completed/total lesson count.

**REQ-P04** Streak Freeze availability shall be surfaced on the Profile screen.

### 2.8 State Persistence

**REQ-ST01** All user state (XP, streak, lesson progress, weekly XP, streak freeze) shall be persisted locally using AsyncStorage.

**REQ-ST02** State shall be loaded on app launch and saved after every lesson completion or streak update.

**REQ-ST03** Weekly resets (XP, streak freeze) shall be computed correctly even if the app was not opened during the reset window.

---

## 3. Comprehensive Requirements

These requirements define the full, polished product experience beyond MVP.

### 3.1 Skill Tree Navigation

**REQ-SK01** The Home screen shall render a scrollable Skill Tree displaying all units and their lessons.

**REQ-SK02** Lessons shall be displayed as nodes in an alternating left-center-right path pattern to create a visual journey feel.

**REQ-SK03** Unit banners shall visually separate units and display unit number, title, and accent color.

**REQ-SK04** Locked units shall be visually dimmed.

**REQ-SK05** Completed lesson nodes shall display a checkmark and be fully colored. Available nodes shall glow. Locked nodes shall be desaturated.

**REQ-SK06** Tapping a completed or available lesson node shall open a **Lesson Detail Sheet** (bottom sheet) with lesson title, description, XP reward, estimated duration, and a start button.

**REQ-SK07** Tapping a locked lesson node shall show an alert explaining it must be unlocked by completing prior lessons.

**REQ-SK08** Lessons that are due for review shall display a visual indicator (e.g., review badge) on the node.

### 3.2 Lesson Detail Sheet

**REQ-LD01** The Lesson Detail Sheet shall display: lesson title, unit name, description, XP reward, estimated minutes.

**REQ-LD02** If the lesson is completed, the sheet shall show a completion badge and still allow re-attempt.

**REQ-LD03** A "Start" or "Start Review" button shall dismiss the sheet and navigate to the lesson.

**REQ-LD04** The sheet shall close when tapping the backdrop or pressing a close button.

### 3.3 Lesson Complete Screen

**REQ-LC01** The Lesson Complete screen shall display: XP earned, star rating (1–3 stars), accuracy %, correct/total count, time elapsed.

**REQ-LC02** Perfect score (0 wrong answers) shall award 3 stars and surface a "Perfect Score!" label.

**REQ-LC03** Accuracy >= 60% shall award 2 stars; below 60% awards 1 star.

**REQ-LC04** Stars shall animate in sequentially using spring animations.

**REQ-LC05** The XP badge shall animate from 0 to earned value over ~1 second.

**REQ-LC06** A "Continue" button shall return the user to the Home/Skill Tree screen.

**REQ-LC07** The accent color of the completed lesson's unit shall theme the entire Lesson Complete screen.

### 3.4 Content Quality

**REQ-CQ01** All lesson questions shall be written from a PM perspective — framing technical concepts in terms of why they matter to product work.

**REQ-CQ02** Feedback text shall be educational, not just confirmatory. Wrong-answer feedback shall explain the correct concept, not just mark the answer wrong.

**REQ-CQ03** Curriculum shall be organized with at minimum 2 units containing 3 lessons each for MVP, with a clear roadmap to expand to 8+ units.

**REQ-CQ04** Each lesson shall have an estimated time label based on actual question count (default: ~3–4 min for 5 questions).

### 3.5 Accessibility & UX Polish

**REQ-UX01** The app shall use a consistent dark theme throughout.

**REQ-UX02** Text and interactive elements shall meet minimum contrast ratios for readability on dark backgrounds.

**REQ-UX03** All lesson interactions shall provide haptic feedback using device haptic APIs.

**REQ-UX04** Animated transitions shall be used on the Lesson Complete screen to delight users.

**REQ-UX05** The app shall use safe area insets to prevent UI elements from being obscured by device notches or navigation bars.

### 3.6 Navigation Architecture

**REQ-NAV01** The app shall use a bottom tab navigation with three tabs: Home (Skill Tree), Leaderboard, Profile.

**REQ-NAV02** Lesson sessions shall be presented as a modal-style stack route, separate from the tab navigator.

**REQ-NAV03** The Lesson Complete screen shall replace the lesson route in the stack (preventing back navigation into a finished lesson).

**REQ-NAV04** Deep linking into specific lessons via URL parameters shall be supported.

### 3.7 Future / Post-MVP Requirements

These are scoped out of MVP but must be architecturally anticipated:

**REQ-F01** **User Authentication** — Account creation, login, profile customization (name, avatar).

**REQ-F02** **Real Leaderboard** — Replace fake users with real user data from a backend.

**REQ-F03** **Push Notifications** — Daily reminders tied to streak state; "you're about to lose your streak" alerts.

**REQ-F04** **Onboarding Flow** — Welcome screen, role selection, skill level assessment, goal setting.

**REQ-F05** **Expanded Curriculum** — Additional units covering: CI/CD, security basics, system design, data modeling, cloud infrastructure, mobile vs. web, AI/ML for PMs.

**REQ-F06** **Streak Freeze Store** — Earn or purchase additional streak freezes.

**REQ-F07** **Achievements / Badges** — Milestone rewards (first lesson, 7-day streak, unit complete, etc.).

**REQ-F08** **Content Management System** — Admin tooling to add/edit lessons without code deploys.

**REQ-F09** **Offline Mode** — Cache lessons locally for offline play.

**REQ-F10** **Team / Cohort Leaderboards** — Org-level grouping for team-wide learning challenges.

---

## 4. Acceptance Criteria

### 4.1 Lesson Session

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-L01 | Heart deduction on wrong answer | Hearts decrement by 1; haptic error fires |
| AC-L02 | Feedback shown after every answer | Banner appears with feedback text regardless of correct/wrong |
| AC-L03 | Out of hearts triggers restart/exit dialog | Alert fires with exactly 2 options: Restart and Exit |
| AC-L04 | Restart resets to question 1 with 3 hearts | `currentIndex = 0`, `hearts = 3`, `wrongCount = 0` |
| AC-L05 | Progress bar reflects current question | Bar fills proportionally to `currentIndex / totalQuestions` |
| AC-L06 | Lesson completion awards correct XP | 30 XP if `wrongCount === 0`, else 20 XP |
| AC-L07 | Exit dialog appears on X button press | Confirmation dialog with "Keep Going" and "Exit" options |
| AC-L08 | Exiting does not save progress | `lessonProgress` record unchanged; hearts reset |
| AC-L09 | All three question types render correctly | MC, T/F, Fill-blank all functional and selectable |
| AC-L10 | Review mode shows only 3 questions | `questions.slice(0, 3)` applied when `review=true` param present |

### 4.2 XP & Scoring

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-X01 | Total XP increments on lesson complete | `xp` in store increases by earned amount |
| AC-X02 | Weekly XP increments on lesson complete | `weeklyXP` increases by earned amount |
| AC-X03 | Weekly XP resets on new week | `weeklyXP = 0` when `currentSunday !== weeklyXPResetDate` |
| AC-X04 | Perfect bonus applied correctly | Wrong count 0 = 30 XP; any wrong answer = 20 XP |
| AC-X05 | Review completion does not award XP | `completeLesson` not called in review mode |

### 4.3 Streak System

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-S01 | First lesson increments streak to 1 | `streak = 1`, `lastActiveDate = today` |
| AC-S02 | Consecutive day increments streak | `daysBetween === 1` → streak + 1 |
| AC-S03 | Same day does not double-increment | `daysBetween === 0` → no change |
| AC-S04 | One missed day with freeze preserves streak | `diff === 2` && freeze available → streak + 1, freeze consumed |
| AC-S05 | Two+ missed days resets streak | `diff > 2` or no freeze → `streak = 1` |
| AC-S06 | Freeze resets each Sunday | `streakFreezeUsedThisWeek = false` on new week load |

### 4.4 Lesson Unlock & Progress

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-P01 | First lesson of Unit 1 starts as available | `lesson-1-1` status = `available` on fresh install |
| AC-P02 | Subsequent lessons locked until prior complete | `lesson-1-2` locked until `lesson-1-1` completed |
| AC-P03 | Unit 2 lessons locked until Unit 1 complete | All unit-2 lessons locked until all unit-1 lessons completed |
| AC-P04 | Completed lesson shows checkmark | Node renders in completed state after `completeLesson` called |
| AC-P05 | State persists across app restarts | Progress, XP, streak same after close and reopen |

### 4.5 Review System

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-R01 | Lesson appears in due reviews after 3 days | `daysBetween(lastCompleted, today) >= 3` → included in `getDueReviews()` |
| AC-R02 | Review banner appears when reviews due | Banner visible on Home when `dueReviews.length > 0` |
| AC-R03 | Review banner hidden when no reviews | Banner not rendered when `dueReviews.length === 0` |
| AC-R04 | Review badge shows on lesson node | Node displays review indicator when `isDue === true` |

### 4.6 Leaderboard

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-LB01 | Users sorted by weekly XP descending | List order matches `sort((a, b) => b.weeklyXP - a.weeklyXP)` |
| AC-LB02 | Current user row highlighted | "You" row visually distinct with highlight color |
| AC-LB03 | Medal icons shown for top 3 | Ranks 1–3 show 🥇🥈🥉 instead of number |
| AC-LB04 | Current user rank and weekly XP shown in card | Summary card updates when `weeklyXP` changes |
| AC-LB05 | Reset date displays correctly | "Resets [next Sunday date]" shown in subtitle |

### 4.7 Profile

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-PR01 | Total XP displays correct value | Matches `xp` from store |
| AC-PR02 | Streak count displayed | Matches `streak` from store |
| AC-PR03 | Overall progress % computed correctly | `completedLessons / totalLessons * 100` rounded |
| AC-PR04 | Per-unit progress bars fill correctly | Each unit's bar = `completed / total` |
| AC-PR05 | Streak freeze status shown | Shows "Available" or "Used" with correct 1x/0x badge |

### 4.8 Lesson Complete Screen

| ID | Criterion | Pass Condition |
|---|---|---|
| AC-LC01 | 3 stars shown for perfect score | `wrongCount === 0` → all 3 stars at full opacity |
| AC-LC02 | 2 stars for 60%+ accuracy | `accuracy >= 60` → 2 stars lit |
| AC-LC03 | 1 star for <60% accuracy | `accuracy < 60` → 1 star lit |
| AC-LC04 | XP count animates from 0 to earned | `xpCountAnim` runs 0 → xpEarned over 1s |
| AC-LC05 | Stars animate in with spring delay | Each star delayed 150ms apart from 300ms start |
| AC-LC06 | Accuracy % computed correctly | `correctCount / totalQuestions * 100` rounded |
| AC-LC07 | Time displayed in correct format | `>= 60s` → `Xm Xs` format; `< 60s` → `Xs` format |
| AC-LC08 | Continue returns to Home tab | `router.replace('/(tabs)')` called on continue press |

---

## 5. User Flows

### 5.1 First Launch / New User Flow

```
App Opens
  └─> Load state from AsyncStorage
        └─> No saved state found
              └─> Initialize defaults (0 XP, 0 streak, lesson-1-1 = available)
                    └─> Home Screen (Skill Tree)
                          └─> Unit 1 banner visible
                                └─> Lesson 1-1 node glowing (available)
                                      └─> All other nodes locked
```

### 5.2 Starting and Completing a Lesson

```
Home Screen
  └─> Tap lesson node (available status)
        └─> Lesson Detail Sheet slides up
              ├─ Shows: title, description, XP reward, estimated time
              └─> Tap "Start Lesson"
                    └─> Sheet dismisses (300ms delay)
                          └─> Navigate to Lesson Screen [/lesson/:id]
                                └─> Question 1 displayed
                                      └─> User selects answer
                                            ├─ CORRECT:
                                            │     └─> Success haptic
                                            │           └─> Feedback banner ("Correct! ✓ [explanation]")
                                            │                 └─> Tap "Continue"
                                            │                       └─> Next question OR...
                                            │
                                            └─ INCORRECT:
                                                  └─> Error haptic
                                                        └─> Heart deducted
                                                              └─> Feedback banner ("Incorrect · [explanation]")
                                                                    └─> Tap "Continue"
                                                                          └─> Next question OR...

                                [After final question answered]
                                  └─> Tap "Finish"
                                        └─> completeLesson() called
                                              └─> XP added, lesson marked complete
                                                    └─> Streak updated
                                                          └─> Navigate to Lesson Complete Screen
                                                                └─> Animations play (badge, stars, XP count-up)
                                                                      └─> Tap "Continue"
                                                                            └─> Return to Home Screen
                                                                                  └─> Next lesson node unlocked
```

### 5.3 Out of Hearts — Restart Flow

```
Lesson In Progress (1 heart remaining)
  └─> User answers incorrectly
        └─> Error haptic
              └─> Heart decrements to 0
                    └─> Feedback banner shows
                          └─> Tap "Continue"
                                └─> Alert: "Out of Hearts"
                                      ├─ "Restart" → Reset to Q1, 3 hearts, wrongCount=0
                                      └─ "Exit" → Return to Home (no progress saved)
```

### 5.4 Review Flow

```
Home Screen (3 days after completing a lesson)
  └─> Review Due banner appears: "🔁 Review Due · N lessons to revisit"
        └─> Tap banner
              └─> Navigate to first due lesson in review mode [/lesson/:id?review=true]
                    └─> 3 questions shown (subset of full lesson)
                          └─> Complete questions (same as normal lesson)
                                └─> Lesson Complete screen (review mode)
                                      └─> No XP awarded
                                            └─> Return to Home
```

### 5.5 Leaderboard Flow

```
Home Screen
  └─> Tap "Leaderboard" tab
        └─> Leaderboard Screen loads
              └─> All users (fake + current user) sorted by weeklyXP
                    └─> Current user row highlighted
                          └─> Summary card shows rank and weekly XP
                                └─> User earns XP in a lesson
                                      └─> Returns to Leaderboard
                                            └─> Rank updates based on new weeklyXP
```

### 5.6 Streak Freeze Usage

```
User opens app (skipped yesterday, has freeze available)
  └─> loadFromStorage()
        └─> checkAndUpdateStreak()
              └─> daysBetween(lastActiveDate, today) === 2
                    └─> streakFreezeAvailable === true
                          └─> Streak preserved (streak + 1)
                                └─> streakFreezeAvailable = false
                                      └─> streakFreezeUsedThisWeek = true
                                            └─> State saved to AsyncStorage
                                                  └─> Next Sunday: streakFreezeAvailable resets to true
```

### 5.7 Weekly Reset Flow

```
User opens app on or after Sunday (new week)
  └─> loadFromStorage()
        └─> currentSunday !== saved.weeklyXPResetDate
              └─> weeklyXP resets to 0 (applied on next lesson completion)
                    └─> streakFreezeUsedThisWeek = false
                          └─> streakFreezeAvailable = true
                                └─> Leaderboard effectively starts fresh for the week
```

---

## 6. Data Model

### 6.1 Question Types

```typescript
type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

MultipleChoiceQuestion {
  id: string
  type: 'multiple-choice'
  prompt: string
  options: string[]        // Always 4 options
  correctIndex: number     // 0-indexed
  feedback: string
}

TrueFalseQuestion {
  id: string
  type: 'true-false'
  prompt: string
  correctAnswer: boolean
  feedback: string
}

FillBlankQuestion {
  id: string
  type: 'fill-blank'
  promptBefore: string     // Text before the blank
  promptAfter: string      // Text after the blank
  chips: string[]          // 4 word options
  correctChip: string      // Must exist in chips[]
  feedback: string
}
```

### 6.2 Curriculum Structure

```typescript
Lesson {
  id: string              // e.g., "lesson-1-2"
  unitId: string          // e.g., "unit-1"
  title: string
  description: string
  xpReward: number        // Base XP (before perfect bonus)
  estimatedMinutes: number
  questions: Question[]   // 5 questions for standard, slice(0,3) for review
}

Unit {
  id: string              // e.g., "unit-1"
  title: string
  accentColor: string     // Hex color for theming
  glowColor: string       // rgba for glow effect
  lessons: Lesson[]
}
```

### 6.3 App State (Persisted)

```typescript
AppState {
  xp: number                                  // Lifetime total
  streak: number                              // Current day streak
  lastActiveDate: string                      // ISO date (YYYY-MM-DD)
  streakFreezeAvailable: boolean
  streakFreezeUsedThisWeek: boolean
  lessonProgress: Record<string, LessonStatus> // 'locked' | 'available' | 'completed'
  lessonLastCompleted: Record<string, string>  // lessonId → ISO date
  hearts: number                              // 0–3, session-scoped
  weeklyXP: number                            // Resets every Sunday
  weeklyXPResetDate: string                   // ISO date of last Sunday reset
}
```

### 6.4 Key Business Logic Constants

| Constant | Value | Description |
|---|---|---|
| `REVIEW_INTERVAL_DAYS` | 3 | Days after completion before a lesson is due for review |
| Base XP | 20 | XP for completing a lesson with any wrong answers |
| Perfect XP | 30 | XP for completing a lesson with zero wrong answers |
| Starting Hearts | 3 | Hearts available at the start of each lesson session |
| Streak Freeze Per Week | 1 | Max freezes available per calendar week |
| Review Questions | 3 | Number of questions shown in a review session |

---

## 7. Screen Inventory

| Screen | Route | Tab | Description |
|---|---|---|---|
| Home / Skill Tree | `/(tabs)/` | Home | Main scrollable skill tree with unit banners and lesson nodes |
| Leaderboard | `/(tabs)/leaderboard` | Leaderboard | Weekly XP rankings |
| Profile | `/(tabs)/profile` | Profile | User stats, progress, streak freeze |
| Lesson | `/lesson/[id]` | — | Active lesson session (questions, progress bar, hearts) |
| Lesson Complete | `/lesson-complete` | — | Post-lesson celebration screen |

---

## 8. Component Inventory

| Component | Location | Purpose |
|---|---|---|
| `SkillTree` | `components/SkillTree/SkillTree.tsx` | Renders all units and lesson nodes |
| `LessonNode` | `components/SkillTree/LessonNode.tsx` | Single lesson circle node with status styling |
| `UnitBanner` | `components/SkillTree/UnitBanner.tsx` | Unit section header with title and accent |
| `LessonDetailSheet` | `components/LessonDetailSheet.tsx` | Bottom sheet lesson preview and start button |
| `MultipleChoice` | `components/Lesson/MultipleChoice.tsx` | MC question renderer |
| `TrueFalse` | `components/Lesson/TrueFalse.tsx` | T/F question renderer |
| `FillInBlank` | `components/Lesson/FillInBlank.tsx` | Fill-blank chip selector |
| `FeedbackBanner` | `components/Lesson/FeedbackBanner.tsx` | Post-answer feedback and continue button |
| `ProgressBar` | `components/Lesson/ProgressBar.tsx` | Lesson progress indicator |
| `HeartsDisplay` | `components/Lesson/HeartsDisplay.tsx` | Heart icons in lesson header |
| `XPBadge` | `components/common/XPBadge.tsx` | Total XP indicator in home header |
| `StreakBadge` | `components/common/StreakBadge.tsx` | Streak flame indicator in home header |

---

## 9. Curriculum Roadmap

### MVP (Shipped)

| Unit | Title | Lessons |
|---|---|---|
| Unit 1 | How Software Gets Built | SDLC, Agile & Sprints, Tickets & User Stories |
| Unit 2 | How the Internet Works | Frontend vs. Backend, APIs Explained, Databases 101 |

### Phase 2

| Unit | Title | Key Topics |
|---|---|---|
| Unit 3 | Code & Version Control | Git basics, branches, pull requests, code review |
| Unit 4 | Testing & Quality | Unit tests, QA, test coverage, bug severity |
| Unit 5 | Infrastructure & Deployment | Servers, CI/CD, environments, rollbacks |

### Phase 3

| Unit | Title | Key Topics |
|---|---|---|
| Unit 6 | Data & Analytics | Events, funnels, A/B tests, data pipelines |
| Unit 7 | Security for PMs | Auth, encryption, GDPR, OWASP basics |
| Unit 8 | AI & Machine Learning | Model training, inference, latency, hallucinations, evals |

---

## 10. Non-Functional Requirements

### 10.1 Performance

- App cold start to interactive: < 2 seconds on mid-range devices
- Lesson screen navigation: < 300ms perceived latency
- State persistence (AsyncStorage write): non-blocking, async

### 10.2 Reliability

- State must not be lost if the app crashes mid-lesson (state is saved on completion, not mid-session by design)
- Weekly reset logic must be idempotent: running it multiple times on the same day must produce the same result

### 10.3 Platform Support

- iOS 15+ (target: iPhone SE through Pro Max)
- Android 10+ (API level 29+)
- Dark mode only (no light mode in MVP)

### 10.4 Dependencies

| Package | Purpose |
|---|---|
| `expo-router` | File-based navigation |
| `zustand` | Global state management |
| `@react-native-async-storage/async-storage` | Persistence layer |
| `expo-haptics` | Haptic feedback |
| `react-native-reanimated` | Smooth animations |
| `react-native-gesture-handler` | Touch interactions |
| `lottie-react-native` | (Available) Animation support for future use |

---

## 11. Open Questions & Decisions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-1 | Should review completion update `lessonLastCompleted` (resetting the 3-day review clock)? | Product | Open |
| OQ-2 | Should XP be awarded for reviews to incentivize participation? | Product | Open |
| OQ-3 | What is the monetization model? (Free, freemium, subscription, team license?) | Business | Open |
| OQ-4 | Should the leaderboard be global or within friend/team cohorts only? | Product | Open |
| OQ-5 | How should lesson re-attempts be handled? (Re-award XP? Only first time?) | Product | Currently: XP re-awarded on repeat completions |
| OQ-6 | Should streaks require completing a new lesson or can reviews count? | Product | Open |
| OQ-7 | Backend architecture for multi-user leaderboard? (Supabase, Firebase, custom API?) | Engineering | Open |
| OQ-8 | Onboarding flow required for v1 public launch? | Product | Open |

---

## 12. Success Metrics

### Activation
- % of users who complete their first lesson within 24 hours of install
- % of users who complete at least 3 lessons in first week

### Retention
- Day 1 / Day 7 / Day 30 retention rates
- Average streak length at Day 7
- % of users who maintain a 5+ day streak

### Engagement
- Average lessons completed per active day
- % of users who open the review banner when shown
- Leaderboard screen visit rate

### Learning Outcomes (future, via assessments)
- Pre/post quiz score delta
- User self-reported confidence in technical conversations

---

*This PRD is a living document. It should be updated as decisions are made, new requirements emerge, and the product evolves.*
