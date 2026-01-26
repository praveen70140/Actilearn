'use client';

import { IconBook } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Allow HTML tags like <video>
import { useCourseContext } from '../context/CourseContext';

export function TheoryPanel() {
  const {
    currentLesson: lesson,
    currentChapterIndex,
    currentLessonIndex,
  } = useCourseContext();
  const STORAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000/actilearn';

  // Helper to resolve URLs (same logic as image)
  const resolveStorageUrl = (src: string) => {
    if (!src) return '';
    const isExternal = src.startsWith('http') || src.startsWith('https');
    return isExternal ? src : `${STORAGE_BASE_URL}/${src.replace(/^\//, '')}`;
  };

  const MarkdownComponents: { [key: string]: React.ElementType } = {
    // IMAGE SUPPORT
    img: ({ src, alt, ...props }) => {
      const finalSrc = resolveStorageUrl(src);
      return (
        <div className="group my-8 block">
          <div className="relative overflow-hidden rounded-xl border border-[#313244] bg-[#181825]">
            <img
              {...props}
              src={finalSrc}
              alt={alt || 'Lesson Image'}
              loading="lazy"
              className="mx-auto block h-auto max-h-[600px] max-w-full object-contain"
            />
          </div>
          {alt && (
            <span className="mt-3 block text-center text-xs text-[#9399b2]">
              {alt}
            </span>
          )}
        </div>
      );
    },

    // VIDEO SUPPORT (Handles <video> tags in markdown)
    video: ({ src, ...props }) => {
      const finalSrc = resolveStorageUrl(src);
      return (
        <div className="my-8 overflow-hidden rounded-xl border border-[#313244] bg-black shadow-2xl">
          <video
            {...props}
            src={finalSrc}
            controls
            className="aspect-video w-full"
            controlsList="nodownload" // Optional: security feature
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    },

    table: ({ children }) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg border border-[#313244]">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
  };

  return (
    <div className="bg-background border-content2 w-1/2 overflow-y-auto border-r p-8">
      <div className="flex items-center gap-2">
        <IconBook size={18} />
        Lesson {currentChapterIndex + 1}.{currentLessonIndex + 1}
      </div>
      <div className="text-primary mb-8 flex items-center gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{lesson?.name}</h2>
      </div>

      <div className="prose prose-invert prose-headings:text-[#f5e0dc] prose-strong:text-[#fab387] prose-code:text-[#f9e2af] prose-code:bg-[#313244] prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-w-none text-[#cdd6f4]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]} // Enables HTML parsing
          components={MarkdownComponents}
        >
          {lesson?.theory || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
