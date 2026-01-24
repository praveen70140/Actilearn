'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { AiCourseProvider } from '@/context/AiCourseContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider locale="en-IN" navigate={router.push}>
      <ToastProvider toastOffset={50} placement="top-center" />
      <AiCourseProvider>{children}</AiCourseProvider>
    </HeroUIProvider>
  );
}
