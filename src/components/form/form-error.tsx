import { Alert } from '@heroui/react';
import React from 'react';

interface Props {
  message?: string;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;
  return <Alert color={'danger'} description={message} />;
};

export default FormError;
