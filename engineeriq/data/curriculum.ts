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

// ─── Content Panel Types ────────────────────────────────────────────────────────

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  tableColumns?: string[];
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  bidirectional?: boolean;
}

export type DiagramLayout = 'cycle' | 'two-column' | 'two-table';

export interface DiagramConfig {
  layout: DiagramLayout;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

export interface ContentPanel {
  id: string;
  type: 'text' | 'conceptCallout' | 'visualDiagram' | 'example';
  headline?: string;
  body: string;
  diagramConfig?: DiagramConfig;
}

export interface UnitQuiz {
  id: string;
  questions: Question[];
}

// ─── Lesson & Unit ─────────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  estimatedMinutes: number;
  panels: ContentPanel[];
  practiceProblems: Question[];
}

export interface Unit {
  id: string;
  title: string;
  accentColor: string;
  glowColor: string;
  lessons: Lesson[];
  quiz: UnitQuiz;
}

// ─── Unit 1: How Software Gets Built ───────────────────────────────────────────

const unit1Lessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    unitId: 'unit-1',
    title: 'The Software Development Lifecycle',
    description: 'Understand the phases of how software is built, from idea to launch.',
    xpReward: 10,
    estimatedMinutes: 3,
    panels: [
      {
        id: 'p-1-1-1',
        type: 'text',
        headline: "Software doesn't just appear.",
        body: "Every app you use — Spotify, Slack, your company's internal tools — was built through a repeatable process. Engineers call this the Software Development Life Cycle, or SDLC. It's the step-by-step journey from idea to shipped product.",
      },
      {
        id: 'p-1-1-2',
        type: 'conceptCallout',
        body: 'SDLC stands for Software Development Life Cycle. The main phases are: Plan → Design → Develop → Test → Deploy → Maintain.',
      },
      {
        id: 'p-1-1-3',
        type: 'example',
        body: "Think of building software like building a house. You don't just start laying bricks on day one. You plan the blueprint, get approvals, frame the walls, run electrical, inspect it, and then hand over the keys. Software follows the same logic.",
      },
      {
        id: 'p-1-1-4',
        type: 'text',
        headline: 'Where does the PM fit in?',
        body: 'Product Managers are most active in the Plan and Design phases — defining what gets built and why. But a great PM stays engaged through Testing and Launch to make sure what ships matches what was intended.',
      },
    ],
    practiceProblems: [
      {
        id: 'q-1-1-1',
        type: 'multiple-choice',
        prompt: 'You just learned about the SDLC. What does SDLC stand for?',
        options: [
          'Software Design and Launch Checklist',
          'Software Development Life Cycle',
          'System Development and Launch Cycle',
          'Standard Development and Launch Criteria',
        ],
        correctIndex: 1,
        feedback: 'The SDLC is the process engineers follow to plan, build, test, and ship software.',
      },
      {
        id: 'q-1-1-2',
        type: 'true-false',
        prompt: 'The testing phase always happens after a feature is fully built and shipped to users.',
        correctAnswer: false,
        feedback: 'Testing often happens before shipping — and in some teams, even before building (test-driven development).',
      },
      {
        id: 'q-1-1-3',
        type: 'fill-blank',
        promptBefore: 'Engineers write',
        promptAfter: 'to define what a system should do before building it.',
        chips: ['requirements', 'invoices', 'sprints', 'deployments'],
        correctChip: 'requirements',
        feedback: 'Requirements (often written by PMs!) describe what the software needs to do.',
      },
      {
        id: 'q-1-1-4',
        type: 'multiple-choice',
        prompt: 'You just learned about SDLC phases. Which phase comes AFTER development but BEFORE launch?',
        options: ['Planning', 'Design', 'Testing / QA', 'Maintenance'],
        correctIndex: 2,
        feedback: 'QA (Quality Assurance) catches bugs before users do.',
      },
      {
        id: 'q-1-1-5',
        type: 'true-false',
        prompt: 'A PM is responsible for writing all the code in the development phase.',
        correctAnswer: false,
        feedback: 'PMs define what to build and why — engineers handle the how.',
      },
    ],
  },
  {
    id: 'lesson-1-2',
    unitId: 'unit-1',
    title: 'Agile & Sprints',
    description: 'Understand how modern engineering teams organize and ship work.',
    xpReward: 10,
    estimatedMinutes: 3,
    panels: [
      {
        id: 'p-1-2-1',
        type: 'text',
        headline: "Most software teams don't plan everything upfront.",
        body: "In the early days of software, teams would spend months planning before writing a single line of code. This often led to building the wrong thing. Agile is a different approach: build a little, learn a lot, repeat.",
      },
      {
        id: 'p-1-2-2',
        type: 'conceptCallout',
        body: 'A sprint is a short, fixed work cycle — typically 1 or 2 weeks — in which a team commits to completing a specific set of work. At the end of every sprint, there should be something shippable.',
      },
      {
        id: 'p-1-2-3',
        type: 'visualDiagram',
        body: 'The Agile sprint cycle repeats continuously, letting teams learn and adapt.',
        diagramConfig: {
          layout: 'cycle',
          nodes: [
            { id: 'plan', label: 'Plan Sprint' },
            { id: 'build', label: 'Build' },
            { id: 'test', label: 'Test' },
            { id: 'retro', label: 'Review & Retro' },
          ],
          connections: [
            { from: 'plan', to: 'build' },
            { from: 'build', to: 'test' },
            { from: 'test', to: 'retro' },
            { from: 'retro', to: 'plan', label: 'repeat' },
          ],
        },
      },
      {
        id: 'p-1-2-4',
        type: 'example',
        body: "Imagine planning a road trip but you've never driven the route before. Instead of mapping every gas station in advance, you drive for 2 hours, reassess, adjust your route, and keep going. That's Agile thinking applied to travel.",
      },
    ],
    practiceProblems: [
      {
        id: 'q-1-2-1',
        type: 'multiple-choice',
        prompt: 'You just learned about sprints. How long is a typical Agile sprint?',
        options: ['1 day', '1–2 weeks', '1 month', '1 quarter'],
        correctIndex: 1,
        feedback: 'Most teams run 2-week sprints — short cycles that let them ship and adjust frequently.',
      },
      {
        id: 'q-1-2-2',
        type: 'fill-blank',
        promptBefore: 'At the start of each sprint, the team holds a',
        promptAfter: 'planning meeting to decide what to work on.',
        chips: ['sprint', 'retro', 'standup', 'launch'],
        correctChip: 'sprint',
        feedback: 'Sprint planning is where the team picks items from the backlog to tackle that sprint.',
      },
      {
        id: 'q-1-2-3',
        type: 'multiple-choice',
        prompt: 'What is a "backlog" in Agile?',
        options: [
          "A list of bugs that weren't fixed",
          'A prioritized list of all work to be done',
          'Unfinished sprints from last quarter',
          'A log of past deployments',
        ],
        correctIndex: 1,
        feedback: 'The backlog is a living list of features, improvements, and bugs — prioritized by the PM.',
      },
      {
        id: 'q-1-2-4',
        type: 'true-false',
        prompt: "In a daily standup, engineers give detailed updates on everything they've done that week.",
        correctAnswer: false,
        feedback: "Standups are short (15 min max). Each person covers: what I did yesterday, what I'm doing today, and any blockers.",
      },
      {
        id: 'q-1-2-5',
        type: 'multiple-choice',
        prompt: 'What happens at a sprint retrospective?',
        options: [
          'The team demos the product to customers',
          "Engineers review each other's code",
          'The team reflects on what went well and what to improve',
          'The PM presents the roadmap',
        ],
        correctIndex: 2,
        feedback: 'Retros are about improving how the team works — not just what they built.',
      },
    ],
  },
  {
    id: 'lesson-1-3',
    unitId: 'unit-1',
    title: 'Tickets & User Stories',
    description: 'Learn how work is documented and communicated to engineers.',
    xpReward: 10,
    estimatedMinutes: 4,
    panels: [
      {
        id: 'p-1-3-1',
        type: 'text',
        headline: 'How does work actually get to engineers?',
        body: 'Once a PM decides what to build, that work needs to be broken down into bite-sized pieces that engineers can pick up and execute. Those pieces are called tickets — and writing good ones is one of the most important PM skills.',
      },
      {
        id: 'p-1-3-2',
        type: 'conceptCallout',
        body: 'A user story is a lightweight way to describe a feature from the end user\'s perspective. Format: "As a [type of user], I want to [do something] so that [I get some benefit]."',
      },
      {
        id: 'p-1-3-3',
        type: 'example',
        body: '"Add a search bar" is a task. "As a returning customer, I want to search my past orders by product name so I can quickly reorder items I\'ve bought before" is a user story. The second version tells the engineer why — and that context changes how they build it.',
      },
      {
        id: 'p-1-3-4',
        type: 'text',
        headline: 'Acceptance criteria close the loop.',
        body: 'Every ticket needs acceptance criteria: the specific conditions that must be true before the ticket is considered done. Without them, "done" means something different to everyone on the team.',
      },
    ],
    practiceProblems: [
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
        feedback: 'Tickets (also called issues or cards) are how teams track individual pieces of work.',
      },
      {
        id: 'q-1-3-2',
        type: 'fill-blank',
        promptBefore: 'User stories follow the format: "As a',
        promptAfter: ', I want to…"',
        chips: ['user', 'developer', 'company', 'PM'],
        correctChip: 'user',
        feedback: "User stories keep the team focused on who they're building for and why.",
      },
      {
        id: 'q-1-3-3',
        type: 'multiple-choice',
        prompt: 'You just learned about user stories. Which of these is the best one?',
        options: [
          '"Build a login page"',
          '"Fix authentication"',
          '"As a new user, I want to sign up with my email so I can create an account"',
          '"Login should work better"',
        ],
        correctIndex: 2,
        feedback: 'Good user stories specify the who, what, and why — not just the technical task.',
      },
      {
        id: 'q-1-3-4',
        type: 'true-false',
        prompt: 'Acceptance criteria define when a ticket is considered "done."',
        correctAnswer: true,
        feedback: 'Acceptance criteria are the conditions a feature must meet to be accepted. PMs often write these.',
      },
      {
        id: 'q-1-3-5',
        type: 'multiple-choice',
        prompt: 'What does "story points" measure in Agile?',
        options: ['Hours of work', 'Lines of code', 'Relative effort and complexity', 'Number of bugs'],
        correctIndex: 2,
        feedback: 'Story points are a relative estimate, not a time estimate. A 3-point story is roughly 3x harder than a 1-point story.',
      },
    ],
  },
];

