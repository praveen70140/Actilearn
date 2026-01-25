import { z } from 'zod';
import { EvaluationStatus } from '../enum/evaluation-status';

// 1. Individual Question Response Schema
export const questionResponseSchema = z.object({
  // Use z.any() to allow strings ("2"), numbers (2), or objects
  response: z.array(z.any()),
  evaluation: z.nativeEnum(EvaluationStatus),
});

// 2. Main Response Document Schema
export const responseDocumentSchema = z.object({
  _id: z.preprocess((val) => val?.toString(), z.string()),
  user: z.preprocess((val) => val?.toString(), z.string()),
  course: z.preprocess((val) => val?.toString(), z.string()),
  chapters: z.array(
    z.object({
      lessons: z.array(
        z.object({
          questions: z.array(questionResponseSchema),
        }),
      ),
    }),
  ).default([]),
});
