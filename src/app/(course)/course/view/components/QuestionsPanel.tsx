'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Select, SelectItem } from '@heroui/react';
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
      console.error(
        `No answer check strategy found for question type: ${currentQuestion.body.type}`,
      );
      return;
    }

    const correctAnswer = currentQuestion.body.answer;
    const isCorrect = strategy.check(answer, correctAnswer);

    setIsSubmitted(true);
    setFeedback(null);
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-default-50 flex h-full w-1/2 flex-col overflow-y-auto p-8">
      <Card className="bg-background border-content2 flex-1 border p-4 shadow-2xl">
        <CardBody className="gap-4 px-4">
          <div className="flex items-center justify-start space-x-2">
            <Button
              isIconOnly
              size="lg"
              variant="light"
              onPress={onPrevQuestion}
            >
              <IconArrowLeft size={24} className="stroke-secondary" />
            </Button>
            <Select
              className="w-48"
              variant="underlined"
              size="lg"
              selectedKeys={new Set([currentQuestionIndex.toString()])}
              onSelectionChange={onQuestionChange}
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
              onPress={onNextQuestion}
            >
              <IconArrowRight size={24} className="stroke-secondary" />
            </Button>
          </div>

          <p className="leading-relaxed">{currentQuestion.questionText}</p>

          <QuestionRenderer
            question={currentQuestion}
            value={answer}
            onChange={setAnswer}
            isDisabled={isSubmitted && feedback?.status === 'correct'}
            onCheck={handleCheck}
          />

          <div className="flex flex-col gap-4">
            <FeedbackBanner feedback={feedback} />
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground"
            >
              Submit Solution
            </Button>
            {<SolutionBox solution={currentQuestion.solution} />}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
