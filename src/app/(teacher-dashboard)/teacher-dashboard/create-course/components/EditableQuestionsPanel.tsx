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
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { IconArrowLeft, IconArrowRight, IconPlus } from '@tabler/icons-react';
import { useCourseCreateContext } from '../context/CourseCreateContext';
import { useState } from 'react';
import { LessonType } from './CreateCourseViewer';
import { QuestionTypes } from '@/lib/enum/question-types';

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
  const [newQuestionType, setNewQuestionType] = useState<QuestionTypes>(
    QuestionTypes.OPEN_ENDED,
  );
  const [mcqOptions, setMcqOptions] = useState<string[]>(['', '']);
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState<number | null>(null);

  const currentLesson =
    courseData.chapters[currentChapterIndex]?.lessons[currentLessonIndex];
  const currentQuestion = (currentLesson?.questions || [])[currentQuestionIndex];

  const addQuestion = (lesson: LessonType) => {
    // Open modal to add question
    setIsModalOpen(true);
  };
  
  const handleSaveQuestion = () => {
    setCourseData((prevCourse) => {
      const newChapters = [...prevCourse.chapters];
      const chapter = newChapters[currentChapterIndex];
      if (!chapter) return prevCourse;
      const lesson = chapter.lessons[currentLessonIndex];
      if (!lesson) return prevCourse;

      let newQuestion;

      if (newQuestionType === QuestionTypes.MULTIPLE_CHOICE) {
        if (mcqOptions.some(opt => opt.trim() === '') || mcqOptions.length < 2 || mcqCorrectIndex === null) {
          // Here you might want to show an error to the user
          console.error("MCQ requires at least 2 options and a correct answer.");
          return prevCourse;
        }
        newQuestion = {
          questionText: newQuestionText,
          body: {
            type: QuestionTypes.MULTIPLE_CHOICE,
            arguments: {
              options: mcqOptions,
            },
            answer: {
              correctIndex: mcqCorrectIndex,
            },
          },
          solution: `The correct answer is option ${mcqCorrectIndex + 1}.`,
        };
      } else { // OPEN_ENDED
        newQuestion = {
          questionText: newQuestionText,
          body: {
            type: QuestionTypes.OPEN_ENDED,
            arguments: {
              characterCount: null,
            },
            answer: {
              evaluationPrompt: 'The user has provided an answer, please evaluate it.',
            },
          },
          solution: 'A sample solution text would go here.',
        };
      }
      
      const existingQuestions = lesson.questions || [];
      lesson.questions = [...existingQuestions, newQuestion];
      
      return { ...prevCourse, chapters: newChapters };
    });

    // Reset state and close modal
    setIsModalOpen(false);
    setNewQuestionText('');
    setNewQuestionType(QuestionTypes.OPEN_ENDED);
    setMcqOptions(['', '']);
    setMcqCorrectIndex(null);
  };

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
                currentQuestionIndex >= (currentLesson.questions?.length || 0) - 1
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
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm">Question Type:</span>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    {newQuestionType === QuestionTypes.OPEN_ENDED
                      ? 'Open Ended'
                      : 'Multiple Choice'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Question Type"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={[QuestionTypes[newQuestionType]]}
                  onSelectionChange={(keys) =>
                    setNewQuestionType(
                      QuestionTypes[
                        Array.from(keys)[0] as keyof typeof QuestionTypes
                      ],
                    )
                  }
                >
                  <DropdownItem key="OPEN_ENDED">Open Ended</DropdownItem>
                  <DropdownItem key="MULTIPLE_CHOICE">
                    Multiple Choice
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <Textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Question Text"
              className="mb-4"
            />
            {newQuestionType === QuestionTypes.MULTIPLE_CHOICE && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Options</h3>
                {mcqOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...mcqOptions];
                        newOptions[index] = e.target.value;
                        setMcqOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Tooltip content="Mark as correct">
                      <Button
                        isIconOnly
                        variant={mcqCorrectIndex === index ? 'solid' : 'light'}
                        color={mcqCorrectIndex === index ? 'success' : 'default'}
                        onPress={() => setMcqCorrectIndex(index)}
                      >
                        ✓
                      </Button>
                    </Tooltip>
                    <Tooltip content="Remove option">
                       <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => {
                          const newOptions = mcqOptions.filter((_, i) => i !== index);
                          setMcqOptions(newOptions);
                          if (mcqCorrectIndex === index) {
                            setMcqCorrectIndex(null);
                          } else if (mcqCorrectIndex && mcqCorrectIndex > index) {
                            setMcqCorrectIndex(mcqCorrectIndex - 1);
                          }
                        }}
                      >
                        ✕
                      </Button>
                    </Tooltip>
                  </div>
                ))}
                <Button
                  onPress={() => setMcqOptions([...mcqOptions, ''])}
                  size="sm"
                  variant="flat"
                >
                  Add Option
                </Button>
              </div>
            )}
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
