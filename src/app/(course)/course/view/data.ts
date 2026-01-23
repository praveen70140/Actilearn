import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';

export const courseData: z.infer<typeof courseSchema> = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // New, valid UUID
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
Hooks allow you to use state and other React features without writing a class. They provide a more direct API to the React concepts you already know.

### The Component Lifecycle
Understanding when hooks fire is critical for performance and bug prevention.

![React Lifecycle Diagram](test.png)

### Common Hooks
1. **useState**: For local state management.
2. **useEffect**: For side effects (API calls, subscriptions).
3. **useContext**: For consuming context without nesting.

\`\`\`javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Component mounted");
}, []);
\`\`\`
          `,
          questions: [
            {
              questionType: QuestionTypes.MULTIPLE_CHOICE,
              questionText: 'Which hook is used for side effects?',
              argument: JSON.stringify({
                options: ['useState', 'useEffect', 'useMemo', 'useRef'],
              }),
              answer: JSON.stringify({ correctAnswer: 1 }),
              solution: JSON.stringify({
                explanation:
                  'useEffect is designed for side effects like data fetching, subscriptions, and manual DOM mutations.',
              }),
            },
            {
              questionType: QuestionTypes.NUMERICAL,
              questionText:
                'How many times will useEffect run if dependency array is empty?',
              argument: JSON.stringify({}),
              answer: JSON.stringify({ correctAnswer: 1 }),
              solution: JSON.stringify({
                explanation:
                  'An empty dependency array makes the effect run once after the initial render.',
              }),
            },
            {
              questionType: QuestionTypes.OPEN_ENDED,
              questionText: 'Explain the difference between useMemo and useCallback.',
              argument: JSON.stringify({}),
              answer: JSON.stringify({
                keywords: ['memoizes', 'value', 'function'],
              }),
              solution: JSON.stringify({
                explanation:
                  'useMemo memoizes a computed value, while useCallback memoizes a function reference to prevent unnecessary re-creations.',
              }),
            },
            {
              questionType: QuestionTypes.CODE_EXECUTION,
              questionText: 'Write a JavaScript function that takes two numbers and returns their sum. Your function should be named `addNumbers`.',
              argument: JSON.stringify({
                starterCode: 'function addNumbers(a, b) {\n  // Write your code here\n}',
                testCases: [
                  { input: '2,3', expectedOutput: '5' },
                  { input: '10,20', expectedOutput: '30' },
                ],
              }),
              answer: JSON.stringify({
                correctAnswer: 'function addNumbers(a, b) { return a + b; }',
              }),
              solution: JSON.stringify({
                explanation: 'The function should take two arguments and return their sum. For example, `addNumbers(2, 3)` should return `5`.',
              }),
            },
          ],
        },
        {
          name: 'Advanced State Management',
          theory: `
# State Management Strategies
As applications grow, managing state across multiple components becomes challenging.

### Lifting State Up
The simplest way to share state is to move it to the closest common ancestor. 

### Context API
For global settings like **Theme** or **Auth**, the Context API avoids "prop drilling."
<video src="test.mp4" />
> **Tip:** Don't put high-frequency updates in Context, as it can trigger re-renders across the entire tree.
          `,
          questions: [
            {
              questionType: QuestionTypes.MULTIPLE_CHOICE,
              questionText: 'Which problem does lifting state up solve?',
              argument: JSON.stringify({
                options: [
                  'Code splitting',
                  'Shared state between components',
                  'Memory leaks',
                  'Improving bundle size',
                ],
              }),
              answer: JSON.stringify({ correctAnswer: 1 }),
              solution: JSON.stringify({
                explanation:
                  'Lifting state up allows multiple components to share and stay in sync with the same state.',
              }),
            },
            {
              questionType: QuestionTypes.OPEN_ENDED,
              questionText: 'When would you choose Context API over Redux?',
              argument: JSON.stringify({}),
              answer: JSON.stringify({ keywords: ['low-frequency', 'global'] }),
              solution: JSON.stringify({
                explanation:
                  'Context API is suitable for low-frequency global state like themes or auth, while Redux fits complex, high-frequency updates.',
              }),
            },
          ],
        },
      ],
    },
    {
      name: 'Backend Fundamentals',
      lessons: [
        {
          name: 'HTTP & RESTful APIs',
          theory: `
# HTTP & RESTful Design
REST (Representational State Transfer) is an architectural style for providing standards between computer systems on the web.

### Key HTTP Methods
- **GET**: Retrieve data.
- **POST**: Create data.
- **PUT**: Replace data (Idempotent).
- **PATCH**: Partially update data.
- **DELETE**: Remove data.

### Status Codes
- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error
          `,
          questions: [
            {
              questionType: QuestionTypes.NUMERICAL,
              questionText: 'In standard HTTP, which port is used for HTTPS?',
              argument: JSON.stringify({}),
              answer: JSON.stringify({ correctAnswer: 443 }),
              solution: JSON.stringify({
                explanation: 'Port 443 is the default port for HTTPS traffic.',
              }),
            },
            {
              questionType: QuestionTypes.MULTIPLE_CHOICE,
              questionText: 'Which HTTP method is idempotent?',
              argument: JSON.stringify({
                options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
              }),
              answer: JSON.stringify({ correctAnswer: 2 }),
              solution: JSON.stringify({
                explanation:
                  'PUT is idempotent because multiple identical requests result in the same state.',
              }),
            },
            {
              questionType: QuestionTypes.OPEN_ENDED,
              questionText: 'What does statelessness mean in REST APIs?',
              argument: JSON.stringify({}),
              answer: JSON.stringify({ keywords: ['server', 'no client session'] }),
              solution: JSON.stringify({
                explanation:
                  'Statelessness means each request contains all information needed to process it, and the server stores no client session.',
              }),
            },
          ],
        },
      ],
    },
  ],
};

