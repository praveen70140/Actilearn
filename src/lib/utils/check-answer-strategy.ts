import z from 'zod';
import { QuestionTypes } from '../enum/question-types';
import {
  responseBaseSchema,
  responseCodeExecutionSchema,
  responseMultipleChoiceSchema,
  responseNumericalSchema,
  responseOpenEndedSchema,
} from '../zod/responses';
import { EvaluationStatus } from '../enum/evaluation-status';
import {
  questionTypeBaseSchema,
  questionTypeCodeExecutionSchema,
  questionTypeMultipleChoiceSchema,
  questionTypeNumericalSchema,
  questionTypeOpenEndedSchema,
} from '../zod/questions';

interface AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseBaseSchema.shape.body>,
    args: z.infer<typeof questionTypeBaseSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeBaseSchema.shape.answer>,
  ): EvaluationStatus;
}

class MultipleChoiceStrategy implements AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseMultipleChoiceSchema.shape.body>,
    args: z.infer<typeof questionTypeMultipleChoiceSchema.shape.arguments>,
    correctAnswer: z.infer<
      typeof questionTypeMultipleChoiceSchema.shape.answer
    >,
  ): EvaluationStatus {
    if (response === null) return EvaluationStatus.SKIPPED;

    return response.selectedIndex === correctAnswer.correctIndex
      ? EvaluationStatus.CORRECT
      : EvaluationStatus.INCORRECT;
  }
}

class NumericalStrategy implements AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseNumericalSchema.shape.body>,
    args: z.infer<typeof questionTypeNumericalSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeNumericalSchema.shape.answer>,
  ): EvaluationStatus {
    if (response === null) return EvaluationStatus.SKIPPED;

    console.log('lol1: ', response);
    console.log('lol2: ', correctAnswer);

    return response.submittedNumber.toFixed(args.precision) ===
      correctAnswer.correctNumber.toFixed(args.precision)
      ? EvaluationStatus.CORRECT
      : EvaluationStatus.INCORRECT;
  }
}

class OpenEndedStrategy implements AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseCodeExecutionSchema.shape.body>,
    args: z.infer<typeof questionTypeCodeExecutionSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeCodeExecutionSchema.shape.answer>,
  ): EvaluationStatus {
    if (response === null) return EvaluationStatus.SKIPPED;

    // For open ended questions, we can check for keywords or just a minimum length.
    // For now, we'll just check for minimum length.
    return response.submittedCode.trim().length > 10
      ? EvaluationStatus.CORRECT
      : EvaluationStatus.INCORRECT;
  }
}

class CodeExecutionStrategy implements AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseOpenEndedSchema.shape.body>,
    args: z.infer<typeof questionTypeOpenEndedSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeOpenEndedSchema.shape.answer>,
  ): EvaluationStatus {
    if (response === null) return EvaluationStatus.SKIPPED;

    // For code execution, we can't actually execute the code here.
    // We'll just check if the answer is not empty.
    return response.submittedText.trim().length > 10
      ? EvaluationStatus.CORRECT
      : EvaluationStatus.INCORRECT;
  }
}

export const answerCheckStrategyMap = new Map<
  QuestionTypes,
  AnswerCheckStrategy
>([
  [QuestionTypes.MULTIPLE_CHOICE, new MultipleChoiceStrategy()],
  [QuestionTypes.NUMERICAL, new NumericalStrategy()],
  [QuestionTypes.OPEN_ENDED, new OpenEndedStrategy()],
  [QuestionTypes.CODE_EXECUTION, new CodeExecutionStrategy()],
]);
