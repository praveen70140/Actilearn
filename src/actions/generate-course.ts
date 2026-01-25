'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { courseSchema } from '@/lib/zod/course';
import { z } from 'zod';

// --- CONFIGURATION ---
// Set this to true to use mock data and save AI tokens
// Set this to false to use the real Gemini AI
const USE_MOCK_AI = true;
// ---------------------

// Define a partial schema for AI generation (excluding system fields like id, created)
// We will merge this with system fields later
const aiCourseGenerationSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  chapters: z.array(
    z.object({
      name: z.string(),
      lessons: z.array(
        z.object({
          name: z.string(),
          theory: z.string(),
          questions: z.array(
            z.object({
              questionText: z.string(),
              body: z.object({
                type: z.number(), // We expect integers 0-3 matching QuestionTypes enum
                arguments: z.record(z.string(), z.any()),
                answer: z.record(z.string(), z.any()),
              }),
              solution: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export async function generateCourseFromDoubt(doubt: string) {
  try {
    let text: string;

    if (USE_MOCK_AI) {
      console.log('--- Using Mock AI Response ---');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      text = JSON.stringify({
        name: 'Introduction to React Hooks',
        description:
          'A concise guide to understanding and using React Hooks effectively.',
        tags: ['react', 'hooks', 'frontend', 'javascript'],
        chapters: [
          {
            name: 'Core Hooks',
            lessons: [
              {
                name: 'The useState Hook',
                theory:
                  'useState is a Hook that lets you add React state to function components. It returns a pair: the current state value and a function that lets you update it. You can call this function from an event handler or somewhere else.',
                questions: [
                  {
                    questionText: 'What does useState return?',
                    solution:
                      'It returns an array with two elements: the current state value and a state setter function.',
                    body: {
                      type: 0,
                      arguments: {
                        options: [
                          'A single value representing the state',
                          'An object containing state and setState',
                          'An array with the current state and a setter function',
                          'A promise that resolves to the state',
                        ],
                      },
                      answer: {
                        correctIndex: 2,
                      },
                    },
                  },
                  {
                    questionText: 'Which rule is NOT a rule of hooks?',
                    solution:
                      'Hooks can only be called inside React function components or custom hooks, and they must be called at the top level. They cannot be conditional.',
                    body: {
                      type: 0,
                      arguments: {
                        options: [
                          'Only call Hooks at the top level',
                          'Only call Hooks from React functions',
                          'Only call Hooks inside loops or conditions',
                          'Hooks must start with "use"',
                        ],
                      },
                      answer: {
                        correctIndex: 2,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'GEMINI_API_KEY is not defined in environment variables',
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
        You are an expert educational content creator. A student has a doubt: "${doubt}".
        Create a short, structured course to explain this concept and related topics.

        Return the output strictly as a valid JSON object. Do not include markdown formatting (like \`\`\`json).
        
        The JSON must follow this exact structure:
        {
          "name": "Course Title (min 10 chars)",
          "description": "Course description",
          "tags": ["tag1", "tag2", "tag3"] (min 3 chars per tag),
          "chapters": [
            {
              "name": "Chapter Title",
              "lessons": [
                {
                  "name": "Lesson Title",
                  "theory": "Detailed theory explanation...",
                  "questions": [
                    {
                      "questionText": "Question text",
                      "solution": "Explanation of the solution",
                      "body": {
                        "type": 0, // 0=MCQ, 1=Numerical, 3=OpenEnded. Avoid 2 (Code) for now unless specifically asked.
                        "arguments": { ... }, // Depends on type
                        "answer": { ... } // Depends on type
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }

        Specific Rules for "body" based on "type":
        
        1. IF type is 0 (Multiple Choice):
           "arguments": { "options": ["Option A", "Option B", "Option C", "Option D"] } (min 2 options)
           "answer": { "correctIndex": 0 } (index of the correct option)
           
        2. IF type is 1 (Numerical):
           "arguments": { "precision": 0 } (integer >= 0)
           "answer": { "correctNumber": 42 }
           
        3. IF type is 3 (Open Ended/Subjective):
           "arguments": { "characterCount": 100 } (optional max chars)
           "answer": { "evaluationPrompt": "Key points the answer should cover..." }

        Ensure:
        - At least 1 chapter.
        - At least 1 lesson per chapter.
        - At least 1 question per lesson.
        - "name" must be > 10 chars.
        - "tags" must be > 3 chars each.
      `;

      console.log('--- Sending request to Gemini ---');
      console.log('Doubt:', doubt);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();

      console.log('--- Gemini Raw Response ---');
      console.log(text);
    }

    // Clean up potential markdown formatting if the model ignores the "no markdown" instruction
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();

    const parsedContent = JSON.parse(jsonStr);

    // Validate structure against our loose AI schema first
    const validAiContent = aiCourseGenerationSchema.parse(parsedContent);

    // Construct the full course object with server-generated ID and Date
    const fullCourse = {
      ...validAiContent,
      id: crypto.randomUUID(),
      created: new Date(),
    };

    // Final Validation using the project's strict Zod schema
    console.log('--- Validating against Project Schema ---');
    const validatedCourse = courseSchema.parse(fullCourse);

    console.log('--- Validation Success ---');
    return { success: true, data: validatedCourse };
  } catch (error) {
    console.error('--- Error Generating Course ---');
    console.error(error);
    if (error instanceof z.ZodError) {
      console.error(
        'Validation Errors:',
        JSON.stringify(error.issues, null, 2),
      );
    }
    return {
      success: false,
      error: 'Failed to generate a valid course. Please try again.',
    };
  }
}
