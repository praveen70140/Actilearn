'use client';
import { useState, useCallback } from 'react';
import {
  Textarea,
  Button,
  Card,
  Skeleton,
  CardHeader,
  CardBody,
  CardFooter,
} from '@heroui/react';
import { IconSend, IconSparkles } from '@tabler/icons-react';
import { z } from 'zod';
import { courseSchema } from '@/lib/zod/course';
import { generateCourseFromDoubt } from '@/actions/generate-course';
import CourseViewer from '@/app/(course)/course/view/CourseViewer';

export default function DoubtsPage() {
  const [doubt, setDoubt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<z.infer<typeof courseSchema> | null>(
    null,
  );
  const [isAttempting, setIsAttempting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!doubt) return;
    setIsLoading(true);
    setCourse(null);
    setIsAttempting(false);

    try {
      const result = await generateCourseFromDoubt(doubt);

      if (result.success && result.data) {
        setCourse(result.data);
      } else {
        console.error('Course generation failed:', result.error);
        alert('Failed to generate course. Please try again.');
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [doubt]);

  const handleReset = () => {
    setDoubt('');
    setCourse(null);
    setIsAttempting(false);
  };

  if (isAttempting && course) {
    return (
      <div className="bg-background fixed inset-0 z-50">
        <Button
          isIconOnly
          variant="light"
          className="absolute top-4 right-4 z-[60] text-white/50 hover:text-white"
          onClick={() => setIsAttempting(false)}
        >
          X
        </Button>
        <CourseViewer courseData={course} />
      </div>
    );
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-primary/20 absolute -top-1/4 -left-1/4 h-1/2 w-1/2 animate-pulse rounded-full opacity-50 blur-3xl filter" />
        <div className="bg-secondary/20 absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 animate-pulse rounded-full opacity-50 blur-3xl filter" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {!course && !isLoading && (
          <div className="flex flex-col items-center text-center">
            <h1 className="from-primary to-secondary mb-4 flex items-center gap-2 bg-gradient-to-r bg-clip-text text-5xl font-extrabold text-transparent">
              <IconSparkles size={48} />
              Doubts
            </h1>
            <p className="text-muted mb-8 max-w-2xl">
              Have a question about a topic? Ask away and our AI will generate a
              customized course to help you understand it better.
            </p>
            <Textarea
              variant="bordered"
              placeholder="Tell us what your doubt is..."
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              className="mb-4 min-h-[150px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={!doubt}
              color="primary"
              variant="shadow"
              endContent={<IconSend size={20} />}
            >
              Submit
            </Button>
          </div>
        )}

        {isLoading && (
          <Card className="w-full" shadow="lg">
            <CardHeader>
              <Skeleton className="h-8 w-3/5 rounded-md" />
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </CardBody>
            <CardFooter>
              <Skeleton className="h-12 w-32 rounded-md" />
            </CardFooter>
          </Card>
        )}

        {course && (
          <Card isBlurred shadow="lg" className="border border-white/10">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-foreground text-2xl font-bold">
                {course.name}
              </h2>
              <Button variant="light" onClick={handleReset}>
                Ask another doubt
              </Button>
            </CardHeader>
            <CardBody>
              <p className="text-muted">{course.description}</p>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button
                color="success"
                variant="shadow"
                size="lg"
                onClick={() => setIsAttempting(true)}
              >
                Attempt
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
