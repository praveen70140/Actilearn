import { headers } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Course, { ICourseMongoSchema } from '@/db/models/Course';
import CourseViewer, { ResponseType } from './CourseViewer';
import { courseSchema } from '@/lib/zod/course';
import Response, { IResponseMongoSchema } from '@/db/models/Response';
import { auth } from '@/lib/auth';
import { QuestionTypes } from '@/lib/enum/question-types';
import z, { string } from 'zod';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';

export default async function CourseViewPage() {
  await connectDB();

  const courseDoc: ICourseMongoSchema | null = await Course.findOne().lean();
  if (!courseDoc) return <div>Course not found</div>;

  // Manual serialization of BSON types (UUID and ObjectId)
  const serializedCourse: z.infer<typeof courseSchema> = {
    // id: courseDoc.slug.toString(),
    description: courseDoc.description,
    slug: courseDoc.slug.toString(),
    tags: courseDoc.tags,
    chapters: courseDoc.chapters.map((chapter) => ({
      name: chapter.name,
      lessons: chapter.lessons.map((lesson) => ({
        name: lesson.name,
        theory: lesson.theory,
        questions: lesson.questions.map((question) => ({
          questionText: question.questionText,
          body: question.body,
          solution: question.solution,
        })),
      })),
    })),
    created: new Date(
      courseDoc.created instanceof Date
        ? courseDoc.created.toISOString()
        : courseDoc.created,
    ),
    name: courseDoc.name,
    _id: courseDoc._id.toString(),
  };

  const validatedFields = courseSchema.safeParse(serializedCourse);
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  let userResponse = null;

  if (validatedFields.error) {
    return <p>{validatedFields.error.message}</p>;
  }

  const { data: parsedCourse } = validatedFields;

  if (userId) {
    let responseData: ResponseType | null = await Response.findOne({
      user: userId,
      course: courseDoc._id,
    }).lean();

    if (!responseData) {
      const initialChapters = courseDoc.chapters.map((chapter) => ({
        lessons: chapter.lessons.map((lesson) => ({
          questions: lesson.questions.map(() => ({
            response: {},
            evaluation: EvaluationStatus.SKIPPED,
          })),
        })),
      }));

      const newResponse = await Response.create({
        user: userId,
        course: courseDoc._id,
        chapters: initialChapters,
      });

      responseData = newResponse.toObject();
    }

    if (responseData) {
      const transformedResponseData = {
        user: responseData.user.toString(),
        course: responseData.course.toString(),
        _id: responseData._id.toString(),
        chapters: responseData.chapters.map((chapter, chapterIndex) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson, lessonIndex) => ({
            ...lesson,
            questions: lesson.questions.map(
              (questionResponse, questionIndex) => {
                if (
                  questionResponse.response &&
                  Array.isArray(questionResponse.response) &&
                  questionResponse.response.length > 0
                ) {
                  const questionInCourse =
                    parsedCourse.chapters[chapterIndex]?.lessons[lessonIndex]
                      ?.questions?.[questionIndex];
                  if (
                    questionInCourse &&
                    typeof questionResponse.response[0] !== 'object'
                  ) {
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
                        if (typeof answer === 'string') {
                          responseBody = {
                            submittedCode: answer,
                            languageSelected: 0,
                            testCaseOutput: [],
                          };
                        } else {
                          responseBody = answer;
                        }
                        break;
                      default:
                        responseBody = answer;
                    }
                    return {
                      ...questionResponse,
                      response: [
                        {
                          type: questionInCourse.body.type,
                          body: responseBody,
                        },
                      ],
                    };
                  }
                }
                return questionResponse;
              },
            ),
          })),
        })),
      };
      // Assign the transformed data to userResponse or a similar variable if needed
      // Note: The original code didn't assign 'transformedResponseData' to 'userResponse' explicitly in the snippet I saw,
      // but it returned <CourseViewer responseData={userResponse} />.
      // Wait, the original code had:
      // if (responseData) { const transformedResponseData = ... }
      // AND THEN return <CourseViewer ... responseData={userResponse} />
      // BUT userResponse was initialized to null and NEVER assigned.
      // The original code snippet provided in 'read' shows:
      // let userResponse = null;
      // ...
      // if (responseData) { const transformedResponseData = ... }
      // ...
      // return <CourseViewer ... responseData={userResponse} />
      // This implies the original code was BUGGY (passing null always).
      // I should fix this by assigning transformedResponseData to userResponse.

      userResponse = transformedResponseData as any; // Cast to any or appropriate type to match CourseViewer props
    }
  }

  return <CourseViewer courseData={parsedCourse} responseData={userResponse} />;
}
