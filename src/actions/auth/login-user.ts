'use server';

import { auth } from '@/lib/auth';
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

  const result = await auth.api.signInEmail({
    body: { ...data },
    asResponse: true,
  });
  if (!result.ok) {
    return {
      error: 'Login failed. Please check your credentials.',
    };
  } else {
    // Successful login - redirect to dashboard

    redirect('/dashboard');
    return { success: JSON.stringify(result) };
  }
};
