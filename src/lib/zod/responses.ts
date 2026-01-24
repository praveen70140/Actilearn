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
import { QuestionTypes } from '../enum/question-types';
import { codeExecutionLanguages } from '../constants/code-execution-languages';

export const responseBaseSchema = looseObject({
  type: nativeEnum(QuestionTypes),
  body: looseObject({}),
});

export const responseMultipleChoiceSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.MULTIPLE_CHOICE),
  body: object({
    selectedIndex: number('Response is required')
      .int('Response must be an integer')
      .min(0, 'Response cannot be less than 0'),
  }),
});

export const responseNumericalSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.NUMERICAL),
  body: object({
    submittedNumber: number('Response is required'),
  }),
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
  }),
});

export const responseOpenEndedSchema = responseBaseSchema.extend({
  type: literal(QuestionTypes.OPEN_ENDED),
  body: object({
    submittedText: string('Response is required'),
  }),
});

export const responseAllSchema = discriminatedUnion('type', [
  responseMultipleChoiceSchema,
  responseNumericalSchema,
  responseCodeExecutionSchema,
  responseOpenEndedSchema,
]);
