'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, Select, SelectItem } from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { QuestionRenderer } from './QuestionPanelComponents/QuestionRenderer';
import { FeedbackBanner } from './QuestionPanelComponents/FeedbackBanner';
import { SolutionBox } from './QuestionPanelComponents/SolutionBox';
import { useCourseContext } from '../context/CourseContext';
import { QuestionTypes } from '@/lib/enum/question-types';
import { answerCheckStrategyMap } from '@/lib/check-answer-strategy';

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

  // Initialize answer with starter code for coding questions
  useEffect(() => {
    if (currentQuestion?.body.type === QuestionTypes.CODE_EXECUTION) {
      try {
        setAnswer(currentQuestion.body.arguments.initialCode || '');
      } catch (e) {
        setAnswer('');
      }
    } else {
      setAnswer('');
    }
    setIsSubmitted(false);
    setFeedback(null);
  }, [currentQuestion?.questionText, currentQuestionIndex]);

  const handleCheck = () => {
    if (!answer || !currentQuestion) return;
    
    const strategy = answerCheckStrategyMap.get(currentQuestion.body.type);
    if (!strategy) {
      console.error(`No answer check strategy found for question type: ${currentQuestion.body.type}`);
      return;
    }

    const correctAnswer = currentQuestion.body.answer;
    const isCorrect = strategy.check(answer, correctAnswer);

    setIsSubmitted(true);
    setFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 'Correct Answer!' : 'That is not quite right.',
    });
  };

  if (!currentQuestion) return null;

  return (
    <div className="flex h-full w-1/2 flex-col overflow-y-auto bg-[#181825] p-8">
      <div className="mb-6 flex items-center justify-between">
        <Select
          className="w-48"
          variant="bordered"
          size="sm"
          selectedKeys={new Set([currentQuestionIndex.toString()])}
          onSelectionChange={onQuestionChange}
          classNames={{ trigger: 'border-[#313244] bg-[#1e1e2e]', value: 'text-white' }}
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
        <CardBody className="gap-8 px-4">
          <QuestionRenderer
            question={currentQuestion}
            value={answer}
            onChange={setAnswer}
            isDisabled={isSubmitted && feedback?.status === 'correct'}
            onCheck={handleCheck}
          />

          <div className="flex flex-col gap-4">
            <FeedbackBanner feedback={feedback} />
            {isSubmitted && <SolutionBox solution={currentQuestion.solution} />}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
