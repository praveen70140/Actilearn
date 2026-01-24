'use client';
import { Input } from '@heroui/react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const NumericalType = ({ value, onChange, isDisabled }: Props) => (
  <Input
    type="number"
    variant="bordered"
    placeholder="Enter your numeric answer..."
    value={value}
    onValueChange={onChange}
    isDisabled={isDisabled}
    classNames={{
      inputWrapper:
        'h-14 border-content2 bg-content1 data-[hover=true]:border-secondary',
      input: 'text-base text-foreground',
    }}
  />
);
