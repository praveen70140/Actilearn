'use client';
import {
  Accordion,
  AccordionItem,
  Button,
  Textarea,
  Chip,
} from '@heroui/react';
import { Editor } from '@monaco-editor/react';
import {
  IconCheck,
  IconX,
  IconPlayerPlay,
  IconChevronDown,
} from '@tabler/icons-react';
import { CodeExecutionQuestion } from '../../page';

interface Props {
  question: CodeExecutionQuestion;
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const CodingType = ({
  question,
  value,
  onChange,
  isDisabled,
}: Props) => {
  const testCases = question.body.answer.testCases || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Question</h2>
        <p className="mt-2 leading-relaxed text-[#bac2de]">
          {question.questionText}
        </p>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#9399b2]">
            Code Editor
          </label>
          <Chip
            size="sm"
            variant="flat"
            className="bg-[#313244] text-[#cdd6f4]"
          >
            JavaScript
          </Chip>
        </div>
        <div className="relative h-[400px] overflow-hidden rounded-xl border-2 border-[#313244] bg-[#1e1e2e]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={value}
            onChange={(e) => onChange(e || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 20 },
              automaticLayout: true,
            }}
          />
          <Button
            size="sm"
            onPress={() => alert('Running code...')}
            isDisabled={isDisabled}
            className="absolute right-4 bottom-4 bg-[#fab387] font-bold text-[#1e1e2e] shadow-lg"
            startContent={<IconPlayerPlay size={16} />}
          >
            Run
          </Button>
        </div>
      </div>

      {/* Terminals */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea
          label="Input Terminal"
          placeholder="Custom input for testing..."
          variant="bordered"
          classNames={{ inputWrapper: 'bg-[#181825] border-[#313244]' }}
        />
        <Textarea
          isReadOnly
          label="Output Terminal"
          placeholder="Console output will appear here"
          variant="bordered"
          classNames={{
            inputWrapper: 'bg-[#181825] border-[#313244] opacity-70',
            input: 'font-mono',
          }}
        />
      </div>

      {/* Test Cases */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-white">Test Cases</h3>
        <Accordion variant="splitted" selectionMode="multiple">
          {testCases.map((test: any, i: number) => (
            <AccordionItem
              key={i}
              title={`Test #${i + 1}`}
              indicator={<IconChevronDown size={18} />}
              startContent={
                i === 2 ? (
                  <IconX className="text-danger" />
                ) : (
                  <IconCheck className="text-success" />
                )
              }
              classNames={{
                base: 'bg-[#1e1e2e] border border-[#313244] mb-2',
                title: 'text-sm text-[#cdd6f4]',
              }}
            >
              <div className="flex flex-col gap-4 p-2">
                <Textarea
                  isReadOnly
                  label="Input"
                  size="sm"
                  variant="flat"
                  value={test.input}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Textarea
                    isReadOnly
                    label="Expected"
                    size="sm"
                    variant="flat"
                    value={test.expectedOutput}
                  />
                  <Textarea
                    isReadOnly
                    label="Actual"
                    size="sm"
                    variant="flat"
                    value={i === 2 ? 'Error' : test.expectedOutput}
                  />
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Button
        isDisabled={isDisabled}
        size="lg"
        className="bg-primary h-14 w-full font-bold text-white"
      >
        Submit Solution
      </Button>
    </div>
  );
};
