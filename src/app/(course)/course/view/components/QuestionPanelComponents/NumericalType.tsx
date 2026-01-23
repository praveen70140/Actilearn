'use client';
import { Input } from '@heroui/react';

interface NumericalTypeProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const NumericalType = ({
  value,
  onChange,
  isDisabled,
}: NumericalTypeProps) => (
  <Input
    type="number"
    variant="bordered"
    placeholder="Enter your numeric answer..."
    value={value}
    onValueChange={onChange}
    isDisabled={isDisabled}
    classNames={{
      inputWrapper:
        'h-14 border-[#313244] bg-[#2a2a3c] data-[hover=true]:border-primary',
      input: 'text-lg text-white',
    }}
  />
);
