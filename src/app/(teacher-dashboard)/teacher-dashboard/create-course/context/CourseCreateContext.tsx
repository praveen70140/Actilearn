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
    description: '',
    chapters: [],
    tags: [],
    _id: '',
  });

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const addChapter = (chapter: ChapterType) => {
    setCourseData((prevCourse) => ({
      ...prevCourse,
      chapters: [...prevCourse.chapters, chapter],
    }));
  };

  const addLesson = (chapterIndex: number, lesson: LessonType) => {
    setCourseData((prevCourse) => {
      const newChapters = [...prevCourse.chapters];
      newChapters[chapterIndex].lessons.push(lesson);
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
