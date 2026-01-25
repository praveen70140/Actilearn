'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { courseSchema } from '@/lib/zod/course';
import { z } from 'zod';

export async function generateCourseFromDoubt(doubt: string) {
  console.log('--- [1] STARTING COURSE GENERATION ---');
  console.log('User Doubt:', doubt);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL ERROR: GEMINI_API_KEY is missing');
      throw new Error('GEMINI_API_KEY is not defined');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemma-3-27b-it' });

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
    console.log('Prompt Content:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('--- [3] RAW AI RESPONSE RECEIVED ---');
    console.log(text);

    // EXTRACT JSON USING REGEX (Handles cases where AI adds text or backticks)
    console.log('--- [4] CLEANING RESPONSE STRING ---');
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('ERROR: Could not find JSON object in AI response');
      throw new Error("AI failed to return a valid JSON structure.");
    }

    const cleanJson = jsonMatch[0];
    console.log('Cleaned JSON String:', cleanJson);

    console.log('--- [5] PARSING JSON ---');
    const parsedContent = JSON.parse(cleanJson);
    console.log('Successfully Parsed Object keys:', Object.keys(parsedContent));

    // ENRICHMENT: Adding mandatory system fields for your courseSchema
    console.log('--- [6] ENRICHING DATA WITH SYSTEM FIELDS ---');
    const finalData = {
      ...parsedContent,
      id: crypto.randomUUID(),
      _id: crypto.randomUUID(),
      created: new Date().toISOString(),
    };

    // Log final data structure (depth: null shows all nested objects)
    console.dir(finalData, { depth: null });

    console.log('--- [7] VALIDATING AGAINST PROJECT SCHEMA ---');
    const validatedCourse = courseSchema.parse(finalData);

    console.log('--- [8] SUCCESS: GENERATION COMPLETE ---');
    return { success: true, data: validatedCourse };

  } catch (error) {
    console.error('--- [X] GENERATION ERROR ---');

    if (error instanceof SyntaxError) {
      console.error('JSON Syntax Error:', error.message);
    } else if (error instanceof z.ZodError) {
      console.error('Zod Validation Failed. Issues:');
      console.error(JSON.stringify(error.issues, null, 2));
    } else {
      console.error('Unknown Error:', error);
    }

    return {
      success: false,
      error: 'Failed to generate a valid course. Check server logs for details.',
    };
  }
}
