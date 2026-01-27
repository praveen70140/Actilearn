'use client';
import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Input,
} from '@heroui/react';
import { IconArrowLeft, IconArrowRight, IconPlus } from '@tabler/icons-react';
import { useCourseCreateContext } from '../context/CourseCreateContext';
import { useState } from 'react';
import { LessonType } from './CreateCourseViewer';

export function EditableQuestionsPanel() {
  const {
    courseData,
    setCourseData,
    currentChapterIndex,
    currentLessonIndex,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  } = useCourseCreateContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');

  const currentLesson =
    courseData.chapters[currentChapterIndex]?.lessons[currentLessonIndex];
  const currentQuestion = currentLesson?.questions[currentQuestionIndex];

  const addQuestion = (lesson: LessonType) => {
    // Open modal to add question
    setIsModalOpen(true);
  };
  
  const handleSaveQuestion = () => {
    setCourseData((prevCourse) => {
        const newChapters = [...prevCourse.chapters];
        newChapters[currentChapterIndex].lessons[currentLessonIndex].questions.push({
            questionText: newQuestionText,
            body: {
                type: 'open_ended',
                solution: {},
            },
            solution: 'solution'
        });
        return { ...prevCourse, chapters: newChapters };
    });
    setIsModalOpen(false);
    setNewQuestionText('');
  }

  if (!currentLesson) return null;

  return (
    <div className="bg-default-50 flex h-full w-1/2 flex-col overflow-y-auto p-8">
      <Card className="bg-background border-content2 flex-1 border p-4 shadow-2xl">
        <CardBody className="gap-4 px-4">
          <div className="flex items-center justify-start space-x-2">
            <Button
              isIconOnly
              size="lg"
              variant="light"
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              isDisabled={currentQuestionIndex === 0}
            >
              <IconArrowLeft size={24} className="stroke-secondary" />
            </Button>
            <Select
              className="w-48"
              variant="underlined"
              size="lg"
              selectedKeys={new Set([currentQuestionIndex.toString()])}
              onSelectionChange={(keys) =>
                setCurrentQuestionIndex(Number(Array.from(keys)[0]))
              }
              classNames={{ value: 'text-xl' }}
            >
              {(currentLesson.questions || []).map((_, i) => (
                <SelectItem key={i.toString()} textValue={`Question ${i + 1}`}>
                  Question {i + 1}
                </SelectItem>
              ))}
            </Select>
            <Button
              isIconOnly
              size="lg"
              variant="light"
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              isDisabled={
                currentQuestionIndex === currentLesson.questions.length - 1
              }
            >
              <IconArrowRight size={24} className="stroke-secondary" />
            </Button>
            <Button
              isIconOnly
              size="lg"
              variant="light"
              onPress={() => addQuestion(currentLesson)}
            >
              <IconPlus size={24} className="stroke-secondary" />
            </Button>
          </div>

          <p className="leading-relaxed">{currentQuestion?.questionText}</p>
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Add New Question</ModalHeader>
          <ModalBody>
            <Textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Question Text"
              className="mb-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="light">
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion} color="primary">
              Save Question
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
