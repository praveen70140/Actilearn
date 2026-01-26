/**
 * This file contains the seed data for the "Advanced CSS" course.
 */

import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';

// The seed data for the "Advanced CSS" course.
export const seedCourseData4: z.infer<typeof courseSchema> = {
  slug: 'a3a8d3e8-8b7c-4e6c-9a2a-4a7d1d8a4a5e', // A unique UUID for the course.
  name: 'Advanced CSS',
  description: 'A course on advanced CSS topics like Flexbox, Grid, and animations.',
  created: new Date('2024-03-02T00:00:00Z'),
  tags: ['react', 'typescript'],
  chapters: [
    {
      name: 'Flexbox and Grid',
      lessons: [
        {
          name: 'CSS Flexbox',
          theory: `
# CSS Flexbox
Flexbox is a one-dimensional layout model that allows you to create complex layouts with ease.
          `,
          questions: [
            {
              questionText: 'What is the main purpose of Flexbox?',
              body: {
                type: QuestionTypes.OPEN_ENDED,
                arguments: {
                  characterCount: null,
                },
                answer: {
                  evaluationPrompt: 'What is the main purpose of Flexbox?',
                },
              },
              solution: 'The main purpose of Flexbox is to create one-dimensional layouts.',
            },
          ],
        },
      ],
    },
  ],
};
