'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import Response from '@/db/models/Response';
import { courseSchema } from '@/lib/zod/course';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';
import { answerCheckStrategyMap } from '@/lib/utils/check-answer-strategy';
import z from 'zod';
import { responseAllSchema } from '@/lib/zod/responses';
import { Types } from 'mongoose';

export async function submitAnswer(
  courseSlug: string,
  chapterIndex: number,
  lessonIndex: number,
  questionIndex: number,
  formData: z.infer<typeof responseAllSchema>,
) {
  await connectDB();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return { error: 'User not authenticated' };

  // 1. Find course by slug (UUID string)
  const courseDoc = await Course.findOne({
    slug: new Types.UUID(courseSlug),
  }).lean();
  if (!courseDoc) return { error: 'Course not found' };

  // 2. Validate course for logic
  const validatedFields = courseSchema.safeParse({
    ...courseDoc,
    _id: courseDoc._id.toString(),
    slug: courseDoc.slug.toString(),
  });

  if (validatedFields.error) {
    return { error: validatedFields.error.message };
  }

  const { data } = validatedFields;

  const question =
    data.chapters[chapterIndex]?.lessons[lessonIndex]?.questions?.[
      questionIndex
    ];
  if (!question) return { error: 'Question not found' };

  // 3. Evaluate
  const strategy = answerCheckStrategyMap.get(question.body.type);
  if (!strategy) return { error: 'Strategy not found' };

  const { evaluation: evaluationStatus, result } = await strategy.check(
    formData.body,
    question.body.arguments,
    question.body.answer,
  );

  // 4. Update Response using actual ObjectIds
  let response = await Response.findOne({
    user: userId,
    course: courseDoc._id,
  });

  if (!response) {
    response = new Response({
      user: userId,
      course: courseDoc._id,
      chapters: [],
    });
  }

  // 5. Ensure tree structure exists
  if (!response.chapters[chapterIndex])
    response.chapters[chapterIndex] = { lessons: [] };
  if (!response.chapters[chapterIndex].lessons[lessonIndex]) {
    response.chapters[chapterIndex].lessons[lessonIndex] = { questions: [] };
  }

  // Save answer (Mixed type allows string "2")
  response.chapters[chapterIndex].lessons[lessonIndex].questions[
    questionIndex
  ] = {
    response: formData,
    evaluation: evaluationStatus,
  };

  response.markModified('chapters');
  await response.save();

  return { success: true, data: { evaluationStatus, result } };
}
