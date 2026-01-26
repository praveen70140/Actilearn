'use client';
import { Alert, cn } from '@heroui/react';
import { Icon123, IconCheck, IconX } from '@tabler/icons-react';

interface FeedbackBannerProps {
  feedback: {
    status: 'correct' | 'incorrect';
    message: string;
  } | null;
}

export const FeedbackBanner = ({ feedback }: FeedbackBannerProps) => {
  if (!feedback) return null;
  const isCorrect = feedback.status === 'correct';
  return (
    <Alert
      variant="bordered"
      description={feedback.message}
      classNames={{ alertIcon: 'fill-none' }}
      icon={isCorrect ? <IconCheck /> : <IconX />}
      color={isCorrect ? 'success' : 'danger'}
    />
  );
};
