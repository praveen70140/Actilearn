'use client';
import { Button, Select, Tooltip, SelectItem, Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCourseContext } from '../context/CourseContext';

export function CourseHeader({ onExit }: { onExit: () => void }) {
  const {
    courseData,
    currentChapter,
    currentLesson,
    onChapterChange,
    onLessonChange,
    onPrevLesson,
    onNextLesson,
    isPrevLessonDisabled,
    isNextLessonDisabled,
  } = useCourseContext();

  return (
    <Navbar maxWidth="full" isBordered className="bg-[#1e1e2e] border-[#313244]">
      <NavbarContent justify="start">
        <NavbarItem>
          <Tooltip content="Exit Course">
            <Button isIconOnly color="danger" variant="flat" onPress={onExit}>
              <IconX size={20} stroke={3} />
            </Button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center" className="gap-4">
        <NavbarItem>
          <Select
            className="w-56"
            variant="flat"
            aria-label="Chapter"
            selectedKeys={currentChapter ? [currentChapter.name] : []}
            onSelectionChange={onChapterChange}
          >
            {courseData.chapters.map((c) => (
              <SelectItem key={c.name} textValue={c.name}>{c.name}</SelectItem>
            ))}
          </Select>
        </NavbarItem>

        <NavbarItem>
          <Select
            className="w-56"
            variant="flat"
            aria-label="Lesson"
            selectedKeys={currentLesson ? [currentLesson.name] : []}
            onSelectionChange={onLessonChange}
          >
            {currentChapter.lessons.map((l) => (
              <SelectItem key={l.name} textValue={l.name}>{l.name}</SelectItem>
            ))}
          </Select>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="flex gap-2">
          <Button
            variant="bordered"
            onPress={onPrevLesson}
            isDisabled={isPrevLessonDisabled}
            className="border-[#313244] text-white"
          >
            <IconChevronLeft size={18} /> Previous
          </Button>
          <Button
            color="primary"
            onPress={onNextLesson}
            isDisabled={isNextLessonDisabled}
            className="font-bold"
          >
            Next Lesson <IconChevronRight size={18} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
