'use client';
import { CodingType } from './CodingType';
import { MCQType } from './MCQType';
import { NumericalType } from './NumericalType';
import { SubjectiveType } from './SubjectiveType';
import { QuestionType } from '@/app/(course)/course/view/page';
import { QuestionTypes } from '@/lib/enum/question-types';

interface QuestionRendererProps {
  question: QuestionType;
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
  const props = { question, value, onChange, isDisabled };
  switch (question.body.type) {
    case QuestionTypes.MULTIPLE_CHOICE:
      return <MCQType {...props} />;
    case QuestionTypes.NUMERICAL:
      return <NumericalType {...props} />;
    case QuestionTypes.OPEN_ENDED:
      return <SubjectiveType {...props} />;
    case QuestionTypes.CODE_EXECUTION:
      return <CodingType {...props} onCheck={onCheck || (() => {})} />;
    default:
      return null;
  }
};
