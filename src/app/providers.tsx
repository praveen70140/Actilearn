'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider locale="en-IN" navigate={router.push}>
      <ToastProvider toastOffset={50} placement="top-center" />
      {children}
    </HeroUIProvider>
  );
}
