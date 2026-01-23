import { QuestionTypes } from "./enum/question-types";

interface AnswerCheckStrategy {
  check(answer: string, correctAnswer: any): boolean;
}

class MultipleChoiceStrategy implements AnswerCheckStrategy {
  check(answer: string, correctAnswer: any): boolean {
    return parseInt(answer) === correctAnswer;
  }
}

class NumericalStrategy implements AnswerCheckStrategy {
  check(answer: string, correctAnswer: any): boolean {
    return parseFloat(answer) === correctAnswer;
  }
}

class OpenEndedStrategy implements AnswerCheckStrategy {
  check(answer: string, correctAnswer: any): boolean {
    // For open ended questions, we can check for keywords or just a minimum length.
    // For now, we'll just check for minimum length.
    return answer.trim().length > 10;
  }
}

class CodeExecutionStrategy implements AnswerCheckStrategy {
    check(answer: string, correctAnswer: any): boolean {
        // For code execution, we can't actually execute the code here.
        // We'll just check if the answer is not empty.
        return answer.trim().length > 10;
    }
}

export const answerCheckStrategyMap = new Map<QuestionTypes, AnswerCheckStrategy>([
  [QuestionTypes.MULTIPLE_CHOICE, new MultipleChoiceStrategy()],
  [QuestionTypes.NUMERICAL, new NumericalStrategy()],
  [QuestionTypes.OPEN_ENDED, new OpenEndedStrategy()],
  [QuestionTypes.CODE_EXECUTION, new CodeExecutionStrategy()],
]);
