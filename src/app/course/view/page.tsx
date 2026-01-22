'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@heroui/react';
import { PreCourseModal } from './components/PreCourseModal';
import { CourseHeader } from './components/CourseHeader';
import { TheoryPanel } from './components/TheoryPanel';
import { QuestionsPanel } from './components/QuestionsPanel';

const courseData = {
  id: 'course-1',
  title: 'Web Development Fundamentals',
  chapters: [
    {
      id: 'chapter-1',
      title: '1. HTML Foundations',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is HTML?',
          theory: `
            <p><strong>HTML</strong> is the skeleton of the web.</p>
            <p>It defines structure, not behavior or styling.</p>
            <ul>
              <li>Elements</li>
              <li>Tags</li>
              <li>Attributes</li>
            </ul>
          `,
          questions: [
            { id: 'q-1-1-1', text: 'What does HTML stand for?' },
            { id: 'q-1-1-2', text: 'Is HTML a programming language?' },
            { id: 'q-1-1-3', text: 'Which tag is used for the largest heading?' },
          ],
        },
        {
          id: 'lesson-1-2',
          title: 'Basic Tags',
          theory: `
            <p>HTML provides a set of predefined tags.</p>
            <p>Common tags include:</p>
            <pre>&lt;div&gt; &lt;p&gt; &lt;span&gt;</pre>
          `,
          questions: [
            { id: 'q-1-2-1', text: 'What tag is used to create a paragraph?' },
            { id: 'q-1-2-2', text: 'Which tag is non-semantic by default?' },
          ],
        },
      ],
    },
    {
      id: 'chapter-2',
      title: '2. CSS Basics',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'What is CSS?',
          theory: `
            <p><strong>CSS</strong> controls how HTML looks.</p>
            <p>It handles layout, colors, spacing, and animations.</p>
          `,
          questions: [
            { id: 'q-2-1-1', text: 'What does CSS stand for?' },
            { id: 'q-2-1-2', text: 'Can CSS exist without HTML?' },
            { id: 'q-2-1-3', text: 'Which property controls text color?' },
            { id: 'q-2-1-4', text: 'What selector targets a class?' },
          ],
        },
        {
          id: 'lesson-2-2',
          title: 'Box Model',
          theory: `
            <p>The CSS box model defines spacing and sizing.</p>
            <ol>
              <li>Content</li>
              <li>Padding</li>
              <li>Border</li>
              <li>Margin</li>
            </ol>
          `,
          questions: [
            { id: 'q-2-2-1', text: 'Which box model layer is outermost?' },
            { id: 'q-2-2-2', text: 'Does padding affect element size?' },
          ],
        },
      ],
    },
    {
      id: 'chapter-3',
      title: '3. JavaScript Essentials',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'JS Basics',
          theory: `
            <p>JavaScript adds behavior to web pages.</p>
            <p>It runs in the browser and on the server.</p>
          `,
          questions: [
            { id: 'q-3-1-1', text: 'Is JavaScript synchronous by default?' },
            { id: 'q-3-1-2', text: 'What keyword declares a constant?' },
            { id: 'q-3-1-3', text: 'What does DOM stand for?' },
          ],
        },
      ],
    },
  ],
};

export default function CourseViewPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  // Navigation State
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter.lessons[currentLessonIndex];
  const currentQuestion = currentLesson.questions[currentQuestionIndex];

  // Logic: Lesson Navigation (Navbar)
  const handleNextLesson = () => {
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentChapterIndex < courseData.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentLessonIndex(0);
    }
    setCurrentQuestionIndex(0);
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentLessonIndex(courseData.chapters[currentChapterIndex - 1].lessons.length - 1);
    }
    setCurrentQuestionIndex(0);
  };

  // Logic: Question Navigation (Panel Header)
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (!courseData) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] overflow-hidden">
      <PreCourseModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        courseTitle={courseData.title}
      />

      {!showModal && (
        <>
          <CourseHeader
            courseData={courseData}
            currentChapter={currentChapter}
            currentLesson={currentLesson}
            onChapterChange={(key: any) => {
              const idx = courseData.chapters.findIndex(c => c.id === key);
              if (idx !== -1) { setCurrentChapterIndex(idx); setCurrentLessonIndex(0); setCurrentQuestionIndex(0); }
            }}
            onLessonChange={(key: any) => {
              const idx = currentChapter.lessons.findIndex(l => l.id === key);
              if (idx !== -1) { setCurrentLessonIndex(idx); setCurrentQuestionIndex(0); }
            }}
            onPrevLesson={handlePrevLesson}
            onNextLesson={handleNextLesson}
            isPrevLessonDisabled={currentChapterIndex === 0 && currentLessonIndex === 0}
            isNextLessonDisabled={currentChapterIndex === courseData.chapters.length - 1 && currentLessonIndex === currentChapter.lessons.length - 1}
            onExit={() => router.push('/dashboard')}
          />

          <main className="flex h-[calc(100vh-65px)]">
            <TheoryPanel lesson={currentLesson} />
            <QuestionsPanel
              lesson={currentLesson}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionChange={(key: any) => {
                const idx = currentLesson.questions.findIndex(q => q.id === key);
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