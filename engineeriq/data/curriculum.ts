export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true-false';
  prompt: string;
  correctAnswer: boolean;
  feedback: string;
}

export interface FillBlankQuestion {
  id: string;
  type: 'fill-blank';
  promptBefore: string;
  promptAfter: string;
  chips: string[];
  correctChip: string;
  feedback: string;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | FillBlankQuestion;

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  estimatedMinutes: number;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  accentColor: string;
  glowColor: string;
  lessons: Lesson[];
}

// ─── Unit 1: How Software Gets Built ───────────────────────────────────────────

const unit1Lessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    unitId: 'unit-1',
    title: 'The Software Development Lifecycle',
    description: 'Understand the phases of how software is built, from idea to launch.',
    xpReward: 20,
    estimatedMinutes: 3,
    questions: [
      {
        id: 'q-1-1-1',
        type: 'multiple-choice',
        prompt: 'What does SDLC stand for?',
        options: [
          'Software Design and Launch Checklist',
          'Software Development Life Cycle',
          'System Development and Launch Cycle',
          'Standard Development and Launch Criteria',
        ],
        correctIndex: 1,
        feedback:
          'The SDLC is the process engineers follow to plan, build, test, and ship software.',
      },
      {
        id: 'q-1-1-2',
        type: 'true-false',
        prompt:
          'The testing phase always happens after a feature is fully built and shipped to users.',
        correctAnswer: false,
        feedback:
          'Testing often happens before shipping — and in some teams, even before building (test-driven development).',
      },
      {
        id: 'q-1-1-3',
        type: 'fill-blank',
        promptBefore: 'Engineers write',
        promptAfter: 'to define what a system should do before building it.',
        chips: ['requirements', 'invoices', 'sprints', 'deployments'],
        correctChip: 'requirements',
        feedback:
          'Requirements (often written by PMs!) describe what the software needs to do.',
      },
      {
        id: 'q-1-1-4',
        type: 'multiple-choice',
        prompt: 'Which phase comes AFTER development but BEFORE launch?',
        options: ['Planning', 'Design', 'Testing / QA', 'Maintenance'],
        correctIndex: 2,
        feedback: 'QA (Quality Assurance) catches bugs before users do.',
      },
      {
        id: 'q-1-1-5',
        type: 'true-false',
        prompt: 'A PM is responsible for writing all the code in the development phase.',
        correctAnswer: false,
        feedback:
          'PMs define what to build and why — engineers handle the how.',
      },
    ],
  },
  {
    id: 'lesson-1-2',
    unitId: 'unit-1',
    title: 'Agile & Sprints',
    description: 'Understand how modern engineering teams organize and ship work.',
    xpReward: 20,
    estimatedMinutes: 3,
    questions: [
      {
        id: 'q-1-2-1',
        type: 'multiple-choice',
        prompt: 'How long is a typical Agile sprint?',
        options: ['1 day', '1–2 weeks', '1 month', '1 quarter'],
        correctIndex: 1,
        feedback:
          'Most teams run 2-week sprints — short cycles that let them ship and adjust frequently.',
      },
      {
        id: 'q-1-2-2',
        type: 'fill-blank',
        promptBefore: 'At the start of each sprint, the team holds a',
        promptAfter: 'planning meeting to decide what to work on.',
        chips: ['sprint', 'retro', 'standup', 'launch'],
        correctChip: 'sprint',
        feedback:
          'Sprint planning is where the team picks items from the backlog to tackle that sprint.',
      },
      {
        id: 'q-1-2-3',
        type: 'multiple-choice',
        prompt: 'What is a "backlog" in Agile?',
        options: [
          'A list of bugs that weren\'t fixed',
          'A prioritized list of all work to be done',
          'Unfinished sprints from last quarter',
          'A log of past deployments',
        ],
        correctIndex: 1,
        feedback:
          'The backlog is a living list of features, improvements, and bugs — prioritized by the PM.',
      },
      {
        id: 'q-1-2-4',
        type: 'true-false',
        prompt:
          'In a daily standup, engineers give detailed updates on everything they\'ve done that week.',
        correctAnswer: false,
        feedback:
          'Standups are short (15 min max). Each person covers: what I did yesterday, what I\'m doing today, and any blockers.',
      },
      {
        id: 'q-1-2-5',
        type: 'multiple-choice',
        prompt: 'What happens at a sprint retrospective?',
        options: [
          'The team demos the product to customers',
          'Engineers review each other\'s code',
          'The team reflects on what went well and what to improve',
          'The PM presents the roadmap',
        ],
        correctIndex: 2,
        feedback:
          'Retros are about improving how the team works — not just what they built.',
      },
    ],
  },
  {
    id: 'lesson-1-3',
    unitId: 'unit-1',
    title: 'Tickets & User Stories',
    description: 'Learn how work is documented and communicated to engineers.',
    xpReward: 20,
    estimatedMinutes: 4,
    questions: [
      {
        id: 'q-1-3-1',
        type: 'multiple-choice',
        prompt: 'A "ticket" in engineering is:',
        options: [
          'A bug report sent to the CEO',
          'A documented unit of work tracked in a tool like Jira or Linear',
          'An invoice for software services',
          'A request sent to the design team',
        ],
        correctIndex: 1,
        feedback:
          'Tickets (also called issues or cards) are how teams track individual pieces of work.',
      },
      {
        id: 'q-1-3-2',
        type: 'fill-blank',
        promptBefore: 'User stories follow the format: "As a',
        promptAfter: ', I want to…"',
        chips: ['user', 'developer', 'company', 'PM'],
        correctChip: 'user',
        feedback:
          'User stories keep the team focused on who they\'re building for and why.',
      },
      {
        id: 'q-1-3-3',
        type: 'multiple-choice',
        prompt: 'Which of these is the best user story?',
        options: [
          '"Build a login page"',
          '"Fix authentication"',
          '"As a new user, I want to sign up with my email so I can create an account"',
          '"Login should work better"',
        ],
        correctIndex: 2,
        feedback:
          'Good user stories specify the who, what, and why — not just the technical task.',
      },
      {
        id: 'q-1-3-4',
        type: 'true-false',
        prompt: 'Acceptance criteria define when a ticket is considered "done."',
        correctAnswer: true,
        feedback:
          'Acceptance criteria are the conditions a feature must meet to be accepted. PMs often write these.',
      },
      {
        id: 'q-1-3-5',
        type: 'multiple-choice',
        prompt: 'What does "story points" measure in Agile?',
        options: [
          'Hours of work',
          'Lines of code',
          'Relative effort and complexity',
          'Number of bugs',
        ],
        correctIndex: 2,
        feedback:
          'Story points are a relative estimate, not a time estimate. A 3-point story is roughly 3x harder than a 1-point story.',
      },
    ],
  },
];

