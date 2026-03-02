# CLAUDE.md — EngineerIQ

Guidance for AI assistants working in this repository.

---

## Project Overview

**EngineerIQ** is a Duolingo-style mobile learning app that teaches software engineering concepts to Product Managers and Technical Program Managers (TPMs). Built with React Native + Expo, it uses gamification mechanics (XP, streaks, hearts, skill trees) to make technical topics engaging.

All application code lives under `engineeriq/`. The repo root contains only this file and a minimal `README.md`.

---

## Repository Layout

```
automatic-bassoon/
├── CLAUDE.md               # This file
├── README.md               # Minimal stub
└── engineeriq/             # All application code
    ├── app.json            # Expo project config
    ├── package.json        # Dependencies & scripts
    ├── tsconfig.json       # TypeScript config
    ├── App.tsx             # Root component
    ├── index.ts            # Entry point (registers App.tsx)
    ├── app/                # Expo Router file-based routes
    │   ├── _layout.tsx     # Root Stack navigator
    │   ├── lesson-complete.tsx
    │   ├── (tabs)/         # Bottom tab group
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx   # "Learn" tab (skill tree)
    │   │   ├── leaderboard.tsx
    │   │   └── profile.tsx
    │   └── lesson/
    │       ├── _layout.tsx
    │       └── [id].tsx    # Dynamic lesson player (modal)
    ├── components/
    │   ├── Lesson/         # Question-type UI components
    │   │   ├── MultipleChoice.tsx
    │   │   ├── TrueFalse.tsx
    │   │   ├── FillInBlank.tsx
    │   │   ├── FeedbackBanner.tsx
    │   │   ├── HeartsDisplay.tsx
    │   │   └── ProgressBar.tsx
    │   ├── SkillTree/      # Skill tree visualization
    │   │   ├── SkillTree.tsx
    │   │   ├── UnitBanner.tsx
    │   │   └── LessonNode.tsx
    │   ├── common/         # Shared small components
    │   │   ├── StreakBadge.tsx
    │   │   └── XPBadge.tsx
    │   └── LessonDetailSheet.tsx
    ├── constants/
    │   └── theme.ts        # Design tokens (colors, spacing, typography, radius, shadows)
    ├── data/
    │   └── curriculum.ts   # All lesson/question content + TypeScript types
    ├── store/
    │   └── useAppStore.ts  # Zustand global state store
    └── assets/             # App icons and splash images
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native via Expo ~54 |
| Language | TypeScript ~5.9 (strict mode) |
| Routing | expo-router ~6 (file-based) |
| State | Zustand ^5 |
| Persistence | @react-native-async-storage/async-storage ^2 |
| Animations | react-native-reanimated ~3.16, lottie-react-native ^7 |
| Haptics | expo-haptics ^15 |
| Gestures | react-native-gesture-handler ^2.30 |
| Icons | @expo/vector-icons (Ionicons) |
| Navigation | react-native-screens, react-native-safe-area-context |

---

## Development Commands

All commands run from the `engineeriq/` directory:

```bash
cd engineeriq

npm install          # Install dependencies
npm start            # Start Expo dev server (choose platform interactively)
npm run ios          # Launch iOS simulator
npm run android      # Launch Android emulator
npm run web          # Launch in browser
```

No linter, formatter, or test runner is currently configured.

---

## State Management

The entire app state lives in a single Zustand store: `store/useAppStore.ts`.

### State Shape (`AppState`)

```typescript
// User
xp: number                              // Total XP earned all-time
streak: number                          // Current daily streak count
lastActiveDate: string                  // 'YYYY-MM-DD' of last lesson completed
streakFreezeAvailable: boolean          // One freeze available per week
streakFreezeUsedThisWeek: boolean

// Progress
lessonProgress: Record<string, LessonStatus>     // 'locked' | 'available' | 'completed'
lessonLastCompleted: Record<string, string>       // lessonId → 'YYYY-MM-DD'

// Session
hearts: number                          // Lives per lesson (0–3), resets each lesson
weeklyXP: number                        // XP earned since last Sunday reset
weeklyXPResetDate: string               // ISO date of last weekly reset
```

### Key Actions

| Action | Effect |
|---|---|
| `completeLesson(lessonId, perfect)` | Awards 30 XP (perfect) or 20 XP, recomputes unlock graph, triggers streak check, persists |
| `loseHeart()` | Decrements hearts (min 0) |
| `resetHearts()` | Sets hearts back to 3 |
| `checkAndUpdateStreak()` | Updates streak based on days elapsed; applies freeze if diff === 2 and freeze available |
| `useStreakFreeze()` | Marks freeze used |
| `loadFromStorage()` | Hydrates store from AsyncStorage on app start |
| `saveToStorage()` | Serializes and persists store to AsyncStorage |

### Lesson Unlock Graph

`computeProgress()` in `useAppStore.ts` derives `lessonProgress` from `lessonLastCompleted`:
- The first lesson of the first unit is always `available`.
- Each subsequent lesson unlocks when the preceding lesson in the same unit is completed.
- The first lesson of unit N+1 unlocks when all lessons in unit N are completed.

**Never set `lessonProgress` directly** — always mutate `lessonLastCompleted` and let `computeProgress` re-derive it.

### Persistence

- Storage key: `'engineeriq_state'`
- `lessonProgress` is **not** persisted (it is re-derived on load from `lessonLastCompleted`).
- Weekly streak freeze resets each new week (Sunday-based).

---

## Curriculum / Content Model

All lesson content is defined in `data/curriculum.ts`.

### Type Hierarchy

```
Unit[]
  └── Lesson[]
        └── Question[] (discriminated union)
              ├── MultipleChoiceQuestion  { options[], correctIndex }
              ├── TrueFalseQuestion       { correctAnswer: boolean }
              └── FillBlankQuestion       { promptBefore, promptAfter, chips[], correctChip }
