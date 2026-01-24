'use client';
import { useState } from 'react';
import { CourseType } from '../page';

export const useCourseNavigation = (courseData: CourseType) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter.lessons[currentLessonIndex];
  const currentQuestion =
    currentLesson?.questions?.[currentQuestionIndex] ?? null;

  const handleChapterChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = courseData.chapters.findIndex((c) => c.name === selectedKey);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      setCurrentLessonIndex(0);
      setCurrentQuestionIndex(0);
    }
  };

  const handleLessonChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = currentChapter.lessons.findIndex(
      (l) => l.name === selectedKey,
    );
    if (index !== -1) {
      setCurrentLessonIndex(index);
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuestionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = parseInt(selectedKey);
    if (!isNaN(index)) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex < courseData.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentLessonIndex(0);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex > 0) {
      const prevChapterIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevChapterIdx);
      setCurrentLessonIndex(
        courseData.chapters[prevChapterIdx].lessons.length - 1,
      );
      setCurrentQuestionIndex(0);
    }
  };

  const handleNextQuestion = () => {
    if (
      currentLesson.questions &&
      currentQuestionIndex < currentLesson.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleNextLesson();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      handlePrevLesson();
    }
  };

  const isNextLessonDisabled =
    currentChapterIndex === courseData.chapters.length - 1 &&
    currentLessonIndex === currentChapter.lessons.length - 1;

  const isPrevLessonDisabled =
    currentChapterIndex === 0 && currentLessonIndex === 0;

  return {
    currentChapter,
    currentLesson,
    currentQuestion,
    currentQuestionIndex,
    onChapterChange: handleChapterChange,
    onLessonChange: handleLessonChange,
    onQuestionChange: handleQuestionChange,
    onNextLesson: handleNextLesson,
    onPrevLesson: handlePrevLesson,
    onNextQuestion: handleNextQuestion,
    onPrevQuestion: handlePrevQuestion,
    isNextLessonDisabled,
    isPrevLessonDisabled,
  };
};
