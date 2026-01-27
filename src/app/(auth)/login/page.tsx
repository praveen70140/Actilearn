'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUserSchema } from '@/lib/zod/login-user';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from '@heroui/react';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import FormError from '@/components/form/form-error';
import FormSuccess from '@/components/form/form-success';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    mode: 'onBlur',
  });

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData: z.infer<typeof loginUserSchema>) => {
    setError('');
    setSuccess('');

    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Form
        className="w-full max-w-md space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-primary-500 text-center text-3xl font-extrabold">
          Sign in to your account
        </h2>

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
        <FormError message={error} />
        <FormSuccess message={success} />

        <Button
          type="submit"
          color="primary"
          fullWidth
          isDisabled={isSubmitting}
        >
          Sign In
        </Button>

        <p className="text-sm">
          Don't have an account?{' '}
          <Link href={'/register'} className="text-secondary underline">
            Sign up here
          </Link>
        </p>
      </Form>
    </div>
  );
}
