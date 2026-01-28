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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Spinner,
} from '@heroui/react';
import {
  IconDeviceFloppy,
  IconPlus,
  IconChevronDown,
  IconFolder,
  IconFileText,
  IconEdit,
  IconInfoCircle,
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react';
import { useCourseCreateContext } from '../context/CourseCreateContext';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();
  const titleInputRef = useRef<HTMLInputElement>(null);

  // --- UI State ---
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorData, setErrorData] = useState<any | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // --- Bug Fix 9: Local State to prevent cursor jumping/lag ---
  const [localChapterName, setLocalChapterName] = useState('');
  const [localLessonName, setLocalLessonName] = useState('');

  const currentChapter = courseData.chapters[currentChapterIndex];
  const currentLesson = currentChapter?.lessons[currentLessonIndex];

  // Sync local state when the active index changes
  useEffect(() => {
    setLocalChapterName(currentChapter?.name || '');
  }, [currentChapterIndex, currentChapter?.name]);

  useEffect(() => {
    setLocalLessonName(currentLesson?.name || '');
  }, [currentLessonIndex, currentLesson?.name]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // --- Handlers ---

  // Bug Fix 6: Auto-switch to newly created items
  const handleAddChapter = () => {
    addChapter({ name: 'New Chapter', lessons: [] });
    setCurrentChapterIndex(courseData.chapters.length);
    setCurrentLessonIndex(0);
  };

  const handleAddLesson = () => {
    if (!currentChapter) return;
    addLesson(currentChapterIndex, {
      name: 'New Lesson',
      theory: '',
      questions: [],
    });
    setCurrentLessonIndex(currentChapter.lessons.length);
  };

  const updateChapterName = (val: string) => {
    setLocalChapterName(val);
    setCourseData((prev) => {
      // 1. Copy all chapters
      const updatedChapters = [...prev.chapters];

      // 2. Copy the specific chapter we are editing and update the name
      if (updatedChapters[currentChapterIndex]) {
        updatedChapters[currentChapterIndex] = {
          ...updatedChapters[currentChapterIndex],
          name: val,
        };
      }

      return { ...prev, chapters: updatedChapters };
    });
  };

  const updateLessonName = (val: string) => {
    setLocalLessonName(val);
    setCourseData((prev) => {
      // 1. Copy all chapters
      const updatedChapters = [...prev.chapters];

      // 2. Copy the specific chapter we are editing
      const targetChapter = { ...updatedChapters[currentChapterIndex] };

      // 3. Copy the lessons array within that chapter
      const updatedLessons = [...targetChapter.lessons];

      // 4. Copy the specific lesson and update the name
      updatedLessons[currentLessonIndex] = {
        ...updatedLessons[currentLessonIndex],
        name: val,
      };

      // 5. Put it all back together
      targetChapter.lessons = updatedLessons;
      updatedChapters[currentChapterIndex] = targetChapter;

      return { ...prev, chapters: updatedChapters };
    });
  };

  const handleSubmitCourse = async () => {
    // Basic validation before submission
    if (!courseData.name || courseData.name.trim().length < 10) {
      setErrorData({
        error: 'Validation Error',
        message: 'Course name must be at least 10 characters long',
        code: 'VALIDATION_ERROR',
      });
      setIsErrorModalOpen(true);
      return;
    }

    if (!courseData.description || courseData.description.trim().length === 0) {
      setErrorData({
        error: 'Validation Error',
        message:
          'Course description is required. Please click the info icon to add a description.',
        code: 'VALIDATION_ERROR',
      });
      setIsErrorModalOpen(true);
      return;
    }

    if (courseData.chapters.length === 0) {
      setErrorData({
        error: 'Validation Error',
        message:
          'Course must have at least one chapter. Please add a chapter before submitting.',
        code: 'VALIDATION_ERROR',
      });
      setIsErrorModalOpen(true);
      return;
    }

    if (courseData.chapters.some((chapter) => chapter.lessons.length === 0)) {
      setErrorData({
        error: 'Validation Error',
        message:
          'Each chapter must have at least one lesson. Please add lessons to all chapters.',
        code: 'VALIDATION_ERROR',
      });
      setIsErrorModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorData(data);
        setIsErrorModalOpen(true);
      } else {
        setSuccessData({
          courseId: data.courseId,
          courseName: data.courseName,
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => router.push('/teacher-dashboard'), 2000);
      }
    } catch (err) {
      setErrorData({
        error: 'Network Error',
        message:
          'Failed to connect to server. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      });
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatErrorPath = (path: string) => {
    return path
      .split('.')
      .map((p) => (isNaN(Number(p)) ? p : Number(p) + 1))
      .join(' → ');
  };

  return (
    <>
      <Navbar
        maxWidth="full"
        isBordered
        className="bg-background/70 border-divider h-20 border-b backdrop-blur-md"
        // Bug Fix 10: Ensure dropdowns aren't clipped
        classNames={{ wrapper: 'overflow-visible' }}
      >
        <NavbarContent justify="start" className="max-w-fit">
          {/* Branding/Back Button could go here */}
        </NavbarContent>

        {/* CHAPTER & LESSON MANAGEMENT */}
        <NavbarContent justify="center" className="gap-4">
          {/* CHAPTER SECTION */}
          <div className="flex items-end gap-1">
            <Input
              label="Chapter"
              labelPlacement="outside"
              placeholder="Chapter Name"
              value={localChapterName}
              onValueChange={updateChapterName}
              startContent={
                <IconFolder size={18} className="text-primary flex-shrink-0" />
              }
              className="w-48 lg:w-64"
              endContent={
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    {/* Bug Fix 1 & 5: Button stops focus propagation to input */}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 min-w-8"
                    >
                      <IconChevronDown size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Switch Chapter"
                    disallowEmptySelection
                    selectionMode="single"
                    // Bug Fix 2: Visual feedback for current selection
                    selectedKeys={new Set([currentChapterIndex.toString()])}
                    onAction={(key) => setCurrentChapterIndex(Number(key))}
                  >
                    {courseData.chapters.map((ch, idx) => (
                      // Bug Fix 3: Stable string keys
                      <DropdownItem
                        key={idx.toString()}
                        description={`${ch.lessons.length} lessons`}
                      >
                        {ch.name || 'Untitled Chapter'}
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
                onPress={handleAddChapter}
              >
                <IconPlus size={20} />
              </Button>
            </Tooltip>
          </div>

          <Divider orientation="vertical" className="mx-2 mb-1 h-10 self-end" />

          {/* LESSON SECTION */}
          <div className="flex items-end gap-1">
            <Input
              label="Lesson"
              labelPlacement="outside"
              placeholder={
                currentChapter ? 'Lesson Name' : 'Add a chapter first'
              }
              isDisabled={!currentChapter}
              value={localLessonName}
              onValueChange={updateLessonName}
              startContent={
                <IconFileText
                  size={18}
                  className="text-secondary flex-shrink-0"
                />
              }
              className="w-48 lg:w-64"
              endContent={
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 min-w-8"
                      isDisabled={!currentChapter}
                    >
                      <IconChevronDown size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Switch Lesson"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([currentLessonIndex.toString()])}
                    onAction={(key) => setCurrentLessonIndex(Number(key))}
                  >
                    {/* Bug Fix 8: Empty state handling */}
                    {currentChapter?.lessons.length ? (
                      currentChapter.lessons.map((ls, idx) => (
                        <DropdownItem key={idx.toString()}>
                          {ls.name || 'Untitled Lesson'}
                        </DropdownItem>
                      ))
                    ) : (
                      <DropdownItem
                        key="none"
                        isReadOnly
                        className="italic opacity-50"
                      >
                        No lessons added
                      </DropdownItem>
                    )}
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
                onPress={handleAddLesson}
              >
                <IconPlus size={20} />
              </Button>
            </Tooltip>
          </div>
        </NavbarContent>

        {/* ACTIONS & COURSE TITLE */}
        <NavbarContent justify="end" className="gap-4">
          {/* Bug Fix 4: Matching heights and alignment for Course Title */}
          <div className="flex h-full flex-col justify-end pb-1">
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                variant="flat"
                label="Course Title"
                labelPlacement="outside"
                value={courseData.name}
                onValueChange={(val) =>
                  setCourseData({ ...courseData, name: val })
                }
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="w-48 lg:w-64"
              />
            ) : (
              <div
                className="group flex w-48 cursor-pointer flex-col px-1 lg:w-64"
                onClick={() => setIsEditingTitle(true)}
              >
                <label className="text-default-500 mb-1 text-xs">
                  Course Title
                </label>
                <div className="flex h-10 items-center gap-2">
                  <span className="truncate text-base font-medium">
                    {courseData.name || 'Untitled Course'}
                  </span>
                  <IconEdit
                    size={16}
                    className="text-default-400 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-1 flex items-center gap-2 self-end">
            <Tooltip content="Edit Metadata">
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsMetadataModalOpen(true)}
              >
                <IconInfoCircle size={22} />
              </Button>
            </Tooltip>
            <Button
              color="primary"
              variant="shadow"
              className="px-6 font-bold"
              startContent={
                !isSubmitting && <IconDeviceFloppy size={20} stroke={2.5} />
              }
              onPress={handleSubmitCourse}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </NavbarContent>
      </Navbar>

      {/* Course Metadata Modal */}
      <Modal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Course Metadata</ModalHeader>
          <ModalBody>
            <Textarea
              label="Course Description"
              labelPlacement="outside"
              placeholder="Enter a description for the course"
              value={courseData.description}
              onChange={(e) =>
                setCourseData({ ...courseData, description: e.target.value })
              }
              className="mb-4"
              minRows={3}
              isRequired
              description="A description is required for course creation"
            />
            <Input
              label="Tags (comma separated)"
              labelPlacement="outside"
              placeholder="e.g., programming, web development, javascript"
              value={courseData.tags.join(', ')}
              onChange={(e) =>
                setCourseData({
                  ...courseData,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
                })
              }
              description="Courses without tags will appear in 'Other Courses' section on the dashboard"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsMetadataModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => setIsMetadataModalOpen(false)}
            >
              Save Metadata
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <IconAlertTriangle size={24} className="text-danger" />
            Course Submission Failed
          </ModalHeader>
          <ModalBody>
            {errorData && (
              <div className="space-y-4">
                <div className="bg-danger-50 border-danger-200 rounded-lg border p-4">
                  <h4 className="text-danger-800 mb-2 font-semibold">
                    {errorData.error}
                  </h4>
                  <p className="text-danger-700">{errorData.message}</p>
                  {errorData.code && (
                    <p className="text-danger-600 mt-2 text-xs">
                      Error Code: {errorData.code}
                    </p>
                  )}
                </div>

                {errorData.details && errorData.details.length > 0 && (
                  <div>
                    <h5 className="mb-3 font-semibold">Detailed Issues:</h5>
                    <div className="space-y-3">
                      {errorData.details.map((detail: any, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="mb-1 font-medium text-gray-800">
                            {formatErrorPath(detail.path)}
                          </div>
                          <div className="mb-2 text-gray-700">
                            {detail.message}
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Received:</span> "
                            {detail.received}"
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Error Type:</span>{' '}
                            {detail.code}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsErrorModalOpen(false)}>
              Close and Fix Issues
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <IconCheck size={24} className="text-success" />
            Course Created Successfully!
          </ModalHeader>
          <ModalBody>
            {successData && (
              <div className="space-y-4 text-center">
                <div className="bg-success-50 border-success-200 rounded-lg border p-4">
                  <h4 className="text-success-800 mb-2 font-semibold">
                    "{successData.courseName}" has been created
                  </h4>
                  <p className="text-success-700">
                    Your course is now available to students. You'll be
                    redirected to your teacher dashboard shortly.
                  </p>
                  <p className="text-success-600 mt-2 text-xs">
                    Course ID: {successData.courseId}
                  </p>
                </div>
                <div className="text-default-500 flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm">Redirecting to dashboard...</span>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
