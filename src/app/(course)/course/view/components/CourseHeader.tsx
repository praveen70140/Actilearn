'use client';

import {
  Button,
  Select,
  Tooltip,
  SelectItem,
  Navbar,
  NavbarContent,
  NavbarItem,
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
    <Navbar maxWidth="full" isBordered isBlurred={false}>
      <NavbarContent justify="start">
        <NavbarItem>
          <Tooltip color="danger" content="Abandon Course">
            <Button isIconOnly color="danger" variant="flat" onPress={onExit}>
              <IconX size={20} stroke={3} />
            </Button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarItem>
          <Select
            className="w-48"
            variant="flat"
            selectedKeys={[currentChapter.id]}
            onSelectionChange={onChapterChange}
          >
            {courseData.chapters.map((c: any) => (
              <SelectItem key={c.id} id={c.id} textValue={c.title}>
                {c.title}
              </SelectItem>
            ))}
          </Select>
        </NavbarItem>

        <NavbarItem>
          <Select
            className="w-48"
            selectedKeys={[currentLesson.id]}
            onSelectionChange={onLessonChange}
          >
            {currentChapter.lessons.map((l: any) => (
              <SelectItem key={l.id} id={l.id} textValue={l.title}>
                {l.title}
              </SelectItem>
            ))}
          </Select>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            variant="bordered"
            onPress={onPrevLesson}
            isDisabled={isPrevLessonDisabled}
          >
            <IconChevronLeft /> Previous
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="solid"
            color="primary"
            onPress={onNextLesson}
            isDisabled={isNextLessonDisabled}
          >
            Next Lesson <IconChevronRight />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