// ─── Unit 2: How the Internet Works (for PMs) ──────────────────────────────────

const unit2Lessons: Lesson[] = [
  {
    id: 'lesson-2-1',
    unitId: 'unit-2',
    title: 'Frontend vs. Backend',
    description: 'Understand the two sides of every web or mobile app.',
    xpReward: 20,
    estimatedMinutes: 3,
    questions: [
      {
        id: 'q-2-1-1',
        type: 'multiple-choice',
        prompt: 'The "frontend" of an app refers to:',
        options: [
          'The database where data is stored',
          'The servers that process requests',
          'What the user sees and interacts with',
          'The authentication system',
        ],
        correctIndex: 2,
        feedback: 'Frontend = the UI. Everything visible on screen is frontend.',
      },
      {
        id: 'q-2-1-2',
        type: 'true-false',
        prompt: 'The backend is responsible for storing and processing data.',
        correctAnswer: true,
        feedback:
          'The backend handles the logic, databases, and APIs that power the app — even if users never see it.',
      },
      {
        id: 'q-2-1-3',
        type: 'fill-blank',
        promptBefore: 'When a frontend needs data, it sends a',
        promptAfter: 'to the backend.',
        chips: ['request', 'ticket', 'message', 'file'],
        correctChip: 'request',
        feedback:
          'Frontend and backend communicate via requests (usually HTTP/API calls).',
      },
      {
        id: 'q-2-1-4',
        type: 'multiple-choice',
        prompt: 'Which role typically works on the part of the app users interact with?',
        options: [
          'DevOps engineer',
          'Data engineer',
          'Backend engineer',
          'Frontend engineer',
        ],
        correctIndex: 3,
        feedback: 'Frontend engineers build everything the user sees and touches.',
      },
      {
        id: 'q-2-1-5',
        type: 'multiple-choice',
        prompt: 'A "full-stack" engineer is someone who:',
        options: [
          'Only works on databases',
          'Works on both frontend and backend',
          'Manages cloud infrastructure',
          'Specializes in security',
        ],
        correctIndex: 1,
        feedback:
          'Full-stack engineers can work across the entire app, from UI to database.',
      },
    ],
  },
  {
    id: 'lesson-2-2',
    unitId: 'unit-2',
    title: 'APIs Explained',
    description: 'Understand what APIs are and why they matter to PMs.',
    xpReward: 20,
    estimatedMinutes: 4,
    questions: [
      {
        id: 'q-2-2-1',
        type: 'multiple-choice',
        prompt: 'API stands for:',
        options: [
          'Automated Product Interface',
          'App Performance Index',
          'Application Programming Interface',
          'Applied Programming Integration',
        ],
        correctIndex: 2,
        feedback: 'An API is a way for two software systems to talk to each other.',
      },
      {
        id: 'q-2-2-2',
        type: 'true-false',
        prompt:
          'When you log into an app using your Google account, that uses an API.',
        correctAnswer: true,
        feedback:
          '"Login with Google" uses Google\'s authentication API — a classic real-world example.',
      },
      {
        id: 'q-2-2-3',
        type: 'fill-blank',
        promptBefore: 'An API',
        promptAfter: 'defines what endpoints are available and how to use them.',
        chips: ['contract', 'ticket', 'schema', 'sprint'],
        correctChip: 'contract',
        feedback:
          'The API contract (or spec) is the agreement between teams on how data is exchanged.',
      },
      {
        id: 'q-2-2-4',
        type: 'multiple-choice',
        prompt: 'When a weather app shows you today\'s forecast, it most likely:',
        options: [
          'Stores all weather data in the app itself',
          'Predicts weather using on-device AI',
          'Calls a weather API to fetch live data',
          'Downloads a new app update each day',
        ],
        correctIndex: 2,
        feedback:
          'Most apps pull live data from external APIs rather than storing everything themselves.',
      },
      {
        id: 'q-2-2-5',
        type: 'multiple-choice',
        prompt: 'As a PM, why does understanding APIs matter?',
        options: [
          "You'll write the API code yourself",
          "You'll need to scope integrations and understand technical constraints",
          'APIs are only relevant for backend teams',
          'You manage the API billing',
        ],
        correctIndex: 1,
        feedback:
          'PMs scope API integrations constantly — knowing what\'s possible (and what\'s hard) makes you a better partner to engineering.',
      },
    ],
  },
  {
    id: 'lesson-2-3',
    unitId: 'unit-2',
    title: 'Databases 101',
    description: 'Understand how apps store and retrieve data.',
    xpReward: 20,
    estimatedMinutes: 4,
    questions: [
      {
        id: 'q-2-3-1',
        type: 'multiple-choice',
        prompt: 'What is a database?',
        options: [
          "A backup copy of your app's code",
          'An organized system for storing and retrieving data',
          "A type of server that runs your app",
          "A file that stores your app's design assets",
        ],
        correctIndex: 1,
        feedback:
          'Every app that saves anything — users, orders, messages — uses a database.',
      },
      {
        id: 'q-2-3-2',
        type: 'true-false',
        prompt: 'SQL is a programming language used to interact with relational databases.',
        correctAnswer: true,
        feedback:
          'SQL (Structured Query Language) is how you ask a relational database for data. "SELECT * FROM users" is a SQL query.',
      },
      {
        id: 'q-2-3-3',
        type: 'fill-blank',
        promptBefore: 'In a relational database, data is organized into',
        promptAfter: '.',
        chips: ['tables', 'folders', 'buckets', 'stacks'],
        correctChip: 'tables',
        feedback:
          'Tables have rows (records) and columns (fields) — similar to a spreadsheet.',
      },
      {
        id: 'q-2-3-4',
        type: 'multiple-choice',
        prompt: 'What does it mean when an engineer says "we need to run a migration"?',
        options: [
          "They're moving the app to a new server",
          "They're changing the structure of the database",
          "They're switching to a new database provider",
          "They're archiving old user data",
        ],
        correctIndex: 1,
        feedback:
          'Migrations update the database schema — like adding a new column. This is often required when building new features.',
      },
      {
        id: 'q-2-3-5',
        type: 'multiple-choice',
        prompt: 'As a PM, when should you think about data?',
        options: [
          'Only after the feature ships',
          "Never — that's the data team's job",
          'During feature design, to understand what needs to be stored and queried',
          "Only when there's a data bug",
        ],
        correctIndex: 2,
        feedback:
          'Great PMs think about data early: what do we need to store, how will we query it, and what analytics do we need?',
      },
    ],
  },
];

