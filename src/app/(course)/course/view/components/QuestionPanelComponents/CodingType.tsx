'use client';
import {
  Accordion,
  AccordionItem,
  Button,
  Textarea,
  Chip,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
} from '@heroui/react';
import { Editor } from '@monaco-editor/react';
import {
  IconCheck,
  IconX,
  IconPlayerPlay,
  IconChevronDown,
} from '@tabler/icons-react';
import { CodeExecutionQuestion } from '../../CourseViewer';
import { responseCodeExecutionSchema } from '@/lib/zod/responses';
import { Controller, useFormContext } from 'react-hook-form';
import z from 'zod';
import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';

interface Props {
  question: CodeExecutionQuestion;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const CodingType = ({ question, onChange, isDisabled }: Props) => {
  const testCases = question.body.answer.testCases || [];
  const { languages } = question.body.arguments;

  const {
    control,
    watch,
    formState: { disabled },
  } = useFormContext<z.infer<typeof responseCodeExecutionSchema>>();

  const currentLanguageId = watch('body.languageSelected');
  const currentLanguageName = Object.values(codeExecutionLanguages).find(
    (e) => e.id === currentLanguageId,
  )?.name;

  return (
    <div className="flex flex-col gap-6">
      {/* Monaco Editor Container */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Code Editor</label>
          <Controller
            control={control}
            name="body.languageSelected"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Select
                ref={ref}
                isRequired
                className="m-2 w-3xs"
                errorMessage={error?.message}
                isDisabled={disabled}
                validationBehavior="aria"
                isInvalid={invalid}
                selectedKeys={[`${value}`]}
                onBlur={onBlur}
                onChange={(e) => {
                  onChange(+e.target.value);
                }}
              >
                {Object.values(codeExecutionLanguages)
                  .filter((e) => languages.includes(e.id))
                  .map((lang) => (
                    <SelectItem key={lang.id} className="mr-2">
                      {lang.label}
                    </SelectItem>
                  ))}
              </Select>
            )}
          />
        </div>
        <div className="border-content2 bg-content1 relative h-[400px] overflow-hidden rounded-xl border-2">
          <Controller
            // FIXME: Prevent retaining source code of previous question on switching question
            control={control}
            name={'body.submittedCode'}
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Editor
                height="100%"
                defaultLanguage={''}
                language={currentLanguageName}
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
            )}
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
