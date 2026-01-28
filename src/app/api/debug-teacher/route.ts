import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Educator from '@/db/models/Educator';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    // Get all educator records for debugging
    const allEducators = await Educator.find({}).limit(10);

    // Try to find educator record for current user
    const educatorByString = await Educator.findOne({
      userId: session.user.id,
    });

    return Response.json({
      userId: session.user.id,
      userIdType: typeof session.user.id,
      allEducators: allEducators.map((e) => ({
        _id: e._id,
        userId: e.userId,
        userIdType: typeof e.userId,
        isTeacher: e.isTeacher,
      })),
      foundByString: !!educatorByString,
      educatorRecord: educatorByString,
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