// ─── Exported curriculum ────────────────────────────────────────────────────────

export const UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'How Software Gets Built',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59,130,246,0.35)',
    lessons: unit1Lessons,
  },
  {
    id: 'unit-2',
    title: 'How the Internet Works',
    accentColor: '#10B981',
    glowColor: 'rgba(16,185,129,0.35)',
    lessons: unit2Lessons,
  },
];

// Flat list of all lessons for quick lookup
export const ALL_LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

// Fake leaderboard users
export interface LeaderboardUser {
  id: string;
  name: string;
  initials: string;
  weeklyXP: number;
  isCurrentUser?: boolean;
}

export const FAKE_USERS: Omit<LeaderboardUser, 'isCurrentUser'>[] = [
  { id: 'u1', name: 'Alex Rivera', initials: 'AR', weeklyXP: 340 },
  { id: 'u2', name: 'Jordan Lee', initials: 'JL', weeklyXP: 290 },
  { id: 'u3', name: 'Sam Patel', initials: 'SP', weeklyXP: 250 },
  { id: 'u4', name: 'Morgan Chen', initials: 'MC', weeklyXP: 210 },
  { id: 'u5', name: 'Taylor Kim', initials: 'TK', weeklyXP: 185 },
  { id: 'u6', name: 'Casey Torres', initials: 'CT', weeklyXP: 160 },
  { id: 'u7', name: 'Drew Johnson', initials: 'DJ', weeklyXP: 130 },
  { id: 'u8', name: 'Quinn Williams', initials: 'QW', weeklyXP: 95 },
  { id: 'u9', name: 'Blake Martinez', initials: 'BM', weeklyXP: 60 },
];
