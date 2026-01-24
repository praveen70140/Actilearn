import { model, models, Schema } from 'mongoose';

interface ITagMongoSchema {
  name: string;
  label: string;
  icon: string;
}

interface ITagCategorySchema {
  name: string;
  label: string;
  icon: string;
  tags: ITagCategorySchema[];
}

const tagMongoSchema = new Schema<ITagMongoSchema>({
  name: { type: Schema.Types.String, required: true },
  label: { type: Schema.Types.String, required: true },
  icon: { type: Schema.Types.String },
});

const tagCategoryMongoSchema = new Schema<ITagCategorySchema>({
  tags: {
    type: [tagMongoSchema],
    required: true,
  },
  name: { type: Schema.Types.String, required: true },
  label: { type: Schema.Types.String, required: true },
  icon: { type: Schema.Types.String },
});

export default models.TagCategory ||
  model('TagCategory', tagCategoryMongoSchema);
