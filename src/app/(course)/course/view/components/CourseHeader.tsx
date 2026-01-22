'use client';

import {
  Button,
  Select,
  Listbox,
  Tooltip,
  ListboxItem,
  SelectItem,
} from '@heroui/react';
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function CourseHeader({
  courseData,
  currentChapter,
  currentLesson,
  onChapterChange,
  onLessonChange,
  onPrevLesson,
  onNextLesson,
  isPrevLessonDisabled,
  isNextLessonDisabled,
  onExit,
}: any) {
  return (
    <nav className="flex h-[65px] items-center justify-between border-b border-[#313244] bg-[#11111b] px-6">
      {/* FAR LEFT: Dangerous Exit (Mocha Red) */}
      <Tooltip content="Abandon Course">
        <Button
          isIconOnly
          className="rounded-xl bg-[#f38ba8] text-[#11111b] hover:scale-105"
          onPress={onExit}
        >
          <IconX size={20} stroke={3} />
        </Button>
      </Tooltip>

      {/* Middle: Lesson Dropdowns */}
      <div className="flex items-center gap-3">
        <Select
          className="w-48 text-sm"
          selectedKeys={[currentChapter.id]}
          onSelectionChange={onChapterChange}
        >
          {courseData.chapters.map((c: any) => (
            <SelectItem key={c.id} id={c.id} textValue={c.title}>
              {c.title}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="w-48 text-sm"
          selectedKeys={[currentLesson.id]}
          onSelectionChange={onLessonChange}
        >
          {currentChapter.lessons.map((l: any) => (
            <SelectItem key={l.id} id={l.id} textValue={l.title}>
              {l.title}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Navbar Right: Lesson Jumps */}
      <div className="flex gap-2">
        <Button
          variant="bordered"
          size="sm"
          onPress={onPrevLesson}
          isDisabled={isPrevLessonDisabled}
        >
          <IconChevronLeft size={18} /> Previous Lesson
        </Button>
        <Button
          variant="solid"
          className="bg-[#b4befe] text-[#11111b]"
          size="sm"
          onPress={onNextLesson}
          isDisabled={isNextLessonDisabled}
        >
          Next Lesson <IconChevronRight size={18} />
        </Button>
      </div>
    </nav>
  );
}
