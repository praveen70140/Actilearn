'use client';
import { IconBulb } from '@tabler/icons-react';

interface SolutionBoxProps {
  solution?: string | null;
}

export const SolutionBox = ({ solution }: SolutionBoxProps) => {
  if (!solution) return null;

  const { explanation } = JSON.parse(solution);

  return (
    <div className="mt-4 p-6 bg-[#2a2a3c] border border-[#313244] rounded-xl flex flex-col gap-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-2 text-primary">
        <IconBulb size={20} />
        <span className="font-bold uppercase text-xs tracking-wider">
          Solution / Explanation
        </span>
      </div>
      <p className="text-[#bac2de] text-sm leading-relaxed">{explanation}</p>
    </div>
  );
};
