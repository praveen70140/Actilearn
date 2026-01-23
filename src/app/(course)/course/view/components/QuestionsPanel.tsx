'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, Select, SelectItem } from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { QuestionRenderer } from './QuestionPanelComponents/QuestionRenderer';
import { FeedbackBanner } from './QuestionPanelComponents/FeedbackBanner';
import { SolutionBox } from './QuestionPanelComponents/SolutionBox';
import { useCourseContext } from '../context/CourseContext';
import { QuestionTypes } from '@/lib/enum/question-types';

export function QuestionsPanel() {
  const {
    currentLesson,
    currentQuestion,
    currentQuestionIndex,
    onQuestionChange,
    onPrevQuestion,
    onNextQuestion,
  } = useCourseContext();

  const [answer, setAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'incorrect';
    message: string;
  } | null>(null);

  // FIX: Use optional chaining to prevent crash if currentQuestion is null
  useEffect(() => {
    setAnswer('');
    setIsSubmitted(false);
    setFeedback(null);
  }, [currentQuestion?.questionText, currentQuestionIndex]);

  const handleCheck = () => {
    if (!answer || !currentQuestion) return;
    let isCorrect = false;
    const answerData = JSON.parse(currentQuestion.answer as string);
    const correctAnswer = answerData.correctAnswer;

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

  if (!currentQuestion) {
    return (
      <div className="flex h-full w-1/2 flex-col items-center justify-center bg-[#181825] p-8 text-center">
        <p className="text-lg text-[#9399b2]">This lesson has no assessment questions.</p>
        <p className="text-sm text-[#585b70] mt-2">You can proceed to the next lesson using the header.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-1/2 flex-col overflow-y-auto bg-[#181825] p-8">
      <div className="mb-6 flex items-center justify-between">
        <Select
          className="w-48"
          variant="bordered"
          size="sm"
          aria-label="Select Question"
          selectedKeys={new Set([currentQuestionIndex.toString()])}
          onSelectionChange={onQuestionChange}
          classNames={{
            trigger: 'border-[#313244] bg-[#1e1e2e]',
            value: 'text-white font-medium',
          }}
        >
          {(currentLesson.questions || []).map((_, i) => (
            <SelectItem key={i.toString()} textValue={`Question ${i + 1}`}>
              Question {i + 1}
            </SelectItem>
          ))}
        </Select>

        <div className="flex overflow-hidden rounded-lg border border-[#313244] bg-[#1e1e2e]">
          <Button isIconOnly size="sm" variant="light" onPress={onPrevQuestion}>
            <IconArrowLeft size={16} />
          </Button>
          <Button isIconOnly size="sm" variant="light" onPress={onNextQuestion}>
            <IconArrowRight size={16} />
          </Button>
        </div>
      </div>

      <Card className="flex-1 border border-[#313244] bg-[#1e1e2e] p-6 shadow-2xl">
        <CardHeader className="flex flex-col items-start px-4">
          <p className="text-tiny font-bold text-[#585b70] uppercase">Question {currentQuestionIndex + 1}</p>
          <h4 className="text-2xl font-bold text-white mt-1">Practice Task</h4>
        </CardHeader>
        <CardBody className="gap-8 px-4">
          <p className="text-lg text-[#bac2de]">{currentQuestion.questionText}</p>
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
              isDisabled={!answer || (isSubmitted && feedback?.status === 'correct')}
              className="h-12 font-bold"
            >
              Check Answer
            </Button>
            <FeedbackBanner feedback={feedback} />
            {isSubmitted && <SolutionBox solution={currentQuestion.solution} />}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
