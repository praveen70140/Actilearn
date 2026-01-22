'use client';

import { useRouter } from 'next/navigation';
import { Button, Modal } from '@heroui/react';

interface PreCourseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  courseTitle: string;
}

export function PreCourseModal({ isOpen, onOpenChange, courseTitle }: PreCourseModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      {/* Move the blur effect here using the variant prop */}
      <Modal.Backdrop variant="blur" isDismissable={false}>
        <Modal.Container>
          <Modal.Dialog className="bg-[#181825] border border-[#313244]">
            <Modal.Header className="text-[#f38ba8]">
              <Modal.Heading>Ready to start?</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="text-[#a6adc8]">
              Entering: <b>{courseTitle}</b>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={() => router.push('/dashboard')}>
                Cancel
              </Button>
              <Button className="bg-[#b4befe] text-[#11111b]" slot="close">
                Start Learning
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
