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
          name: string(),
          theory: string(),
          questions: array(questionSchema).nullable(),
        })
      ),
    })
  ),
})
  .passthrough()
  .transform((data: any) => ({
    ...data,
    id: data.slug?.toString() ?? data.id?.toString(),
  }));
