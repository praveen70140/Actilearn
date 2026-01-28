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
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorDetail {
  path: string;
  message: string;
  code: string;
  received: string;
}

interface ApiError {
  error: string;
  message: string;
  code: string;
  details?: ErrorDetail[];
}

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

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  // New state for course submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorData, setErrorData] = useState<ApiError | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    courseId: string;
    courseName: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Course submission handler
  const handleSubmitCourse = async () => {
    setIsSubmitting(true);
    setErrorData(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle error response
        setErrorData(responseData as ApiError);
        setIsErrorModalOpen(true);
        return;
      }

      // Success case
      console.log('Course created successfully:', responseData);
      setSuccessData({
        courseId: responseData.courseId,
        courseName: responseData.courseName,
      });
      setIsSuccessModalOpen(true);

      // Redirect to teacher dashboard after a short delay
      setTimeout(() => {
        router.push('/teacher-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Network error during course submission:', error);
      setErrorData({
        error: 'Network Error',
        message:
          'Failed to connect to the server. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      });
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatErrorPath = (path: string) => {
    // Convert paths like "chapters.0.lessons.1.name" to "Chapter 1 → Lesson 2 → Name"
    const parts = path.split('.');
    let formatted = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === 'chapters') {
        formatted += 'Chapter ';
      } else if (part === 'lessons') {
        formatted += ' → Lesson ';
      } else if (part === 'questions') {
        formatted += ' → Question ';
      } else if (!isNaN(Number(part))) {
        formatted += Number(part) + 1;
      } else {
        formatted += ` → ${part.charAt(0).toUpperCase() + part.slice(1)}`;
      }
    }

    return formatted;
  };

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
    <>
      <Navbar
        maxWidth="full"
        isBordered
        className="bg-background/70 border-divider h-20 border-b backdrop-blur-md"
      >
        <NavbarContent justify="start">
          {/* Placeholder for potential branding or other start-aligned elements */}
        </NavbarContent>

        {/* 2. CHAPTER & LESSON MANAGEMENT - NOW CENTRALIZED */}
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
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400"
                    >
                      <IconChevronDown size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Switch Chapter"
                    onAction={(key) => setCurrentChapterIndex(Number(key))}
                  >
                    {courseData.chapters.map((ch, idx) => (
                      <DropdownItem
                        key={idx}
                        description={`Contains ${ch.lessons.length} lessons`}
                      >
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
                onPress={() =>
                  addChapter({ name: 'Untitled Chapter', lessons: [] })
                }
              >
                <IconPlus size={20} />
              </Button>
            </Tooltip>
          </div>

          <Divider orientation="vertical" className="mb-1 h-10 self-end" />

          {/* LESSON SECTION */}
          <div className="flex items-end gap-1">
            <Input
              label="Lesson"
              labelPlacement="outside"
              placeholder="Lesson Name"
              isDisabled={!currentChapter}
              value={currentLesson?.name || ''}
              onValueChange={updateLessonName}
              startContent={
                <IconFileText size={18} className="text-secondary" />
              }
              className="w-48 lg:w-60"
              endContent={
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400"
                    >
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
                onPress={() =>
                  addLesson(currentChapterIndex, {
                    name: 'Untitled Lesson',
                    theory: '',
                    questions: [],
                  })
                }
              >
                <IconPlus size={20} />
              </Button>
            </Tooltip>
          </div>
        </NavbarContent>

        {/* 3. ACTIONS & COURSE TITLE (moved from start) */}
        <NavbarContent justify="end" className="gap-6">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              variant="flat"
              label="Course Title"
              labelPlacement="outside"
              value={courseData.name}
              onChange={(e) =>
                setCourseData({ ...courseData, name: e.target.value })
              }
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              className="w-48 lg:w-64"
            />
          ) : (
            <div
              className="group flex h-[58px] w-48 cursor-pointer flex-col justify-center lg:w-64"
              onClick={() => setIsEditingTitle(true)}
            >
              <label className="text-default-500 origin-top-left text-xs">
                Course Title
              </label>
              <div className="flex items-center gap-2">
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
          <Tooltip content="Edit Metadata">
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsMetadataModalOpen(true)}
              className="ml-2"
            >
              <IconInfoCircle size={20} />
            </Button>
          </Tooltip>
          <Button
            color="primary"
            variant="shadow"
            className="font-bold"
            startContent={
              isSubmitting ? (
                <Spinner size="sm" color="white" />
              ) : (
                <IconDeviceFloppy size={20} stroke={2.5} />
              )
            }
            onPress={handleSubmitCourse}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
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
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsMetadataModalOpen(false)}>Close</Button>
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
                      {errorData.details.map((detail, index) => (
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
