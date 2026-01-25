import { ObjectId } from 'mongodb';
import { model, models, Schema, Types } from 'mongoose';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';

interface IQuestionResponseSchema {
  response: any;
  evaluation: EvaluationStatus;
}

interface ILessonMongoSchema {
  questions: IQuestionResponseSchema[];
}

interface IChapterMongoSchema {
  lessons: ILessonMongoSchema[];
}

interface IResponseMongoSchema {
  user: ObjectId;
  course: ObjectId;
  chapters: IChapterMongoSchema[];
}

const questionResponseSchema = new Schema<IQuestionResponseSchema>({
  response: { type: { any: {} } },
  evaluation: {
    type: Schema.Types.Number,
    required: true,
    default: EvaluationStatus.PENDING,
  },
});

const lessonMongoSchema = new Schema<ILessonMongoSchema>({
  questions: {
    type: [questionResponseSchema],
    required: true,
  },
});

const chapterMongoSchema = new Schema<IChapterMongoSchema>({
  lessons: {
    type: [lessonMongoSchema],
    required: true,
  },
});

const ResponseMongoSchema = new Schema<IResponseMongoSchema>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  chapters: { type: [chapterMongoSchema], required: true },
});

export default models.Response || model('Response', ResponseMongoSchema);
