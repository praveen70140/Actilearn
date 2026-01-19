import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { user } from './auth-schema';

export const course = pgTable('course', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').unique().notNull(),
  creator: text('creator').references(() => user.id, { onDelete: 'cascade' }),
  created: timestamp('created').defaultNow(),
});

export type Course = InferSelectModel<typeof course>;
