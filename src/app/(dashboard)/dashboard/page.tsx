'use client';
// Import necessary modules and components
import NextLink from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Spinner,
  Chip,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { IconHelp, IconTrophy, IconFlame } from '@tabler/icons-react';

// Define the structure of a Course
interface Course {
  _id: string;
  name: string;
  tags: string[];
}

// Define the structure for course categories
interface CourseCategory {
  category: string;
  courses: Course[];
}

// Placeholder data for non-tech courses
const staticCourseCategories: CourseCategory[] = [
  {
    category: '11th Grade',
    courses: [
      { _id: '1', name: 'Physics - Mechanics', tags: ['Physics', '11th'] },
      { _id: '2', name: 'Chemistry - Organic Basics', tags: ['Chemistry', '11th'] },
      { _id: '3', name: 'Mathematics - Algebra', tags: ['Math', '11th'] },
    ],
  },
  {
    category: '12th Grade',
    courses: [
      { _id: '4', name: 'Physics - Electromagnetism', tags: ['Physics', '12th'] },
      { _id: '5', name: 'Chemistry - Advanced Organic', tags: ['Chemistry', '12th'] },
      { _id: '6', name: 'Mathematics - Calculus', tags: ['Math', '12th'] },
    ],
  },
  {
    category: 'B.Com',
    courses: [
      { _id: '7', name: 'Financial Accounting', tags: ['Commerce', 'B.Com'] },
      { _id: '8', name: 'Business Law', tags: ['Commerce', 'B.Com'] },
      { _id: '9', name: 'Principles of Management', tags: ['Management', 'B.Com'] },
    ],
  },
];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
    [],
  );

  // Fetch courses from the API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses from the API
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const techCourses: Course[] = await response.json();

        // Combine static categories with fetched tech courses
        setCourseCategories([
          { category: 'Tech', courses: techCourses },
          ...staticCourseCategories,
        ]);
      } catch (error) {
        // Log error and set only static categories as a fallback
        console.error('Error fetching courses:', error);
        setCourseCategories(staticCourseCategories);
      }
    };

    fetchCourses();
  }, []);

  // Handle opening the course view modal
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Handle closing the course view modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Effect to redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  // Display a loading spinner while session is being checked
  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <>
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
                  <div key={course._id} className="w-80 shrink-0">
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
                        <Button
                          variant="light"
                          color="secondary"
                          className="w-full"
                          onPress={() => handleViewCourse(course)}
                        >
                          View Course
                        </Button>
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
      {selectedCourse && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <ModalHeader>Continue to Course?</ModalHeader>
            <ModalBody>
              <p>
                You are about to view the course &quot;{selectedCourse.name}&quot;.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleCloseModal}>
                Cancel
              </Button>
              <NextLink href={`/course/${selectedCourse._id}`} passHref>
                <Button
                  color="primary"
                  onPress={handleCloseModal}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Continue
                </Button>
              </NextLink>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}