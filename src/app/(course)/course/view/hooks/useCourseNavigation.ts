'use client';
import { useState, useMemo, useCallback } from 'react';
import { CourseType } from '../page';
import { Key } from 'react';

export const useCourseNavigation = (courseData: CourseType) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentChapter = useMemo(
    () => courseData.chapters[currentChapterIndex],
    [courseData, currentChapterIndex],
  );

  const currentLesson = useMemo(
    () => currentChapter.lessons[currentLessonIndex],
    [currentChapter, currentLessonIndex],
  );

  const currentQuestion = useMemo(
    () => currentLesson?.questions?.[currentQuestionIndex] ?? null,
    [currentLesson, currentQuestionIndex],
  );

  const handleChapterChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = courseData.chapters.findIndex((c) => c.name === selectedKey);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      setCurrentLessonIndex(0);
      setCurrentQuestionIndex(0);
    }
  }, [courseData]);

  const handleLessonChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = currentChapter.lessons.findIndex((l) => l.name === selectedKey);
    if (index !== -1) {
      setCurrentLessonIndex(index);
      setCurrentQuestionIndex(0);
    }
  }, [currentChapter]);

  const handleQuestionChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const index = parseInt(selectedKey);
    if (!isNaN(index)) {
      setCurrentQuestionIndex(index);
    }
  }, []);

  const handleNextLesson = useCallback(() => {
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex < courseData.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentLessonIndex(0);
      setCurrentQuestionIndex(0);
    }
  }, [currentLessonIndex, currentChapterIndex, courseData, currentChapter]);

  const handlePrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    } else if (currentChapterIndex > 0) {
      const prevChapterIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevChapterIdx);
      setCurrentLessonIndex(courseData.chapters[prevChapterIdx].lessons.length - 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentLessonIndex, currentChapterIndex, courseData]);

  const handleNextQuestion = useCallback(() => {
    if (currentLesson.questions && currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleNextLesson();
    }
  }, [currentQuestionIndex, currentLesson, handleNextLesson]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      handlePrevLesson();
    }
  }, [currentQuestionIndex, handlePrevLesson]);

  const isNextLessonDisabled = useMemo(
    () =>
      currentChapterIndex === courseData.chapters.length - 1 &&
      currentLessonIndex === currentChapter.lessons.length - 1,
    [currentChapterIndex, currentLessonIndex, courseData, currentChapter],
  );

  const isPrevLessonDisabled = useMemo(
    () => currentChapterIndex === 0 && currentLessonIndex === 0,
    [currentChapterIndex, currentLessonIndex],
  );

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
