'use server';

import { signUp } from '@/lib/auth-client';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';
import { registerUserSchema } from '@/lib/zod/register-user';
import { redirect } from 'next/navigation';
import z from 'zod';
import connectDB from '@/lib/mongoose';
import Educator from '@/db/models/Educator';

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
    data: { confirmPassword, isTeacher, ...data },
  } = validatedFields;

  const result = await signUp.email({
    ...data,
    callbackURL: isTeacher ? '/teacher-dashboard' : '/dashboard',
  });

  if (result.error) {
    return {
      error: result.error.message || 'Registration failed. Please try again.',
    };
  }

  // If user is a teacher, create educator record
  if (isTeacher && result.data?.user?.id) {
    try {
      await connectDB();

      // Ensure we store the userId as a string
      const userId = result.data.user.id.toString();

      await Educator.create({
        userId: userId,
        isTeacher: true,
      });

      console.log(`Created educator record for user: ${userId}`);
    } catch (error) {
      console.error('Failed to create educator record:', error);
      // Don't fail the registration if educator record creation fails
      // The user can still be registered as a student
    }
  }

  // Successful registration - redirect to appropriate dashboard
  const redirectUrl = isTeacher
    ? '/teacher-dashboard'
    : DEFAULT_LOGGEDUSER_REDIRECT;
  redirect(redirectUrl);
  return { success: 'Signed up successfully' };
};
