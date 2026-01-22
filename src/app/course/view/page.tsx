'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Corrected imports for HeroUI v3
import {
  Button,
  Card,
  Select,
  Spinner,
  Modal,
  Label,
  ListBox,
  useOverlayState
} from '@heroui/react';
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react';

// Placeholder Data
const courseData = {
  id: 'course-1',
  title: 'Web Development Fundamentals',
  chapters: [
    {
      id: 'chapter-1',
      title: 'Introduction to HTML',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is HTML?',
          theory: `<p>HTML is the standard markup language...</p>`,
          questions: [
            { id: 'q1', type: 'mcq', text: 'What does HTML stand for?' },
            { id: 'q2', type: 'open', text: 'Explain the purpose of HTML tags.' },
          ],
        },
      ],
    },
    {
      id: 'chapter-2',
      title: 'Introduction to CSS',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'What is CSS?',
          theory: `<p>CSS is used to style HTML...</p>`,
          questions: [
            { id: 'q5', type: 'mcq', text: 'What does CSS stand for?' },
          ],
        },
      ],
    },
  ],
};

export default function CourseViewPage() {
  const router = useRouter();

  // State management
  const [showModal, setShowModal] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentChapter = courseData?.chapters?.[currentChapterIndex];
  const currentLesson = currentChapter?.lessons?.[currentLessonIndex];
  const currentQuestion = currentLesson?.questions?.[currentQuestionIndex];

  const totalChapters = courseData?.chapters?.length || 0;
  const totalLessonsInChapter = currentChapter?.lessons?.length || 0;
  const totalQuestionsInLesson = currentLesson?.questions?.length || 0;

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessonsInChapter - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentLessonIndex(0);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex > 0) {
      const newChapterIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newChapterIndex);
      setCurrentLessonIndex(courseData.chapters[newChapterIndex].lessons.length - 1);
      setCurrentQuestionIndex(0);
    }
  };

  if (!courseData) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. CORRECTED MODAL ANATOMY (v3) */}
      <Modal isOpen={showModal} onOpenChange={setShowModal}>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Welcome to the Course!</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p>You are about to start: {courseData.title}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onPress={() => router.push('/dashboard')}>Cancel</Button>
                <Button slot="close">Continue to Course</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {!showModal && (
        <>
          <nav className="border-b border-divider bg-surface shadow-sm py-3 px-4">
            <div className="mx-auto max-w-7xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button size="sm" variant="tertiary" onPress={() => router.push('/dashboard')}>
                  <IconX size={16} /> Exit
                </Button>
                <h1 className="text-lg font-bold">{courseData.title}</h1>
              </div>

              <div className="flex items-center gap-2">
                {/* 2. CORRECTED SELECT ANATOMY (v3) */}
                <Select
                  className="w-48"
                  selectedKey={currentChapter?.id}
                  onSelectionChange={(key) => {
                    const idx = courseData.chapters.findIndex(c => c.id === key);
                    if (idx !== -1) {
                      setCurrentChapterIndex(idx);
                      setCurrentLessonIndex(0);
                      setCurrentQuestionIndex(0);
                    }
                  }}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {courseData.chapters.map((chapter) => (
                        <ListBox.Item key={chapter.id} id={chapter.id} textValue={chapter.title}>
                          {chapter.title}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  className="w-48"
                  selectedKey={currentLesson?.id}
                  onSelectionChange={(key) => {
                    const idx = currentChapter.lessons.findIndex(l => l.id === key);
                    if (idx !== -1) {
                      setCurrentLessonIndex(idx);
                      setCurrentQuestionIndex(0);
                    }
                  }}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {currentChapter.lessons.map((lesson) => (
                        <ListBox.Item key={lesson.id} id={lesson.id} textValue={lesson.title}>
                          {lesson.title}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Button
                  variant="tertiary"
                  onPress={handlePreviousLesson}
                  isDisabled={currentChapterIndex === 0 && currentLessonIndex === 0}
                >
                  <IconArrowLeft size={16} /> Previous
                </Button>
                <Button
                  variant="primary"
                  onPress={handleNextLesson}
                  isDisabled={currentChapterIndex === totalChapters - 1 && currentLessonIndex === totalLessonsInChapter - 1}
                >
                  Next <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          </nav>

          <main className="flex h-[calc(100vh-65px)]">
            <div className="w-1/2 p-6 overflow-y-auto border-r border-divider">
              <Card className="h-full p-4">
                <Card.Header>
                  <Card.Title>{currentLesson?.title}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div dangerouslySetInnerHTML={{ __html: currentLesson?.theory || '' }} />
                </Card.Content>
              </Card>
            </div>

            <div className="w-1/2 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Questions ({currentQuestionIndex + 1} / {totalQuestionsInLesson})</h2>
                <Select
                  className="w-48"
                  selectedKey={currentQuestion?.id}
                  onSelectionChange={(key) => {
                    const idx = currentLesson.questions.findIndex(q => q.id === key);
                    if (idx !== -1) setCurrentQuestionIndex(idx);
                  }}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {currentLesson?.questions.map((q, i) => (
                        <ListBox.Item key={q.id} id={q.id} textValue={`Question ${i + 1}`}>
                          {`Question ${i + 1}`}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
              <div className="mt-4">
                {currentQuestion ? (
                  <Card className="p-4">
                    <Card.Header>
                      <Card.Title>Question {currentQuestionIndex + 1}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <p>{currentQuestion.text}</p>
                    </Card.Content>
                    <Card.Footer className="flex justify-between">
                      <Button variant="tertiary" onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} isDisabled={currentQuestionIndex === 0}>
                        Previous
                      </Button>
                      <Button variant="primary" onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} isDisabled={currentQuestionIndex === totalQuestionsInLesson - 1}>
                        Next
                      </Button>
                    </Card.Footer>
                  </Card>
                ) : <p>No active questions.</p>}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
