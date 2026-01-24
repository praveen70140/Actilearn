"use client";

import { courseSchema } from "@/lib/zod/course";
import { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";

type AiCourseType = z.infer<typeof courseSchema> | null;

interface AiCourseContextType {
  aiCourse: AiCourseType;
  setAiCourse: (course: AiCourseType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AiCourseContext = createContext<AiCourseContextType | undefined>(
  undefined
);

export const AiCourseProvider = ({ children }: { children: ReactNode }) => {
  const [aiCourse, setAiCourse] = useState<AiCourseType>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AiCourseContext.Provider
      value={{ aiCourse, setAiCourse, isLoading, setIsLoading }}
    >
      {children}
    </AiCourseContext.Provider>
  );
};

export const useAiCourse = () => {
  const context = useContext(AiCourseContext);
  if (context === undefined) {
    throw new Error("useAiCourse must be used within an AiCourseProvider");
  }
  return context;
};
