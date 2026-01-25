'use client';
import { createContext, useContext, ReactNode, useState } from 'react';
import { useCourseNavigation } from '../hooks/useCourseNavigation';
import { CourseType, ResponseType } from '../CourseViewer';

// Define the shape of the context
interface CourseContextType extends ReturnType<typeof useCourseNavigation> {
  courseData: CourseType;
  response: ResponseType;
  currentQuestionResponse: any; // You might want a more specific type
  setResponse: (response: ResponseType) => void;
}

// Create the context
const CourseContext = createContext<CourseContextType | null>(null);

// Custom hook to use the context
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

// Provider component
export const CourseProvider = ({
  children,
  course,
  response: initialResponse,
}: {
  children: ReactNode;
  course: CourseType;
  response: ResponseType;
}) => {
  const navigation = useCourseNavigation(course);
  const [response, setResponse] = useState(initialResponse);

  const currentQuestionResponse =
    response?.chapters[navigation.currentChapterIndex]?.lessons[
      navigation.currentLessonIndex
    ]?.questions[navigation.currentQuestionIndex];

  return (
    <CourseContext.Provider
      value={{
        courseData: course,
        ...navigation,
        response,
        currentQuestionResponse,
        setResponse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
