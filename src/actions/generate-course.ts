'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { courseSchema } from '@/lib/zod/course';
import { z } from 'zod';

// --- CONFIGURATION ---
// Set to true to use the mock response below and save tokens
// Set to false to use the real Gemma-3-27b-it model
const USE_MOCK_AI = true;
// ---------------------

export async function generateCourseFromDoubt(doubt: string) {
  console.log('--- [1] STARTING COURSE GENERATION ---');
  console.log('User Doubt:', doubt);

  try {
    let text: string;

    if (USE_MOCK_AI) {
      console.log('--- [MOCK] USING SAVED WORKING JSON RESPONSE ---');
      // This is the working JSON you provided, stripped of system fields 
      // so the enrichment logic (Step 6) can add fresh IDs/Dates.
      text = JSON.stringify({
        name: 'HTML Fundamentals',
        description: 'A concise introduction to the core concepts of HTML for web development.',
        tags: ['HTML', 'Web Development', 'Frontend'],
        chapters: [
          {
            name: 'Introduction to HTML',
            lessons: [
              {
                name: 'HTML Basics & Structure',
                theory: '## What is HTML?\n\nHTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure and content of a webpage. Browsers read HTML files and render them into visible web pages.\n\n## Basic HTML Structure\n\nEvery HTML document has a basic structure:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>My First Heading</h1>\n  <p>My first paragraph.</p>\n</body>\n</html>\n```\n\n* `<!DOCTYPE html>`: Declares the document type.\n* `<html>`: The root element.\n* `<head>`: Contains meta-information.\n* `<title>`: Specifies a title for the page.\n* `<body>`: Contains visible content.',
                questions: [
                  {
                    questionText: 'Which tag is used to define the title of an HTML document?',
                    solution: "The `<title>` tag is placed within the `<head>` section of an HTML document and specifies the title that appears in the browser's title bar or tab.",
                    body: {
                      type: 0,
                      arguments: {
                        options: ['`<head>`', '`<title>`', '`<body>`', '`<h1>`']
                      },
                      answer: {
                        correctIndex: 1
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      });
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('CRITICAL ERROR: GEMINI_API_KEY is missing');
        throw new Error('GEMINI_API_KEY is not defined');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'models/gemma-3-27b-it' });

      // THE EXACT PREVIOUS PROMPT (As requested: No changes)
      const prompt = `
      You are an expert tutor. Provide a MINI-COURSE in JSON format to solve this doubt: "${doubt}".

      STRICT CONSTRAINTS:
      1. Create EXACTLY 1 Chapter.
      2. Create EXACTLY 1 Lesson inside that chapter.
      3. Create EXACTLY 1 Multiple Choice Question (Type 0) inside that lesson.
      4. Output ONLY the JSON object. No explanations, no markdown blocks.

      REQUIRED JSON STRUCTURE:
      {
        "name": "Course Title (min 10 chars)",
        "description": "Short summary",
        "tags": ["tag1", "tag2", "tag3"],
        "chapters": [
          {
            "name": "Chapter Title",
            "lessons": [
              {
                "name": "Lesson Title",
                "theory": "Detailed explanation using markdown formatting",
                "questions": [
                  {
                    "questionText": "The question content",
                    "solution": "Why the correct answer is right",
                    "body": {
                      "type": 0,
                      "arguments": { "options": ["Option A", "Option B", "Option C", "Option D"] },
                      "answer": { "correctIndex": 0 }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    `;

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
      throw new Error("Invalid response format.");
    }

    const cleanJson = jsonMatch[0];

    console.log('--- [5] PARSING JSON ---');
    const parsedContent = JSON.parse(cleanJson);

    console.log('--- [6] ENRICHING DATA WITH SYSTEM FIELDS ---');
    const finalData = {
      ...parsedContent,
      id: crypto.randomUUID(),
      _id: crypto.randomUUID(),
      created: new Date(),
    };

    // Log the structure to terminal
    console.dir(finalData, { depth: null });

    console.log('--- [7] VALIDATING AGAINST PROJECT SCHEMA ---');
    const validatedCourse = courseSchema.parse(finalData);

    console.log('--- [8] SUCCESS: GENERATION COMPLETE ---');
    return { success: true, data: validatedCourse };

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
      error: 'Failed to generate a valid course. Check server logs.',
    };
  }
}
