'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Select, SelectItem } from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { QuestionRenderer } from './QuestionPanelComponents/QuestionRenderer';
import { FeedbackBanner } from './QuestionPanelComponents/FeedbackBanner';
import { SolutionBox } from './QuestionPanelComponents/SolutionBox';
import { useCourseContext } from '../context/CourseContext';
import { QuestionTypes } from '@/lib/enum/question-types';
import { submitAnswer } from '@/actions/submit-answer';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { answerCheckStrategyMap } from '@/lib/check-answer-strategy';

export function QuestionsPanel() {
  const {
    courseData,
    currentChapterIndex,
    currentLesson,
    currentLessonIndex,
    currentQuestion,
    currentQuestionIndex,
    onQuestionChange,
    onPrevQuestion,
    onNextQuestion,
    currentQuestionResponse,
    setResponse,
  } = useCourseContext();

  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionStatus = currentQuestionResponse?.evaluation;
  const isSubmitted = submissionStatus !== undefined && submissionStatus !== EvaluationStatus.PENDING;
  const isCorrect = submissionStatus === EvaluationStatus.CORRECT;

  useEffect(() => {
    const previousAnswer = currentQuestionResponse?.response?.[0];
    if (previousAnswer) {
      setAnswer(previousAnswer);
    } else if (currentQuestion?.body.type === QuestionTypes.CODE_EXECUTION) {
      setAnswer(currentQuestion.body.arguments.initialCode || '');
    } else {
      setAnswer('');
    }
  }, [currentQuestion, currentQuestionResponse]);

  const handleSubmit = async () => {
    if (!answer || !currentQuestion) return;

    setIsSubmitting(true);
    const result = await submitAnswer(
      courseData.id,
      currentChapterIndex,
      currentLessonIndex,
      currentQuestionIndex,
      answer,
    );
    setIsSubmitting(false);

    if (result.error) {
      // Handle error appropriately
      console.error(result.error);
      return;
    }

    // This is a temporary way to update the response on the client.
    // Ideally, the action should return the full updated response document.
    setResponse((prev) => {
      const newResponse = JSON.parse(JSON.stringify(prev || { chapters: [] }));
      if (!newResponse.chapters[currentChapterIndex]) {
        newResponse.chapters[currentChapterIndex] = { lessons: [] };
      }
      if (!newResponse.chapters[currentChapterIndex].lessons[currentLessonIndex]) {
        newResponse.chapters[currentChapterIndex].lessons[currentLessonIndex] = { questions: [] };
      }
      newResponse.chapters[currentChapterIndex].lessons[currentLessonIndex].questions[currentQuestionIndex] = {
        response: [answer],
        evaluation: result.evaluation,
      };
      return newResponse;
    });
  };

  if (!currentQuestion) return null;

  const feedback = isSubmitted
    ? {
        status: isCorrect ? ('correct' as const) : ('incorrect' as const),
        message: isCorrect
          ? 'Well done! That is the correct answer.'
          : 'That is not quite right. Please try again or view the solution.',
      }
    : null;

  return (
    <div className="bg-default-50 flex h-full w-1/2 flex-col overflow-y-auto p-8">
      <Card className="bg-background border-content2 flex-1 border p-4 shadow-2xl">
        <CardBody className="gap-4 px-4">
          <div className="flex items-center justify-start space-x-2">
            <Button isIconOnly size="lg" variant="light" onPress={onPrevQuestion}>
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
            <Button isIconOnly size="lg" variant="light" onPress={onNextQuestion}>
              <IconArrowRight size={24} className="stroke-secondary" />
            </Button>
          </div>

          <p className="leading-relaxed">{currentQuestion.questionText}</p>

          <QuestionRenderer
            question={currentQuestion}
            value={answer}
            onChange={setAnswer}
            isDisabled={isCorrect || isSubmitting}
          />

          <div className="flex flex-col gap-4">
            <FeedbackBanner feedback={feedback} />
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground"
              onPress={handleSubmit}
              isDisabled={isCorrect || isSubmitting}
              isLoading={isSubmitting}
            >
              {isCorrect ? 'Correct!' : 'Submit Solution'}
            </Button>
            {isSubmitted && <SolutionBox solution={currentQuestion.solution} />}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
