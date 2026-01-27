'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import {
  IconUser,
  IconBook,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react';

export default function TeacherDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  // Display loading spinner while session is being checked
  if (isPending || !session) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 py-12 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-secondary text-5xl font-bold">
          Welcome, {session.user?.name || 'Educator'}!
        </h1>
        <p className="text-default-600 text-xl">
          Manage your courses, track student progress, and create engaging
          learning experiences.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex items-center gap-4 pb-2">
            <IconBook className="h-8 w-8" />
            <h3 className="text-lg font-semibold">Courses Created</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-3xl font-bold">0</p>
            <p className="text-blue-100">Coming soon</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex items-center gap-4 pb-2">
            <IconUsers className="h-8 w-8" />
            <h3 className="text-lg font-semibold">Students Enrolled</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-3xl font-bold">0</p>
            <p className="text-green-100">Coming soon</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex items-center gap-4 pb-2">
            <IconChartBar className="h-8 w-8" />
            <h3 className="text-lg font-semibold">Assignments</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-3xl font-bold">0</p>
            <p className="text-purple-100">Coming soon</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex items-center gap-4 pb-2">
            <IconUser className="h-8 w-8" />
            <h3 className="text-lg font-semibold">Profile Status</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-lg font-semibold">Teacher</p>
            <p className="text-orange-100">Verified</p>
          </CardBody>
        </Card>
      </div>

      {/* Teacher Actions */}
      <div className="space-y-6">
        <h2 className="text-secondary text-3xl font-bold">Teacher Tools</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Create Course</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Design and publish new courses for your students.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>

          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Manage Students</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                View and manage your student enrollments.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>

          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Analytics</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Track student progress and course performance.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>

          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Assignments</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Create and grade student assignments.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>

          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Communicate with students and parents.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>

          <Card isPressable className="hover:bg-content2 transition-colors">
            <CardHeader>
              <h3 className="text-xl font-semibold">Settings</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">
                Manage your teacher profile and preferences.
              </p>
              <p className="text-primary-500 mt-2 text-sm">Coming soon</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-secondary text-3xl font-bold">Recent Activity</h2>
        <Card>
          <CardBody className="py-12 text-center">
            <p className="text-default-500 text-lg">
              No recent activity to display
            </p>
            <p className="text-default-400 mt-2 text-sm">
              Start creating courses and managing students to see activity here.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
