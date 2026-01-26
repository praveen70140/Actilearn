import { headers } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Course, { ICourseMongoSchema } from '@/db/models/Course';
import CourseViewer from './CourseViewer';
import { courseSchema } from '@/lib/zod/course';
import Response, { IResponseMongoSchema } from '@/db/models/Response';
import { auth } from '@/lib/auth';
import { QuestionTypes } from '@/lib/enum/question-types';
import z, { string } from 'zod';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const courseDoc: ICourseMongoSchema | null = await Course.findOne({
    slug: id,
  }).lean();
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
    let responseData: IResponseMongoSchema | null = await Response.findOne({
      user: userId,
      course: courseDoc._id,
    }).lean();

    if (!responseData) {
      const initialChapters = courseDoc.chapters.map((chapter) => ({
        lessons: chapter.lessons.map((lesson) => ({
          questions: lesson.questions.map(() => ({
            response: {},
            evaluation: EvaluationStatus.PENDING,
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
        ...responseData,
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
      // Assign the transformed data to userResponse
      userResponse = transformedResponseData as any;
    }
  }

  return <CourseViewer courseData={parsedCourse} responseData={userResponse} />;
}
