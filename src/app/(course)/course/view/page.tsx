import { headers } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import CourseViewer from './CourseViewer';
import { courseSchema } from '@/lib/zod/course';
import Response from '@/db/models/Response';
import { auth } from '@/lib/auth';
import { responseDocumentSchema } from '@/lib/zod/responses';

export default async function CourseViewPage() {
  await connectDB();
  const courseDoc = await Course.findOne().lean();

  if (!courseDoc) return <div>Course not found</div>;

  // FIX: Force conversion of BSON UUID buffers to Strings
  const serializedCourse = {
    ...courseDoc,
    _id: courseDoc._id.toString(),
    slug: courseDoc.slug.toString(),
    id: courseDoc.slug.toString(), // Map slug to id for your schema
    creator: courseDoc.creator?.toString(),
    created: courseDoc.created?.toISOString(),
  };

  // Validate with Zod
  const parsedCourse = courseSchema.parse(serializedCourse);

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;
  
  let userResponse = null;

  if (userId) {
    const responseData = await Response.findOne({
      user: userId,
      course: courseDoc._id // Search using the ObjectId from the DB
    }).lean();

    if (responseData) {
      userResponse = responseDocumentSchema.parse({
        ...responseData,
        _id: responseData._id.toString(),
        user: responseData.user.toString(),
        course: responseData.course.toString(),
      });
    }
  }

  return <CourseViewer courseData={parsedCourse} responseData={userResponse} />;
}