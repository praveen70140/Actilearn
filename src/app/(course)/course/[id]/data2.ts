
/**
 * This file contains the seed data for the "Python for Beginners" course.
 * The data is structured according to the courseSchema defined in Zod.
 * This course is designed to be simple and introductory.
 */

import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';
import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';

export const seedCourseData2: z.infer<typeof courseSchema> = {
  slug: 'b1f8b3a7-3c1e-4b7b-8e0a-5a9a4b3c2d1f',
  name: 'Python for Beginners',
  description:
    'A beginner-friendly course to learn the fundamentals of Python programming, from variables to functions.',
  created: new Date('2024-02-15T00:00:00Z'),
  tags: ['python', 'beginner'],

  chapters: [
    {
      name: 'Introduction to Python',
      lessons: [
        {
          name: 'Variables and Data Types',
          theory: `
# Welcome to Python!

Python is a versatile and easy-to-learn programming language.

### Variables
In Python, you can store data in variables.

\`\`\`python
message = "Hello, World!"
print(message)
\`\`\`

### Common Data Types
1. **String**: Text data
2. **Integer**: Whole numbers
3. **Float**: Numbers with decimal points
          `,
          questions: [
            {
              questionText: 'Which data type is used for text in Python?',
              body: {
                type: QuestionTypes.MULTIPLE_CHOICE,
                arguments: {
                  options: ['Integer', 'Float', 'String', 'Boolean'],
                },
                answer: { correctIndex: 2 },
              },
              solution: 'The String data type is used for text.',
            },
            {
              questionText:
                'What is the value of x after this code runs?\n`x = 5\nx = x + 2`',
              body: {
                type: QuestionTypes.NUMERICAL,
                arguments: { precision: 0 },
                answer: { correctNumber: 7 },
              },
              solution: 'The value of x will be 7.',
            },
          ],
        },
      ],
    },
    {
      name: 'Functions',
      lessons: [
        {
          name: 'Defining and Calling Functions',
          theory: `
# Functions in Python

Functions are blocks of reusable code.

### Defining a Function
You can define a function using the \`def\` keyword.

\`\`\`python
def greet(name):
    print("Hello, " + name)
\`\`\`

### Calling a Function
\`\`\`python
greet("Alice")
\`\`\`
          `,
          questions: [
            {
              questionText:
                'Which keyword is used to define a function in Python?',
              body: {
                type: QuestionTypes.OPEN_ENDED,
                arguments: { characterCount: null },
                answer: {
                  evaluationPrompt:
                    'Which keyword is used to define a function in Python?',
                },
              },
              solution: 'The `def` keyword is used to define a function.',
            },
          ],
        },
      ],
    },
  ],
};

