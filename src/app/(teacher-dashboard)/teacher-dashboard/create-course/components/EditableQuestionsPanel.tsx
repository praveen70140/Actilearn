'use client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
import { LessonType } from './CreateCourseViewer';
import { QuestionTypes } from '@/lib/enum/question-types';
import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';

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
        } else if (newType === QuestionTypes.NUMERICAL) {
            return {
                ...q,
                body: {
                    type: QuestionTypes.NUMERICAL,
                    arguments: { precision: 2 },
                    answer: { correctNumber: 0 }
                }
            };
        } else if (newType === QuestionTypes.CODE_EXECUTION) {
            return {
                ...q,
                body: {
                    type: QuestionTypes.CODE_EXECUTION,
                    arguments: {
                      // Mirrors your sample course shape
                      languages: [codeExecutionLanguages.javascript.id, codeExecutionLanguages.python.id],
                      initialCode: 'function addNumbers(a, b) {\n  // Write your code here\n}',
                    },
                    answer: {
                      testCases: [
                        { input: '2,3', expectedOutput: '5' },
                      ],
                    },
                },
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
  const isNumerical = currentQuestion.body.type === QuestionTypes.NUMERICAL;
  const isCodeExecution = currentQuestion.body.type === QuestionTypes.CODE_EXECUTION;

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
                  <Button variant="bordered">
                    {isMCQ
                      ? 'Multiple Choice'
                      : isNumerical
                        ? 'Numerical'
                        : isCodeExecution
                          ? 'Code Execution'
                          : 'Open Ended'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Question Type" disallowEmptySelection selectionMode="single"
                  selectedKeys={[QuestionTypes[currentQuestion.body.type]]}
                  onSelectionChange={(keys) => handleQuestionTypeChange(QuestionTypes[Array.from(keys)[0] as keyof typeof QuestionTypes])}
                >
                  <DropdownItem key="OPEN_ENDED">Open Ended</DropdownItem>
                  <DropdownItem key="MULTIPLE_CHOICE">Multiple Choice</DropdownItem>
                  <DropdownItem key="NUMERICAL">Numerical</DropdownItem>
                  <DropdownItem key="CODE_EXECUTION">Code Execution</DropdownItem>
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

            {isNumerical && 'arguments' in currentQuestion.body && (
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  label="Precision"
                  placeholder="Enter decimal precision (e.g., 2 for 0.01)"
                  value={`${(currentQuestion.body.arguments as {precision: number}).precision}`}
                  onChange={e => updateQuestion(q => {
                    const precision = parseInt(e.target.value) || 0;
                    return {
                      ...q,
                      body: {
                        ...q.body,
                        arguments: { ...q.body.arguments, precision: Math.max(0, precision) }
                      }
                    };
                  })}
                  description="Number of decimal places allowed (0 = integers only)"
                  min={0}
                />
                <Input
                  type="number"
                  label="Correct Answer"
                  placeholder="Enter the correct numerical answer"
                  value={`${(currentQuestion.body.answer as {correctNumber: number}).correctNumber}`}
                  onChange={e => updateQuestion(q => {
                    const correctNumber = parseFloat(e.target.value) || 0;
                    return {
                      ...q,
                      body: {
                        ...q.body,
                        answer: { ...q.body.answer, correctNumber }
                      }
                    };
                  })}
                  step="any"
                />
              </div>
            )}

            {isCodeExecution && 'arguments' in currentQuestion.body && 'answer' in currentQuestion.body && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">Languages</h3>
                  <Select
                    selectionMode="multiple"
                    selectedKeys={
                      new Set(
                        ((currentQuestion.body.arguments as any).languages as number[]).map((id) =>
                          id.toString(),
                        ),
                      )
                    }
                    onSelectionChange={(keys) =>
                      updateQuestion((q) => {
                        const selected = Array.from(keys).map((k) => Number(k));
                        return {
                          ...q,
                          body: {
                            ...q.body,
                            arguments: { ...(q.body.arguments as any), languages: selected },
                          },
                        };
                      })
                    }
                    className="max-w-md"
                    variant="bordered"
                    placeholder="Select allowed languages"
                  >
                    {Object.values(codeExecutionLanguages).map((lang) => (
                      <SelectItem key={lang.id.toString()} textValue={lang.label}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">Initial Code</h3>
                  <Textarea
                    label="Starter code"
                    placeholder="Provide starter code shown to learners..."
                    minRows={6}
                    value={`${((currentQuestion.body.arguments as any).initialCode ?? '') as string}`}
                    onChange={(e) =>
                      updateQuestion((q) => ({
                        ...q,
                        body: {
                          ...q.body,
                          arguments: {
                            ...(q.body.arguments as any),
                            initialCode: e.target.value.length ? e.target.value : null,
                          },
                        },
                      }))
                    }
                    classNames={{ input: 'font-mono' }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Test Cases</h3>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() =>
                        updateQuestion((q) => {
                          const prev = ((q.body.answer as any).testCases ?? []) as {
                            input: string | null;
                            expectedOutput: string;
                          }[];
                          const next = [...prev, { input: '', expectedOutput: '' }];
                          return { ...q, body: { ...q.body, answer: { ...(q.body.answer as any), testCases: next } } };
                        })
                      }
                    >
                      Add Test Case
                    </Button>
                  </div>

                  {(((currentQuestion.body.answer as any).testCases ?? []) as any[]).map(
                    (tc, idx) => (
                      <Card key={idx} className="bg-background border-content2 border p-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm font-medium">Test #{idx + 1}</div>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isDisabled={(((currentQuestion.body.answer as any).testCases ?? []) as any[]).length <= 1}
                            onPress={() =>
                              updateQuestion((q) => {
                                const prev = ((q.body.answer as any).testCases ?? []) as any[];
                                const next = prev.filter((_: any, i: number) => i !== idx);
                                return { ...q, body: { ...q.body, answer: { ...(q.body.answer as any), testCases: next } } };
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Textarea
                            label="Input"
                            placeholder='e.g. "2,3" (or empty)'
                            value={`${tc.input ?? ''}`}
                            onChange={(e) =>
                              updateQuestion((q) => {
                                const prev = ((q.body.answer as any).testCases ?? []) as any[];
                                const next = [...prev];
                                next[idx] = { ...next[idx], input: e.target.value.length ? e.target.value : null };
                                return { ...q, body: { ...q.body, answer: { ...(q.body.answer as any), testCases: next } } };
                              })
                            }
                            classNames={{ input: 'font-mono' }}
                          />
                          <Textarea
                            label="Expected Output"
                            placeholder='e.g. "5"'
                            value={`${tc.expectedOutput ?? ''}`}
                            onChange={(e) =>
                              updateQuestion((q) => {
                                const prev = ((q.body.answer as any).testCases ?? []) as any[];
                                const next = [...prev];
                                next[idx] = { ...next[idx], expectedOutput: e.target.value };
                                return { ...q, body: { ...q.body, answer: { ...(q.body.answer as any), testCases: next } } };
                              })
                            }
                            classNames={{ input: 'font-mono' }}
                          />
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>
            )}

            <Textarea label="Solution Explanation" placeholder="Explain the solution..." value={currentQuestion.solution || ''} onChange={e => updateQuestion(q => ({...q, solution: e.target.value}))} />

        </CardBody>
      </Card>
    </div>
  );
}
