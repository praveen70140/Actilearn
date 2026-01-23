'use client';
import { useState, useEffect, Key } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
} from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { QuestionRenderer } from './QuestionPanelComponents/QuestionRenderer';
import { FeedbackBanner } from './QuestionPanelComponents/FeedbackBanner';
import { SolutionBox } from './QuestionPanelComponents/SolutionBox';
import { LessonType, QuestionType } from '@/app/(course)/course/view/page';
import { QuestionTypes } from '@/lib/enum/question-types';

interface QuestionsPanelProps {
  lesson: LessonType;
  currentQuestion: QuestionType;
  currentQuestionIndex: number;
  onQuestionChange: (keys: Set<Key> | any) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
}

export function QuestionsPanel({
  lesson,
  currentQuestion,
  currentQuestionIndex,
  onQuestionChange,
  onPrevQuestion,
  onNextQuestion,
}: QuestionsPanelProps) {
  const [answer, setAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'incorrect';
    message: string;
  } | null>(null);

  useEffect(() => {
    setAnswer('');
    setIsSubmitted(false);
    setFeedback(null);
  }, [currentQuestion.questionText]);

  const handleCheck = () => {
    if (!answer) return;
    let isCorrect = false;
    const correctAnswer = JSON.parse(currentQuestion.answer as string)
      .correctAnswer;

    if (currentQuestion.questionType === QuestionTypes.MULTIPLE_CHOICE) {
      isCorrect = parseInt(answer) === correctAnswer;
    } else if (currentQuestion.questionType === QuestionTypes.NUMERICAL) {
      isCorrect = parseFloat(answer) === correctAnswer;
    } else if (currentQuestion.questionType === QuestionTypes.OPEN_ENDED) {
      isCorrect = answer.trim().length > 10;
    }

    setIsSubmitted(true);
    setFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 'Correct Answer!' : 'That is not quite right.',
    });
  };

  return (
    <div className="flex h-full w-1/2 flex-col overflow-y-auto bg-[#181825] p-8">
      <div className="mb-6 flex items-center justify-between">
        {/* FIXED SELECT COMPONENT */}
        <Select
          className="w-48"
          variant="bordered"
          size="sm"
          aria-label="Select Question"
          selectedKeys={new Set([currentQuestionIndex.toString()])}
          onSelectionChange={onQuestionChange}
          classNames={{
            trigger:
              'border-[#313244] bg-[#1e1e2e] data-[hover=true]:border-primary',
            value: 'text-white font-medium',
            popoverContent: 'bg-[#1e1e2e] border border-[#313244]',
            listbox: 'bg-[#1e1e2e]',
          }}
        >
          {lesson.questions?.map((q, i) => (
            <SelectItem
              key={i.toString()}
              textValue={`Question ${i + 1}`}
              className="text-[#bac2de] data-[hover=true]:bg-[#2a2a3c] data-[hover=true]:text-white"
            >
              Question {i + 1}
            </SelectItem>
          ))}
        </Select>

        <div className="flex overflow-hidden rounded-lg border border-[#313244] bg-[#1e1e2e]">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onPrevQuestion}
            isDisabled={currentQuestionIndex === 0}
            className="text-[#bac2de] hover:text-white"
          >
            <IconArrowLeft size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onNextQuestion}
            isDisabled={
              !lesson.questions ||
              currentQuestionIndex === lesson.questions.length - 1
            }
            className="text-[#bac2de] hover:text-white"
          >
            <IconArrowRight size={16} />
          </Button>
        </div>
      </div>

      <Card className="flex-1 border border-[#313244] bg-[#1e1e2e] p-6 shadow-2xl">
        <CardHeader className="flex flex-col items-start px-4">
          <p className="text-tiny font-bold text-[#585b70] uppercase">
            Step {currentQuestionIndex + 1}
          </p>
          <h4 className="text-2xl font-bold text-white">
            Question {currentQuestionIndex + 1}
          </h4>
        </CardHeader>
        <CardBody className="gap-8 px-4">
          <p className="text-lg text-[#bac2de]">
            {currentQuestion.questionText}
          </p>
          <QuestionRenderer
            question={currentQuestion}
            value={answer}
            onChange={setAnswer}
            isDisabled={isSubmitted && feedback?.status === 'correct'}
          />
          <div className="flex flex-col gap-4">
            <Button
              color={feedback?.status === 'correct' ? 'success' : 'primary'}
              onPress={handleCheck}
              isDisabled={
                !answer || (isSubmitted && feedback?.status === 'correct')
              }
              className="h-12 font-bold text-black data-[color=primary]:text-white"
            >
              Check Answer
            </Button>
            <FeedbackBanner feedback={feedback} />
            {isSubmitted && (
              <SolutionBox solution={currentQuestion.solution} />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
