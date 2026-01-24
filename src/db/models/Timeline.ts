import { ObjectId } from 'mongodb';
import { model, models, Schema } from 'mongoose';

interface IAttemptMongoSchema {
  startedAt: Date;
  endedAt: Date;
  course: ObjectId;
  chapterIndex: number;
  lessonIndex: number;
}

interface ITimelineMongoSchema {
  user: ObjectId;
  attempts: IAttemptMongoSchema[];
}

const attemptMongoSchema = new Schema<IAttemptMongoSchema>({
  startedAt: { type: Schema.Types.Date, required: true, immutable: true },
  endedAt: { type: Schema.Types.Date },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    immutable: true,
  },
  chapterIndex: { type: Schema.Types.Number, required: true },
  lessonIndex: { type: Schema.Types.Number, required: true },
});

const timelineMongoSchema = new Schema<ITimelineMongoSchema>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attempts: {
    type: [attemptMongoSchema],
    required: true,
  },
});

export default models.Timeline || model('Timeline', timelineMongoSchema);
