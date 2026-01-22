'use client';

import { useRouter } from 'next/navigation';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

interface PreCourseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  courseTitle: string;
}

export function PreCourseModal({ isOpen, onOpenChange, courseTitle }: PreCourseModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" isDismissable={false}>
      <ModalContent className="bg-[#181825] border border-[#313244]">
        {(onClose) => (
          <>
            <ModalHeader className="text-[#f38ba8]">
              Ready to start?
            </ModalHeader>
            <ModalBody className="text-[#a6adc8]">
              Entering: <b>{courseTitle}</b>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={() => router.push('/dashboard')}>
                Cancel
              </Button>
              <Button className="bg-[#b4befe] text-[#11111b]" onPress={onClose}>
                Start Learning
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
