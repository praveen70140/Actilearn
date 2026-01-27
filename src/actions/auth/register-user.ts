'use server';

import { auth } from '@/lib/auth';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';
import { registerUserSchema } from '@/lib/zod/register-user';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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

  try {
    const result = await auth.api.signUpEmail({
      body: {
        ...data,
      },
      headers: await headers(),
      asResponse: true,
    });

    if (!result.ok) {
      let errorMessage = 'Registration failed. Please try again.';
      try {
        const errorData = await result.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore json parse error
      }
      return {
        error: errorMessage,
      };
    }
  } catch (error: any) {
    return {
      error:
        error.message || 'An unexpected error occurred during registration',
    };
  }

  // Successful registration - redirect to dashboard (user is auto-signed in)
  redirect(DEFAULT_LOGGEDUSER_REDIRECT);
};
