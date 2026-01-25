'use client';
import { useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';
import { courseSchema, questionSchema } from '@/lib/zod/course';
import { CourseHeader } from './components/CourseHeader';
import { TheoryPanel } from './components/TheoryPanel';
import { QuestionsPanel } from './components/QuestionsPanel';
import { CourseProvider, useCourseContext } from './context/CourseContext';
import { z } from 'zod';
import {
  questionTypeCodeExecutionSchema,
  questionTypeMultipleChoiceSchema,
  questionTypeNumericalSchema,
  questionTypeOpenEndedSchema,
} from '@/lib/zod/questions';

export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = CourseType['chapters'][number];
export type LessonType = ChapterType['lessons'][number];

// These schemas are used for type inference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multipleChoiceQuestionSchema = questionSchema.extend({
  body: questionTypeMultipleChoiceSchema,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const numericalQuestionSchema = questionSchema.extend({
  body: questionTypeNumericalSchema,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const codeExecutionQuestionSchema = questionSchema.extend({
  body: questionTypeCodeExecutionSchema,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openEndedQuestionSchema = questionSchema.extend({
  body: questionTypeOpenEndedSchema,
});

export type MultipleChoiceQuestion = z.infer<
  typeof multipleChoiceQuestionSchema
>;
export type NumericalQuestion = z.infer<typeof numericalQuestionSchema>;
export type CodeExecutionQuestion = z.infer<typeof codeExecutionQuestionSchema>;
export type OpenEndedQuestion = z.infer<typeof openEndedQuestionSchema>;

const CourseView = () => {
  const { currentChapter, currentLesson } = useCourseContext();
  const router = useRouter();

  if (!currentChapter || !currentLesson) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e2e]">
        <Spinner color="primary" size="lg" />
        <p className="animate-pulse text-sm font-medium text-[#b4befe]">
          Loading Payload...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] selection:bg-[#f5e0dc] selection:text-[#1e1e2e]">
      <CourseHeader onExit={() => router.push('/dashboard')} />
      <main className="flex h-[calc(100vh-65px)]">
        <TheoryPanel />
        <QuestionsPanel />
      </main>
    </div>
  );
};

import { responseDocumentSchema } from '@/lib/zod/responses';

export type ResponseType = z.infer<typeof responseDocumentSchema> | null;

export default function CourseViewer({
  courseData,
  responseData,
}: {
  courseData: CourseType;
  responseData: ResponseType;
}) {
  // If no course data is provided (e.g. direct access without props), show fallback or redirect
  // For the Doubt page use-case, we will render this component with props.
  // If accessed directly via URL, it might need to fetch data or redirect.
  // For now, let's assume this page is primarily a component used by the Doubts page wrapper
  // or that the Doubts page will render the CourseProvider and View structure itself.

  // Actually, wait. The user wants to "attempt" the course from the Doubts page.
  // The Doubts page is currently a separate page.
  // The Course View logic is tightly coupled to this file structure.

  // Refactoring strategy:
  // 1. Export the main CourseView component and CourseProvider so Doubts page can use them.
  // 2. Keep this default export for the /course/view route if needed (though dynamic data makes static route tricky).

  return (
    <CourseProvider course={courseData} response={responseData}>
      <CourseView />
    </CourseProvider>
  );
}
