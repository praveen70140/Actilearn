'use server';

import { signIn } from '@/lib/auth-client';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';
import { loginUserSchema } from '@/lib/zod/login-user';
import { redirect } from 'next/navigation';
import z from 'zod';

export const loginUser = async (formData: z.infer<typeof loginUserSchema>) => {
  if (!formData) {
    return { error: 'Please provide form data!' };
  }
  const validatedFields = loginUserSchema.safeParse(formData);
  if (validatedFields.error) {
    return {
      error: validatedFields.error.message,
    };
  }
  const { data } = validatedFields;

  const result = await signIn.email({
    ...data,
    callbackURL: '/dashboard',
  });
  if (result.error) {
    return {
      error:
        result.error.message || 'Login failed. Please check your credentials.',
    };
  } else {
    // Successful login - redirect to dashboard
    redirect('/dashboard');
    return { success: 'Logged in successfully' };
  }
};
