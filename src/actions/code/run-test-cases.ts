'use server';

import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';
import { CodeExecutionStatus } from '@/lib/enum/code-execution-status';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { base64ToUtf8, utf8ToBase64 } from '@/lib/utils/encode-decode';
import { fetchDataUntilCondition } from '@/lib/utils/fetch-data';
import {
  questionTypeCodeExecutionSchema,
  questionTypeOpenEndedSchema,
} from '@/lib/zod/questions';
import {
  responseCodeExecutionSchema,
  responseOpenEndedSchema,
} from '@/lib/zod/responses';
import z from 'zod';

export const runTestCases = async (
  response: z.infer<typeof responseCodeExecutionSchema.shape.body>,
  args: z.infer<typeof questionTypeCodeExecutionSchema.shape.arguments>,
  correctAnswer: z.infer<typeof questionTypeCodeExecutionSchema.shape.answer>,
) => {
  if (!response || !args || !correctAnswer) {
    return { error: 'Please provide complete arguments!' };
  }

  if (!response.submittedCode) {
    return { error: 'Please provide source code!' };
  }

  if (!response.languageSelected) {
    return { error: 'Please provide a language ID!' };
  }
  if (
    !Object.values(codeExecutionLanguages)
      .map((e) => e.id)
      .includes(response.languageSelected)
  ) {
    return { error: 'Invalid language ID!' };
  }

  const submissionBody = {
    submissions: correctAnswer.testCases.map((testCase) => ({
      language_id: response.languageSelected,
      source_code: utf8ToBase64(response.submittedCode),
      stdin: testCase.input ? utf8ToBase64(testCase.input) : undefined,
      expected_output: utf8ToBase64(testCase.expectedOutput),
    })),
  };

  let submissionPostRequest: Response;

  try {
    submissionPostRequest = await fetch(
      process.env.JUDGE0_URL + '/submissions/batch?base64_encoded=true',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionBody),
      },
    );
  } catch (error: any) {
    return { error: 'Could not connect to code execution API!' };
  }

  if (!submissionPostRequest.ok) {
    return { error: 'Could not connect to code execution API!' };
  }

  const submissionPostJson: { token: string }[] =
    await submissionPostRequest.json();

  const submissionGetUrl =
    process.env.JUDGE0_URL +
    '/submissions/batch?tokens=' +
    submissionPostJson.map((obj) => obj.token).join(',') +
    '&base64_encoded=true';

  const breakConditionFunction = (data: any) => {
    return ![
      CodeExecutionStatus.InQueue,
      CodeExecutionStatus.Processing,
    ].includes(data?.submissions[0].status.id ?? -1);
  };

  let submissionGetJson: {
    stdout: string;
    stderr: string;
    submissions: string;
    compile_output: string | null;
  } | null;

  try {
    submissionGetJson = await fetchDataUntilCondition(
      submissionGetUrl,
      breakConditionFunction,
    );
  } catch (error) {
    return { error: 'Could not connect to code execution API!' };
  }
  if (submissionGetJson === null) {
    return { error: 'Code execution failed!' };
  }

  const submissionResults: [
    {
      language_id: number;
      stdout: string;
      status: { id: number; description: string };
      stderr: string | null;
      token: string;
    },
  ] = submissionGetJson.submissions as any;

  const isCorrect = submissionResults.every(
    (submission) => submission.status.id === CodeExecutionStatus.Accepted,
  );

  const finalData = {
    evaluation: isCorrect
      ? EvaluationStatus.CORRECT
      : EvaluationStatus.INCORRECT,
    submissions: submissionResults.map(({ stdout, status: { id } }) =>
      base64ToUtf8(stdout),
    ),
  };

  return {
    success: 'Code successfully executed!',
    data: finalData,
  };
};
