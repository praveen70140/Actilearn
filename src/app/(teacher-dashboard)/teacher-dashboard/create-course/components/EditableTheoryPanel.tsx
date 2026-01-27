'use client';

import { Textarea } from '@heroui/react';
import { IconBook } from '@tabler/icons-react';
import { useCourseCreateContext } from '../context/CourseCreateContext';

export function EditableTheoryPanel() {
  const {
    courseData,
    setCourseData,
    currentChapterIndex,
    currentLessonIndex,
  } = useCourseCreateContext();

  const currentLesson =
    courseData.chapters[currentChapterIndex]?.lessons[currentLessonIndex];

  const handleTheoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTheory = e.target.value;
    setCourseData((prevCourse) => {
      const newChapters = [...prevCourse.chapters];
      newChapters[currentChapterIndex].lessons[
        currentLessonIndex
      ].theory = newTheory;
      return { ...prevCourse, chapters: newChapters };
    });
  };

  return (
    <div className="bg-background border-content2 w-1/2 overflow-y-auto border-r p-8">
      <div className="flex items-center gap-2">
        <IconBook size={18} />
        Lesson {currentChapterIndex + 1}.{currentLessonIndex + 1}
      </div>
      <div className="text-primary mb-8 flex items-center gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{currentLesson?.name}</h2>
      </div>

      <Textarea
        value={currentLesson?.theory || ''}
        onChange={handleTheoryChange}
        placeholder="Write the lesson theory here..."
        rows={20}
        className="w-full"
      />
    </div>
  );
}
