import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Educator from '@/db/models/Educator';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    // Find all educators and get user collection from Better Auth
    const educators = await Educator.find({});
    const updates = [];

    for (const educator of educators) {
      // If userId is stored as ObjectId, we need to find the corresponding string user ID
      const objectIdUserId = educator.userId.toString();

      // Get the user from Better Auth user collection
      const db = (await connectDB()).connection.db;
      const usersCollection = db.collection('user');
      const user = await usersCollection.findOne({ _id: educator.userId });

      if (user && user._id) {
        const stringUserId = user._id.toString();

        // Update educator record with string userId
        await Educator.findByIdAndUpdate(educator._id, {
          userId: stringUserId,
        });

        updates.push({
          educatorId: educator._id,
          oldUserId: educator.userId,
          newUserId: stringUserId,
          userEmail: user.email,
        });
      }
    }

    return Response.json({
      message: 'Migration completed',
      updates: updates,
      totalUpdated: updates.length,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return Response.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 },
    );
  }
}
