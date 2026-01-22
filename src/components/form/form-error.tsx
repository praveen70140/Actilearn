import { Alert } from '@heroui/react';
import React from 'react';

interface Props {
  message?: string;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <Alert status="danger" className="border-danger border-2">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
};

export default FormError;
