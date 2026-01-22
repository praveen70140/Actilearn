import { Alert } from '@heroui/react';
import React from 'react';

interface Props {
  message?: string;
}

const FormSuccess = ({ message }: Props) => {
  if (!message) return null;
  return <Alert color={'success'} description={message} />;
};

export default FormSuccess;
