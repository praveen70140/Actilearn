'use client';
import { IconBulb } from '@tabler/icons-react';
export const SolutionBox = ({ solution }: { solution?: string }) => {
  if (!solution) return null;
  return (
    <div className="mt-4 p-6 bg-[#2a2a3c] border border-[#313244] rounded-xl flex flex-col gap-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-2 text-primary">
        <IconBulb size={20} />
        <span className="font-bold uppercase text-xs tracking-wider">Solution / Explanation</span>
      </div>
      <p className="text-[#bac2de] text-sm leading-relaxed">{solution}</p>
    </div>
  );
};
