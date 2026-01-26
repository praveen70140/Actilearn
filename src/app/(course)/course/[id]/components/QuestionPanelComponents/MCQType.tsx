'use client';
import { RadioGroup, Radio, cn } from '@heroui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { responseMultipleChoiceSchema } from '@/lib/zod/responses';
import z from 'zod';
import { MultipleChoiceQuestion } from '../../CourseViewer';

interface Props {
  question: MultipleChoiceQuestion;
  isDisabled: boolean;
}

export const MCQType = ({ question, isDisabled }: Props) => {
  const { options } = question.body.arguments;

  const {
    control,
    watch,
    formState: { disabled },
  } = useFormContext<z.infer<typeof responseMultipleChoiceSchema>>();

  return (
    <Controller
      control={control}
      name="body.selectedIndex"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid, error },
      }) => (
        <RadioGroup
          value={`${value}`}
          onChange={(e) => onChange(+e.target.value)}
          isDisabled={isDisabled}
          errorMessage={error?.message}
          validationBehavior="aria"
          isInvalid={invalid}
          onBlur={onBlur}
          classNames={{ wrapper: 'gap-4' }}
        >
          <p>{value}</p>
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
      )}
    />
  );
};
