'use client';
/**
 * This is the main dashboard page where users can see available courses and navigate to other parts of the application.
 * It fetches the list of courses and course categories from the API, groups the courses by category, and displays them in sections.
 * It also provides quick action cards to navigate to other pages like 'Ask a Doubt', 'Compete', and 'View Your Streak'.
 */

// Import necessary modules and components from Next.js, React, and other libraries.
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

// Define the structure of a Course object that we expect from the API.
interface Course {
  _id: string;
  slug: string;
  name: string;
  tags: string[];
}

// Define the structure of a Course Category object that we expect from the API.
interface CourseCategory {
  _id: string;
  name: string;
  label: string;
  icon: string;
  tags: { name: string; label: string; icon: string }[];
}

// Define the structure for the categorized courses to be displayed.
interface CategorizedCourses {
  category: string;
  courses: Course[];
}

import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  // useSession hook to get session data and authentication status.
  const { data: session, isPending } = useSession();
  // useRouter hook for programmatic navigation.
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to control the visibility of the course confirmation modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to control the visibility of the error modal.
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  // State to store the currently selected course.
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // State to store the categorized courses.
  const [categorizedCourses, setCategorizedCourses] = useState<
    CategorizedCourses[]
  >([]);

  // useEffect hook to fetch courses and categories from the API when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses and categories in parallel.
        const [coursesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/courses/categories'),
        ]);

        if (!coursesResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const courses: Course[] = await coursesResponse.json();
        const categories: CourseCategory[] = await categoriesResponse.json();

        // Group courses by category.
        const groupedCourses = categories.map((category) => {
          const categoryTags = new Set(category.tags.map((tag) => tag.name));
          const coursesInCategory = courses.filter((course) =>
            course.tags.some((tag) => categoryTags.has(tag)),
          );
          return {
            category: category.name,
            courses: coursesInCategory,
          };
        });

        // Find courses that don't belong to any category (including those with empty tags)
        const allCategorizedCourses = new Set();
        groupedCourses.forEach((group) => {
          group.courses.forEach((course) => {
            allCategorizedCourses.add(course._id);
          });
        });

        const uncategorizedCourses = courses.filter(
          (course) => !allCategorizedCourses.has(course._id),
        );

        // Create "Other Courses" section if there are uncategorized courses
        const finalGroupedCourses = groupedCourses.filter(
          (group) => group.courses.length > 0,
        );

        if (uncategorizedCourses.length > 0) {
          finalGroupedCourses.push({
            category: 'Other Courses',
            courses: uncategorizedCourses,
          });
        }

        setCategorizedCourses(finalGroupedCourses);
      } catch (error) {
        // Log any errors that occur during the fetch operation.
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  useEffect(() => {
    if (searchParams.get('error') === 'course_not_found') {
      setIsErrorModalOpen(true);
    }
  }, [searchParams]);

  // Function to handle opening the course confirmation modal.
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Function to handle closing the course confirmation modal.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Function to handle closing the error modal.
  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    // Remove the error query parameter from the URL
    router.replace('/dashboard');
  };

  // useEffect hook to redirect to the login page if the user is not authenticated.
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  // Display a loading spinner while the session is being checked or if there is no session.
  if (isPending || !session) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Render the main dashboard UI.
  return (
    <>
      <main className="mx-auto max-w-7xl space-y-8 py-12 sm:px-6 lg:px-8">
        {/* Section for quick actions */}
        <h2 className="text-secondary mb-6 text-4xl font-bold">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card for 'Ask a Doubt' */}
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

          {/* Card for 'Compete' */}
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

          {/* Card for 'View Your Streak' */}
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
        {/* Section to display the list of courses grouped by category */}
        <div className="space-y-12">
          {categorizedCourses.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              <h2 className="text-foreground mb-6 text-2xl font-bold">
                {categoryGroup.category}
              </h2>
              <ScrollShadow
                orientation="horizontal"
                className="flex space-x-6 p-2"
              >
                {/* Map over the courses in the category and render a card for each course */}
                {categoryGroup.courses.map((course) => (
                  <div key={course._id} className="w-80 shrink-0">
                    <Card className="bg-background outline-content2 hover:bg-content1 outline-1 hover:outline-0">
                      <CardHeader></CardHeader>
                      <CardBody>
                        <h2 className="text-xl">{course.name}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {/* Map over the course tags and render a chip for each tag */}
                          {course.tags.map((tag) => (
                            <Chip
                              key={tag}
                              variant="bordered"
                              color="secondary"
                            >
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
            </div>
          ))}
        </div>
      </main>
      {/* Modal for confirming course navigation */}
      {selectedCourse && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <ModalHeader>Continue to Course?</ModalHeader>
            <ModalBody>
              <p>
                You are about to view the course &quot;{selectedCourse.name}
                &quot;.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleCloseModal}>
                Cancel
              </Button>
              {/* Link to the course page using the course slug */}
              <NextLink href={`/course/${selectedCourse.slug}`} passHref>
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

      {/* Modal for displaying course not found error */}
      <Modal isOpen={isErrorModalOpen} onClose={handleCloseErrorModal}>
        <ModalContent>
          <ModalHeader className="text-danger">Course Not Found</ModalHeader>
          <ModalBody>
            <p>
              The course you are trying to access could not be found. It may
              have been removed or you might have an incorrect link.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={handleCloseErrorModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
