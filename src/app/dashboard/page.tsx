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

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  // Loading state
  if (isPending || !session) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Bar */}
      <nav className="border-border bg-surface border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-accent text-xl font-bold">ActiLearn</h1>
            </div>
            <div className="flex items-center gap-4">
              <p>
                {' '}
                Welcome back,{' '}
                <span className="text-accent font-semibold">
                  {session.user.name}
                </span>
                !
              </p>
              <Button onPress={handleSignOut} variant="bordered">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <NextLink href="/doubts">
              <Card className="bg-surface hover:bg-default cursor-pointer transition-shadow duration-300">
                <CardBody className="flex items-center gap-4">
                  <IconHelp className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-foreground text-xl">Ask a Doubt</h3>
                    <p className="text-muted">
                      Get help from peers and instructors.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </NextLink>

            <NextLink href="/compete">
              <Card className="bg-surface hover:bg-default cursor-pointer transition-shadow duration-300">
                <CardBody className="flex items-center gap-4">
                  <IconTrophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="text-foreground text-xl">Compete</h3>
                    <p className="text-muted">
                      Challenge yourself and climb the leaderboard.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </NextLink>

            <NextLink href="/streak">
              <Card className="bg-surface hover:bg-default cursor-pointer transition-shadow duration-300">
                <CardBody className="flex items-center gap-4">
                  <IconFlame className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="text-foreground text-xl">
                      View Your Streak
                    </h3>
                    <p className="text-muted">
                      Stay consistent and watch your streak grow.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </NextLink>
          </div>
        </div>

        {/* Course Catalog */}
        <div className="space-y-12">
          {courseCategories.map((category) => (
            <div key={category.category}>
              <h2 className="text-foreground mb-6 text-2xl font-bold">
                {category.category}
              </h2>
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {category.courses.map((course) => (
                  <div key={course.name} className="w-80 shrink-0">
                    <Card className="bg-surface h-full">
                      <CardBody>
                        <h2 className="text-foreground text-xl">
                          {course.name}
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {course.tags.map((tag) => (
                            <Chip
                              key={tag}
                              className="bg-default text-default-foreground"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </CardBody>
                      <CardFooter>
                        <NextLink href="/course/view" className="w-full">
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                            View Course
                          </Button>
                        </NextLink>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
