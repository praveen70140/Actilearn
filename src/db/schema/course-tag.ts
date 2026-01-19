import { pgTable, text } from 'drizzle-orm/pg-core';
import { course } from './course';
import { tag } from './tag';
import { InferSelectModel } from 'drizzle-orm';

export const courseTag = pgTable('course-tag', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course-id').references(() => course.id, {
    onDelete: 'cascade',
  }),
  tagId: text('tag-id').references(() => tag.id, { onDelete: 'cascade' }),
});

export type CourseTag = InferSelectModel<typeof courseTag>;
