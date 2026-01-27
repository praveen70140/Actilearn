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
import { GoogleGenerativeAI } from '@google/generative-ai';
import { runTestCases } from '@/actions/code/run-test-cases';

// We are using the Gemini API to evaluate open-ended questions.
// The model being used is 'gemini-1.5-flash', which is also used in other parts of the application (e.g., course generation).
// A new GoogleGenerativeAI client is instantiated here.
// It requires the GEMINI_API_KEY to be set in the environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * @interface AnswerCheckStrategy
 * @description Defines the interface for different answer checking strategies.
 * The `check` method is asynchronous to accommodate potential I/O operations,
 * such as calling an AI model for evaluation.
 */
interface AnswerCheckStrategy {
  check(
    response: z.infer<typeof responseBaseSchema.shape.body>,
    args: z.infer<typeof questionTypeBaseSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeBaseSchema.shape.answer>,
  ): Promise<{ evaluation: EvaluationStatus; result?: any }>;
}

/**
 * @class MultipleChoiceStrategy
 * @description Strategy for checking multiple-choice questions.
 * It compares the selected index from the user's response with the correct index.
 */
class MultipleChoiceStrategy implements AnswerCheckStrategy {
  async check(
    response: z.infer<typeof responseMultipleChoiceSchema.shape.body>,
    args: z.infer<typeof questionTypeMultipleChoiceSchema.shape.arguments>,
    correctAnswer: z.infer<
      typeof questionTypeMultipleChoiceSchema.shape.answer
    >,
  ): Promise<{ evaluation: EvaluationStatus; result: null }> {
    // If the response is null, the user skipped the question.
    if (response === null)
      return { evaluation: EvaluationStatus.SKIPPED, result: null };

    // Check if the selected index matches the correct index.
    return {
      result: null,
      evaluation:
        response.selectedIndex === correctAnswer.correctIndex
          ? EvaluationStatus.CORRECT
          : EvaluationStatus.INCORRECT,
    };
  }
}

/**
 * @class NumericalStrategy
 * @description Strategy for checking numerical questions.
 * It compares the user's submitted number with the correct number, up to a specified precision.
 */
class NumericalStrategy implements AnswerCheckStrategy {
  async check(
    response: z.infer<typeof responseNumericalSchema.shape.body>,
    args: z.infer<typeof questionTypeNumericalSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeNumericalSchema.shape.answer>,
  ): Promise<{ evaluation: EvaluationStatus; result: null }> {
    // If the response is null, the user skipped the question.
    if (response === null)
      return { evaluation: EvaluationStatus.SKIPPED, result: null };

    // Compare the numbers after formatting them to the required precision.
    return {
      evaluation:
        response.submittedNumber.toFixed(args.precision) ===
        correctAnswer.correctNumber.toFixed(args.precision)
          ? EvaluationStatus.CORRECT
          : EvaluationStatus.INCORRECT,
      result: null,
    };
  }
}

/**
 * @class OpenEndedStrategy
 * @description Strategy for checking open-ended questions using an AI model.
 * This strategy sends the question and the user's answer to the Gemini API for evaluation.
 */
class OpenEndedStrategy implements AnswerCheckStrategy {
  async check(
    response: z.infer<typeof responseOpenEndedSchema.shape.body>,
    args: z.infer<typeof questionTypeOpenEndedSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeOpenEndedSchema.shape.answer>,
  ): Promise<{ evaluation: EvaluationStatus; result: null }> {
    // If the response is null, the user skipped the question.
    if (response === null)
      return { evaluation: EvaluationStatus.SKIPPED, result: null };

    // The user wants to use Gemini to evaluate the answer.
    // Initialize the Gemini model. We use 'gemini-1.5-flash' for this task.
    const model = genAI.getGenerativeModel({ model: 'models/gemma-3-27b-it' });

    // The `correctAnswer` for an open-ended question includes the question text.
    // This is used to provide context to the AI model.
    const prompt = `
      You are an AI assistant tasked with evaluating a user's answer to a question.
      Your evaluation should be based on the conceptual correctness of the answer.
      The answer does not need to be a verbatim match to any specific solution, but it must correctly address the question.

      The question is: "${correctAnswer.evaluationPrompt}"
      The user's answer is: "${response.submittedText}"
      
      Please evaluate if the user's answer is correct.
      
      Respond with only one of the following two words: "CORRECT" or "INCORRECT".
      Do not provide any additional explanation or commentary.
    `;

    try {
      // Generate content using the AI model with the constructed prompt.
      const result = await model.generateContent(prompt);
      // Process the AI's response.
      const aiResponse = result?.response.text().trim().toUpperCase();

      // For debugging purposes, log the raw response from the AI.
      console.log('Raw AI Response for Open-Ended Evaluation:', aiResponse);

      // Return the evaluation status based on the AI's response.
      if (aiResponse === 'CORRECT') {
        return { evaluation: EvaluationStatus.CORRECT, result: null };
      } else {
        return { evaluation: EvaluationStatus.INCORRECT, result: null };
      }
    } catch (error) {
      // If there is an error with the AI evaluation, log the error.
      console.error('Error evaluating open ended answer with AI:', error);
      // If the AI evaluation fails, we mark the response as PENDING.
      // This indicates that the evaluation could not be completed and may need to be retried.
      return { evaluation: EvaluationStatus.PENDING, result: null };
    }
  }
}

/**
 * @class CodeExecutionStrategy
 * @description Strategy for checking code execution questions.
 * Currently, this is a placeholder and does not execute code.
 * It performs a basic check to see if the submitted code is not empty.
 */
class CodeExecutionStrategy implements AnswerCheckStrategy {
  async check(
    response: z.infer<typeof responseCodeExecutionSchema.shape.body>,
    args: z.infer<typeof questionTypeCodeExecutionSchema.shape.arguments>,
    correctAnswer: z.infer<typeof questionTypeCodeExecutionSchema.shape.answer>,
  ): Promise<{ evaluation: EvaluationStatus; result: any | null }> {
    // If the response is null, the user skipped the question.
    if (response === null)
      return { evaluation: EvaluationStatus.PENDING, result: null };

    // This is a placeholder check. In a real scenario, this would involve
    // a more complex process of running the code and checking the output.
    // For now, we just check if the code is longer than 10 characters.
    const testCaseResult = await runTestCases(response, args, correctAnswer);

    if (testCaseResult.success) {
      return {
        result: testCaseResult.data.submissions,
        evaluation: testCaseResult.data?.evaluation,
      };
    } else return { evaluation: EvaluationStatus.PENDING, result: null };
  }
}

/**
 * @description A map that associates question types with their corresponding checking strategies.
 * This allows for easy retrieval of the correct strategy for a given question type.
 */
export const answerCheckStrategyMap = new Map<
  QuestionTypes,
  AnswerCheckStrategy
>([
  [QuestionTypes.MULTIPLE_CHOICE, new MultipleChoiceStrategy()],
  [QuestionTypes.NUMERICAL, new NumericalStrategy()],
  [QuestionTypes.OPEN_ENDED, new OpenEndedStrategy()],
  [QuestionTypes.CODE_EXECUTION, new CodeExecutionStrategy()],
]);
