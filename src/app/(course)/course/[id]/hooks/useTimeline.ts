'use client';

import { useEffect } from 'react';
import { startLesson } from '@/actions/timeline/start-lesson';
import { endLesson } from '@/actions/timeline/end-lesson';

export const useTimeline = (
  courseId: string | undefined,
  chapterIndex: number,
  lessonIndex: number,
) => {
  useEffect(() => {
    if (!courseId) return;

    // Start the lesson attempt
    startLesson(courseId, chapterIndex, lessonIndex).catch((err) =>
      console.error('Failed to start lesson timeline:', err),
    );

    // Cleanup: End the lesson attempt when the user navigates away or indices change
    return () => {
      endLesson(courseId, chapterIndex, lessonIndex).catch((err) =>
        console.error('Failed to end lesson timeline:', err),
      );
    };
  }, [courseId, chapterIndex, lessonIndex]);
};
