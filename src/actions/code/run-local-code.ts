'use server';

import { codeExecutionLanguages } from '@/lib/constants/code-execution-languages';
import { CodeExecutionStatus } from '@/lib/enum/code-execution-status';
import { base64ToUtf8, utf8ToBase64 } from '@/lib/utils/encode-decode';
import { fetchDataUntilCondition } from '@/lib/utils/fetch-data';

export const runLocalCode = async (
  sourceCode: string,
  languageId: number,
  input?: string,
) => {
  if (!sourceCode) {
    return { error: 'Please provide source code!' };
  }

  if (!languageId) {
    return { error: 'Please provide a language ID!' };
  }
  if (
    !Object.values(codeExecutionLanguages)
      .map((e) => e.id)
      .includes(languageId)
  ) {
    return { error: 'Invalid language ID!' };
  }

  const submissionBody = {
    source_code: utf8ToBase64(sourceCode),
    language_id: languageId,
    stdin: input ? utf8ToBase64(input) : undefined,
  };

  let submissionPostRequest: Response;

  try {
    submissionPostRequest = await fetch(
      process.env.JUDGE0_URL + '/submissions?base64_encoded=true',
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
    return { error: 'Could not connect to the code execution API!' };
  }

  const submissionPostJson = await submissionPostRequest.json();

  const submissionGetUrl =
    process.env.JUDGE0_URL +
    '/submissions/' +
    submissionPostJson.token +
    '?base64_encoded=true';

  const breakConditionFunction = (data: any) => {
    return ![
      CodeExecutionStatus.InQueue,
      CodeExecutionStatus.Processing,
    ].includes(data?.status?.id ?? -1);
  };

  let submissionGetJson: {
    stdout: string;
    stderr: string;
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

  const returnedData = {
    output: base64ToUtf8(submissionGetJson.stdout),
    error: base64ToUtf8(submissionGetJson.stderr),
    compileMessage: base64ToUtf8(submissionGetJson.compile_output),
  };

  return {
    success: 'Code successfully executed!',
    data: returnedData,
  };
};
