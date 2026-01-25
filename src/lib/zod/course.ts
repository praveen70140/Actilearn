import { array, date, object, string, preprocess } from 'zod';
import { questionTypeAllSchema } from './questions';

export const questionSchema = object({
  questionText: string(),
  body: questionTypeAllSchema,
  solution: string(),
});

export const courseSchema = object({
  _id: preprocess((val) => val?.toString(), string()),
  id: preprocess((val) => val?.toString(), string()), // Accept UUID string
  name: string(),
  description: string(),
  created: preprocess((val) => val && new Date(val as any), date()),
  tags: array(string()),
  chapters: array(
    object({
      name: string(),
      lessons: array(
        object({
          name: string({ required_error: 'Lesson name is required' }),
          theory: string({ required_error: 'Lesson theory text is required' }),
          questions: array(questionSchema, {
            required_error: 'Questions are required to be defined',
          })
            .min(1, 'At least one question is required to be defined')
            .nullable(),
        }),
        { required_error: 'Lessons are required' },
      ).min(1, 'At least one lesson is required'),
    }),
    { required_error: 'Chapters are required' },
  ).min(1, 'At least one chapter is required'),
})
  .passthrough()
  .transform((data: any) => ({
    ...data,
    id: data.slug?.toString() ?? data.id?.toString(),
    _id: data._id?.toString(),
  }));