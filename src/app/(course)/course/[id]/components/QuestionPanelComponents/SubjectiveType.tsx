'use client';
import { responseOpenEndedSchema } from '@/lib/zod/responses';
import { Textarea } from '@heroui/react';
import { Controller, useFormContext } from 'react-hook-form';
import z from 'zod';

interface SubjectiveTypeProps {
  isDisabled: boolean;
}

export const SubjectiveType = ({ isDisabled }: SubjectiveTypeProps) => {
  const {
    control,
    watch,
    formState: { disabled },
  } = useFormContext<z.infer<typeof responseOpenEndedSchema>>();

  return (
    <Controller
      control={control}
      name={'body.submittedText'}
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid, error },
      }) => (
        <Textarea
          variant="bordered"
          placeholder="Write your explanation here..."
          value={value}
          onValueChange={onChange}
          isDisabled={isDisabled}
          classNames={{
            inputWrapper:
              'border-content2 bg-content1 data-[hover=true]:border-secondary',
            input: 'text-base text-white min-h-[150px]',
          }}
        />
      )}
    />
  );
};
