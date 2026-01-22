import { array, date, json, object, string, uuid } from 'zod';
import { nativeEnum } from 'zod/v3';
import { QuestionTypes } from '../enum/question-types';

const MIN_NAME_CHAR_COUNT = 10;

export const courseSchema = object({
  id: uuid('Course ID is required'),
  name: string('Course name is required').min(
    MIN_NAME_CHAR_COUNT,
    `Course name must be at least ${MIN_NAME_CHAR_COUNT} characters long`,
  ),
  description: string('Course description is required'),
  //  Creator is not included as it will be inferred from the user account associated with the uploader
  created: date('Date is required'),
  chapters: array(
    object({
      name: string('Chapter name is required'),
      lessons: array(
        object({
          name: string('Lesson name is required'),
          theory: string('Lesson theory text is required'),
          questions: array(
            object({
              questionType: nativeEnum(QuestionTypes, {
                required_error: 'Question type is required',
                invalid_type_error: 'Invalid question type',
              }),
              questionText: string('Question text is required'),
              // Arguments and answers are arbitrary fields defined as per question type
              argument: json('Question arguments are required'),
              answer: json('Answer is required'),
              solution: json('Solution is required'),
            }),
            // Questions can be null but cannot be an empty array
          )
            .min(1, 'At least one question is required to be defined')
            .nullable(),
        }),
      ).min(1, 'At least one lesson is required'),
    }),
  ).min(1, 'At least one chapter is required'),
});
