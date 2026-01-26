/**
 * This file defines the API endpoint for fetching course categories.
 * It connects to the database and retrieves all the tag categories.
 */

import { NextRequest, NextResponse } from 'next/server';
import TagCategory from '@/db/models/TagCategory';
import connectDB from '@/lib/mongoose';

/**
 * @swagger
 * /api/courses/categories:
 *   get:
 *     summary: Fetches all course categories
 *     description: Returns a list of all course categories from the database.
 *     responses:
 *       200:
 *         description: A JSON array of course category objects
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all tag categories from the database
    const categories = await TagCategory.find({});

    // Return the categories as a JSON response
    return NextResponse.json(categories);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to fetch course categories:', error);

    // Return an error response
    return NextResponse.json(
      { message: 'Failed to fetch course categories' },
      { status: 500 },
    );
  }
}
