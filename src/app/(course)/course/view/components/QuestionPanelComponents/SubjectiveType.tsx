'use client';
import { Textarea } from '@heroui/react';

interface SubjectiveTypeProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const SubjectiveType = ({
  value,
  onChange,
  isDisabled,
}: SubjectiveTypeProps) => (
  <Textarea
    variant="bordered"
    placeholder="Write your explanation here..."
    value={value}
    onValueChange={onChange}
    isDisabled={isDisabled}
    classNames={{
      inputWrapper:
        'border-[#313244] bg-[#2a2a3c] data-[hover=true]:border-primary',
      input: 'text-base text-white min-h-[150px]',
    }}
  />
);
