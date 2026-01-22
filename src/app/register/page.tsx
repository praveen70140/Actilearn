'use client';

import { useState, useTransition } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { registerUserSchema } from '@/lib/zod/register-user';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button, Form, Input } from '@heroui/react';
import FormError from '@/components/form/form-error';
import FormSuccess from '@/components/form/form-success';
import { registerUser } from '@/actions/auth/register-user';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';

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
            redirect(DEFAULT_LOGGEDUSER_REDIRECT);
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
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
              label={'Full Name'}
              placeholder="Enter your full name"
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type="email"
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
              label="Email"
              placeholder="Enter your email"
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type={isPasswordVisible ? 'text' : 'password'}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
              label="Password"
              placeholder="Enter your password"
              errorMessage={error?.message}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setIsPasswordVisible((e) => !e)}
                >
                  {isPasswordVisible ? <IconEye /> : <IconEyeClosed />}
                </Button>
              }
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              isRequired
              validationBehavior="aria"
              isInvalid={invalid}
              label={'Confirm Password'}
              placeholder="Confirm your password"
              errorMessage={error?.message}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setIsConfirmPasswordVisible((e) => !e)}
                >
                  {isConfirmPasswordVisible ? <IconEye /> : <IconEyeClosed />}
                </Button>
              }
            />
          )}
        />

        <p className="text-danger-500">{(errors as any)['']?.message}</p>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" color="primary" fullWidth isDisabled={isPending}>
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
