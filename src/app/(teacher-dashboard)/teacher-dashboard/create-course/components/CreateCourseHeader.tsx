'use client';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Navbar,
  NavbarContent,
  NavbarItem,
  Input,
  Divider,
} from '@heroui/react';
import {
  IconDeviceFloppy,
  IconPlus,
  IconChevronDown,
  IconFolder,
  IconFileText,
  IconEdit
} from '@tabler/icons-react';
import { useCourseCreateContext } from '../context/CourseCreateContext';

export function CreateCourseHeader() {
  const {
    courseData,
    setCourseData,
    addChapter,
    addLesson,
    currentChapterIndex,
    setCurrentChapterIndex,
    currentLessonIndex,
    setCurrentLessonIndex,
  } = useCourseCreateContext();

  // Helper to update current chapter name
  const updateChapterName = (name: string) => {
    const newChapters = [...courseData.chapters];
    if (newChapters[currentChapterIndex]) {
      newChapters[currentChapterIndex].name = name;
      setCourseData({ ...courseData, chapters: newChapters });
    }
  };

  // Helper to update current lesson name
  const updateLessonName = (name: string) => {
    const newChapters = [...courseData.chapters];
    if (newChapters[currentChapterIndex]?.lessons[currentLessonIndex]) {
      newChapters[currentChapterIndex].lessons[currentLessonIndex].name = name;
      setCourseData({ ...courseData, chapters: newChapters });
    }
  };

  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter?.lessons[currentLessonIndex];

  return (
    <Navbar
      maxWidth="full"
      isBordered
      className="bg-background/70 backdrop-blur-md border-b border-divider h-20"
    >
      {/* 1. COURSE TITLE */}
      <NavbarContent justify="start" className="max-w-fit">
        <Input
          variant="flat"
          label="Course Title"
          labelPlacement="outside"
          value={courseData.name}
          onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
          placeholder="Enter course name..."
          className="w-48 lg:w-64"
        />
      </NavbarContent>

      {/* 2. CHAPTER & LESSON MANAGEMENT */}
      <NavbarContent justify="center" className="gap-6">

        {/* CHAPTER SECTION */}
        <div className="flex items-end gap-1">
          <Input
            label="Chapter"
            labelPlacement="outside"
            placeholder="Chapter Name"
            value={currentChapter?.name || ''}
            onValueChange={updateChapterName}
            startContent={<IconFolder size={18} className="text-primary" />}
            className="w-48 lg:w-60"
            endContent={
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light" className="text-default-400">
                    <IconChevronDown size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Switch Chapter"
                  onAction={(key) => setCurrentChapterIndex(Number(key))}
                >
                  {courseData.chapters.map((ch, idx) => (
                    <DropdownItem key={idx} description={`Contains ${ch.lessons.length} lessons`}>
                      {ch.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            }
          />
          <Tooltip content="New Chapter">
            <Button
              isIconOnly
              radius="md"
              color="primary"
              variant="flat"
              onPress={() => addChapter({ name: "Untitled Chapter", lessons: [] })}
            >
              <IconPlus size={20} />
            </Button>
          </Tooltip>
        </div>

        <Divider orientation="vertical" className="h-10 self-end mb-1" />

        {/* LESSON SECTION */}
        <div className="flex items-end gap-1">
          <Input
            label="Lesson"
            labelPlacement="outside"
            placeholder="Lesson Name"
            isDisabled={!currentChapter}
            value={currentLesson?.name || ''}
            onValueChange={updateLessonName}
            startContent={<IconFileText size={18} className="text-secondary" />}
            className="w-48 lg:w-60"
            endContent={
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light" className="text-default-400">
                    <IconChevronDown size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Switch Lesson"
                  onAction={(key) => setCurrentLessonIndex(Number(key))}
                >
                  {(currentChapter?.lessons || []).map((ls, idx) => (
                    <DropdownItem key={idx}>{ls.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            }
          />
          <Tooltip content="New Lesson">
            <Button
              isIconOnly
              radius="md"
              color="secondary"
              variant="flat"
              isDisabled={!currentChapter}
              onPress={() => addLesson(currentChapterIndex, { name: "Untitled Lesson", theory: '', questions: [] })}
            >
              <IconPlus size={20} />
            </Button>
          </Tooltip>
        </div>
      </NavbarContent>

      {/* 3. ACTIONS */}
      <NavbarContent justify="end">
        <Button
          color="primary"
          variant="shadow"
          className="font-bold"
          startContent={<IconDeviceFloppy size={20} stroke={2.5} />}
          onPress={() => console.log(courseData)}
        >
          Save Course
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
