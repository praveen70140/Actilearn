'use client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Select,
  SelectItem,
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

  const currentLesson =
    courseData.chapters[currentChapterIndex]?.lessons[currentLessonIndex];
  const currentQuestion = (currentLesson?.questions || [])[currentQuestionIndex];

  // Helper to update the current question in the deeply nested state
  const updateQuestion = (
    updater: (q: LessonType['questions'][number]) => LessonType['questions'][number],
  ) => {
    setCourseData((prev) => {
      const newChapters = [...prev.chapters];
      const chapter = { ...newChapters[currentChapterIndex] };
      const lessons = [...chapter.lessons];
      const lesson = { ...lessons[currentLessonIndex] };
      const questions = [...(lesson.questions || [])];

      if (questions[currentQuestionIndex]) {
        questions[currentQuestionIndex] = updater(
          questions[currentQuestionIndex],
        );
        lesson.questions = questions;
        lessons[currentLessonIndex] = lesson;
        chapter.lessons = lessons;
        newChapters[currentChapterIndex] = chapter;
        return { ...prev, chapters: newChapters };
      }
      return prev;
    });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: 'New Question',
      body: {
        type: QuestionTypes.OPEN_ENDED,
        arguments: { characterCount: null },
        answer: { evaluationPrompt: 'Evaluate the answer.' },
      },
      solution: '',
    };

    const newQuestionIndex = (currentLesson?.questions || []).length;

    setCourseData((prev) => {
      const newChapters = [...prev.chapters];
      const chapter = { ...newChapters[currentChapterIndex] };
      const lessons = [...chapter.lessons];
      const lesson = { ...lessons[currentLessonIndex] };
      const questions = [...(lesson.questions || [])];
      
      questions.push(newQuestion);
      lesson.questions = questions;
      lessons[currentLessonIndex] = lesson;
      chapter.lessons = lessons;
      newChapters[currentChapterIndex] = chapter;
      return { ...prev, chapters: newChapters };
    });

    setCurrentQuestionIndex(newQuestionIndex);
  };
  
  const handleQuestionTypeChange = (newType: QuestionTypes) => {
    updateQuestion(q => {
        if (newType === QuestionTypes.MULTIPLE_CHOICE) {
            return {
                ...q,
                body: {
                    type: QuestionTypes.MULTIPLE_CHOICE,
                    arguments: { options: ['Option 1', 'Option 2'] },
                    answer: { correctIndex: 0 }
                }
            };
        } else { // OPEN_ENDED
            return {
                ...q,
                body: {
                    type: QuestionTypes.OPEN_ENDED,
                    arguments: { characterCount: null },
                    answer: { evaluationPrompt: 'Evaluate the answer.' }
                }
            };
        }
    });
  }

  if (!currentLesson) return null;
  if (!currentQuestion) {
     return (
        <div className="bg-default-50 flex h-full w-1/2 flex-col items-center justify-center p-8">
            <Card className="bg-background border-content2 p-8 shadow-2xl text-center">
                <p className="mb-4">There are no questions in this lesson yet.</p>
                <Button onPress={handleAddQuestion} color="primary">
                    <IconPlus size={16} className="mr-2" />
                    Add the First Question
                </Button>
            </Card>
        </div>
     );
  }

  const isMCQ = currentQuestion.body.type === QuestionTypes.MULTIPLE_CHOICE;

  return (
    <div className="bg-default-50 flex h-full w-1/2 flex-col overflow-y-auto p-8">
      <Card className="bg-background border-content2 flex-1 border p-4 shadow-2xl flex flex-col">
        <CardHeader className="flex items-center justify-start space-x-2">
            <Button isIconOnly size="lg" variant="light" onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} isDisabled={currentQuestionIndex === 0}>
                <IconArrowLeft size={24} className="stroke-secondary" />
            </Button>
            <Select
                className="w-48" variant="underlined" size="lg"
                selectedKeys={new Set([currentQuestionIndex.toString()])}
                onSelectionChange={(keys) => setCurrentQuestionIndex(Number(Array.from(keys)[0]))}
                classNames={{ value: 'text-xl' }}
            >
                {(currentLesson.questions || []).map((_, i) => (
                    <SelectItem key={i.toString()} textValue={`Question ${i + 1}`}>
                        Question {i + 1}
                    </SelectItem>
                ))}
            </Select>
            <Button isIconOnly size="lg" variant="light" onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} isDisabled={currentQuestionIndex >= (currentLesson.questions?.length || 0) - 1}>
                <IconArrowRight size={24} className="stroke-secondary" />
            </Button>
            <Button isIconOnly size="lg" variant="light" onPress={handleAddQuestion}>
                <IconPlus size={24} className="stroke-secondary" />
            </Button>
        </CardHeader>
        <CardBody className="gap-6 px-4 overflow-y-auto flex-1">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Question Type:</span>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">{isMCQ ? 'Multiple Choice' : 'Open Ended'}</Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Question Type" disallowEmptySelection selectionMode="single"
                  selectedKeys={[QuestionTypes[currentQuestion.body.type]]}
                  onSelectionChange={(keys) => handleQuestionTypeChange(QuestionTypes[Array.from(keys)[0] as keyof typeof QuestionTypes])}
                >
                  <DropdownItem key="OPEN_ENDED">Open Ended</DropdownItem>
                  <DropdownItem key="MULTIPLE_CHOICE">Multiple Choice</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Textarea label="Question Text" placeholder="Enter the question prompt" value={currentQuestion.questionText} onChange={e => updateQuestion(q => ({...q, questionText: e.target.value}))} />

            {isMCQ && 'arguments' in currentQuestion.body && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Options</h3>
                {(currentQuestion.body.arguments as {options: string[]}).options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input fullWidth value={option} onChange={e => updateQuestion(q => {
                        const newOptions = [...(q.body.arguments as any).options];
                        newOptions[index] = e.target.value;
                        return {...q, body: {...q.body, arguments: {...q.body.arguments, options: newOptions}}};
                    })} placeholder={`Option ${index + 1}`} />
                    <Tooltip content="Mark as correct">
                      <Button isIconOnly variant={'answer' in currentQuestion.body && (currentQuestion.body.answer as any).correctIndex === index ? 'solid' : 'light'} color={'answer' in currentQuestion.body && (currentQuestion.body.answer as any).correctIndex === index ? 'success' : 'default'} onPress={() => updateQuestion(q => ({...q, body: {...q.body, answer: {correctIndex: index}}}))}>✓</Button>
                    </Tooltip>
                    <Tooltip content="Remove option">
                       <Button isIconOnly variant="light" color="danger" onPress={() => updateQuestion(q => {
                           const newOptions = (q.body.arguments as any).options.filter((_: any, i: number) => i !== index);
                           let newCorrectIndex = (q.body.answer as any).correctIndex;
                           if (index === newCorrectIndex) newCorrectIndex = 0;
                           else if (index < newCorrectIndex) newCorrectIndex -= 1;
                           return {...q, body: {...q.body, arguments: {...q.body.arguments, options: newOptions}, answer: {correctIndex: newCorrectIndex}}};
                       })} isDisabled={(currentQuestion.body.arguments as any).options.length <= 2}>✕</Button>
                    </Tooltip>
                  </div>
                ))}
                <Button onPress={() => updateQuestion(q => {
                    const newOptions = [...(q.body.arguments as any).options, ''];
                    return {...q, body: {...q.body, arguments: {...q.body.arguments, options: newOptions}}};
                })} size="sm" variant="flat">Add Option</Button>
              </div>
            )}

            <Textarea label="Solution Explanation" placeholder="Explain the solution..." value={currentQuestion.solution || ''} onChange={e => updateQuestion(q => ({...q, solution: e.target.value}))} />

        </CardBody>
      </Card>
    </div>
  );
}
