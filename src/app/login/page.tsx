'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { loginUserSchema } from '@/lib/zod/login-user';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from '@heroui/react';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import FormError from '@/components/form/form-error';
import FormSuccess from '@/components/form/form-success';
import { loginUser } from '@/actions/auth/login-user';
import { useSession } from '@/lib/auth-client';
import { router } from 'better-auth/api';
import { useRouter } from 'next/navigation';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    mode: 'onBlur',
  });

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const { data: session, refetch } = useSession();

  const onSubmit = async (formData: z.infer<typeof loginUserSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      loginUser(formData)
        .then((data) => {
          if (data && data.success) {
            setSuccess(data.success);
          }
          if (data && data.error) {
            setError(data.error);
          }
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    });
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
        <p>{JSON.stringify(session)}</p>

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

        <Button type="submit" color="primary" fullWidth isDisabled={isPending}>
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
