'use client';
import { z } from 'zod';
import { courseSchema } from '@/lib/zod/course';
import { CourseCreateProvider } from '../context/CourseCreateContext';
import { CreateCourseHeader } from './CreateCourseHeader';
import { EditableTheoryPanel } from './EditableTheoryPanel';
import { EditableQuestionsPanel } from './EditableQuestionsPanel';
import { useCourseCreateContext } from '../context/CourseCreateContext';
import { useEffect, useMemo, useRef } from 'react';

export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = CourseType['chapters'][number];
export type LessonType = ChapterType['lessons'][number];

function stableSerialize(value: unknown) {
  return JSON.stringify(value, (_key, val) => {
    if (val instanceof Date) return val.toISOString();
    return val;
  });
}

const UnsavedChangesGuard = () => {
  const { courseData } = useCourseCreateContext();

  const initialSerializedRef = useRef<string | null>(null);

  const currentSerialized = useMemo(() => stableSerialize(courseData), [courseData]);

  const isDirty = useMemo(() => {
    if (initialSerializedRef.current === null) {
      initialSerializedRef.current = currentSerialized;
      return false;
    }
    return initialSerializedRef.current !== currentSerialized;
  }, [currentSerialized]);

  useEffect(() => {
    const message = 'Course progress will be lost. Are you sure you want to leave?';

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      // Chrome requires returnValue to be set.
      e.returnValue = '';
    };

    // Guard in-app navigation via link clicks.
    const onDocumentClickCapture = (e: MouseEvent) => {
      if (!isDirty) return;
      if (e.defaultPrevented) return;

      // Only left clicks without modifier keys
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (!anchor.href) return;
      if (anchor.target === '_blank') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href);
      const current = new URL(window.location.href);

      // same-page hash changes shouldn't warn
      const isSameDoc =
        url.origin === current.origin &&
        url.pathname === current.pathname &&
        url.search === current.search;
      if (isSameDoc && url.hash !== current.hash) return;
      if (isSameDoc && url.hash === current.hash) return;

      const ok = window.confirm(message);
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Guard browser back/forward. Uses "trap" state pattern.
    const trapState = { __actilearn_unsaved_guard: true };
    const pushTrap = () => {
      try {
        window.history.pushState(trapState, document.title, window.location.href);
      } catch {
        // ignore
      }
    };

    const onPopState = () => {
      if (!isDirty) return;
      const ok = window.confirm(message);
      if (!ok) {
        // Re-push current URL to cancel navigation.
        pushTrap();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onDocumentClickCapture, true);
    window.addEventListener('popstate', onPopState);

    // initialize trap so first "Back" hits our handler
    pushTrap();

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onDocumentClickCapture, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, [isDirty]);

  return null;
};

const CreateCourseView = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] selection:bg-[#f5e0dc] selection:text-[#1e1e2e]">
      <UnsavedChangesGuard />
      <CreateCourseHeader />
      <main className="flex h-[calc(100vh-65px)]">
        <EditableTheoryPanel />
        <EditableQuestionsPanel />
      </main>
    </div>
  );
};

export default function CreateCourseViewer() {
  return (
    <CourseCreateProvider>
      <CreateCourseView />
    </CourseCreateProvider>
  );
}
