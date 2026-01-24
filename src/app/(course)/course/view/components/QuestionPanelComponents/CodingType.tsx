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
      {/* Monaco Editor Container */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Code Editor</label>
          <Chip size="sm" variant="faded" color="secondary">
            JavaScript
          </Chip>
        </div>
        <div className="border-content2 bg-content1 relative h-[400px] overflow-hidden rounded-xl border-2">
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
            className="absolute right-4 bottom-4 font-bold shadow-lg"
            variant="ghost"
            color="secondary"
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
          classNames={{ inputWrapper: 'bg-default-100 border-content1' }}
        />
        <Textarea
          isReadOnly
          label="Output Terminal"
          placeholder="Console output will appear here"
          variant="bordered"
          classNames={{
            inputWrapper: 'bg-default-100 border-content1',
            input: 'font-mono',
          }}
        />
      </div>

      {/* Test Cases */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Test Cases</h3>
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
                base: 'bg-background border border-content2 mb-2',
              }}
            >
              <div className="flex flex-col gap-4 p-2">
                <Textarea
                  isReadOnly
                  label="Input"
                  size="sm"
                  classNames={{
                    input: 'font-mono',
                  }}
                  disabled
                  variant="flat"
                  value={test.input}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Textarea
                    isReadOnly
                    label="Expected"
                    size="sm"
                    disabled
                    classNames={{
                      input: 'font-mono',
                    }}
                    variant="flat"
                    value={test.expectedOutput}
                  />
                  <Textarea
                    isReadOnly
                    label="Actual"
                    size="sm"
                    disabled
                    classNames={{
                      input: 'font-mono',
                    }}
                    variant="flat"
                    value={i === 2 ? 'Error' : test.expectedOutput}
                  />
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
