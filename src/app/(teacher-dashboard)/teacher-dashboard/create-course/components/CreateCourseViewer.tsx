'use client';
import { z } from 'zod';
import { courseSchema } from '@/lib/zod/course';
import { CourseCreateProvider } from '../context/CourseCreateContext';
import { CreateCourseHeader } from './CreateCourseHeader';
import { EditableTheoryPanel } from './EditableTheoryPanel';
import { EditableQuestionsPanel } from './EditableQuestionsPanel';

export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = CourseType['chapters'][number];
export type LessonType = ChapterType['lessons'][number];

const CreateCourseView = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] selection:bg-[#f5e0dc] selection:text-[#1e1e2e]">
      <CreateCourseHeader />
      <main className="flex h-[calc(100vh-65px)]">
        <EditableTheoryPanel />
        <EditableQuestionsPanel />
      </main>
    </div>
  );
};

export default function CreateCourseViewer() {
  return (
    <CourseCreateProvider>
      <CreateCourseView />
    </CourseCreateProvider>
  );
}
