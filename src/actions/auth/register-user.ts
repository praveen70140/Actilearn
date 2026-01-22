'use server';

import { signUp } from '@/lib/auth-client';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';
import { registerUserSchema } from '@/lib/zod/register-user';
import { redirect } from 'next/navigation';
import z from 'zod';

export const registerUser = async (
  formData: z.infer<typeof registerUserSchema>,
) => {
  if (!formData) {
    return { error: 'Please provide form data!' };
  }
  const validatedFields = registerUserSchema.safeParse(formData);
  if (validatedFields.error) {
    return {
      error: validatedFields.error.message,
    };
  }
  const {
    data: { confirmPassword, ...data },
  } = validatedFields;

  const result = await signUp.email({
    ...data,
    callbackURL: '/dashboard',
  });
  if (result.error) {
    return {
      error: result.error.message || 'Registration failed. Please try again.',
    };
  } else {
    // Successful registration - redirect to dashboard (user is auto-signed in)
    redirect(DEFAULT_LOGGEDUSER_REDIRECT);
    return { success: 'Signed up successfully' };
  }
};
