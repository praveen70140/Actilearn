'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Timeline from '@/db/models/Timeline';
import Course from '@/db/models/Course';

export async function startLesson(
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
      { user: userId },
      {
        $push: {
          attempts: {
            course: course._id,
            chapterIndex,
            lessonIndex,
            startedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true },
    );
    return { success: true };
  } catch (error) {
    console.error('Error starting lesson timeline:', error);
    return { error: 'Failed to start lesson timeline' };
  }
}
