'use client';
import { cn } from '@heroui/react';
import { IconCheck, IconX } from '@tabler/icons-react';
export const FeedbackBanner = ({ feedback }: any) => {
  if (!feedback) return null;
  const isCorrect = feedback.status === 'correct';
  return (
    <div className={cn(
      "p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2",
      isCorrect ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
    )}>
      {isCorrect ? <IconCheck size={20} /> : <IconX size={20} />}
      <span className="text-sm font-semibold">{feedback.message}</span>
    </div>
  );
};
