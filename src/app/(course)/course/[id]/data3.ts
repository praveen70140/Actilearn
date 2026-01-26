/**
 * This file contains the seed data for the "Physics 101" course.
 * The data is structured according to the `courseSchema` defined in the Zod validation library.
 * This course is designed to test the "High School" category.
 */

import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
import { z } from 'zod';

// The seed data for the "Physics 101" course.
export const seedCourseData3: z.infer<typeof courseSchema> = {
  slug: 'a2a8d3e8-8b7c-4e6c-9a2a-4a7d1d8a4a5e', // A unique UUID for the course.
  name: 'Physics 101',
  description: 'An introductory course to the fundamental concepts of physics.',
  created: new Date('2024-03-01T00:00:00Z'),
  tags: ['physics', '11th'],
  chapters: [
    {
      name: 'Introduction to Mechanics',
      lessons: [
        {
          name: 'Newtons Laws of Motion',
          theory: `
# Newton's Laws of Motion
These three laws are the foundation of classical mechanics.

### First Law
An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.

### Second Law
The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.

### Third Law
For every action, there is an equal and opposite reaction.
          `,
          questions: [
            {
              questionText: 'What is another name for the first law of motion?',
              body: {
                type: QuestionTypes.MULTIPLE_CHOICE,
                arguments: {
                  options: ['Law of Inertia', 'Law of Acceleration', 'Law of Action-Reaction', 'Law of Gravity'],
                },
                answer: { correctIndex: 0 },
              },
              solution: 'The first law of motion is also known as the Law of Inertia.',
            },
          ],
        },
      ],
    },
  ],
};
