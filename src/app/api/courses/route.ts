
// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import Course from '@/db/models/Course';
import connectDB from '@/lib/mongoose';

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Fetches all courses
 *     description: Returns a list of all courses from the database.
 *     responses:
 *       200:
 *         description: A JSON array of course objects
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all courses from the database
    const courses = await Course.find({});

    // Return the courses as a JSON response
    return NextResponse.json(courses);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to fetch courses:', error);

    // Return an error response
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 },
    );
  }
}
