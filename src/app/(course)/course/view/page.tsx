'use client';
import { useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';
import { courseData as rawCourseData } from './data';
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

const courseData = courseSchema.parse(rawCourseData);

export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = CourseType['chapters'][number];
export type LessonType = ChapterType['lessons'][number];

const multipleChoiceQuestionSchema = questionSchema.extend({
  body: questionTypeMultipleChoiceSchema,
});
const numericalQuestionSchema = questionSchema.extend({
  body: questionTypeNumericalSchema,
});
const codeExecutionQuestionSchema = questionSchema.extend({
  body: questionTypeCodeExecutionSchema,
});
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

  // FIX: Only check for courseData and core navigation objects
  if (!courseData || !currentChapter || !currentLesson) {
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

export default function CourseViewPage() {
  return (
    <CourseProvider course={courseData}>
      <CourseView />
    </CourseProvider>
  );
}
