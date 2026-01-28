// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import Course from '@/db/models/Course';
import connectDB from '@/lib/mongoose';
import { auth } from '@/lib/auth';
import { isUserTeacher } from '@/lib/utils/role-check';
import { courseSchema } from '@/lib/zod/course';
import { ZodError } from 'zod';

// Create a schema for API input validation that excludes auto-generated fields
const apiCourseInputSchema = courseSchema
  .omit({
    slug: true, // Will be auto-generated
    created: true, // Will be auto-generated
  })
  .extend({
    _id: courseSchema.shape._id, // Keep _id as optional
  });

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

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Creates a new course
 *     description: Creates a new course and saves it to the database. Requires teacher authentication.
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Teacher role required
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get session and authenticate user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be logged in to create courses',
          code: 'UNAUTHENTICATED',
        },
        { status: 401 },
      );
    }

    // Verify teacher role
    const isTeacher = await isUserTeacher(session.user.id);
    if (!isTeacher) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message:
            'Teacher role required to create courses. Please contact an administrator to upgrade your account.',
          code: 'INSUFFICIENT_PERMISSIONS',
        },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Remove slug and created from body if they exist (they should be auto-generated)
    const cleanBody = { ...body };
    delete cleanBody.slug;
    delete cleanBody.created;

    // Validate the course data using the API input schema (without slug and created)
    let validatedCourse;
    try {
      validatedCourse = apiCourseInputSchema.parse(cleanBody);
    } catch (error) {
      if (error instanceof ZodError) {
        // Format detailed validation errors
        const formattedErrors = error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
          received: err.received || 'undefined',
        }));

        return NextResponse.json(
          {
            error: 'Validation failed',
            message:
              'The course data contains validation errors. Please review and correct the following issues:',
            details: formattedErrors,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 },
        );
      }
      throw error;
    }

    // Transform course data for database save with auto-generated fields
    const courseForDb = {
      ...validatedCourse,
      creator: session.user.id, // Set creator to authenticated teacher
      isPrivate: false, // All courses public by default
      whitelist: [], // Empty whitelist for public courses
      slug: crypto.randomUUID(), // Auto-generate slug
      created: new Date(), // Auto-generate creation date
      _id: undefined, // Let MongoDB generate the ID
    };

    // Save course to database
    const newCourse = new Course(courseForDb);
    const savedCourse = await newCourse.save();

    console.log(
      `Course created successfully: ${savedCourse._id} by teacher: ${session.user.id}`,
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'Course created successfully',
        courseId: savedCourse._id,
        courseName: savedCourse.name,
        courseSlug: savedCourse.slug,
      },
      { status: 201 },
    );
  } catch (error) {
    // Log the error for debugging
    console.error('Failed to create course:', error);

    // Check for specific MongoDB errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const mongoError = error as any;
      const validationErrors = Object.keys(mongoError.errors || {}).map(
        (key) => ({
          path: key,
          message: mongoError.errors[key].message,
          code: 'MONGODB_VALIDATION_ERROR',
          received: mongoError.errors[key].value,
        }),
      );

      return NextResponse.json(
        {
          error: 'Database validation failed',
          message:
            'The course data failed database validation. Please check the following fields:',
          details: validationErrors,
          code: 'DATABASE_VALIDATION_ERROR',
        },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error as any).code === 11000
    ) {
      return NextResponse.json(
        {
          error: 'Duplicate course data',
          message:
            'A course with this information already exists. Please modify the course name or other unique identifiers.',
          code: 'DUPLICATE_DATA',
        },
        { status: 400 },
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Course creation failed',
        message:
          'An unexpected error occurred while creating your course. Please try again. If the problem persists, contact support.',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
