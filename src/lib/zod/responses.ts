import { QuestionTypes } from '../enum/question-types';
import { codeExecutionLanguages } from '../constants/code-execution-languages';
import {
  array,
  discriminatedUnion,
  literal,
  looseObject,
  number,
  object,
  string,
} from 'zod';
import { nativeEnum } from 'zod/v3';

export const responseBaseSchema = object({
  type: nativeEnum(QuestionTypes),
  body: looseObject({}).nullable(),
});

export const responseMultipleChoiceSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.MULTIPLE_CHOICE),
  body: object({
    selectedIndex: number({ message: 'Response is required' })
      .int('Response must be an integer')
      .min(0, 'Response cannot be less than 0'),
  }).nullable(),
});

export const responseNumericalSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.NUMERICAL),
  body: object({
    submittedNumber: number({ message: 'Response is required' }),
  }).nullable(),
});

export const responseCodeExecutionSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.CODE_EXECUTION),
  body: object({
    languageSelected: number({ message: 'Selected language is required' })
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
    testCaseOutput: array(
      string({ message: 'Test case actual output is required' }),
    ).min(1, 'At least one test case output is required'),
    submittedCode: string({ message: 'Response is required' }),
  }).nullable(),
});

export const responseOpenEndedSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.OPEN_ENDED),
  body: object({
    submittedText: string({ message: 'Response is required' }),
  }).nullable(),
});

export const responseAllSchema = discriminatedUnion('type', [
  responseMultipleChoiceSchema,
  responseNumericalSchema,
  responseCodeExecutionSchema,
  responseOpenEndedSchema,
]);

// export const questionResponseSchema = z.object({
//   response: z.array(responseAllSchema),
//   evaluation: z.nativeEnum(EvaluationStatus),
// });

// export const responseDocumentSchema = z.object({
//   _id: z.preprocess((val) => val?.toString(), z.string()),
//   user: z.preprocess((val) => val?.toString(), z.string()),
//   course: z.preprocess((val) => val?.toString(), z.string()),
//   chapters: z.array(
//     z.object({
//       lessons: z.array(
//         z.object({
//           questions: z.array(questionResponseSchema),
//         }),
//       ),
//     }),
//   ).default([]),
// });
