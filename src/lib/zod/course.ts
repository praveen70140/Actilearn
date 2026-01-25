import z, { array, date, json, object, string, uuid } from 'zod';
import { questionTypeAllSchema } from './questions';

const MIN_NAME_CHAR_COUNT = 10;
const MIN_TAG_CHAR_COUNT = 3;

export const questionSchema = object({
  questionText: string('Question text is required'),
  // Question body must be any one of the schemas of the
  // predetermined question types
  body: questionTypeAllSchema,
  solution: string('Solution is required'),
});

export const courseSchema = object({
  name: string('Course name is required').min(
    MIN_NAME_CHAR_COUNT,
    `Course name must be at least ${MIN_NAME_CHAR_COUNT} characters long`,
  ),
  slug: uuid('Slug is required').default(() => crypto.randomUUID()),
  description: string('Course description is required'),
  //  Creator is not included as it will be inferred from the user account associated with the uploader
  created: date('Date is required'),
  tags: array(
    string('Tag name is required').min(
      MIN_TAG_CHAR_COUNT,
      `Tag name must be at least ${MIN_TAG_CHAR_COUNT} characters long`,
    ),
    { error: 'Tag array is required to be defined' },
  ),
  chapters: array(
    object({
      name: string('Chapter name is required'),
      lessons: array(
        object({
          name: string('Lesson name is required'),
          theory: string('Lesson theory text is required'),
          questions: array(
            questionSchema,
            // Questions can be null but cannot be an empty array
            { error: 'Questions are required to be defined' },
          )
            .min(1, 'At least one question is required to be defined')
            .nullable(),
        }),
        { error: 'Lessons are required' },
      ).min(1, 'At least one lesson is required'),
    }),
    { error: 'Chapters are required' },
  ).min(1, 'At least one chapter is required'),
});
