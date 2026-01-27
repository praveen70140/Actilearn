'use server';

import { auth } from '@/lib/auth';
import { loginUserSchema } from '@/lib/zod/login-user';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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

  try {
    const result = await auth.api.signInEmail({
      body: { ...data },
      headers: await headers(),
      asResponse: true,
    });

    if (!result.ok) {
      let errorMessage = 'Login failed. Please check your credentials.';
      try {
        const errorData = await result.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore
      }
      return {
        error: errorMessage,
      };
    }
  } catch (error: any) {
    return {
      error: error.message || 'An unexpected error occurred during login.',
    };
  }

  // Successful login - redirect to dashboard
  redirect('/dashboard');
};
