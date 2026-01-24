import {
  array,
  discriminatedUnion,
  literal,
  looseObject,
  number,
  object,
  string,
} from 'zod';
import { QuestionTypes } from '../enum/question-types';
import { codeExecutionLanguages } from '../constants/code-execution-languages';
import { nativeEnum } from 'zod/v3';

const MIN_OPTIONS_COUNT = 2;

// Every question type schema is composed of 'type', 'arguments' and 'answer'
//
// 'arguments' and 'answer' are composed of nested objects that are
// defined as per nature of the corresponding question type

export const questionTypeBaseSchema = object({
  type: nativeEnum(QuestionTypes),
  arguments: looseObject({}),
  answer: looseObject({}),
});

export const questionTypeMultipleChoiceSchema = questionTypeBaseSchema
  .extend({
    type: literal(QuestionTypes.MULTIPLE_CHOICE),
    arguments: object({
      options: array(string(), { error: 'Options are required' }).min(
        MIN_OPTIONS_COUNT,
        `At least ${MIN_OPTIONS_COUNT} options are required`,
      ),
    }),
    answer: object({ correctIndex: number('Correct index is required') }),
  })
  .refine(
    (data) => data.arguments.options.at(data.answer.correctIndex) !== undefined,
    {
      error: 'Answer must be one of the options',
    },
  );

export const questionTypeNumericalSchema = questionTypeBaseSchema.extend({
  type: literal(QuestionTypes.NUMERICAL),
  arguments: object({
    precision: number('Precision is required')
      .int('Precision must be an integer')
      .min(0, 'Precision cannot be less than zero'),
  }),
  answer: object({ correctNumber: number('Correct number is required') }),
});

export const questionTypeCodeExecutionSchema = questionTypeBaseSchema.extend({
  type: literal(QuestionTypes.CODE_EXECUTION),
  arguments: object({
    languages: array(number().int(), {
      error: 'Programming languages are required',
    })
      .min(1, 'At least one programming language is required')
      .refine(
        (data) => {
          const allowedLanguageIdList = Object.values(
            codeExecutionLanguages,
          ).map((e) => e.id);
          return data.every((val) => allowedLanguageIdList.includes(val));
        },
        { error: 'Languages must be among valid' },
      ),
    initialCode: string()
      .min(1, 'Initial code must be described if defined')
      .nullable(),
  }),
  answer: object({
    testCases: array(
      object({
        input: string('Input is required').nullable(),
        expectedOutput: string('Expected output is required'),
      }),
      { error: 'Test cases are required' },
    ).min(1, 'At least one test case is required'),
  }),
});

export const questionTypeOpenEndedSchema = questionTypeBaseSchema.extend({
  type: literal(QuestionTypes.OPEN_ENDED),
  arguments: object({
    characterCount: number()
      .min(0, 'Character count cannot be less than zero')
      .nullable(),
  }),
  answer: object({ evaluationPrompt: string('Evaluation prompt is required') }),
});

export const questionTypeAllSchema = discriminatedUnion('type', [
  questionTypeMultipleChoiceSchema,
  questionTypeNumericalSchema,
  questionTypeCodeExecutionSchema,
  questionTypeOpenEndedSchema,
]);
