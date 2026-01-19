import { pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { question } from './question';
import { InferSelectModel } from 'drizzle-orm';
import { user } from './auth-schema';

export const response = pgTable('response', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text('question-id')
    .notNull()
    .references(() => question.id, { onDelete: 'cascade' }),
  studentId: text('student-id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  responseText: text('response-text'),
  evaluation: smallint('evaluation').notNull(),
});

export type Response = InferSelectModel<typeof response>;
