'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import Response from '@/db/models/Response';
import { courseSchema } from '@/lib/zod/course';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { answerCheckStrategyMap } from '@/lib/check-answer-strategy';
import { z } from 'zod';

type Answer = string | number | string[];

export async function submitAnswer(
  courseSlug: string, // This is the UUID string
  chapterIndex: number,
  lessonIndex: number,
  questionIndex: number,
  answer: Answer,
) {
  await connectDB();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not authenticated' };

  // FIX: Search by slug (the UUID) instead of findById
  const course = await Course.findOne({ slug: courseSlug }).lean();
  
  if (!course) return { error: 'Course not found' };

  // Map to string for Zod/Logic
  const courseIdStr = course.slug.toString(); 
  const courseObjectId = course._id; // Keep this for the Response query

  const parsedCourse = courseSchema.parse({ 
    ...course, 
    _id: course._id.toString(),
    id: courseIdStr 
  });

  const question = parsedCourse.chapters[chapterIndex]?.lessons[lessonIndex]?.questions?.[questionIndex];
  if (!question) return { error: 'Question not found' };

  const strategy = answerCheckStrategyMap.get(question.body.type);
  if (!strategy) return { error: 'Strategy not found' };

  const isCorrect = strategy.check(answer as any, question.body.answer);
  const evaluation = isCorrect ? EvaluationStatus.CORRECT : EvaluationStatus.INCORRECT;

  // FIX: Use the actual MongoDB ObjectId (courseObjectId) for the relationship query
  let response = await Response.findOne({ user: userId, course: courseObjectId });

  if (!response) {
    response = new Response({
      user: userId,
      course: courseObjectId,
      chapters: [],
    });
  }

  // Update response structure... (rest of your logic remains same)
  if (!response.chapters[chapterIndex]) response.chapters[chapterIndex] = { lessons: [] };
  if (!response.chapters[chapterIndex].lessons[lessonIndex]) {
    response.chapters[chapterIndex].lessons[lessonIndex] = { questions: [] };
  }
  response.chapters[chapterIndex].lessons[lessonIndex].questions[questionIndex] = {
    response: [answer],
    evaluation: evaluation,
  };

  await response.save();
  return { evaluation };
}