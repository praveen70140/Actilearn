import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import CourseViewer from './CourseViewer';
import { courseSchema } from '@/lib/zod/course';

export default async function CourseViewPage() {
  await connectDB();
  const course = await Course.findOne().lean();

  if (!course) {
    return <div>Course not found</div>;
  }

  // The 'id' in the zod schema is a uuid, but mongoose uses ObjectId.
  // The fetched course has `_id`. Let's map it to `id`.
  // The course object from the database needs to be validated and parsed.
  // The seeder script uses the course `id` as `slug`.
  // The schema has `slug` as a UUID, and the data has `id` as UUID.
  // The data from the database will have a `slug` field.
  // The zod schema expects `id`.
  const courseToValidate = {
    ...course,
    id: course.slug.toString(),
  };

  const parsedCourse = courseSchema.parse(courseToValidate);

  return <CourseViewer courseData={parsedCourse} />;
}