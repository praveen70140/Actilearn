'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Timeline from '@/db/models/Timeline';
import Course from '@/db/models/Course';

export async function endLesson(
  courseId: string,
  chapterIndex: number,
  lessonIndex: number,
) {
  await connectDB();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return { error: 'User not authenticated' };
  }

  const course = await Course.findById(courseId).lean();
  if (!course) {
    return { error: 'Course not found' };
  }

  try {
    await Timeline.findOneAndUpdate(
      {
        user: userId,
        'attempts.course': course._id,
        'attempts.chapterIndex': chapterIndex,
        'attempts.lessonIndex': lessonIndex,
        'attempts.endedAt': { $exists: false },
      },
      {
        $set: {
          'attempts.$.endedAt': new Date(),
        },
      },
    );
    return { success: true };
  } catch (error) {
    console.error('Error ending lesson timeline:', error);
    return { error: 'Failed to end lesson timeline' };
  }
}
