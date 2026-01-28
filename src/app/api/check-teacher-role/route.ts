import { auth } from '@/lib/auth';
import { isUserTeacher } from '@/lib/utils/role-check';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const isTeacher = await isUserTeacher(session.user.id);

    return Response.json({
      isTeacher,
      userId: session.user.id,
      redirectUrl: isTeacher ? '/teacher-dashboard' : '/dashboard',
    });
  } catch (error) {
    console.error('Teacher check API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
