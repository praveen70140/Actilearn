'use client';

import { IconBook } from '@tabler/icons-react';

export function TheoryPanel({ lesson }: any) {
  return (
    <div className="w-1/2 p-8 overflow-y-auto border-r border-[#313244]">
      <div className="flex items-center gap-2 mb-6 text-[#fab387]">
        <IconBook size={24} />
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
      </div>
      <article className="prose prose-invert max-w-none text-[#cdd6f4]">
        <div dangerouslySetInnerHTML={{ __html: lesson.theory }} />
      </article>
    </div>
  );
}
