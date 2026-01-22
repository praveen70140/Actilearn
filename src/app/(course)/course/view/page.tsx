'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@heroui/react';

// Import Data
import { courseData } from './data';

// Import Components
import { PreCourseModal } from './components/PreCourseModal';
import { CourseHeader } from './components/CourseHeader';
import { TheoryPanel } from './components/TheoryPanel';
import { QuestionsPanel } from './components/QuestionsPanel';

export default function CourseViewPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  // --- NAVIGATION STATE ---
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Derived Data
  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter.lessons[currentLessonIndex];
  const currentQuestion = currentLesson.questions[currentQuestionIndex];

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
    if (currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!courseData)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e2e]">
        {/* Corrected: color="accent" is the v3 semantic key */}
        <Spinner color="primary" size="lg" />
        <p className="animate-pulse text-sm font-medium text-[#b4befe]">
          Loading Payload...
        </p>
      </div>
    );
  return (
    <div className="min-h-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] selection:bg-[#f5e0dc] selection:text-[#1e1e2e]">
      {/* 1. Modal for Entry */}
      <PreCourseModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        courseTitle={courseData.title}
      />

      {!showModal && (
        <>
          {/* 2. Global Navbar (Lesson/Chapter Control) */}
          <CourseHeader
            courseData={courseData}
            currentChapter={currentChapter}
            currentLesson={currentLesson}
            onChapterChange={(key: any) => {
              const idx = courseData.chapters.findIndex((c) => c.id === key);
              if (idx !== -1) {
                setCurrentChapterIndex(idx);
                setCurrentLessonIndex(0);
                setCurrentQuestionIndex(0);
              }
            }}
            onLessonChange={(key: any) => {
              const idx = currentChapter.lessons.findIndex((l) => l.id === key);
              if (idx !== -1) {
                setCurrentLessonIndex(idx);
                setCurrentQuestionIndex(0);
              }
            }}
            onPrevLesson={handlePrevLesson}
            onNextLesson={handleNextLesson}
            isPrevDisabled={
              currentChapterIndex === 0 && currentLessonIndex === 0
            }
            isNextDisabled={
              currentChapterIndex === courseData.chapters.length - 1 &&
              currentLessonIndex === currentChapter.lessons.length - 1
            }
            onExit={() => router.push('/dashboard')}
          />

          <main className="flex h-[calc(100vh-65px)]">
            {/* 3. Left Panel (Markdown Content) */}
            <TheoryPanel lesson={currentLesson} />

            {/* 4. Right Panel (Question Logic) */}
            <QuestionsPanel
              lesson={currentLesson}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionChange={(key: any) => {
                const idx = currentLesson.questions.findIndex(
                  (q) => q.id === key,
                );
                if (idx !== -1) setCurrentQuestionIndex(idx);
              }}
              onPrevQuestion={handlePrevQuestion}
              onNextQuestion={handleNextQuestion}
            />
          </main>
        </>
      )}
    </div>
  );
}
