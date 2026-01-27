'use client';

import React, { useRef, useState } from 'react'; // Added useState
import { Textarea, Button, Tooltip, Divider, ButtonGroup } from '@heroui/react';
import {
  IconBook, IconEdit, IconEye, IconBold, IconItalic,
  IconHeading, IconList, IconLink, IconPhoto,
  IconVideo, IconTable, IconCode
} from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCourseCreateContext } from '../context/CourseCreateContext';

export function EditableTheoryPanel() {
  const {
    courseData,
    setCourseData,
    currentChapterIndex,
    currentLessonIndex,
  } = useCourseCreateContext();

  // State to manage Edit vs Preview mode
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentLesson =
    courseData.chapters[currentChapterIndex]?.lessons[currentLessonIndex];

  // --- Markdown Helper Function ---
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentLesson?.theory || '';
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      before + selectedText + after +
      text.substring(end);

    updateTheory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const updateTheory = (value: string) => {
    setCourseData((prev) => {
      const chapters = [...prev.chapters];
      if (!chapters[currentChapterIndex]) {
        chapters[currentChapterIndex] = { name: `Chapter ${currentChapterIndex + 1}`, lessons: [] };
      }
      const lessons = [...chapters[currentChapterIndex].lessons];
      if (!lessons[currentLessonIndex]) {
        lessons[currentLessonIndex] = { name: `Lesson ${currentLessonIndex + 1}`, theory: '', questions: [] };
      }
      lessons[currentLessonIndex] = { ...lessons[currentLessonIndex], theory: value };
      chapters[currentChapterIndex] = { ...chapters[currentChapterIndex], lessons };
      return { ...prev, chapters };
    });
  };

  const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000/actilearn';
  const resolveStorageUrl = (src: string) => {
    if (!src) return '';
    return src.startsWith('http') ? src : `${STORAGE_BASE_URL}/${src.replace(/^\//, '')}`;
  };

  const MarkdownComponents: { [key: string]: React.ElementType } = {
    img: ({ src, alt, ...props }) => (
      <div className="my-8"><img {...props} src={resolveStorageUrl(src)} alt={alt} className="mx-auto rounded-xl border border-[#313244] max-h-[600px]" /></div>
    ),
    video: ({ src, ...props }) => (
      <div className="my-8 rounded-xl border border-[#313244] overflow-hidden bg-black">
        <video {...props} src={resolveStorageUrl(src)} controls className="w-full aspect-video" />
      </div>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-[#313244]"><table className="w-full text-left text-sm">{children}</table></div>
    ),
  };

  return (
    <div className="bg-background border-content2 flex w-1/2 flex-col border-r h-full">
      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-default-500 text-xs mb-1">
            <IconBook size={14} />
            Lesson {currentChapterIndex + 1}.{currentLessonIndex + 1}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary">
            {currentLesson?.name}
          </h2>
        </div>

        {/* PILL SWITCHER */}
        <div className="flex p-1 bg-content2 rounded-full border border-divider">
          <Button
            size="sm"
            radius="full"
            variant={viewMode === 'edit' ? 'solid' : 'light'}
            color={viewMode === 'edit' ? 'primary' : 'default'}
            onClick={() => setViewMode('edit')}
            startContent={<IconEdit size={16} />}
            className="px-4 h-8"
          >
            Edit
          </Button>
          <Button
            size="sm"
            radius="full"
            variant={viewMode === 'preview' ? 'solid' : 'light'}
            color={viewMode === 'preview' ? 'primary' : 'default'}
            onClick={() => setViewMode('preview')}
            startContent={<IconEye size={16} />}
            className="px-4 h-8"
          >
            Preview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-6 overflow-hidden mt-4">
        {viewMode === 'edit' ? (
          /* EDITOR VIEW */
          <div className="flex flex-col h-[calc(100vh-220px)] border border-content3 rounded-xl bg-content1 overflow-hidden">
            {/* MARKDOWN TOOLBAR */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-content3 bg-content2/50">
              <ToolbarButton icon={<IconHeading size={18} />} tooltip="Heading" onClick={() => insertMarkdown('### ', '')} />
              <ToolbarButton icon={<IconBold size={18} />} tooltip="Bold" onClick={() => insertMarkdown('**', '**')} />
              <ToolbarButton icon={<IconItalic size={18} />} tooltip="Italic" onClick={() => insertMarkdown('_', '_')} />
              <Divider orientation="vertical" className="h-6 mx-1" />
              <ToolbarButton icon={<IconList size={18} />} tooltip="Bullet List" onClick={() => insertMarkdown('- ', '')} />
              <ToolbarButton icon={<IconCode size={18} />} tooltip="Code Block" onClick={() => insertMarkdown('```\n', '\n```')} />
              <ToolbarButton icon={<IconTable size={18} />} tooltip="Table" onClick={() => insertMarkdown('| Header | Header |\n| --- | --- |\n| Cell | Cell |', '')} />
              <Divider orientation="vertical" className="h-6 mx-1" />
              <ToolbarButton icon={<IconLink size={18} />} tooltip="Link" onClick={() => insertMarkdown('[text](url)', '')} />
              <ToolbarButton icon={<IconPhoto size={18} />} tooltip="Image" onClick={() => insertMarkdown('![alt text](image-path.jpg)', '')} />
              <ToolbarButton icon={<IconVideo size={18} />} tooltip="Video Tag" onClick={() => insertMarkdown('<video src="video-path.mp4"></video>', '')} />
            </div>

            <textarea
              ref={textareaRef}
              value={currentLesson?.theory || ''}
              onChange={(e) => updateTheory(e.target.value)}
              placeholder="Start writing your lesson theory..."
              className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-foreground scrollbar-hide"
            />

            <div className="px-4 py-2 border-t border-content3 bg-content2/30 text-[10px] text-default-400 flex justify-between">
              <span>Markdown Supported</span>
              <span>{currentLesson?.theory?.length || 0} characters</span>
            </div>
          </div>
        ) : (
          /* PREVIEW VIEW */
          <div className="h-[calc(100vh-220px)] overflow-y-auto border border-content3 rounded-xl bg-content1 p-8 custom-scrollbar">
            <div className="prose prose-invert prose-headings:text-[#f5e0dc] prose-strong:text-[#fab387] prose-code:text-[#f9e2af] prose-code:bg-[#313244] prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-w-none text-[#cdd6f4]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {currentLesson?.theory || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
  return (
    <Tooltip content={tooltip} closeDelay={0}>
      <Button isIconOnly variant="light" size="sm" onClick={onClick} className="text-default-500 hover:text-primary min-w-8 h-8">
        {icon}
      </Button>
    </Tooltip>
  );
}
