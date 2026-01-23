'use client';

import { IconBook } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function TheoryPanel({ lesson }: any) {
  // IMPORTANT: Ensure this matches your .env.local exactly
  // If it's undefined, it defaults to the MinIO path
  const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000/actilearn';

  const MarkdownComponents = {
    // We handle the URL logic directly here
    img: ({ src, alt, ...props }: any) => {
      // 1. Determine the final URL
      const isExternal = src?.startsWith('http') || src?.startsWith('https');
      const finalSrc = isExternal
        ? src
        : `${STORAGE_BASE_URL}/${src?.replace(/^\//, '')}`;

      console.log("Rendering Image. Original:", src, "Final:", finalSrc);

      return (
        <span className="block my-8 group">
          <div className="relative overflow-hidden rounded-xl border border-[#313244] bg-[#181825]">
            <img
              {...props}
              src={finalSrc} // Use the calculated finalSrc
              alt={alt || 'Lesson Image'}
              loading="lazy"
              className="block max-w-full h-auto max-h-[600px] mx-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
          {alt && (
            <span className="block text-center text-xs text-[#9399b2] mt-3 font-medium uppercase tracking-wider">
              {alt}
            </span>
          )}
        </span>
      );
    },
    table: ({ children }: any) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg border border-[#313244]">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
    ),
  };

  return (
    <div className="w-1/2 p-8 overflow-y-auto border-r border-[#313244] bg-[#1e1e2e]">
      <div className="flex items-center gap-2 mb-8 text-[#fab387]">
        <IconBook size={24} />
        <h2 className="text-2xl font-bold tracking-tight">{lesson?.title}</h2>
      </div>

      <article className="prose prose-invert max-w-none 
        text-[#cdd6f4] 
        prose-headings:text-[#f5e0dc] 
        prose-strong:text-[#fab387]
        prose-code:text-[#f9e2af]
        prose-code:bg-[#313244] 
        prose-code:px-1 
        prose-code:rounded
        prose-code:before:content-none 
        prose-code:after:content-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MarkdownComponents}
        >
          {lesson?.theory || ''}
        </ReactMarkdown>
      </article>
    </div>
  );
}
