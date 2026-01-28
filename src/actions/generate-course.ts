'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { courseSchema } from '@/lib/zod/course';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Course, { ICourseMongoSchema } from '@/db/models/Course';
import { Types } from 'mongoose';

// --- CONFIGURATION ---
// Set to true to use the mock response below and save tokens
// Set to false to use the real Gemma-3-27b-it model
const USE_MOCK_AI = false;
// ---------------------

export async function generateCourseFromDoubt(doubt: string) {
  await connectDB();

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not authenticated' };

  console.log('--- [1] STARTING COURSE GENERATION ---');
  console.log('User Doubt:', doubt);

  try {
    let text: string;

    if (USE_MOCK_AI) {
      console.log('--- [MOCK] USING SAVED WORKING JSON RESPONSE ---');
      text = JSON.stringify({
        name: 'HTML Fundamentals',
        description:
          'A concise introduction to the core concepts of HTML for web development.',
        tags: ['HTML', 'Web Development', 'Frontend'],
        chapters: [
          {
            name: 'Introduction to HTML',
            lessons: [
              {
                name: 'HTML Basics & Structure',
                theory:
                  '## What is HTML?\n\nHTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure and content of a webpage. Browsers read HTML files and render them into visible web pages.\n\n## Basic HTML Structure\n\nEvery HTML document has a basic structure:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>My First Heading</h1>\n  <p>My first paragraph.</p>\n</body>\n</html>\n```\n\n* `<!DOCTYPE html>`: Declares the document type.\n* `<html>`: The root element.\n* `<head>`: Contains meta-information.\n* `<title>`: Specifies a title for the page.\n* `<body>`: Contains visible content.',
                questions: [
                  {
                    questionText:
                      'Which tag is used to define the title of an HTML document?',
                    solution:
                      "The `<title>` tag is placed within the `<head>` section of an HTML document and specifies the title that appears in the browser's title bar or tab.",
                    body: {
                      type: 0,
                      arguments: {
                        options: [
                          '`<head>`',
                          '`<title>`',
                          '`<body>`',
                          '`<h1>`',
                        ],
                      },
                      answer: {
                        correctIndex: 1,
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
        console.error('CRITICAL ERROR: GEMINI_API_KEY is missing');
        throw new Error('GEMINI_API_KEY is not defined');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'models/gemma-3-27b-it',
      });

      // UPDATED PROMPT: Removed "Exactly 1" limits, added multiple items to example structure
      const prompt = `
You are an expert tutor. Provide a comprehensive, high-quality course in JSON format to solve this doubt: "${doubt}".

STRICT CONTENT RULES:
1. Create a logical progression of at least 2 chapters.
2. Provide at least 2 lessons per chapter.
3. Provide at least 2 questions per lesson.
4. "name" must be a string longer than 10 characters.
5. "tags" must be an array of strings, each longer than 3 characters.

STRICT QUESTION TYPE RULES (Crucial for Zod Schema Validation):

- TYPE 0 (Multiple Choice):
  "arguments": { "options": ["Option 1", "Option 2", "Option 3", "Option 4"] }
  "answer": { "correctIndex": number }

- TYPE 1 (Numerical):
  ONLY use this for answers that are pure numbers (years, math, counts).
  "arguments": { "precision": 0 }
  "answer": { "correctNumber": number }

- TYPE 3 (Open Ended):
  Use this for "Explain" or "What is" questions requiring a text response.
  "arguments": { "characterCount": 500 }
  "answer": { "evaluationPrompt": "Detailed criteria for grading this answer" }

OUTPUT INSTRUCTION:
Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json. Do not include any text before or after the JSON.

REQUIRED JSON STRUCTURE EXAMPLE:
{
  "name": "Title of the Course",
  "description": "Comprehensive description of the course.",
  "tags": ["education", "learning", "topic"],
  "chapters": [
    {
      "name": "Chapter 1: Foundations",
      "lessons": [
        {
          "name": "Lesson 1.1: Basic Concepts",
          "theory": "Detailed markdown text...",
          "questions": [
            {
              "questionText": "Multiple Choice Example?",
              "solution": "Explanation...",
              "body": {
                "type": 0,
                "arguments": { "options": ["A", "B", "C"] },
                "answer": { "correctIndex": 0 }
              }
            },
            {
              "questionText": "In what year did this event happen?",
              "solution": "It happened in 2024.",
              "body": {
                "type": 1,
                "arguments": { "precision": 0 },
                "answer": { "correctNumber": 2024 }
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Chapter 2: Advanced Analysis",
      "lessons": [
        {
          "name": "Lesson 2.1: Deep Dive",
          "theory": "Advanced markdown text...",
          "questions": [
            {
              "questionText": "Explain the significance of this topic.",
              "solution": "This is significant because...",
              "body": {
                "type": 3,
                "arguments": { "characterCount": 300 },
                "answer": { "evaluationPrompt": "Check for mention of key impacts." }
              }
            }
          ]
        }
      ]
    }
  ]
}
`;
      `; `;
      console.log('--- [2] SENDING PROMPT TO GEMMA-3 ---');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    console.log('--- [3] RESPONSE RECEIVED ---');
    console.log(text);

    console.log('--- [4] CLEANING RESPONSE STRING ---');
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('ERROR: Could not find JSON object in response');
      throw new Error('Invalid response format.');
    }

    const cleanJson = jsonMatch[0];

    console.log('--- [5] PARSING JSON ---');
    const parsedContent: ICourseMongoSchema = JSON.parse(cleanJson);

    console.log('--- [6] ENRICHING DATA WITH SYSTEM FIELDS ---');
    const finalData: ICourseMongoSchema = {
      ...parsedContent,
      created: new Date(),
    };

    // Log the structure to terminal
    console.dir(finalData, { depth: null });

    console.log('--- [7] VALIDATING AGAINST PROJECT SCHEMA ---');
    const validatedCourse = courseSchema.parse(finalData);

    const finalCourse = {
      ...validatedCourse,
      _id: new Types.ObjectId(),
      isPrivate: true,
      whitelist: [new Types.ObjectId(session.user.id)],
    };

    await Course.create(finalCourse);

    console.log('--- [8] SUCCESS: GENERATION COMPLETE ---');
    return { success: true, data: finalCourse as ICourseMongoSchema };
  } catch (error) {
    console.error('--- [X] GENERATION ERROR ---');

    if (error instanceof z.ZodError) {
      console.error('Zod Validation Failed. Issues:');
      console.error(JSON.stringify(error.issues, null, 2));
    } else {
      console.error(error);
    }

    return {
      success: false,
      error: 'Failed to generate a valid course: ' + error,
    };
  }
}
