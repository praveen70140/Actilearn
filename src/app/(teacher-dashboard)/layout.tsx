import DashboardNavbar from '@/components/dashboard-navbar';
import React from 'react';

const TeacherDashboardLayout = ({
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

export default TeacherDashboardLayout;
