import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { courseSchema } from '@/lib/zod/course';
import { QuestionTypes } from '@/lib/enum/question-types';
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function POST(req: NextRequest) {
  console.log("🚀 [1/8] API REQUEST RECEIVED");

  try {
    const { doubt } = await req.json();
    console.log("📥 [2/8] DOUBT:", doubt);

    const responseSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        chapters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              lessons: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    theory: { type: 'string' },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          questionText: { type: 'string' },
                          body: {
                            type: 'object',
                            properties: {
                              type: { type: 'string' },
                              arguments: { type: 'object' },
                              answer: { type: 'object' }
                            },
                            required: ['type', 'arguments', 'answer']
                          },
                          solution: { type: 'string' }
                        },
                        required: ['questionText', 'body', 'solution']
                      }
                    }
                  },
                  required: ['name', 'theory', 'questions']
                }
              }
            },
            required: ['name', 'lessons']
          }
        }
      },
      required: ['name', 'description', 'tags', 'chapters']
    };

    console.log("🧠 [3/8] CALLING GEMINI-FLASH-LATEST...");

    const prompt = `You are a technical course generator. Create a JSON mini-course for: "${doubt}".
    IMPORTANT: Ensure all Markdown quotes inside the JSON strings are escaped. 
    The "solution" field must be a valid JSON string: "{\\"explanation\\": \\"...\\"}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        response_mime_type: 'application/json',
        response_schema: responseSchema,
        temperature: 0.1,
        max_output_tokens: 8192, // Ensure it doesn't cut off
      },
    });

    // --- LOGGING RAW TEXT IMMEDIATELY ---
    const responseText = response.text;
    console.log("------------------ RAW AI RESPONSE START ------------------");
    console.log(responseText || "EMPTY RESPONSE");
    console.log("------------------- RAW AI RESPONSE END -------------------");

    if (!responseText) throw new Error("AI returned nothing.");

    console.log("🛠️ [5/8] CLEANING JSON...");

    // Find the first { and last } just in case there is garbage text
    let cleanedText = responseText.trim();
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    // Fix common AI JSON errors (like trailing commas before closing braces)
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, '$1');

    let rawData;
    try {
      rawData = JSON.parse(cleanedText);
    } catch (e: any) {
      console.error("❌ JSON PARSE ERROR AT POSITION:", e.message);
      // We log the cleaned text so we can see what failed
      console.error("CLEANED TEXT ATTEMPTED:", cleanedText);
      throw e;
    }

    console.log("🛠️ [6/8] SELF-HEALING & INJECTING SYSTEM FIELDS...");
    const healedData = {
      name: rawData.name || rawData.courseTitle || "Untitled Course",
      description: rawData.description || "Educational content.",
      tags: Array.isArray(rawData.tags) ? rawData.tags : ["learning"],
      chapters: (rawData.chapters || rawData.modules || []).map((ch: any) => ({
        name: ch.name || "Chapter",
        lessons: (ch.lessons || []).map((ls: any) => ({
          name: ls.name || "Lesson",
          theory: ls.theory || ls.content || "",
          questions: (ls.questions || []).map((q: any) => ({
            questionText: q.questionText || "Question?",
            body: {
              type: q.body?.type || QuestionTypes.MULTIPLE_CHOICE,
              arguments: q.body?.arguments || { options: ["A", "B"] },
              answer: q.body?.answer || { correctIndex: 0 }
            },
            solution: typeof q.solution === 'string' ? q.solution : JSON.stringify({ explanation: "Explanation provided." })
          }))
        }))
      }))
    };

    const finalObject = {
      ...healedData,
      id: crypto.randomUUID(),
      created: new Date(),
    };

    console.log("🛡️ [8/8] RUNNING ZOD VALIDATION...");
    const parsedCourse = courseSchema.passthrough().parse(finalObject);

    console.log("✨ GENERATION SUCCESSFUL");
    return NextResponse.json(parsedCourse);

  } catch (error: any) {
    console.error("🛑 [FATAL ERROR]");

    if (error instanceof z.ZodError) {
      console.error("ZOD FAIL:", JSON.stringify(error.flatten().fieldErrors, null, 2));
      return NextResponse.json({ error: 'Validation Error', details: error.flatten().fieldErrors }, { status: 500 });
    }

    console.error("ERROR MESSAGE:", error.message);
    return NextResponse.json({ error: 'Generation Failed', details: error.message }, { status: 500 });
  }
}
