'use client';
import { useState, useEffect, useTransition } from 'react';
import { Button, Card, CardBody, Select, SelectItem } from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { QuestionRenderer } from './QuestionPanelComponents/QuestionRenderer';
import { FeedbackBanner } from './QuestionPanelComponents/FeedbackBanner';
import { SolutionBox } from './QuestionPanelComponents/SolutionBox';
import { useCourseContext } from '../context/CourseContext';
import { QuestionTypes } from '@/lib/enum/question-types';
import { submitAnswer } from '@/actions/submit-answer';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { responseAllSchema } from '@/lib/zod/responses';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseType } from '../CourseViewer';
import FormError from '@/components/form/form-error';

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

  // const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionStatus = currentQuestionResponse?.evaluation;
  const isSubmitted =
    submissionStatus !== undefined &&
    submissionStatus !== EvaluationStatus.PENDING &&
    submissionStatus !== EvaluationStatus.SKIPPED;
  const isCorrect = submissionStatus === EvaluationStatus.CORRECT;

  const [error, setError] = useState<string | undefined>(undefined);

  const methods = useForm<z.infer<typeof responseAllSchema>>({
    resolver: zodResolver(responseAllSchema),
    defaultValues: {
      body: {},
      type: QuestionTypes.NUMERICAL,
    },
    mode: 'onChange',
  });

  const responses = methods.watch('body');
  const [isPending, startTransition] = useTransition();

  const formType = methods.watch('type');

  useEffect(() => {
    methods.reset({
      type: currentQuestion?.body.type as any,
      body: responses as any,
    });
  }, [currentQuestion, currentQuestionResponse]);

  const handleSubmit = async () => {
    console.log('clicked');

    const rawFormData = methods.getValues();

    if (!rawFormData.body || !currentQuestion) return;

    const validatedFields = await responseAllSchema.safeParse(rawFormData);
    if (validatedFields.error) {
      setError(validatedFields.error.message);
      return;
    }
    const { data: formData } = validatedFields;

    startTransition(async () => {
      const result = await submitAnswer(
        courseData.slug,
        currentChapterIndex,
        currentLessonIndex,
        currentQuestionIndex,
        methods.getValues(),
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setResponse((prev: ResponseType) => {
        const newResponse = JSON.parse(
          JSON.stringify(prev || { chapters: [] }),
        );
        if (!newResponse.chapters[currentChapterIndex]) {
          newResponse.chapters[currentChapterIndex] = { lessons: [] };
        }
        if (
          !newResponse.chapters[currentChapterIndex].lessons[currentLessonIndex]
        ) {
          newResponse.chapters[currentChapterIndex].lessons[
            currentLessonIndex
          ] = { questions: [] };
        }
        newResponse.chapters[currentChapterIndex].lessons[
          currentLessonIndex
        ].questions[currentQuestionIndex] = {
          response: formData.body,
          evaluation: result.data?.evaluationStatus,
        };
        return newResponse;
      });
    });

    // This is a temporary way to update the response on the client.
    // Ideally, the action should return the full updated response document.
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
    <FormProvider {...methods}>
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
                  <SelectItem
                    key={i.toString()}
                    textValue={`Question ${i + 1}`}
                  >
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
              isDisabled={isCorrect || isPending}
            />

            <div className="flex flex-col gap-4">
              <FormError message={error} />
              <FeedbackBanner feedback={feedback} />
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground"
                onPress={handleSubmit}
                isDisabled={isCorrect || isPending}
                isLoading={isPending}
              >
                {isCorrect ? 'Correct!' : 'Submit Solution'}
              </Button>
              {isSubmitted && (
                <SolutionBox solution={currentQuestion.solution} />
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </FormProvider>
  );
}