const unit1Quiz: UnitQuiz = {
  id: 'quiz-unit-1',
  questions: [
    {
      id: 'qz-1-1',
      type: 'multiple-choice',
      prompt: 'What does SDLC stand for?',
      options: [
        'Software Development Life Cycle',
        'Software Design and Launch Checklist',
        'System Development and Launch Cycle',
        'Standard Development and Launch Criteria',
      ],
      correctIndex: 0,
      feedback: 'SDLC = Software Development Life Cycle — the end-to-end process of building software.',
    },
    {
      id: 'qz-1-2',
      type: 'true-false',
      prompt: 'In Agile, teams plan all features in detail before writing any code.',
      correctAnswer: false,
      feedback: 'Agile is iterative — teams plan a little, build a little, and learn continuously.',
    },
    {
      id: 'qz-1-3',
      type: 'multiple-choice',
      prompt: 'What is a sprint?',
      options: [
        'A final review meeting before launch',
        'A type of software bug',
        'A short, fixed work cycle (usually 1–2 weeks)',
        'A release note sent to stakeholders',
      ],
      correctIndex: 2,
      feedback: "Sprints are the core building block of Agile — short cycles that end with something shippable.",
    },
    {
      id: 'qz-1-4',
      type: 'multiple-choice',
      prompt: 'A daily standup should last:',
      options: ['1 hour', '30 minutes', '~15 minutes', 'As long as needed'],
      correctIndex: 2,
      feedback: "Standups are brief by design — just blockers, today's plan, and yesterday's summary.",
    },
    {
      id: 'qz-1-5',
      type: 'true-false',
      prompt: 'A ticket\'s acceptance criteria defines when the work is considered "done."',
      correctAnswer: true,
      feedback: 'Acceptance criteria set clear, agreed-upon conditions for completion.',
    },
    {
      id: 'qz-1-6',
      type: 'multiple-choice',
      prompt: 'Which of these is the best user story format?',
      options: [
        '"Build a search bar"',
        '"As a returning customer, I want to search past orders so I can reorder quickly"',
        '"Search needs to be faster"',
        '"Users want better search"',
      ],
      correctIndex: 1,
      feedback: 'A good user story has a who, a what, and a why — giving engineers the full context.',
    },
    {
      id: 'qz-1-7',
      type: 'multiple-choice',
      prompt: 'What happens at a sprint retrospective?',
      options: [
        'Engineers demo new features to customers',
        'The PM presents the roadmap for next quarter',
        'The team reflects on what went well and what to improve',
        'New tickets are added to the backlog',
      ],
      correctIndex: 2,
      feedback: 'Retros are about team process improvement, not the product itself.',
    },
    {
      id: 'qz-1-8',
      type: 'true-false',
      prompt: 'The backlog is a prioritized list of all work to be done.',
      correctAnswer: true,
      feedback: "The backlog is the PM's primary tool for managing what gets built next.",
    },
    {
      id: 'qz-1-9',
      type: 'multiple-choice',
      prompt: 'Story points measure:',
      options: [
        'Hours of work',
        'Lines of code written',
        'Number of bugs fixed',
        'Relative effort and complexity',
      ],
      correctIndex: 3,
      feedback: 'Story points are relative — they compare tasks to each other, not to clock time.',
    },
    {
      id: 'qz-1-10',
      type: 'multiple-choice',
      prompt: 'Where is a PM most actively involved in the SDLC?',
      options: [
        'Testing and Maintenance',
        'Deployment and Monitoring',
        'Planning and Design',
        'Development and Code Review',
      ],
      correctIndex: 2,
      feedback: 'PMs drive the "what" and "why" — most impactful in Planning and Design phases.',
    },
  ],
};

