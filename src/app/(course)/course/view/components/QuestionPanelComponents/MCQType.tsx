'use client';
import { RadioGroup, Radio, cn } from '@heroui/react';
export const MCQType = ({ question, value, onChange, isDisabled }: any) => (
  <RadioGroup
    value={value}
    onValueChange={onChange}
    isDisabled={isDisabled}
    classNames={{ wrapper: "gap-4" }}
  >
    {question.options?.map((opt: string, idx: number) => (
      <Radio
        key={idx}
        value={idx.toString()}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-[#2a2a3c] hover:bg-[#313244] items-center justify-between",
            "flex-row-reverse cursor-pointer rounded-xl gap-4 p-4 border-2 border-transparent",
            "max-w-full w-full transition-all",
            "data-[selected=true]:border-primary data-[selected=true]:bg-[#313244]"
          ),
          label: "text-[#bac2de] text-base",
        }}
      >
        {opt}
      </Radio>
    ))}
  </RadioGroup>
);
