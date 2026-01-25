'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import Response from '@/db/models/Response';
import { courseSchema } from '@/lib/zod/course';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { answerCheckStrategyMap } from '@/lib/check-answer-strategy';

export async function submitAnswer(
  courseSlug: string,
  chapterIndex: number,
  lessonIndex: number,
  questionIndex: number,
  answer: any,
) {
  await connectDB();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not authenticated' };

  // 1. Find course by slug (UUID string)
  const courseDoc = await Course.findOne({ slug: courseSlug }).lean();
  if (!courseDoc) return { error: 'Course not found' };

  // 2. Validate course for logic
  const parsedCourse = courseSchema.parse({
    ...courseDoc,
    _id: courseDoc._id.toString(),
    id: courseDoc.slug.toString()
  });

  const question = parsedCourse.chapters[chapterIndex]?.lessons[lessonIndex]?.questions?.[questionIndex];
  if (!question) return { error: 'Question not found' };

  // 3. Evaluate
  const strategy = answerCheckStrategyMap.get(question.body.type);
  if (!strategy) return { error: 'Strategy not found' };

  const isCorrect = strategy.check(answer, question.body.answer);
  const evaluation = isCorrect ? EvaluationStatus.CORRECT : EvaluationStatus.INCORRECT;

  // 4. Update Response using actual ObjectIds
  let response = await Response.findOne({ user: userId, course: courseDoc._id });

  if (!response) {
    response = new Response({ user: userId, course: courseDoc._id, chapters: [] });
  }

  // 5. Ensure tree structure exists
  if (!response.chapters[chapterIndex]) response.chapters[chapterIndex] = { lessons: [] };
  if (!response.chapters[chapterIndex].lessons[lessonIndex]) {
    response.chapters[chapterIndex].lessons[lessonIndex] = { questions: [] };
  }

  // Save answer (Mixed type allows string "2")
  response.chapters[chapterIndex].lessons[lessonIndex].questions[questionIndex] = {
    response: [answer],
    evaluation: evaluation,
  };

  response.markModified('chapters');
  await response.save();

  return { evaluation };
}
