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
import type {
  CourseType,
  ChapterType,
  LessonType,
} from '@/app/(course)/course/view/page';
import { Key } from 'react';

interface CourseHeaderProps {
  courseData: CourseType;
  currentChapter: ChapterType;
  currentLesson: LessonType;
  onChapterChange: (keys: Set<Key> | any) => void;
  onLessonChange: (keys: Set<Key> | any) => void;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  isPrevLessonDisabled: boolean;
  isNextLessonDisabled: boolean;
  onExit: () => void;
}

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
}: CourseHeaderProps) {
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
            selectedKeys={[currentChapter.name]}
            onSelectionChange={onChapterChange}
          >
            {courseData.chapters.map((c: ChapterType) => (
              <SelectItem key={c.name} id={c.name} textValue={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </Select>
        </NavbarItem>

        <NavbarItem>
          <Select
            className="w-48"
            selectedKeys={[currentLesson.name]}
            onSelectionChange={onLessonChange}
          >
            {currentChapter.lessons.map((l: LessonType) => (
              <SelectItem key={l.name} id={l.name} textValue={l.name}>
                {l.name}
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
