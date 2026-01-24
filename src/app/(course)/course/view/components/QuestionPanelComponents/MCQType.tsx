'use client';
import { RadioGroup, Radio, cn } from '@heroui/react';
import { MultipleChoiceQuestion } from '../../page';

interface Props {
  question: MultipleChoiceQuestion;
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const MCQType = ({ question, value, onChange, isDisabled }: Props) => {
  const { options } = question.body.arguments;

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      isDisabled={isDisabled}
      classNames={{ wrapper: 'gap-4' }}
    >
      {options?.map((opt: string, idx: number) => (
        <Radio
          key={idx}
          value={idx.toString()}
          classNames={{
            base: cn(
              'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
              'flex-row-reverse cursor-pointer rounded-xl gap-4 p-4 border-2 border-transparent',
              'max-w-full w-full transition-all',
              'data-[selected=true]:border-secondary data-[selected=true]:bg-secondary-50',
            ),
            label: 'text-foreground text-base',
          }}
        >
          {opt}
        </Radio>
      ))}
    </RadioGroup>
  );
};
