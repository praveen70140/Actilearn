import { ObjectId } from 'mongodb';
import { model, models, Schema } from 'mongoose';

interface IQuestionMongoSchema {
  questionText: string;
  solution: string;
  body: {
    type: number;
  };
  arguments: any;
  answer: any;
}

interface ILessonMongoSchema {
  name: string;
  theory: string;
  questions: IQuestionMongoSchema[];
}

interface IChapterMongoSchema {
  name: string;
  lessons: ILessonMongoSchema[];
}

interface ICourseMongoSchema {
  name: string;
  description: string;
  slug: any;
  creator: string;
  created: Date;
  isPrivate: boolean;
  whitelist: ObjectId[];
  tags: string[];
  chapters: IChapterMongoSchema[];
}

const questionMongoSchema = new Schema<IQuestionMongoSchema>({
  questionText: { type: Schema.Types.String, required: true },
  solution: { type: Schema.Types.String, required: true },
  body: {
    type: {
      type: {
        type: Schema.Types.Number,
        required: true,
      },
      arguments: { type: Schema.Types.Mixed, required: true },
      answer: { type: Schema.Types.Mixed, required: true },
    },
  },
});

const lessonMongoSchema = new Schema<ILessonMongoSchema>({
  name: { type: Schema.Types.String, required: true },
  theory: { type: Schema.Types.String, required: true },
  questions: {
    type: [questionMongoSchema],
    required: true,
  },
});

const chapterMongoSchema = new Schema<IChapterMongoSchema>({
  name: { type: Schema.Types.String, required: true },
  lessons: {
    type: [lessonMongoSchema],
    required: true,
  },
});

const courseMongoSchema = new Schema<ICourseMongoSchema>({
  name: { type: Schema.Types.String, required: true },
  slug: {
    type: Schema.Types.UUID,
    required: true,
    default: () => crypto.randomUUID(),
    immutable: true,
  },
  description: { type: Schema.Types.String, required: true },
  created: {
    type: Schema.Types.Date,
    default: () => Date.now(),
    immutable: true,
  },
  creator: { type: Schema.Types.String, immutable: true },
  isPrivate: { type: Schema.Types.Boolean, required: true },
  whitelist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: { type: [Schema.Types.String] },
  chapters: {
    type: [chapterMongoSchema],
    required: true,
  },
});

export default models.Course || model('Course', courseMongoSchema);
