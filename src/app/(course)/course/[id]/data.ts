/**
 * This file contains the seed data for the "Fullstack Mastery: From Zero to Hero" course.
 * The data is structured according to the courseSchema from Zod.
 */

import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';
import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';

export const seedCourseData: z.infer<typeof courseSchema> = {
  slug: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Fullstack Mastery: From Zero to Hero',
  description:
    'A comprehensive course that covers everything you need to know to become a fullstack developer, from frontend fundamentals to backend architecture and database management.',
  created: new Date('2024-01-01T00:00:00Z'),
  tags: ['fullstack', 'react', 'typescript', 'backend'],

  chapters: [
    {
      name: 'Frontend Core',
      lessons: [
        {
          name: 'React Hooks Deep Dive',
          theory: `
# Mastering React Hooks

Hooks allow you to use state and other React features without writing a class.

### The Component Lifecycle
Understanding when hooks fire is critical for performance and bug prevention.

### Common Hooks
1. **useState**
2. **useEffect**
3. **useContext**

\`\`\`javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Component mounted");
}, []);
\`\`\`
          `,
          questions: [
            {
              questionText: 'Which hook is used for side effects?',
              body: {
                type: QuestionTypes.MULTIPLE_CHOICE,
                arguments: {
                  options: ['useState', 'useEffect', 'useMemo', 'useRef'],
                },
                answer: { correctIndex: 1 },
              },
              solution:
                'useEffect is designed for side effects like data fetching, subscriptions, and DOM mutations.',
            },
            {
              questionText:
                'How many times will useEffect run if dependency array is empty?',
              body: {
                type: QuestionTypes.NUMERICAL,
                arguments: { precision: 0 },
                answer: { correctNumber: 1 },
              },
              solution:
                'An empty dependency array makes the effect run once after the initial render.',
            },
            {
              questionText:
                'Explain the difference between useMemo and useCallback.',
              body: {
                type: QuestionTypes.OPEN_ENDED,
                arguments: { characterCount: null },
                answer: {
                  evaluationPrompt:
                    'Explain the difference between useMemo and useCallback.',
                },
              },
              solution:
                'useMemo memoizes values, useCallback memoizes function references.',
            },
            {
              questionText:
                'Write a JavaScript function that takes two numbers and returns their sum.',
              body: {
                type: QuestionTypes.CODE_EXECUTION,
                arguments: {
                  languages: [
                    codeExecutionLanguages.javascript.id,
                    codeExecutionLanguages.python.id,
                  ],
                  initialCode:
                    'function addNumbers(a, b) {\n  // Write your code here\n}',
                },
                answer: {
                  testCases: [
                    { input: '2,3', expectedOutput: '5' },
                    { input: '10,20', expectedOutput: '30' },
                  ],
                },
              },
              solution: 'Return the sum of the two input numbers.',
            },
          ],
        },
        {
          name: 'Advanced State Management',
          theory: `
# State Management Strategies

### Lifting State Up
Move shared state to the closest common ancestor.

### Context API
Avoid prop drilling for global state.

<video src="test.mp4" />

> Tip: Avoid high-frequency updates in Context.
          `,
          questions: [
            {
              questionText: 'Which problem does lifting state up solve?',
              body: {
                type: QuestionTypes.MULTIPLE_CHOICE,
                arguments: {
                  options: [
                    'Code splitting',
                    'Shared state between components',
                    'Memory leaks',
                    'Improving bundle size',
                  ],
                },
                answer: { correctIndex: 1 },
              },
              solution:
                'It allows multiple components to share synchronized state.',
            },
          ],
        },
      ],
    },
  ],
};