// ─── Unit 2: How the Internet Works (for PMs) ──────────────────────────────────

const unit2Lessons: Lesson[] = [
  {
    id: 'lesson-2-1',
    unitId: 'unit-2',
    title: 'Frontend vs. Backend',
    description: 'Understand the two sides of every web or mobile app.',
    xpReward: 10,
    estimatedMinutes: 3,
    panels: [
      {
        id: 'p-2-1-1',
        type: 'text',
        headline: 'Every app has two sides.',
        body: 'When you tap a button in an app, two things are happening simultaneously: something you can see (the button animating, a screen loading) and something invisible (a server processing your request, a database being queried). These two sides are called the frontend and the backend.',
      },
      {
        id: 'p-2-1-2',
        type: 'conceptCallout',
        body: 'Frontend = everything the user sees and interacts with. Backend = the servers, logic, and databases that power the app behind the scenes.',
      },
      {
        id: 'p-2-1-3',
        type: 'visualDiagram',
        body: 'Frontend and backend communicate constantly through requests and responses.',
        diagramConfig: {
          layout: 'two-column',
          nodes: [
            { id: 'frontend', label: 'Frontend', sublabel: 'Your Screen\nUI · Buttons · Forms' },
            { id: 'backend', label: 'Backend', sublabel: 'The Server\nLogic · Database · APIs' },
          ],
          connections: [
            { from: 'frontend', to: 'backend', label: 'Requests & Responses', bidirectional: true },
          ],
        },
      },
      {
        id: 'p-2-1-4',
        type: 'example',
        body: 'Think of a restaurant. The dining room — tables, menus, waitstaff — is the frontend. The kitchen — where food is actually made — is the backend. You interact with the dining room, but the kitchen does the real work.',
      },
    ],
    practiceProblems: [
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
        feedback: "The backend handles the logic, databases, and APIs that power the app — even if users never see it.",
      },
      {
        id: 'q-2-1-3',
        type: 'fill-blank',
        promptBefore: 'When a frontend needs data, it sends a',
        promptAfter: 'to the backend.',
        chips: ['request', 'ticket', 'message', 'file'],
        correctChip: 'request',
        feedback: 'Frontend and backend communicate via requests (usually HTTP/API calls).',
      },
      {
        id: 'q-2-1-4',
        type: 'multiple-choice',
        prompt: 'Which role typically works on the part of the app users interact with?',
        options: ['DevOps engineer', 'Data engineer', 'Backend engineer', 'Frontend engineer'],
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
        feedback: 'Full-stack engineers can work across the entire app, from UI to database.',
      },
    ],
  },
  {
    id: 'lesson-2-2',
    unitId: 'unit-2',
    title: 'APIs Explained',
    description: 'Understand what APIs are and why they matter to PMs.',
    xpReward: 10,
    estimatedMinutes: 4,
    panels: [
      {
        id: 'p-2-2-1',
        type: 'text',
        headline: 'How do apps talk to each other?',
        body: "Your weather app doesn't collect weather data itself. Your food delivery app doesn't build its own mapping software. These apps use APIs to request data and services from other systems — and stitch everything together into a seamless experience.",
      },
      {
        id: 'p-2-2-2',
        type: 'conceptCallout',
        body: 'An API (Application Programming Interface) is a defined way for two software systems to communicate. It specifies: what you can ask for, how to ask for it, and what you\'ll get back.',
      },
      {
        id: 'p-2-2-3',
        type: 'example',
        body: 'An API is like a power outlet. You don\'t need to know how the electrical grid works — you just need to know that if you plug in the right connector, you get power. APIs give apps a standard "plug" to access data or functionality from another system.',
      },
      {
        id: 'p-2-2-4',
        type: 'text',
        headline: 'Why PMs need to understand APIs.',
        body: 'When you pitch a feature that requires a third-party integration — a payment processor, a map, a login system — you\'re proposing an API integration. Understanding what\'s possible (and what\'s complex) helps you scope accurately and avoid surprises mid-sprint.',
      },
    ],
    practiceProblems: [
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
        prompt: 'When you log into an app using your Google account, that uses an API.',
        correctAnswer: true,
        feedback: '"Login with Google" uses Google\'s authentication API — a classic real-world example.',
      },
      {
        id: 'q-2-2-3',
        type: 'fill-blank',
        promptBefore: 'An API',
        promptAfter: 'defines what endpoints are available and how to use them.',
        chips: ['contract', 'ticket', 'schema', 'sprint'],
        correctChip: 'contract',
        feedback: 'The API contract (or spec) is the agreement between teams on how data is exchanged.',
      },
      {
        id: 'q-2-2-4',
        type: 'multiple-choice',
        prompt: "When a weather app shows you today's forecast, it most likely:",
        options: [
          'Stores all weather data in the app itself',
          'Predicts weather using on-device AI',
          'Calls a weather API to fetch live data',
          'Downloads a new app update each day',
        ],
        correctIndex: 2,
        feedback: 'Most apps pull live data from external APIs rather than storing everything themselves.',
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
        feedback: "PMs scope API integrations constantly — knowing what's possible (and what's hard) makes you a better partner to engineering.",
      },
    ],
  },
  {
    id: 'lesson-2-3',
    unitId: 'unit-2',
    title: 'Databases 101',
    description: 'Understand how apps store and retrieve data.',
    xpReward: 10,
    estimatedMinutes: 4,
    panels: [
      {
        id: 'p-2-3-1',
        type: 'text',
        headline: 'Where does all the data go?',
        body: 'Every time you create an account, place an order, or send a message — that data has to live somewhere. That somewhere is a database: a structured system designed to store, organize, and retrieve information efficiently.',
      },
      {
        id: 'p-2-3-2',
        type: 'conceptCallout',
        body: 'A relational database stores data in tables — rows and columns, like a spreadsheet. Each table represents a type of thing (users, orders, products). Tables are linked together through shared IDs called foreign keys.',
      },
      {
        id: 'p-2-3-3',
        type: 'visualDiagram',
        body: 'Two related tables linked by a foreign key.',
        diagramConfig: {
          layout: 'two-table',
          nodes: [
            { id: 'users', label: 'Users', tableColumns: ['user_id', 'name', 'email'] },
            { id: 'orders', label: 'Orders', tableColumns: ['order_id', 'user_id', 'product'] },
          ],
          connections: [
            { from: 'orders', to: 'users', label: 'foreign key' },
          ],
        },
      },
      {
        id: 'p-2-3-4',
        type: 'example',
        body: "Imagine a library. The card catalog tells you every book's location. The books themselves are the data. The catalog is the database — it doesn't store the books, but it knows exactly where everything is and how it all connects.",
      },
      {
        id: 'p-2-3-5',
        type: 'text',
        headline: 'PMs and data: think early.',
        body: "New features almost always require new data to be stored or new queries to run against existing data. When you're writing a PRD, ask yourself: what data does this feature need, and do we already have it? If not, that's engineering scope you need to account for.",
      },
    ],
    practiceProblems: [
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
        feedback: 'Every app that saves anything — users, orders, messages — uses a database.',
      },
      {
        id: 'q-2-3-2',
        type: 'true-false',
        prompt: 'SQL is a programming language used to interact with relational databases.',
        correctAnswer: true,
        feedback: 'SQL (Structured Query Language) is how you ask a relational database for data. "SELECT * FROM users" is a SQL query.',
      },
      {
        id: 'q-2-3-3',
        type: 'fill-blank',
        promptBefore: 'In a relational database, data is organized into',
        promptAfter: '.',
        chips: ['tables', 'folders', 'buckets', 'stacks'],
        correctChip: 'tables',
        feedback: 'Tables have rows (records) and columns (fields) — similar to a spreadsheet.',
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
        feedback: 'Migrations update the database schema — like adding a new column. This is often required when building new features.',
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
        feedback: 'Great PMs think about data early: what do we need to store, how will we query it, and what analytics do we need?',
      },
    ],
  },
];

