import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';
import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';

export const seedCourseData: z.infer<typeof courseSchema>[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Fullstack Mastery: From Zero to Hero',
    description: 'A comprehensive course covering frontend fundamentals to backend architecture.',
    created: new Date('2024-01-01T00:00:00Z'),
    tags: ['fullstack', 'react', 'typescript', 'backend'],
    chapters: [
      {
        name: 'Frontend Core',
        lessons: [
          {
            name: 'React Hooks Deep Dive',
            theory: '# Mastering React Hooks\nHooks allow you to use state without classes.',
            questions: [
              {
                questionText: 'Which hook is used for side effects?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['useState', 'useEffect', 'useMemo', 'useRef'] },
                  answer: { correctIndex: 1 },
                },
                solution: 'useEffect is designed for side effects.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Advanced TypeScript Patterns',
    description: 'Master Generics, Mapped Types, and Conditional Types for enterprise apps.',
    created: new Date('2024-02-15T00:00:00Z'),
    tags: ['typescript', 'programming', 'advanced'],
    chapters: [
      {
        name: 'Generics & Constraints',
        lessons: [
          {
            name: 'Generic Constraints',
            theory: '### Why Constraints?\nSometimes you want a generic that only works on objects with a `.length` property.',
            questions: [
              {
                questionText: 'Which keyword is used to constrain a generic type?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['implements', 'extends', 'typeof', 'keyof'] },
                  answer: { correctIndex: 1 },
                },
                solution: "The 'extends' keyword is used for generic constraints.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Next.js 14: The App Router',
    description: 'Deep dive into Server Components, Server Actions, and Parallel Routes.',
    created: new Date('2024-03-10T00:00:00Z'),
    tags: ['nextjs', 'react', 'frontend'],
    chapters: [
      {
        name: 'Server Rendering Strategies',
        lessons: [
          {
            name: 'Streaming and Suspense',
            theory: 'Streaming allows you to break down the page’s HTML into smaller chunks.',
            questions: [
              {
                questionText: 'What is the default rendering type in the App Router?',
                body: {
                  type: QuestionTypes.OPEN_ENDED,
                  arguments: { characterCount: null },
                  answer: { evaluationPrompt: 'Explain Server Components as default.' },
                },
                solution: 'React Server Components (RSC) are the default.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'PostgreSQL Architecture',
    description: 'Learn indexing, query optimization, and complex joins.',
    created: new Date('2024-04-05T00:00:00Z'),
    tags: ['database', 'postgresql', 'sql'],
    chapters: [
      {
        name: 'Performance Tuning',
        lessons: [
          {
            name: 'B-Tree Indexes',
            theory: 'Indexes speed up retrieval but slow down writes.',
            questions: [
              {
                questionText: 'What is the default port for a PostgreSQL server?',
                body: {
                  type: QuestionTypes.NUMERICAL,
                  arguments: { precision: 0 },
                  answer: { correctNumber: 5432 },
                },
                solution: 'Default port is 5432.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'DevOps with Docker & K8s',
    description: 'Containerize and orchestrate applications at scale.',
    created: new Date('2024-05-12T00:00:00Z'),
    tags: ['devops', 'docker', 'kubernetes'],
    chapters: [
      {
        name: 'Docker Fundamentals',
        lessons: [
          {
            name: 'Layer Caching',
            theory: 'Each command in a Dockerfile creates a new layer.',
            questions: [
              {
                questionText: 'Which command lists all running containers?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['docker ps', 'docker ls', 'docker show'] },
                  answer: { correctIndex: 0 },
                },
                solution: 'docker ps is the command.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2540d6d5-6b80-48e8-963b-63806f366144',
    name: 'Backend Node.js Security',
    description: 'Protecting your API from OWASP Top 10 vulnerabilities.',
    created: new Date('2024-06-20T00:00:00Z'),
    tags: ['security', 'nodejs', 'backend'],
    chapters: [
      {
        name: 'Authentication',
        lessons: [
          {
            name: 'JWT Best Practices',
            theory: 'Never store sensitive data in JWT payloads.',
            questions: [
              {
                questionText: 'How many parts are in a JWT string?',
                body: {
                  type: QuestionTypes.NUMERICAL,
                  arguments: { precision: 0 },
                  answer: { correctNumber: 3 },
                },
                solution: 'Header, Payload, and Signature.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '63d0c3f3-00a4-4340-9755-667466861f6d',
    name: 'Python for Data Analysis',
    description: 'Use Pandas and NumPy to clean and analyze datasets.',
    created: new Date('2024-07-01T00:00:00Z'),
    tags: ['python', 'data-science'],
    chapters: [
      {
        name: 'Pandas DataFrames',
        lessons: [
          {
            name: 'Filtering Data',
            theory: 'Pandas allows for vectorised operations which are highly efficient.',
            questions: [
              {
                questionText: 'What is the standard library for multi-dimensional arrays?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['Pandas', 'NumPy', 'SciPy', 'Matplotlib'] },
                  answer: { correctIndex: 1 },
                },
                solution: 'NumPy is the base for numerical arrays.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '06f47053-0668-4504-8b01-57d4778106a7',
    name: 'Testing React Apps',
    description: 'From Unit testing with Vitest to E2E with Playwright.',
    created: new Date('2024-08-15T00:00:00Z'),
    tags: ['testing', 'frontend', 'react'],
    chapters: [
      {
        name: 'Unit Testing',
        lessons: [
          {
            name: 'Mocking APIs',
            theory: 'Mocking prevents tests from making real network requests.',
            questions: [
              {
                questionText: 'Write a simple assertion that 1+1 is 2 using Jest syntax.',
                body: {
                  type: QuestionTypes.CODE_EXECUTION,
                  arguments: {
                    languages: [codeExecutionLanguages.javascript.id],
                    initialCode: 'test("addition", () => {\n  // expect code here\n});',
                  },
                  answer: { testCases: [{ input: '', expectedOutput: '' }] },
                },
                solution: 'expect(1 + 1).toBe(2);',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '0375f49d-6493-41a4-9964-6f9160d5b248',
    name: 'CSS for UI Engineers',
    description: 'Master Flexbox, Grid, and Modern CSS features like subgrid.',
    created: new Date('2024-09-05T00:00:00Z'),
    tags: ['css', 'frontend', 'ui'],
    chapters: [
      {
        name: 'Modern Layouts',
        lessons: [
          {
            name: 'CSS Grid Mastery',
            theory: 'Grid is 2-dimensional while flexbox is 1-dimensional.',
            questions: [
              {
                questionText: 'Which property creates space between grid items?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['margin', 'padding', 'gap', 'gutter'] },
                  answer: { correctIndex: 2 },
                },
                solution: 'The gap property.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '18171189-61e8-4227-9907-28492021c60b',
    name: 'Mobile with React Native',
    description: 'Build native iOS and Android apps with JavaScript.',
    created: new Date('2024-10-10T00:00:00Z'),
    tags: ['mobile', 'react-native'],
    chapters: [
      {
        name: 'Native Components',
        lessons: [
          {
            name: 'Flexbox in Mobile',
            theory: 'In React Native, flex-direction defaults to column.',
            questions: [
              {
                questionText: 'What is the default flex-direction in React Native?',
                body: {
                  type: QuestionTypes.MULTIPLE_CHOICE,
                  arguments: { options: ['row', 'column', 'row-reverse'] },
                  answer: { correctIndex: 1 },
                },
                solution: 'It is column by default.',
              },
            ],
          },
        ],
      },
    ],
  },
];
