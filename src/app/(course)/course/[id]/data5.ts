/**
 * This file contains the seed data for the "Node.js for Beginners" course.
 */

import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';

// The seed data for the "Node.js for Beginners" course.
export const seedCourseData5: z.infer<typeof courseSchema> = {
  slug: 'b4b8d3e8-8b7c-4e6c-9a2a-4a7d1d8a4a5e', // A unique UUID for the course.
  name: 'Node.js for Beginners',
  description: 'A beginner-friendly course to learn the fundamentals of Node.js and backend development.',
  created: new Date('2024-03-03T00:00:00Z'),
  tags: ['backend', 'typescript'],
  chapters: [
    {
      name: 'Introduction to Node.js',
      lessons: [
        {
          name: 'What is Node.js?',
          theory: `
# What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
          `,
          questions: [
            {
              questionText: 'What is Node.js?',
              body: {
                type: QuestionTypes.OPEN_ENDED,
                arguments: {
                  characterCount: null,
                },
                answer: {
                  evaluationPrompt: 'What is Node.js?',
                },
              },
              solution: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
            },
          ],
        },
      ],
    },
  ],
};
