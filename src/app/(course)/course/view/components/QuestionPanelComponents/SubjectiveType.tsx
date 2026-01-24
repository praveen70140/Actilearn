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
        'border-content2 bg-content1 data-[hover=true]:border-secondary',
      input: 'text-base text-white min-h-[150px]',
    }}
  />
);
