'use client';

import { useState, useTransition } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { registerUserSchema } from '@/lib/zod/register-user';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Alert,
  Button,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import FormError from '@/components/form/form-error';
import FormSuccess from '@/components/form/form-success';
import { registerUser } from '@/actions/auth/register-user';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    mode: 'onBlur',
  });

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const onSubmit = async (formData: z.infer<typeof registerUserSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      registerUser(formData)
        .then((data) => {
          if (data && data.success) {
            setSuccess(data.success);
            reset({
              email: '',
              name: '',
              password: '',
              confirmPassword: '',
            });
            redirect('/dashboard');
          }
          if (data && data.error) {
            setError(data.error);
          }
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    });

    // // Basic validation
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match');
    //   return;
    // }
    // if (password.length < 8) {
    //   setError('Password must be at least 8 characters long');
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const result = await signUp.email({
    //     email,
    //     password,
    //     name,
    //     callbackURL: '/dashboard',
    //   });
    //   if (result.error) {
    //     setError(
    //       result.error.message || 'Registration failed. Please try again.',
    //     );
    //   } else {
    //     // Successful registration - redirect to dashboard (user is auto-signed in)
    //     // router.push('/dashboard');
    //   }
    // // Basic validation
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match');
    //   return;
    // }
    // if (password.length < 8) {
    //   setError('Password must be at least 8 characters long');
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const result = await signUp.email({
    //     email,
    //     password,
    //     name,
    //     callbackURL: '/dashboard',
    //   });
    //   if (result.error) {
    //     setError(
    //       result.error.message || 'Registration failed. Please try again.',
    //     );
    //   } else {
    // } catch (err: any) {
    //   setError(
    //     err.message || 'An unexpected error occurred. Please try again.',
    //   );
    // } finally {
    //   // setLoading(false);
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Form
        className="w-full max-w-md space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-accent text-center text-3xl font-extrabold">
          Create your account
        </h2>

        <Controller
          control={control}
          name="name"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
            >
              <Label>Full Name</Label>
              <Input placeholder="Enter your full name" />
              <FieldError>{error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type="email"
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
            >
              <Label>Email</Label>
              <Input placeholder="Enter your email" />
              <FieldError>{error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type={isPasswordVisible ? 'text' : 'password'}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
            >
              <Label>Password</Label>{' '}
              <Input placeholder="Enter your password" />
              <FieldError>{error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
            >
              <Label>Confirm Password</Label>
              <Input placeholder="Confirm your password" />
              <FieldError>{error?.message}</FieldError>
            </TextField>
          )}
        />

        <ErrorMessage>{(errors as any)['']?.message}</ErrorMessage>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" fullWidth isDisabled={isPending}>
          Create Account
        </Button>

        <p className="text-sm">
          Already have an account?{' '}
          <Link href={'/login'} className="text-accent underline">
            Log in here
          </Link>
        </p>
      </Form>
    </div>
  );
}
