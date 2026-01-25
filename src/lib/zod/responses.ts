import { z } from 'zod';
import { EvaluationStatus } from '../enum/evaluation-status';
import { QuestionTypes } from '../enum/question-types';
import { codeExecutionLanguages } from '../constants/code-execution-languages';

export const responseBaseSchema = z.object({
  type: z.nativeEnum(QuestionTypes),
});

export const responseMultipleChoiceSchema = responseBaseSchema.extend({
  type: z.literal(QuestionTypes.MULTIPLE_CHOICE),
  body: z.object({
    selectedIndex: z.number({ message: 'Response is required' })
      .int('Response must be an integer')
      .min(0, 'Response cannot be less than 0'),
  }).nullable(),
});

export const responseNumericalSchema = responseBaseSchema.extend({
  type: z.literal(QuestionTypes.NUMERICAL),
  body: z.object({
    submittedNumber: z.number({ message: 'Response is required' }),
  }).nullable(),
});

export const responseCodeExecutionSchema = responseBaseSchema.extend({
  type: z.literal(QuestionTypes.CODE_EXECUTION),
  body: z.object({
    languageSelected: z.number({ message: 'Selected language is required' })
      .int('Selected language must be an integer ID')
      .refine(
        (data) => {
          const allowedLanguageIdList = Object.values(
            codeExecutionLanguages,
          ).map((e) => e.id);
          return allowedLanguageIdList.includes(data);
        },
        { message: 'Languages must be among valid language list' },
      ),
    testCaseOutput: z.array(z.string({ message: 'Test case actual output is required' })).min(
      1,
      'At least one test case output is required',
    ),
    submittedCode: z.string({ message: 'Response is required' }),
  }).nullable(),
});

export const responseOpenEndedSchema = responseBaseSchema.extend({
  type: z.literal(QuestionTypes.OPEN_ENDED),
  body: z.object({
    submittedText: z.string({ message: 'Response is required' }),
  }).nullable(),
});

export const responseAllSchema = z.discriminatedUnion('type', [
  responseMultipleChoiceSchema,
  responseNumericalSchema,
  responseCodeExecutionSchema,
  responseOpenEndedSchema,
]);

export const questionResponseSchema = z.object({
  response: z.array(responseAllSchema),
  evaluation: z.nativeEnum(EvaluationStatus),
});

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