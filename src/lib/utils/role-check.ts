import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Educator from '@/db/models/Educator';
import { ObjectId } from 'mongodb';

/**
 * Check if a user is a teacher by looking up their record in the educators collection
 * @param userId - The user ID from Better Auth
 * @returns Promise<boolean> - True if user is a teacher, false otherwise
 */
export async function isUserTeacher(userId: string): Promise<boolean> {
  try {
    console.log('=== isUserTeacher DEBUG START ===');
    console.log('Input userId:', userId);
    console.log('userId type:', typeof userId);

    await connectDB();
    console.log('Database connected successfully');

    // First try to find by string userId (new format)
    console.log('Searching for educator with string userId:', userId);
    let educator = await Educator.findOne({ userId: userId });
    console.log('Found educator by string:', educator);

    // If not found, try by ObjectId (existing records format)
    if (!educator) {
      console.log('No educator found by string, trying ObjectId conversion...');
      try {
        const objectIdUserId = new ObjectId(userId);
        console.log('Converted to ObjectId:', objectIdUserId);
        educator = await Educator.findOne({ userId: objectIdUserId });
        console.log('Found educator by ObjectId:', educator);
      } catch (error) {
        console.log('Failed to convert to ObjectId:', error);
        // userId is not a valid ObjectId, continue
      }
    }

    const result = educator !== null && educator.isTeacher === true;
    console.log('Final result - isTeacher:', result);
    console.log('=== isUserTeacher DEBUG END ===');

    return result;
  } catch (error) {
    console.error('Error checking teacher status:', error);
    return false;
  }
}

/**
 * Get the current session and check if the user is a teacher
 * @returns Promise<boolean> - True if current user is a teacher, false otherwise
 */
export async function isCurrentUserTeacher(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    return await isUserTeacher(session.user.id);
  } catch (error) {
    console.error('Error checking current user teacher status:', error);
    return false;
  }
}

/**
 * Get the appropriate dashboard redirect URL based on user role
 * @param userId - The user ID to check
 * @returns Promise<string> - The dashboard URL to redirect to
 */
export async function getDashboardUrl(userId: string): Promise<string> {
  const isTeacher = await isUserTeacher(userId);
  return isTeacher ? '/teacher-dashboard' : '/dashboard';
}

/**
 * Get educator info for a user
 * @param userId - The user ID to get educator info for
 * @returns Promise<any> - Educator record or null if not found
 */
export async function getEducatorInfo(userId: string): Promise<any> {
  try {
    await connectDB();

    // First try string format, then ObjectId format for backwards compatibility
    let educator = await Educator.findOne({ userId: userId });
    if (!educator) {
      try {
        const objectIdUserId = new ObjectId(userId);
        educator = await Educator.findOne({ userId: objectIdUserId });
      } catch {
        // userId is not a valid ObjectId
      }
    }

    return educator;
  } catch (error) {
    console.error('Error getting educator info:', error);
    return null;
  }
}
