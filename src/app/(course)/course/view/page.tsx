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

  // Manual serialization of BSON types (UUID and ObjectId)
  const serializedCourse = {
    ...courseDoc,
    _id: courseDoc._id.toString(),
    slug: courseDoc.slug.toString(),
    id: courseDoc.slug.toString(),
    creator: courseDoc.creator?.toString(),
    created: courseDoc.created instanceof Date ? courseDoc.created.toISOString() : courseDoc.created,
  };

  const parsedCourse = courseSchema.parse(serializedCourse);
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  let userResponse = null;

  if (userId) {
    const responseData = await Response.findOne({
      user: userId,
      course: courseDoc._id
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
