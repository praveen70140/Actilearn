'use client';
import { responseNumericalSchema } from '@/lib/zod/responses';
import { Input } from '@heroui/react';
import { Controller, useFormContext } from 'react-hook-form';
import z from 'zod';

interface Props {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const NumericalType = ({ onChange, isDisabled }: Props) => {
  const {
    control,
    watch,
    formState: { disabled },
  } = useFormContext<z.infer<typeof responseNumericalSchema>>();

  return (
    <Controller
      control={control}
      name={'body.submittedNumber'}
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid, error },
      }) => (
        <Input
          type="number"
          variant="bordered"
          placeholder="Enter your numeric answer..."
          value={`${value}`}
          onValueChange={onChange}
          isDisabled={isDisabled}
          classNames={{
            inputWrapper:
              'h-14 border-content2 bg-content1 data-[hover=true]:border-secondary',
            input: 'text-base text-foreground',
          }}
        />
      )}
    />
  );
};
