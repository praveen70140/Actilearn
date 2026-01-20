import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { chapter } from './chapter';

export const lesson = pgTable('lesson', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chapterId: text('chapter-id')
    .notNull()
    .references(() => chapter.id, { onDelete: 'cascade' }),
  name: text('name'),
  index: integer('index').notNull(),
  theory: text('theory').notNull(),
});

export type Lesson = InferSelectModel<typeof lesson>;
