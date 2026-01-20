import { integer, pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { lesson } from './lesson';
import { InferSelectModel } from 'drizzle-orm';

export const question = pgTable('question', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lessonId: text('lesson-id')
    .notNull()
    .references(() => lesson.id, { onDelete: 'cascade' }),
  questionType: smallint('question-type').notNull(),
  questionText: text('question-text').notNull(),
  arguments: text('arguments').notNull(),
  answer: text('answer').notNull(),
  solution: text('solution').notNull(),
  index: integer('index').notNull(),
});

export type Question = InferSelectModel<typeof question>;
