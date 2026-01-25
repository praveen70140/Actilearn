'use client';
import z from 'zod';
import { CodingType } from './CodingType';
import { MCQType } from './MCQType';
import { NumericalType } from './NumericalType';
import { SubjectiveType } from './SubjectiveType';
import { QuestionTypes } from '@/lib/enum/question-types';
import { questionSchema } from '@/lib/zod/course';
import {
  CodeExecutionQuestion,
  MultipleChoiceQuestion,
} from '../../CourseViewer';

interface QuestionRendererProps {
  question: z.infer<typeof questionSchema>;
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
  onCheck?: () => void;
}

export const QuestionRenderer = ({
  question,
  value,
  onChange,
  isDisabled,
  onCheck,
}: QuestionRendererProps) => {
  const props = { value, onChange, isDisabled };
  switch (question.body.type) {
    case QuestionTypes.MULTIPLE_CHOICE:
      return (
        <MCQType {...props} question={question as MultipleChoiceQuestion} />
      );
    case QuestionTypes.NUMERICAL:
      return <NumericalType {...props} />;
    case QuestionTypes.OPEN_ENDED:
      return <SubjectiveType {...props} />;
    case QuestionTypes.CODE_EXECUTION:
      return (
        <CodingType {...props} question={question as CodeExecutionQuestion} />
      );
    default:
      return null;
  }
};
