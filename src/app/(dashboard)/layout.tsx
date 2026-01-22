import DashboardNavbar from '@/components/dashboard-navbar';
import { Navbar } from '@heroui/react';
import React from 'react';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen">
      <DashboardNavbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
