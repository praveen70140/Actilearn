import {
  array,
  discriminatedUnion,
  literal,
  looseObject,
  number,
  object,
  string,
  uuid,
  preprocess,
} from 'zod';
import { nativeEnum } from 'zod/v3';
import { QuestionTypes } from '../enum/question-types';
import { codeExecutionLanguages } from '../constants/code-execution-languages';
import { EvaluationStatus } from '../enum/evaluation-status';

export const responseBaseSchema = object({
  type: nativeEnum(QuestionTypes),
});

export const responseMultipleChoiceSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.MULTIPLE_CHOICE),
  body: object({
    selectedIndex: number('Response is required')
      .int('Response must be an integer')
      .min(0, 'Response cannot be less than 0'),
  }).nullable(),
});

export const responseNumericalSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.NUMERICAL),
  body: object({
    submittedNumber: number('Response is required'),
  }).nullable(),
});

export const responseCodeExecutionSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.CODE_EXECUTION),
  body: object({
    languageSelected: number('Selected language is required')
      .int('Selected language must be an integer ID')
      .refine(
        (data) => {
          const allowedLanguageIdList = Object.values(
            codeExecutionLanguages,
          ).map((e) => e.id);
          return allowedLanguageIdList.includes(data);
        },
        { error: 'Languages must be among valid language list' },
      ),
    testCaseOutput: array(string('Test case actual output is required')).min(
      1,
      'At least one test case output is required',
    ),
    submittedCode: string('Response is required'),
  }).nullable(),
});

export const responseOpenEndedSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.OPEN_ENDED),
  body: object({
    submittedText: string('Response is required'),
  }).nullable(),
});

export const responseAllSchema = discriminatedUnion('type', [
  responseMultipleChoiceSchema,
  responseNumericalSchema,
  responseCodeExecutionSchema,
  responseOpenEndedSchema,
]);

export const questionResponseSchema = object({
  response: array(responseAllSchema),
  evaluation: nativeEnum(EvaluationStatus),
});

export const responseDocumentSchema = object({
  _id: preprocess((val) => val?.toString(), string()),
  user: preprocess((val) => val?.toString(), uuid('User ID is required')),
  course: preprocess((val) => val?.toString(), string()),
  chapters: array(
    object({
      lessons: array(
        object({
          questions: array(questionResponseSchema),
        }),
      ),
    }),
  ),
});
