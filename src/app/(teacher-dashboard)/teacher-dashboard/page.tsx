'use client';
import { Card, CardBody } from '@heroui/react';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const TeacherDashboardPage = () => {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-7xl space-y-8 py-12 sm:px-6 lg:px-8">
      <h2 className="text-secondary mb-6 text-4xl font-bold">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          isPressable
          onPress={() => router.push('/teacher-dashboard/create-course')}
          className="hover:bg-content2"
        >
          <CardBody className="flex items-center gap-4">
            <IconPlus className="h-16 w-16 text-blue-500" />
            <div>
              <h3 className="text-2xl">Create Course</h3>
              <p className="text-default-700">
                Create a new course for your students.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
};

export default TeacherDashboardPage;