'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useCourseNavigation } from '../hooks/useCourseNavigation';
import { CourseType } from '../page';

// Define the shape of the context
interface CourseContextType extends ReturnType<typeof useCourseNavigation> {
  courseData: CourseType;
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
}: {
  children: ReactNode;
  course: CourseType;
}) => {
  const navigation = useCourseNavigation(course);

  return (
    <CourseContext.Provider value={{ courseData: course, ...navigation }}>
      {children}
    </CourseContext.Provider>
  );
};
