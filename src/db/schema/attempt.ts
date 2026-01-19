import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { course } from './course';
import { InferSelectModel } from 'drizzle-orm';
import { user } from './auth-schema';

export const attempt = pgTable('attempt', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course-id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  studentId: text('student-id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  startTime: timestamp('start-time').notNull().defaultNow(),
  endTime: timestamp('end-time'),
  chapterIndex: integer('chapter-index').notNull(),
  lessonIndex: integer('lesson-index').notNull(),
});

export type Attempt = InferSelectModel<typeof attempt>;
