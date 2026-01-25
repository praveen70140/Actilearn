'use client';
import { IconBulb } from '@tabler/icons-react';

interface SolutionBoxProps {
  solution?: string | null;
}

export const SolutionBox = ({ solution }: SolutionBoxProps) => {
  if (!solution) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 bg-primary-50 mt-4 flex flex-col gap-3 rounded-xl p-6">
      <div className="text-primary flex items-center gap-2">
        <IconBulb size={20} />
        <span className="text-base font-bold tracking-wider">
          Solution / Explanation
        </span>
      </div>
      <p className="text-base leading-relaxed">{solution}</p>
    </div>
  );
};
