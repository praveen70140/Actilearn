'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@heroui/react';
import { z } from 'zod';

// Import Data & Schema
import { courseData as rawCourseData } from './data';
import { courseSchema } from '@/lib/zod/course';

// Import Components
import { CourseHeader } from './components/CourseHeader';
import { TheoryPanel } from './components/TheoryPanel';
import { QuestionsPanel } from './components/QuestionsPanel';

// Validate and type the raw data
const courseData = courseSchema.parse(rawCourseData);

export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = CourseType['chapters'][number];
export type LessonType = ChapterType['lessons'][number];
export type QuestionType = NonNullable<LessonType['questions']>[number];

export default function CourseViewPage() {
  const router = useRouter();

  // --- NAVIGATION STATE ---
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Derived Data
  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter.lessons[currentLessonIndex];
  const currentQuestion = currentLesson.questions
    ? currentLesson.questions[currentQuestionIndex]
    : null;

  // --- LOGIC: LESSON NAVIGATION ---
  const handleNextLesson = () => {
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
    } else if (currentChapterIndex < courseData.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentLessonIndex(0);
    }
    setCurrentQuestionIndex(0); // Reset questions for new lesson
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
    } else if (currentChapterIndex > 0) {
      const prevChapterIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevChapterIdx);
      setCurrentLessonIndex(
        courseData.chapters[prevChapterIdx].lessons.length - 1,
      );
    }
    setCurrentQuestionIndex(0);
  };

  // --- LOGIC: QUESTION NAVIGATION ---
  const handleNextQuestion = () => {
    if (
      currentLesson.questions &&
      currentQuestionIndex < currentLesson.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!courseData || !currentQuestion)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e2e]">
        <Spinner color="primary" size="lg" />
        <p className="animate-pulse text-sm font-medium text-[#b4befe]">
          Loading Payload...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] selection:bg-[#f5e0dc] selection:text-[#1e1e2e]">
      <CourseHeader
        courseData={courseData}
        currentChapter={currentChapter}
        currentLesson={currentLesson}
        onChapterChange={(keys) => {
          // keys is a Set
          const selectedKey = Array.from(keys)[0];
          const idx = courseData.chapters.findIndex(
            (c) => c.name === selectedKey,
          );
          if (idx !== -1) {
            setCurrentChapterIndex(idx);
            setCurrentLessonIndex(0);
            setCurrentQuestionIndex(0);
          }
        }}
        onLessonChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          const idx = currentChapter.lessons.findIndex(
            (l) => l.name === selectedKey,
          );
          if (idx !== -1) {
            setCurrentLessonIndex(idx);
            setCurrentQuestionIndex(0);
          }
        }}
        onPrevLesson={handlePrevLesson}
        onNextLesson={handleNextLesson}
        isPrevLessonDisabled={
          currentChapterIndex === 0 && currentLessonIndex === 0
        }
        isNextLessonDisabled={
          currentChapterIndex === courseData.chapters.length - 1 &&
          currentLessonIndex === currentChapter.lessons.length - 1
        }
        onExit={() => router.push('/dashboard')}
      />

      <main className="flex h-[calc(100vh-65px)]">
        <TheoryPanel lesson={currentLesson} />

        <QuestionsPanel
          lesson={currentLesson}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            if (currentLesson.questions) {
              const idx = currentLesson.questions.findIndex(
                (q, i) => i.toString() === selectedKey,
              );
              if (idx !== -1) setCurrentQuestionIndex(idx);
            }
          }}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
        />
      </main>
    </div>
  );
}
