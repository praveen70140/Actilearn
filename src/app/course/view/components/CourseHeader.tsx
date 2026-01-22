'use client';

import {
  Button,
  Select,
  ListBox,
  Tooltip
} from '@heroui/react';
import {
  IconX,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';

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
  onExit
}: any) {
  return (
    <nav className="h-[65px] border-b border-[#313244] bg-[#11111b] px-6 flex justify-between items-center">
      {/* FAR LEFT: Dangerous Exit (Mocha Red) */}
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            isIconOnly
            className="bg-[#f38ba8] text-[#11111b] rounded-xl hover:scale-105"
            onPress={onExit}
          >
            <IconX size={20} stroke={3} />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Abandon Course
        </Tooltip.Content>
      </Tooltip>

      {/* Middle: Lesson Dropdowns */}
      <div className="flex items-center gap-3">
        <Select
          className="w-48 text-sm"
          selectedKey={currentChapter.id}
          onSelectionChange={onChapterChange}
        >
          <Select.Trigger className="h-8 min-h-8">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {courseData.chapters.map((c: any) => (
                <ListBox.Item key={c.id} id={c.id} textValue={c.title}>
                  {c.title}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="w-48 text-sm"
          selectedKey={currentLesson.id}
          onSelectionChange={onLessonChange}
        >
          <Select.Trigger className="h-8 min-h-8">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {currentChapter.lessons.map((l: any) => (
                <ListBox.Item key={l.id} id={l.id} textValue={l.title}>
                  {l.title}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {/* Navbar Right: Lesson Jumps */}
      <div className="flex gap-2">
        <Button
          variant="tertiary"
          size="sm"
          onPress={onPrevLesson}
          isDisabled={isPrevLessonDisabled}
        >
          <IconChevronLeft size={18} /> Previous Lesson
        </Button>
        <Button
          variant="primary"
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
