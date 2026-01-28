'use client';

import DashboardNavbar from '@/components/dashboard-navbar';
import React from 'react';
import { usePathname } from 'next/navigation';

const TeacherDashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const hideNavbar = pathname === '/teacher-dashboard/create-course';

  return (
    <div className="min-h-screen">
      {!hideNavbar && <DashboardNavbar />}
      {children}
    </div>
  );
};

export default TeacherDashboardLayout;
