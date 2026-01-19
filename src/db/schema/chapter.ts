import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { course } from './course';
import { InferSelectModel } from 'drizzle-orm';

export const chapter = pgTable('chapter', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course-id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  name: text('name'),
  index: integer('index').notNull(),
});

export type Chapter = InferSelectModel<typeof chapter>;
