import { headers } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import CourseViewer from './CourseViewer';
import { courseSchema } from '@/lib/zod/course';
import Response from '@/db/models/Response';
import { auth } from '@/lib/auth';
import { responseDocumentSchema } from '@/lib/zod/responses';
import { QuestionTypes } from '@/lib/enum/question-types';

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
      const transformedResponseData = {
        ...responseData,
        chapters: responseData.chapters.map((chapter, chapterIndex) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                questions: lesson.questions.map((questionResponse, questionIndex) => {
                    if (questionResponse.response && Array.isArray(questionResponse.response) && questionResponse.response.length > 0) {
                        const questionInCourse = parsedCourse.chapters[chapterIndex]?.lessons[lessonIndex]?.questions?.[questionIndex];
                        if (questionInCourse && typeof questionResponse.response[0] !== 'object') {
                            const answer = questionResponse.response[0];
                            let responseBody;
                            switch (questionInCourse.body.type) {
                                case QuestionTypes.MULTIPLE_CHOICE:
                                    responseBody = { selectedIndex: Number(answer) };
                                    break;
                                case QuestionTypes.NUMERICAL:
                                    responseBody = { submittedNumber: Number(answer) };
                                    break;
                                case QuestionTypes.OPEN_ENDED:
                                    responseBody = { submittedText: String(answer) };
                                    break;
                                case QuestionTypes.CODE_EXECUTION:
                                    if(typeof answer === 'string'){
                                      responseBody = { submittedCode: answer, languageSelected: 0, testCaseOutput: [] };
                                    } else {
                                      responseBody = answer;
                                    }
                                    break;
                                default:
                                    responseBody = answer;
                            }
                            return {
                                ...questionResponse,
                                response: [{
                                    type: questionInCourse.body.type,
                                    body: responseBody
                                }]
                            };
                        }
                    }
                    return questionResponse;
                }),
            })),
        })),
      };
      userResponse = responseDocumentSchema.parse({
        ...transformedResponseData,
        _id: responseData._id.toString(),
        user: responseData.user.toString(),
        course: responseData.course.toString(),
      });
    }
  }

  return <CourseViewer courseData={parsedCourse} responseData={userResponse} />;
}
