'use client';

import {
  Button,
  Card,
  Select,
  ListBox
} from '@heroui/react';
import {
  IconArrowLeft,
  IconArrowRight,
  IconHelpCircle
} from '@tabler/icons-react';

export function QuestionsPanel({
  lesson,
  currentQuestion,
  currentQuestionIndex,
  onQuestionChange,
  onPrevQuestion,
  onNextQuestion,
}: any) {
  return (
    <div className="w-1/2 p-8 flex flex-col bg-[#181825]">
      {/* Question Navigation Bar (Top-Inside-Section) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Select
            className="w-40 text-sm"
            variant="secondary"
            selectedKey={currentQuestion.id}
            onSelectionChange={onQuestionChange}
          >
            <Select.Trigger className="h-8 min-h-8">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {lesson.questions.map((q: any, i: number) => (
                  <ListBox.Item key={q.id} id={q.id} textValue={`Q${i + 1}`}>
                    Question {i + 1}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Distinguishable Question-level Prev/Next */}
          <div className="flex border border-[#313244] rounded-lg overflow-hidden">
            <Button
              isIconOnly
              variant="tertiary"
              size="sm"
              onPress={onPrevQuestion}
              isDisabled={currentQuestionIndex === 0}
              className="rounded-none border-r border-[#313244]"
            >
              <IconArrowLeft size={16} />
            </Button>
            <Button
              isIconOnly
              variant="tertiary"
              size="sm"
              onPress={onNextQuestion}
              isDisabled={currentQuestionIndex === lesson.questions.length - 1}
              className="rounded-none"
            >
              <IconArrowRight size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#585b70]">
          <IconHelpCircle size={14} />
          <span>{currentQuestionIndex + 1} of {lesson.questions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-[#1e1e2e] border border-[#313244] p-8 flex-1 shadow-2xl">
        <Card.Header>
          <Card.Title className="text-xl">Question {currentQuestionIndex + 1}</Card.Title>
        </Card.Header>
        <Card.Content className="mt-4">
          <p className="text-lg leading-relaxed text-[#bac2de]">
            {currentQuestion.text}
          </p>
          <div className="mt-12 h-32 border-2 border-dashed border-[#313244] rounded-2xl flex items-center justify-center text-[#585b70]">
            Interactive Response Area
          </div>
        </Card.Content>
      </Card>

      <p className="mt-4 text-center text-[10px] text-[#45475a] uppercase tracking-widest">
        Knowledge check for {lesson.title}
      </p>
    </div>
  );
}
