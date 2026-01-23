'use client';

import NextLink from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Button,
  Card,
  Spinner,
  Chip,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from '@heroui/react';
import { IconHelp, IconTrophy, IconFlame } from '@tabler/icons-react';

// Placeholder data for courses
const courseCategories = [
  {
    category: 'Tech',
    courses: [
      { name: 'Introduction to Programming', tags: ['Beginner', 'Code'] },
      { name: 'Advanced Algorithms', tags: ['Advanced', 'Data Structures'] },
      {
        name: 'Web Development with Next.js',
        tags: ['Intermediate', 'Web', 'JavaScript'],
      },
      { name: 'Database Design and SQL', tags: ['Beginner', 'Databases'] },
      { name: 'Machine Learning Foundations', tags: ['Intermediate', 'AI/ML'] },
      { name: 'Cloud Computing with AWS', tags: ['Intermediate', 'Cloud'] },
    ],
  },
  {
    category: '11th Grade',
    courses: [
      { name: 'Physics - Mechanics', tags: ['Physics', '11th'] },
      { name: 'Chemistry - Organic Basics', tags: ['Chemistry', '11th'] },
      { name: 'Mathematics - Algebra', tags: ['Math', '11th'] },
    ],
  },
  {
    category: '12th Grade',
    courses: [
      { name: 'Physics - Electromagnetism', tags: ['Physics', '12th'] },
      { name: 'Chemistry - Advanced Organic', tags: ['Chemistry', '12th'] },
      { name: 'Mathematics - Calculus', tags: ['Math', '12th'] },
    ],
  },
  {
    category: 'B.Com',
    courses: [
      { name: 'Financial Accounting', tags: ['Commerce', 'B.Com'] },
      { name: 'Business Law', tags: ['Commerce', 'B.Com'] },
      { name: 'Principles of Management', tags: ['Management', 'B.Com'] },
    ],
  },
];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  // Loading state
  if (isPending || !session) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 py-12 sm:px-6 lg:px-8">
      {/* Quick Actions */}
      <h2 className="text-secondary mb-6 text-4xl font-bold">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          isPressable
          onPress={() => router.push('/doubts')}
          className="hover:bg-content2"
        >
          <CardBody className="flex items-center gap-4">
            <IconHelp className="h-16 w-16 text-blue-500" />
            <div>
              <h3 className="text-2xl">Ask a Doubt</h3>
              <p className="text-default-700">
                Get help from peers and instructors.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card
          isPressable
          onPress={() => router.push('/compete')}
          className="hover:bg-content2"
        >
          <CardBody className="flex items-center gap-4">
            <IconTrophy className="h-16 w-16 text-yellow-500" />
            <div>
              <h3 className="text-2xl">Compete</h3>
              <p className="text-default-700">
                Challenge yourself and climb the leaderboard.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card
          isPressable
          onPress={() => router.push('/streak')}
          className="hover:bg-content2"
        >
          <CardBody className="flex items-center gap-4">
            <IconFlame className="h-16 w-16 text-red-500" />
            <div>
              <h3 className="text-2xl">View Your Streak</h3>
              <p className="text-default-700">
                Stay consistent and watch your streak grow.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-secondary mb-6 text-4xl font-bold">
        Discover Courses
      </h2>
      {/* Course Catalog */}
      <div className="space-y-12">
        {courseCategories.map((category) => (
          <div key={category.category}>
            <h2 className="text-foreground mb-6 text-2xl font-bold">
              {category.category}
            </h2>
            <ScrollShadow
              orientation="horizontal"
              className="flex space-x-6 p-2"
            >
              {category.courses.map((course) => (
                <div key={course.name} className="w-80 shrink-0">
                  <Card className="bg-background outline-content2 hover:bg-content1 outline-1 hover:outline-0">
                    <CardHeader></CardHeader>
                    <CardBody>
                      <h2 className="text-xl">{course.name}</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <Chip key={tag} variant="bordered" color="secondary">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </CardBody>
                    <CardFooter>
                      <NextLink href="/course/view" className="w-full">
                        <Button
                          variant="light"
                          color="secondary"
                          className="w-full"
                        >
                          View Course
                        </Button>
                      </NextLink>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </ScrollShadow>
            <div className="flex space-x-6 overflow-x-auto pb-4"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
