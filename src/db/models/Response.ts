import { model, models, Schema } from 'mongoose';

const questionResponseSchema = new Schema({
  // Mixed allows strings, numbers, or objects
  response: { type: [Schema.Types.Mixed], default: [] },
  evaluation: {
    type: Number,
    required: true,
  },
}, { _id: false }); // No internal IDs for question objects

const lessonMongoSchema = new Schema({
  questions: [questionResponseSchema],
}, { _id: false });

const chapterMongoSchema = new Schema({
  lessons: [lessonMongoSchema],
}, { _id: false });

const ResponseMongoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  chapters: [chapterMongoSchema],
}, {
  timestamps: true,
  minimize: false // Keeps empty arrays intact
});

export default models.Response || model('Response', ResponseMongoSchema);
