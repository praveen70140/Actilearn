'use client';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem, // Correct import
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
      {/* Question Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* Corrected HeroUI Select Syntax */}
          <Select
            className="w-48"
            variant="bordered"
            size="sm"
            disallowEmptySelection
            aria-label="Select Question"
            selectedKeys={new Set([currentQuestion.id.toString()])}
            onSelectionChange={(keys) => onQuestionChange(keys)}
          >
            {lesson.questions.map((q: any, i: number) => (
              <SelectItem key={q.id} textValue={`Question ${i + 1}`}>
                Question {i + 1}
              </SelectItem>
            ))}
          </Select>

          <div className="flex border border-[#313244] rounded-lg overflow-hidden">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={onPrevQuestion}
              isDisabled={currentQuestionIndex === 0}
              className="rounded-none border-r border-[#313244]"
            >
              <IconArrowLeft size={16} />
            </Button>
            <Button
              isIconOnly
              variant="light"
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

      {/* Corrected HeroUI Card Syntax */}
      <Card className="bg-[#1e1e2e] border border-[#313244] p-4 flex-1 shadow-2xl">
        <CardHeader className="flex flex-col items-start px-6">
          <p className="text-tiny uppercase font-bold text-[#585b70]">Step {currentQuestionIndex + 1}</p>
          <h4 className="text-xl font-bold text-white">Question {currentQuestionIndex + 1}</h4>
        </CardHeader>
        <CardBody className="px-6">
          <p className="text-lg leading-relaxed text-[#bac2de]">
            {currentQuestion.text}
          </p>
          <div className="mt-12 h-32 border-2 border-dashed border-[#313244] rounded-2xl flex items-center justify-center text-[#585b70]">
            Interactive Response Area
          </div>
        </CardBody>
      </Card>

      <p className="mt-4 text-center text-[10px] text-[#45475a] uppercase tracking-widest">
        Knowledge check for {lesson.title}
      </p>
    </div>
  );
}