```

All types share `id: string`, `type: QuestionType`, `prompt` (or split prompt), and `feedback: string`.

### ID Conventions

- Units: `'unit-1'`, `'unit-2'`, …
- Lessons: `'lesson-<unitNum>-<lessonNum>'` e.g. `'lesson-1-1'`
- Questions: `'q-<unitNum>-<lessonNum>-<questionNum>'` e.g. `'q-1-1-3'`

### Adding a New Lesson

1. Add a `Lesson` object to the appropriate `unit<N>Lessons` array in `data/curriculum.ts`.
2. Follow the ID convention above.
3. Provide 4–5 questions; mix question types.
4. Every question needs a `feedback` string explaining the correct answer.
5. The unlock graph auto-updates — no store changes needed.

### Adding a New Unit

1. Define a `unitNLessons` array and a `Unit` object with `accentColor` and `glowColor` from `constants/theme.ts`.
2. Add it to the `UNITS` export and include its lessons in `ALL_LESSONS`.

---

## Routing (Expo Router)

The app uses Expo Router's **file-based routing** (similar to Next.js App Router).

| File | Route | Notes |
|---|---|---|
| `app/(tabs)/index.tsx` | `/` | Main learn tab |
| `app/(tabs)/leaderboard.tsx` | `/leaderboard` | |
| `app/(tabs)/profile.tsx` | `/profile` | |
| `app/lesson/[id].tsx` | `/lesson/:id` | Full-screen modal, receives `id` via `useLocalSearchParams` |
| `app/lesson-complete.tsx` | `/lesson-complete` | Celebration screen |

Navigation uses `router.push()` / `router.replace()` / `router.back()` from `expo-router`.

---

## Design System

All tokens are exported from `constants/theme.ts`. Always import from there — do not hardcode color hex values or spacing numbers inline.

### Colors (key values)

```
background:      #0F172A   (dark navy — default app background)
surface:         #1E293B
surfaceElevated: #253349
textPrimary:     #F8FAFC
textSecondary:   #94A3B8
unit1 (blue):    #3B82F6
unit2 (green):   #10B981
correct:         #22C55E
wrong:           #EF4444
xpGold:          #F59E0B
streakOrange:    #F97316
```

### Scale Tokens

```typescript
FontSize: { xs:11, sm:13, base:15, md:17, lg:20, xl:24, xxl:30, xxxl:38 }
Spacing:  { xs:4,  sm:8,  md:12,  lg:16, xl:24, xxl:32, xxxl:48 }
Radius:   { sm:8,  md:12, lg:16,  xl:24, full:9999 }
Shadow:   { card: {...}, node: {...} }
```

---

## Code Conventions

### TypeScript

- Strict mode is enabled — no `any`, no implicit `undefined`.
- Use discriminated unions for variant types (see `Question` in `curriculum.ts`).
- Component prop interfaces: `interface FooProps { ... }` (PascalCase + `Props` suffix).
- Export default for components; named exports for types, constants, and utilities.

### Components

- All components are functional; no class components.
- Use `StyleSheet.create()` for all styles — no inline style objects with literals.
- Reference theme tokens: `import { Colors, Spacing, FontSize, Radius } from '@/constants/theme'`.
- Avoid prop drilling — access the Zustand store directly in components that need state.

### Hooks

- Use `useCallback` for handlers passed as props or used in `useEffect` deps.
- Use `useRef` for mutable values that should not trigger re-renders (timers, animation refs).
- Use `useMemo` only when computation is genuinely expensive.

### Animations

- Use the React Native `Animated` API (not Reanimated worklets) for simple transitions.
- Use `lottie-react-native` for complex celebration/reward animations.
- Trigger haptic feedback (`expo-haptics`) alongside visual feedback for correct/incorrect answers.

### Path Aliases

`@/*` maps to the `engineeriq/` root (configured in `tsconfig.json`). Prefer alias imports over relative `../../` paths.

---

## Gamification Rules

| Mechanic | Rule |
|---|---|
| XP per lesson | 30 XP (perfect — no hearts lost), 20 XP otherwise |
| Hearts | 3 per lesson; losing all 3 fails the lesson |
| Weekly XP | Resets every Sunday |
| Streak | Increments if lesson completed on consecutive days |
| Streak freeze | One per week; auto-applies if user missed exactly 1 day |
| Review interval | Lessons are "due for review" 3 days after last completion (`REVIEW_INTERVAL_DAYS = 3`) |

---

## No Tests / No CI

There are currently no automated tests or CI pipelines. When adding features:
- Manually verify on at least one platform (web is fastest for iteration).
- Keep business logic (streak, XP, unlock graph) in the Zustand store so it can be unit-tested later without UI dependencies.

---

## Common Pitfalls

1. **Circular imports**: `computeProgress` uses `require('../data/curriculum')` inside the function body to avoid a circular module dependency. Don't change it to a top-level import.
2. **`lessonProgress` is derived**: Never write to it directly. Mutate `lessonLastCompleted`, then call `computeProgress`.
3. **AsyncStorage is async**: `saveToStorage` and `loadFromStorage` are async. Call `loadFromStorage()` in the root layout's `useEffect` before rendering content.
4. **Weekly reset is Sunday-based**: Use `getSundayBefore()` when comparing weekly boundaries, not arbitrary 7-day windows.
5. **Expo Router modals**: The `lesson/[id]` route is a full-screen modal — push it with `router.push('/lesson/lesson-1-1')`, not `navigate`.
