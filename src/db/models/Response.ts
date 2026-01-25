import { model, models, Schema, ObjectId } from 'mongoose';
import { EvaluationStatus } from '@/lib/enum/evaluation-status';

interface IQuestionResponseSchema {
  response: any[];
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
  response: { type: [Schema.Types.Mixed], default: [] },
  evaluation: {
    type: Number,
    required: true,
  },
}, { _id: false }); // No internal IDs for question objects

const lessonMongoSchema = new Schema<ILessonMongoSchema>({
  questions: [questionResponseSchema],
}, { _id: false });

const chapterMongoSchema = new Schema<IChapterMongoSchema>({
  lessons: [lessonMongoSchema],
}, { _id: false });

const ResponseMongoSchema = new Schema<IResponseMongoSchema>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  chapters: [chapterMongoSchema],
}, {
  timestamps: true,
  minimize: false // Keeps empty arrays intact
});

export default models.Response || model('Response', ResponseMongoSchema);