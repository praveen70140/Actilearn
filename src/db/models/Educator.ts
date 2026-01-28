import { ObjectId } from 'mongodb';
import { model, models, Schema } from 'mongoose';

export interface IEducatorMongoSchema {
  _id: ObjectId;
  userId: string; // Reference to Better Auth user ID (as string)
  isTeacher: boolean;
  createdAt: Date;
}

const educatorMongoSchema = new Schema<IEducatorMongoSchema>({
  userId: {
    type: Schema.Types.String,
    required: true,
    unique: true, // One educator record per user
    immutable: true,
  },
  isTeacher: {
    type: Schema.Types.Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => Date.now(),
    immutable: true,
  },
});

// Create index on userId for fast lookups
educatorMongoSchema.index({ userId: 1 });

export default models.Educator || model('Educator', educatorMongoSchema);
