'use client';

import NextLink from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button, Card, Spinner, Chip } from '@heroui/react';
import { IconHelp, IconTrophy, IconFlame } from '@tabler/icons-react';

// Placeholder data for courses
const courseCategories = [
  {
    category: 'Tech',
    courses: [
      { name: 'Introduction to Programming', tags: ['Beginner', 'Code'] },
      { name: 'Advanced Algorithms', tags: ['Advanced', 'Data Structures'] },
      { name: 'Web Development with Next.js', tags: ['Intermediate', 'Web', 'JavaScript'] },
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-surface shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-accent">ActiLearn</h1>
            </div>
             <div className="flex items-center gap-4">
               <p> Welcome back, <span className="font-semibold text-accent">{session.user.name}</span>!</p>
              <Button
                onClick={handleSignOut}
                variant="secondary"
              >
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
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <NextLink href="/doubts">
                <Card className="bg-surface hover:bg-default transition-shadow duration-300 cursor-pointer">
                    <Card.Content className="flex items-center gap-4">
                    <IconHelp className="h-8 w-8 text-blue-500" />
                    <div>
                        <Card.Title className="text-xl text-foreground">Ask a Doubt</Card.Title>
                        <p className="text-muted">Get help from peers and instructors.</p>
                    </div>
                    </Card.Content>
                </Card>
                </NextLink>

                <NextLink href="/compete">
                <Card className="bg-surface hover:bg-default transition-shadow duration-300 cursor-pointer">
                    <Card.Content className="flex items-center gap-4">
                    <IconTrophy className="h-8 w-8 text-yellow-500" />
                    <div>
                        <Card.Title className="text-xl text-foreground">Compete</Card.Title>
                        <p className="text-muted">Challenge yourself and climb the leaderboard.</p>
                    </div>
                    </Card.Content>
                </Card>
                </NextLink>

                <NextLink href="/streak">
                <Card className="bg-surface hover:bg-default transition-shadow duration-300 cursor-pointer">
                    <Card.Content className="flex items-center gap-4">
                    <IconFlame className="h-8 w-8 text-red-500" />
                    <div>
                        <Card.Title className="text-xl text-foreground">View Your Streak</Card.Title>
                        <p className="text-muted">Stay consistent and watch your streak grow.</p>
                    </div>
                    </Card.Content>
                </Card>
                </NextLink>
            </div>
        </div>

        {/* Course Catalog */}
        <div className="space-y-12">
            {courseCategories.map((category) => (
                <div key={category.category}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
                    <div className="flex space-x-6 overflow-x-auto pb-4">
                        {category.courses.map((course) => (
                            <div key={course.name} className="w-80 flex-shrink-0">
                                <Card className="bg-surface h-full">
                                <Card.Content>
                                    <Card.Title className="text-xl text-foreground">{course.name}</Card.Title>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                    {course.tags.map((tag) => (
                                        <Chip key={tag} className="bg-default text-default-foreground">{tag}</Chip>
                                    ))}
                                    </div>
                                </Card.Content>
                                <Card.Footer>
                                    <NextLink href="#" className="w-full">
                                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">View Course</Button>
                                    </NextLink>
                                </Card.Footer>
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
