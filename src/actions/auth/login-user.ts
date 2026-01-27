'use server';

import { auth } from '@/lib/auth';
import { loginUserSchema } from '@/lib/zod/login-user';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import z from 'zod';
import { isUserTeacher } from '@/lib/utils/role-check';

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

    // Get user session after successful login
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log('=== LOGIN SESSION DEBUG ===');
    console.log('Full session object:', JSON.stringify(session, null, 2));
    console.log('User ID from session:', session?.user?.id);
    console.log('User ID type:', typeof session?.user?.id);

    if (session?.user?.id) {
      // Check if user is a teacher and redirect accordingly
      console.log('=== CALLING isUserTeacher ===');
      const isTeacher = await isUserTeacher(session.user.id);
      console.log('isUserTeacher returned:', isTeacher);

      const redirectUrl = isTeacher ? '/teacher-dashboard' : '/dashboard';
      console.log('Redirecting to:', redirectUrl);
      console.log('=== LOGIN DEBUG END ===');

      redirect(redirectUrl);
    } else {
      console.log(
        'No session or user ID found, redirecting to default dashboard',
      );
      // Fallback to default dashboard if session check fails
      redirect('/dashboard');
    }
  } catch (error: any) {
    return {
      error: error.message || 'An unexpected error occurred during login.',
    };
  }
};