const unit2Quiz: UnitQuiz = {
  id: 'quiz-unit-2',
  questions: [
    {
      id: 'qz-2-1',
      type: 'multiple-choice',
      prompt: 'The frontend of an app refers to:',
      options: [
        'The UI and everything the user sees',
        'The server that processes requests',
        'The database storing user data',
        'The authentication layer',
      ],
      correctIndex: 0,
      feedback: 'Frontend = what the user sees and touches. UI, buttons, forms — all frontend.',
    },
    {
      id: 'qz-2-2',
      type: 'true-false',
      prompt: 'A full-stack engineer can work on both frontend and backend.',
      correctAnswer: true,
      feedback: 'Full-stack means end-to-end capability — from UI to database.',
    },
    {
      id: 'qz-2-3',
      type: 'multiple-choice',
      prompt: 'What does API stand for?',
      options: [
        'Automated Product Interface',
        'Application Programming Interface',
        'Applied Programming Integration',
        'App Performance Index',
      ],
      correctIndex: 1,
      feedback: 'API = Application Programming Interface — a standard way for systems to communicate.',
    },
    {
      id: 'qz-2-4',
      type: 'multiple-choice',
      prompt: 'When you log in with Google on a third-party app, this uses:',
      options: ['A database migration', 'A frontend framework', 'An API (OAuth)', 'A backend deployment'],
      correctIndex: 2,
      feedback: '"Login with Google" is a classic OAuth API integration.',
    },
    {
      id: 'qz-2-5',
      type: 'true-false',
      prompt: 'The backend is responsible for storing and processing data.',
      correctAnswer: true,
      feedback: 'The backend handles all the server-side logic, including databases and APIs.',
    },
    {
      id: 'qz-2-6',
      type: 'multiple-choice',
      prompt: 'A relational database stores data in:',
      options: ['Folders and subfolders', 'JSON blobs', 'Tables with rows and columns', 'Queues and stacks'],
      correctIndex: 2,
      feedback: 'Relational databases organize data in structured tables — like spreadsheets.',
    },
    {
      id: 'qz-2-7',
      type: 'multiple-choice',
      prompt: 'What is a database migration?',
      options: [
        'Moving the app to a new cloud provider',
        'Archiving old user records',
        'Importing data from a spreadsheet',
        'Changing the structure of an existing database',
      ],
      correctIndex: 3,
      feedback: 'Migrations alter the database schema — adding columns, renaming tables, etc.',
    },
    {
      id: 'qz-2-8',
      type: 'true-false',
      prompt: 'Most apps fetch live data from external APIs rather than storing everything locally.',
      correctAnswer: true,
      feedback: 'APIs let apps access external data and services without rebuilding them.',
    },
    {
      id: 'qz-2-9',
      type: 'multiple-choice',
      prompt: 'As a PM, why does it matter if a new feature needs new data stored?',
      options: [
        "It doesn't — that's a backend concern",
        'New data storage is engineering scope that affects the timeline',
        'It only matters post-launch for analytics',
        "PMs don't interact with data decisions",
      ],
      correctIndex: 1,
      feedback: 'Data requirements directly affect engineering effort — PMs need to account for this when scoping.',
    },
    {
      id: 'qz-2-10',
      type: 'multiple-choice',
      prompt: 'Which analogy best describes an API?',
      options: [
        "A library storing all the app's data",
        'A kitchen where backend logic runs',
        'A power outlet with a standard connector anyone can plug into',
        'A blueprint for how the UI is designed',
      ],
      correctIndex: 2,
      feedback: "APIs are standard 'plugs' — you don't need to know how the system works, just how to connect.",
    },
  ],
};

// ─── Exported curriculum ────────────────────────────────────────────────────────

export const UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'How Software Gets Built',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59,130,246,0.35)',
    lessons: unit1Lessons,
    quiz: unit1Quiz,
  },
  {
    id: 'unit-2',
    title: 'How the Internet Works',
    accentColor: '#10B981',
    glowColor: 'rgba(16,185,129,0.35)',
    lessons: unit2Lessons,
    quiz: unit2Quiz,
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

export function getUnitForLesson(lessonId: string): Unit | undefined {
  return UNITS.find((u) => u.lessons.some((l) => l.id === lessonId));
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
