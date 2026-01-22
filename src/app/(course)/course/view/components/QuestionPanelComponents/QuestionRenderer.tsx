'use client';
import { MCQType } from './MCQType';
import { NumericalType } from './NumericalType';
import { SubjectiveType } from './SubjectiveType';
export const QuestionRenderer = ({ question, value, onChange, isDisabled }: any) => {
  const props = { question, value, onChange, isDisabled };
  switch (question.type) {
    case 'mcq': return <MCQType {...props} />;
    case 'numerical': return <NumericalType {...props} />;
    case 'subjective': return <SubjectiveType {...props} />;
    default: return null;
  }
};
