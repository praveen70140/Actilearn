'use client';

import { Alert } from '@heroui/react'; // Import Alert component
import { IconTrophy } from '@tabler/icons-react'; // Import Trophy icon

export function PodiumBanner() {
  return (
    <Alert
      color={'warning'} // Set color to warning
      description={"You're in the podium!"} // Set the message
      icon={<IconTrophy />} // Use IconTrophy as the podium icon
      // You can add additional classNames here if needed, similar to FeedbackBanner
      className="rounded-xl border border-[#313244] bg-[#313244]/50 p-4 text-center"
    />
  );
}
