'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  CourseType,
  ChapterType,
  LessonType,
} from '../components/CreateCourseViewer';

// Create a type for course data in the UI that excludes auto-generated fields
type UICourseType = Omit<CourseType, 'slug' | 'created'> & {
  _id?: string; // Keep _id as optional
};

// Define the shape of the context
interface CourseCreateContextType {
  courseData: UICourseType;
  setCourseData: Dispatch<SetStateAction<UICourseType>>;
  currentChapterIndex: number;
  setCurrentChapterIndex: Dispatch<SetStateAction<number>>;
  currentLessonIndex: number;
  setCurrentLessonIndex: Dispatch<SetStateAction<number>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;

  // Functions to manipulate course data
  addChapter: (chapter: ChapterType) => void;
  addLesson: (chapterIndex: number, lesson: LessonType) => void;
  // Add more functions as needed (e.g., addQuestion, updateTheory, etc.)
}

// Create the context
const CourseCreateContext = createContext<CourseCreateContextType | null>(null);

// Custom hook to use the context
export const useCourseCreateContext = () => {
  const context = useContext(CourseCreateContext);
  if (!context) {
    throw new Error(
      'useCourseCreateContext must be used within a CourseCreateProvider',
    );
  }
  return context;
};

// Provider component
export const CourseCreateProvider = ({ children }: { children: ReactNode }) => {
  const [courseData, setCourseData] = useState<UICourseType>({
    name: 'New Course',
    description: 'Course description', // Default description to prevent validation error
    chapters: [],
    tags: [],
    _id: '',
  });

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const addChapter = (chapter: ChapterType) => {
    setCourseData((prevCourse) => {
      // Create a fresh copy of the new chapter with unique ID and fresh lessons array
      const newChapter = {
        ...chapter,
        _id: crypto.randomUUID(), // Ensure unique ID for each chapter
        lessons: [...chapter.lessons], // Ensure fresh lessons array (not shared reference)
      };

      return {
        ...prevCourse,
        chapters: [...prevCourse.chapters, newChapter],
      };
    });
  };

  const addLesson = (chapterIndex: number, lesson: LessonType) => {
    setCourseData((prevCourse) => {
      // 1. Copy all chapters
      const newChapters = [...prevCourse.chapters];

      // 2. Copy the specific chapter we are editing
      const targetChapter = { ...newChapters[chapterIndex] };

      // 3. Copy the lessons array within that chapter
      const newLessons = [...targetChapter.lessons];

      // 4. Create a fresh copy of the new lesson with unique ID
      const newLesson = {
        ...lesson,
        _id: crypto.randomUUID(), // Ensure unique ID for each lesson
      };

      // 5. Add the new lesson to the copied array
      newLessons.push(newLesson);

      // 6. Put it all back together
      targetChapter.lessons = newLessons;
      newChapters[chapterIndex] = targetChapter;

      return { ...prevCourse, chapters: newChapters };
    });
  };

  const value = {
    courseData,
    setCourseData,
    currentChapterIndex,
    setCurrentChapterIndex,
    currentLessonIndex,
    setCurrentLessonIndex,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addChapter,
    addLesson,
  };

  return (
    <CourseCreateContext.Provider value={value}>
      {children}
    </CourseCreateContext.Provider>
  );
};
